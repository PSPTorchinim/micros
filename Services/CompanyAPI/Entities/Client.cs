namespace CompanyAPI.Entities
{
    public class Client : Person
    {
        public List<Brand> Brands { get; set; }
        public List<ClientCustomField> CustomFields { get; set; }
    }
}
