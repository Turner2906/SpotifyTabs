using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Server.Kestrel.Core;

[Route("api/spotify")]
[ApiController]
public class SpotifyController : ControllerBase
{
  private readonly IConfiguration _configuration;

  public SpotifyController(IConfiguration configuration)
  {
    _configuration = configuration;
  }

  [HttpGet("callback")]
  public async Task<IActionResult> Callback(string code)
  {
    var clientId = _configuration["Spotify:ClientId"];
    var clientSecret = _configuration["Spotify:ClientSecret"];
    var redirectUri = _configuration["Spotify:RedirectUri"];

    using (var client = new HttpClient())
    {
      var tokenResponse = await client.PostAsync("https://accounts.spotify.com/api/token", new FormUrlEncodedContent(new[]
      {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", redirectUri),
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret)
            }));

      var responseContent = await tokenResponse.Content.ReadAsStringAsync();
      var json = JObject.Parse(responseContent);
      var accessToken = json["access_token"].ToString();

      return Ok(accessToken);
    }
  }

  [HttpGet("usertop")]
  public async Task<IActionResult> GetUserAll(string accessToken, string? timeRange = "medium_term", string? limit = "10", string? offset = "0")
  {

    using (var client = new HttpClient())
    {
      client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
      var userInfo = client.GetAsync("https://api.spotify.com/v1/me");
      var topArtists = client.GetAsync($"https://api.spotify.com/v1/me/top/artists?limit={limit}&time_range={timeRange}&offset={offset}");
      var topTracks = client.GetAsync($"https://api.spotify.com/v1/me/top/tracks?limit={limit}&time_range={timeRange}&offset={offset}");

      await Task.WhenAll(userInfo, topArtists, topTracks);

      var userInfoContent = await userInfo.Result.Content.ReadAsStringAsync();
      var topArtistsContent = await topArtists.Result.Content.ReadAsStringAsync();
      var topTracksContent = await topTracks.Result.Content.ReadAsStringAsync();

      var userAll = new
      {
        userInfo = userInfoContent,
        topArtists = topArtistsContent,
        topTracks = topTracksContent
      };

      if (JObject.Parse(userInfoContent).ToString().Contains("error") ||
        JObject.Parse(topArtistsContent).ToString().Contains("error") ||
        JObject.Parse(topTracksContent).ToString().Contains("error"))
      {
        return BadRequest("One or more requests returned an error.");
      }

      return Ok(userAll);
    }
  }
}
