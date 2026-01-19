using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompanyAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleToBrandUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "BrandUsers",
                type: "integer",
                nullable: false,
                defaultValue: 2); // Default to Member (2)
            
            // Update existing records where CreatedByUserId matches UserId to Creator (0)
            migrationBuilder.Sql(@"
                UPDATE ""BrandUsers"" bu
                SET ""Role"" = 0
                FROM ""Brands"" b
                WHERE bu.""BrandId"" = b.""Id""
                  AND bu.""UserId"" = b.""CreatedByUserId""
                  AND b.""CreatedByUserId"" IS NOT NULL;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "BrandUsers");
        }
    }
}
