namespace CompanyAPI.Entities
{
    /// <summary>
    /// Defines roles for users within a brand/company
    /// </summary>
    public enum BrandUserRole
    {
        /// <summary>
        /// The user who created the company - has full administrative rights
        /// </summary>
        Creator = 0,
        
        /// <summary>
        /// Company owner - has full administrative rights
        /// </summary>
        Owner = 1,
        
        /// <summary>
        /// Regular member of the company
        /// </summary>
        Member = 2
    }
}
