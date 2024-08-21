using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

[Route("api/songsterr")]
[ApiController]
public class SongsterrController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public SongsterrController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(string query)
    {
        using (var client = new HttpClient())
        {
            var html = await client.GetStringAsync($"https://www.songsterr.com/?pattern={query}");
            var htmlDoc = new HtmlDocument();

            var songLink = htmlDoc.DocumentNode.SelectSingleNode("//a[contains(@class, 'B0cew')]");

            if (songLink != null)
            {
                var hrefValue = songLink.GetAttributeValue("href", string.Empty);
                var innerText = songLink.InnerText;

                return Ok(new { href = hrefValue, text = innerText });
            }
            else
            {
                return NotFound("Could not find any songs matching your search.");
            }
        }
    }
}