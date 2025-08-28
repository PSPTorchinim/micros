namespace Shared.Entities
{
    public interface INamedEntity : IEntity
    {
        public string Name { get; set; }
    }
}