namespace ComponentsAPI.Entities
{
    public class Component
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Category { get; set; }
        public string? Tags { get; set; }
        public string? Props { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public virtual ICollection<Story> Stories { get; set; } = new List<Story>();
    }
}
