namespace Shared.Entities
{
    public interface IIdentifier : IEntity
    {
        public Guid Id { get; set; }
    }
}