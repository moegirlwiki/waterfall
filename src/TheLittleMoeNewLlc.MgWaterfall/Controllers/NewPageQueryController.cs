using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using TheLittleMoeNewLlc.MgWaterfall.DataObjects;
using TheLittleMoeNewLlc.MgWaterfall.Models;

namespace TheLittleMoeNewLlc.MgWaterfall.Controllers
{
    public class NewPageQueryController : Controller
    {
        private IOptions<RpcEndpointConfiguration> m_rpcEndpointOptions;
        private const int CardWidth = 220;

        public NewPageQueryController(IOptions<RpcEndpointConfiguration> rpcEndpointOptions)
        {
            m_rpcEndpointOptions = rpcEndpointOptions;
        }

        public async Task<IActionResult> Index(string id = null)
        {
            var rel = await GetRecentNewPagesWithThumnnailAsync(50, id, HttpContext.RequestAborted);

            return Json(new {
                ContinuationToken = rel.Item2,
                Pages = rel.Item1
            });
        }

        private async Task<(IReadOnlyList<Page>, string)> GetRecentNewPagesWithThumnnailAsync(int limit = 50, 
            string queryContinuationToken = null,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            if (limit > 50) throw new ArgumentException("Limit higher than 50 is not allowed.");
            var ret = new List<Page>(50);
            string continuationToken = null;

            using (var httpClient = new HttpClient())
            {
                // First set of request will fetch recent new pages
                var requestUrl = $"{m_rpcEndpointOptions.Value.ApiEndpoint}?action=query&format=json&" +
                    $"prop=&list=recentchanges&utf8=1&formatversion=2&" +
                    $"rclimit={WebUtility.UrlEncode(limit.ToString("G"))}&rctype=new&rcprop=title%7Ctimestamp%7Cids%7Cuser";

                if (!string.IsNullOrEmpty(queryContinuationToken))
                {
                    requestUrl += $"&rccontinue={WebUtility.UrlEncode(queryContinuationToken)}";
                }

                using (var rcnRequest = await httpClient.GetAsync(requestUrl, cancellationToken))
                {
                    rcnRequest.EnsureSuccessStatusCode();
                    dynamic rcnResponse = JsonConvert.DeserializeObject(await rcnRequest.Content.ReadAsStringAsync());

                    continuationToken = rcnResponse.@continue.rccontinue;
                    string rcnItemsSerialized = rcnResponse.query.recentchanges.ToString();

                    var recentItems = JsonConvert.DeserializeObject<List<RecentChangeEntity>>(rcnItemsSerialized);

                    var joinedTitles = string.Join("|", recentItems.Select(r => r.Title));
                    var imgQueryUrl = $"{m_rpcEndpointOptions.Value.ApiEndpoint}?action=query&format=json&" +
                        $"prop=pageimages&titles={WebUtility.UrlEncode(joinedTitles)}&utf8=1&formatversion=2&" +
                        $"piprop=thumbnail&pithumbsize=300&pilimit=50";

                    using (var imgRequest = await httpClient.GetAsync(imgQueryUrl, cancellationToken))
                    {
                        imgRequest.EnsureSuccessStatusCode();
                        dynamic imgResponse = JsonConvert.DeserializeObject(await imgRequest.Content.ReadAsStringAsync());

                        foreach (var page in imgResponse.query.pages)
                        {
                            // Fix by case: If page removed
                            if (page?.pageid == null || page?.title == null || page?.missing == true) continue;

                            var retPage = new Page
                            {
                                PageId = (long) page?.pageid,
                                Title = (string) page.title,
                                Link = $"{m_rpcEndpointOptions.Value.SiteEndpoint}{(string) page.title}"
                            };

                            if (page.thumbnail != null)
                            {
                                retPage.Thumbnail = (string) page.thumbnail.source;
                                retPage.Height = (((double) page.thumbnail.height * 220) / (double) page.thumbnail.width);
                                retPage.Width = 220;
                            }

                            ret.Add(retPage);
                        }
                    }

                    var joinedAuthorData = from k in recentItems
                                           join v in ret on k.Title equals v.Title into m
                                           from s in m
                                           select new Page {
                                               Author = k.Username,
                                               Height = s.Height,
                                               PageId = s.PageId,
                                               Thumbnail = s.Thumbnail,
                                               Title = s.Title,
                                               Width = s.Width,
                                               Link = s.Link,
                                               NamespaceId = k.NamespaceId
                                           };

                    ret = joinedAuthorData.ToList();
                }
            }

            return (ret, continuationToken);
        }
    }
}
