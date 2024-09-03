using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

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
            var encodedQuery = Uri.EscapeDataString(query);
            var html = await client.GetStringAsync($"https://www.songsterr.com/?pattern={encodedQuery}");
            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(html);
            var songLink = htmlDoc.DocumentNode.SelectSingleNode("//a[contains(@class, 'B0cew')]");

            if (songLink != null)
            {
                var hrefValue = songLink.GetAttributeValue("href", string.Empty);
                var innerText = songLink.InnerText;

                return Ok(new { href = hrefValue, text = innerText , query = encodedQuery });
            }
            else
            {
                return NotFound("Could not find any songs matching your search.");
            }
        }
    }
    [HttpGet("backup_search")]
    public async Task<IActionResult> Backup_Search(string query)
    {
        using (var driver = new ChromeDriver())
        {
            // Navigate to the Songsterr website
            driver.Navigate().GoToUrl("https://www.songsterr.com/");

            // Find the search input element
            var searchInput = driver.FindElement(By.Name("pattern"));

            // Enter the query
            searchInput.SendKeys(query);

            // Simulate pressing Enter
            searchInput.SendKeys(Keys.Enter);

            // Wait for the page to load (you may need to adjust the timeout)
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

            // Find the first search result
            var songLink = driver.FindElement(By.CssSelector(".B0cew"));

            if (songLink != null)
            {
                var hrefValue = songLink.GetAttribute("href");
                var innerText = songLink.Text;

                return Ok(new { href = hrefValue, text = innerText });
            }
            else
            {
                return NotFound("Could not find any songs matching your search.");
            }
        }
    }
}