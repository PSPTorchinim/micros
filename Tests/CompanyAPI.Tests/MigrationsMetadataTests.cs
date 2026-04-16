using CompanyAPI.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CompanyAPI.Tests
{
    public class MigrationsMetadataTests
    {
        [Fact]
        public void AddCompanyTypeFieldsMigration_ShouldHaveMigrationMetadata()
        {
            var migrationType = typeof(AddCompanyTypeFields);

            Assert.NotNull(Attribute.GetCustomAttribute(migrationType, typeof(MigrationAttribute)));
            Assert.NotNull(Attribute.GetCustomAttribute(migrationType, typeof(DbContextAttribute)));
        }
    }
}
