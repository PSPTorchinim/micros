using Shared.Entities;

namespace DocumentsAPI.Entities
{
    public class Invoice : IIdentifier
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public Document Document { get; set; }
        public DateTime? PaymentDate { get; set; }
    }
}