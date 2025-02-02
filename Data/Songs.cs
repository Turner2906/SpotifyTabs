namespace spotifyTabApp.Data;

public class Songs
{
    public Guid Id { get; set; }

    public string ArtistName { get; set; }
    
    public string SongName { get; set; }

    public string SongLink { get; set; }

    public string DownloadLink { get; set; }
}