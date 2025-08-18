namespace CompanyAPI.Entities
{
    public class Brand : Person
    {
        public string BrandEmail { get; set; }
        public string BrandPhone { get; set; }
        public string? Logo { get; set; }
        public List<BrandCustomField> BrandCustomFields { get; set; }
        public List<Package> Packages { get; set; }
        public List<Client> Clients { get; set; }
    }
}
