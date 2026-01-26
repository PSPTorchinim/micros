using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompanyAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddBrandUserRelationshipAndCreatedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CreatedByUserId",
                table: "Brands",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BrandUsers_BrandId",
                table: "BrandUsers",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_BrandUsers_UserId",
                table: "BrandUsers",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BrandUsers_BrandId",
                table: "BrandUsers");

            migrationBuilder.DropIndex(
                name: "IX_BrandUsers_UserId",
                table: "BrandUsers");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Brands");
        }
    }
}
