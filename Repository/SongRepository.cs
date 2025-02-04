using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using spotifyTabApp.Data;
using spotifyTabApp.Models;
using HtmlAgilityPack;

namespace spotifyTabApp.Repository;

public class SongRepository : ISongRepository
{
    private readonly SongsContext _context;
    private readonly IConfiguration _config;

    public SongRepository(SongsContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<Guid> AddSong(SongModel model)
    {
        var song = new Songs()
        {
            ArtistName = model.ArtistName,
            SongName = model.SongName,
            SongLink = model.SongLink,
            DownloadLink = model.DownloadLink
        };

        await _context.Songs.AddAsync(song);
        await _context.SaveChangesAsync();

        return song.Id;
    }
    public async Task<SongModel> GetSong(string title, string artist)
    {
        return null;
    }
}