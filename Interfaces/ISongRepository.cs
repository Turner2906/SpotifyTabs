using System.Linq;
using System.Threading.Tasks;
using spotifyTabApp.Models;
using spotifyTabApp.Helpers;

namespace spotifyTabApp.Interfaces
{
    public interface ISongRepository
    {
        Task<Song> AddSong(Song songModel);
        Task<Song?> GetSong(string title, string artist);
    }
}