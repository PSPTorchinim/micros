using IdentityAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace IdentityAPI.Data
{
    public class IdentityContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<Password> Passwords { get; set; }
        public DbSet<Block> Blocks { get; set; }

        private readonly ILogger<IdentityContext>? _logger;

        public IdentityContext(DbContextOptions<IdentityContext> options, ILogger<IdentityContext>? logger = null)
            : base(options)
        {
            _logger = logger;
            _logger?.LogInformation("IdentityContext created.");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            _logger?.LogInformation("Configuring model in OnModelCreating.");

            modelBuilder.Entity<User>().HasIndex(p => p.Email).IsUnique();
            modelBuilder.Entity<User>().Property(x => x.CreatedDate).HasDefaultValueSql("getdate()");
            modelBuilder.Entity<Password>().Property(x => x.CreatedDate).HasDefaultValueSql("getdate()");
            modelBuilder.Entity<Role>().Property(x => x.CreatedDate).HasDefaultValueSql("getdate()");
            modelBuilder.Entity<Permission>().Property(x => x.CreatedDate).HasDefaultValueSql("getdate()");
            modelBuilder.Entity<Block>().Property(x => x.CreatedDate).HasDefaultValueSql("getdate()");
        }

        public override int SaveChanges()
        {
            _logger?.LogInformation("SaveChanges called.");
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            _logger?.LogInformation("SaveChangesAsync called.");
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}