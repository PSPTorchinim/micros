using ComponentsAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace ComponentsAPI.Data
{
    public class ComponentsContext : DbContext
    {
        public DbSet<Component> Components { get; set; }
        public DbSet<Story> Stories { get; set; }

        private readonly ILogger<ComponentsContext>? _logger;

        public ComponentsContext(DbContextOptions<ComponentsContext> options, ILogger<ComponentsContext>? logger = null)
            : base(options)
        {
            _logger = logger;
            _logger?.LogInformation("ComponentsContext created.");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            _logger?.LogInformation("Configuring model in OnModelCreating.");

            modelBuilder.Entity<Component>().HasKey(c => c.Id);
            modelBuilder.Entity<Story>().HasKey(s => s.Id);
            
            modelBuilder.Entity<Component>()
                .HasMany(c => c.Stories)
                .WithOne(s => s.Component)
                .HasForeignKey(s => s.ComponentId);
            
            modelBuilder.Entity<Component>().Property(x => x.CreatedDate).HasDefaultValueSql("getdate()");
            modelBuilder.Entity<Story>().Property(x => x.CreatedDate).HasDefaultValueSql("getdate()");
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
