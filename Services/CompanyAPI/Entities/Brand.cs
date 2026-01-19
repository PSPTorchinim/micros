namespace CompanyAPI.Entities
{
    public class Brand : Person
    {
        public string BrandEmail { get; set; }
        public string BrandPhone { get; set; }
        public string? Logo { get; set; }
        
        /// <summary>
        /// The user ID of the user who created this brand/company
        /// </summary>
        public Guid? CreatedByUserId { get; set; }
        
        public List<BrandCustomField> BrandCustomFields { get; set; }
        public List<Package> Packages { get; set; }
        public List<Client> Clients { get; set; }
        
        /// <summary>
        /// Collection of users associated with this brand/company
        /// </summary>
        public List<BrandUser> BrandUsers { get; set; }
    }
}
