namespace spotifyTabApp.Helpers;

public class QueryObject
{
    public Guid Id { get; set; }

    public string? ArtistName { get; set; } = null;
    
    public string? SongName { get; set; } = null;

    public string? SongLink { get; set; } = null;

    public string? DownloadLink { get; set; } = null;
}