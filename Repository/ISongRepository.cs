using spotifyTabApp.Models;

namespace spotifyTabApp.Repository
{
    public interface ISongRepository
    {
        Task<Guid> AddSong(SongModel model);
        Task<SongModel> GetSong(string title, string artist);
    }
}