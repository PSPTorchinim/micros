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

        /// <summary>
        /// The selected company type (references CompanyType.Id stored in MongoDB)
        /// </summary>
        public Guid? CompanyTypeId { get; set; }

        /// <summary>
        /// JSON storage for dynamic company-type-specific fields
        /// </summary>
        public string? CompanyTypeData { get; set; }
        
        public List<BrandCustomField> BrandCustomFields { get; set; }
        public List<Package> Packages { get; set; }
        public List<Client> Clients { get; set; }
        
        /// <summary>
        /// Collection of users associated with this brand/company
        /// </summary>
        public List<BrandUser> BrandUsers { get; set; }
    }
}
