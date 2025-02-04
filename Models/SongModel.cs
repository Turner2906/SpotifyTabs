namespace spotifyTabApp.Models;

public class SongModel
{
    public Guid Id { get; set; }

    public required string ArtistName { get; set; }
    
    public required string SongName { get; set; }

    public string? SongLink { get; set; }

    public string? DownloadLink { get; set; }
}