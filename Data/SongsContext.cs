using Microsoft.EntityFrameworkCore;

namespace spotifyTabApp.Data;

public class SongsContext : DbContext
{

    public SongsContext(DbContextOptions<SongsContext> options) : base(options)
    {

    }

    public DbSet<Songs> Songs { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}