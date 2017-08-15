﻿using Microsoft.AspNetCore.Mvc;
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

        public NewPageQueryController(IOptions<RpcEndpointConfiguration> rpcEndpointOptions)
        {
            m_rpcEndpointOptions = rpcEndpointOptions;
        }

        public async Task<IActionResult> Index()
        {
            var rel = await GetRecentNewPagesWithThumnnailAsync(50, null, HttpContext.RequestAborted);

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
                    $"rclimit={WebUtility.UrlEncode(limit.ToString("G"))}&rctype=new";

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
                            if (page.thumbnail == null) continue;
                            ret.Add(new Page
                            {
                                PageId = (long) page.pageid,
                                Thumbnail = (string) page.thumbnail.source,
                                Title = (string) page.title
                            });
                        }
                    }
                }
            }

            return (ret, continuationToken);
        }
    }
}
