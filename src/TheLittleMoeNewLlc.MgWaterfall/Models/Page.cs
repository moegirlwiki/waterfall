namespace TheLittleMoeNewLlc.MgWaterfall.Models
{
    public class Page
    {
        public string Title { get; set; }
        public long PageId { get; set; }
        public string Thumbnail { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public string Author { get; set; }
        public string Link { get; set; }
        public int NamespaceId { get; set; }
    }
}
