namespace ComponentsAPI.Entities
{
    public class Story
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Code { get; set; }
        public string? PreviewUrl { get; set; }
        public int ComponentId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public virtual Component? Component { get; set; }
    }
}
