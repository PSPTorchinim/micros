namespace IdentityAPI.DTO.User
{
    public class BlockUserDTO
    {
        public Guid UserId { get; set; }
        public DateTime? To { get; set; }
        public string Reason { get; set; }
        public bool Pernament { get; set; }
    }
}
