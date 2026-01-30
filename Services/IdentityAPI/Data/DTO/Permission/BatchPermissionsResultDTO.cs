namespace IdentityAPI.Data.DTO.Permission
{
    public class BatchPermissionsResultDTO
    {
        public int Created { get; set; }
        public int Skipped { get; set; }
        public int Failed { get; set; }
    }
}
