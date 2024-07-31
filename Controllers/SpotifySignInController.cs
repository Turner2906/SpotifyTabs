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

      return Redirect($"https://localhost:44461/profile?accessToken={accessToken}");
    }
  }

  [HttpGet("userinfo")]
  public async Task<IActionResult> GetUserInfo(string accessToken)
  {
    using (var client = new HttpClient())
    {
      client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

      var userResponse = await client.GetAsync("https://api.spotify.com/v1/me");
      var responseContent = await userResponse.Content.ReadAsStringAsync();

      return Ok(responseContent);
    }
  }
  [HttpGet("test")]
  public IActionResult Test()
  {
    return Content("<html><body><h1>Dummy Redirect Endpoint</h1><p>This is a dummy redirect message.</p></body></html>", "text/html");
  }
}
