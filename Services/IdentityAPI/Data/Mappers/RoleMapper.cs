using AutoMapper;
using IdentityAPI.DTO.Role;
using IdentityAPI.Entities;

namespace IdentityAPI.Data.Mappers
{
    public class RoleMapper : Profile
    {
        public RoleMapper()
        {
            CreateMap<Role, GetRoleDTO>();
        }
    }
}
