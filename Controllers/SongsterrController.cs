using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Newtonsoft.Json.Linq;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using spotifyTabApp.Interfaces;
using spotifyTabApp.Models;
using spotifyTabApp.Repository;

namespace spotifyTabApp.Controllers;

[Route("api/songsterr")]
[ApiController]
public class SongsterrController : ControllerBase
{       
    private readonly ISongRepository _songRepository = null;

    public SongsterrController(ISongRepository songRepository)
    {
        _songRepository = songRepository;
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
                var hrefVal = songLink.GetAttributeValue("href", string.Empty);
                var songNameDiv = songLink.SelectSingleNode(".//div[@data-field='name']");
                var artistDiv = songLink.SelectSingleNode(".//div[@data-field='artist']");
                var songName = songNameDiv?.InnerText.Trim();
                var artistName = artistDiv?.InnerText.Trim();
                return Ok(new { href = hrefVal, artist = artistName, song = songName, query = encodedQuery });
            }
            else
            {
                return NotFound("Could not find any songs matching your search.");
            }
        }
    }

    [HttpGet("song-id")]
    public async Task<IActionResult> Song_id(string query)
    {

        using (var client = new HttpClient())
        {
            var encodedQuery = Uri.EscapeDataString(query);
            var response = await client.GetStringAsync($"https://www.songsterr.com/api/songs?pattern={encodedQuery}&size=50&from=0");
            return Ok(response);
        }
    }

    [HttpGet("download/{song_id:int}")]
    public async Task<IActionResult> Download(int song_id)
    {
        using (var client = new HttpClient())
        {
            var response = await client.GetStringAsync($"https://www.songsterr.com/api/meta/{song_id}/revisions");
            return Ok(response);
        }
    }

    [HttpGet("backup-search")]
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

    [HttpPost("songs")]
    public async Task<IActionResult> AddSong(Song songModel)
    {
        var song_data = await _songRepository.AddSong(songModel);
        return Ok(song_data);
    }

    [HttpGet("songs")]
    public async Task<IActionResult> GetSong(string title, string artist)
    {
        var song = await _songRepository.GetSong(title, artist);
        return Ok(song);
    }
}
