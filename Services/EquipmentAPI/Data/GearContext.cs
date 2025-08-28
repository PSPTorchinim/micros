using Microsoft.EntityFrameworkCore;

namespace EquipmentAPI.Data
{
    public class GearContext : DbContext
    {


        public GearContext(DbContextOptions<GearContext> options)
        : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}