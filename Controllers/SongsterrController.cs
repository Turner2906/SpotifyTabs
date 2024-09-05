using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

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
        var options = new ChromeOptions();
        options.AddArgument("--headless");

        using (var driver = new ChromeDriver(options))
        {
            // Navigate to the Songsterr website
            driver.Navigate().GoToUrl("https://www.songsterr.com/");
            // Find the search input element
            var searchInput = driver.FindElement(By.CssSelector(".Cvu1qm"));

            // Enter the query
            searchInput.SendKeys(query);

            // Wait until the page changes from its default state
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(20));
            wait.Until(drv =>
            {
                var defaultCheck = drv.FindElement(By.CssSelector(".B0cew"));
                return defaultCheck.GetAttribute("href") != "https://www.songsterr.com/a/wsa/metallica-master-of-puppets-tab-s455118";
            });

            // Find the first search result
            var songLink = driver.FindElement(By.CssSelector(".B0cew"));

            if (songLink != null)
            {
                var hrefValue = songLink.GetAttribute("href");
                var innerText = songLink.Text;

                return Ok(new { href = hrefValue, text = innerText});
            }
            else
            {
                return NotFound("Could not find any songs matching your search.");
            }
        }
    }
}