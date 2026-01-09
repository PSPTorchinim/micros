namespace CompanyAPI.Data.Models
{
    public class CompanyDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? Logo { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class UpdateCompanyDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? Logo { get; set; }
    }

    public class CompanyUserDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }

    public class AddCompanyUserDTO
    {
        public Guid UserId { get; set; }
        public string Role { get; set; }
    }

    public class CompanyStructureNodeDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public Guid? ParentId { get; set; }
        public List<CompanyStructureNodeDTO>? Children { get; set; }
    }

    public class UpdateCompanyStructureDTO
    {
        public List<CompanyStructureNodeDTO> Nodes { get; set; }
    }
}
