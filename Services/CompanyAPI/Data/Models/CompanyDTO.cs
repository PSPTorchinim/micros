using System.ComponentModel.DataAnnotations;

namespace CompanyAPI.Data.Models
{
    public class CompanyDTO
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string PostCode { get; set; }
        [Required]
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? Logo { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? CompanyTypeId { get; set; }
        public string? CompanyTypeData { get; set; }
    }

    public class UpdateCompanyDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string PostCode { get; set; }
        [Required]
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? Logo { get; set; }
        public Guid? CompanyTypeId { get; set; }
        public string? CompanyTypeData { get; set; }
    }

    public class CompanyUserDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Role { get; set; }
    }

    public class AddCompanyUserDTO
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string Role { get; set; }
    }

    public class CompanyStructureNodeDTO
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Type { get; set; }
        public Guid? ParentId { get; set; }
        public List<CompanyStructureNodeDTO>? Children { get; set; }
    }

    public class UpdateCompanyStructureDTO
    {
        [Required]
        public List<CompanyStructureNodeDTO> Nodes { get; set; }
    }
}
