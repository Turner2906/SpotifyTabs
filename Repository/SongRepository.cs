using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using spotifyTabApp.Data;
using spotifyTabApp.Models;
using spotifyTabApp.Interfaces;
using spotifyTabApp.Helpers;
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

    public async Task<Song> AddSong(Song songModel)
    {
        await _context.Songs.AddAsync(songModel);
        await _context.SaveChangesAsync();

        return songModel;
    }
    public async Task<Song?> GetSong(string title, string artist)
    {
        return await _context.Songs.FirstOrDefaultAsync(x => x.SongName == title && x.ArtistName == artist);
    }
}