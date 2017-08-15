using Newtonsoft.Json;
using System;

namespace TheLittleMoeNewLlc.MgWaterfall.DataObjects
{
    public class RecentChangeEntity
    {
        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("rcid")]
        public long RcId { get; set; }

        [JsonProperty("timestamp")]
        public DateTimeOffset Timestamp { get; set; }
    }
}
