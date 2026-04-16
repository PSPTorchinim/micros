using System;
using CompanyAPI.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CompanyAPI.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(BrandContext))]
    [Migration("20260316000000_AddCompanyTypeFields")]
    public partial class AddCompanyTypeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyTypeId",
                table: "Brands",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyTypeData",
                table: "Brands",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyTypeId",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "CompanyTypeData",
                table: "Brands");
        }
    }
}
