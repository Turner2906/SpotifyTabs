using Microsoft.EntityFrameworkCore;
using spotifyTabApp.Models;

namespace spotifyTabApp.Data;

public class SongsContext : DbContext
{

    public SongsContext(DbContextOptions<SongsContext> options) : base(options)
    {

    }

    public DbSet<Song> Songs { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}