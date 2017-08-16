using HtmlAgilityPack;
using System;
using System.Text.RegularExpressions;

namespace TheLittleMoeNewLlc.MgWaterfall.Utilities
{
    /// <summary>
    /// Local implementation of MediaWiki Extension:TextExtracts.
    /// </summary>
    public static class TextExtracter
    {
        private static Regex sNewlineRegex = new Regex("\n{3,}");

        /// <summary>
        /// Extract given article content using extraction workflow in Extension:TextExtracts
        /// </summary>
        /// <param name="inputHtml">Input article content in HTML form.</param>
        /// <returns>Plain extracted text.</returns>
        public static string ExtractContent(this string inputHtml)
        {
            if (inputHtml == null) throw new ArgumentNullException(nameof(inputHtml));

            var doc = new HtmlDocument();
            doc.LoadHtml(inputHtml);

            var preProcessText = doc.DocumentNode.InnerText;
            preProcessText = preProcessText.Replace("\xC2\xA0", " ");
            preProcessText = preProcessText.Replace("\r", "\n");
            preProcessText = sNewlineRegex.Replace(preProcessText, "\n\n");

            return preProcessText;
        }
    }
}
