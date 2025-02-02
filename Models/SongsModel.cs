namespace spotifyTabApp.Models;

public class Songs
{
    public Guid Id { get; set; }

    public string ArtistName { get; set; } = string.Empty;
    
    public string SongName { get; set; } = string.Empty;

    public string SongLink { get; set; } = string.Empty;

    public string DownloadLink { get; set; } = string.Empty;
}