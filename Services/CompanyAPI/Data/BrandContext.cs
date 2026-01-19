using CompanyAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace CompanyAPI.Data
{
    public class BrandContext : DbContext
    {

        public DbSet<Brand> Brands { get; set; }
        public DbSet<BrandUser> BrandUsers { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientCustomField> ClientCustomFields { get; set; }
        public DbSet<BrandCustomField> BrandCustomFields { get; set; }

        public BrandContext(DbContextOptions<BrandContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Brand-BrandUser relationship
            modelBuilder.Entity<Brand>()
                .HasMany(b => b.BrandUsers)
                .WithOne(bu => bu.Brand)
                .HasForeignKey(bu => bu.BrandId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Configure BrandUser indexes for performance
            modelBuilder.Entity<BrandUser>()
                .HasIndex(bu => bu.UserId);
                
            modelBuilder.Entity<BrandUser>()
                .HasIndex(bu => bu.BrandId);
        }
    }
}