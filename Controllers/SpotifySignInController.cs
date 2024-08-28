using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;

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

  [HttpGet("userdata")]
  public async Task<IActionResult> GetUserAll(string accessToken, string? timeRange = "medium_term")
  {

    using (var client = new HttpClient())
    {
      client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
      var userInfo = client.GetAsync("https://api.spotify.com/v1/me");
      var topArtists = client.GetAsync($"https://api.spotify.com/v1/me/top/artists?limit=10&time_range={timeRange}");
      var topTracks = client.GetAsync($"https://api.spotify.com/v1/me/top/tracks?limit=10&time_range={timeRange}");

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
      return Ok(userAll);
    }
  }
}
