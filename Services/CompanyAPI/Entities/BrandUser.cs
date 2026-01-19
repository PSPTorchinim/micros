namespace CompanyAPI.Entities
{
    public class BrandUser
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BrandId { get; set; }
        public Brand Brand { get; set; }
        
        /// <summary>
        /// The role of this user within the brand/company
        /// </summary>
        public BrandUserRole Role { get; set; }
    }
}