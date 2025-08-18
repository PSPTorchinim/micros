using AutoMapper;
using IdentityAPI.Data.DTO.Permission;
using IdentityAPI.Entities;

namespace IdentityAPI.Data.Mappers
{
    public class PermissionsMapper : Profile
    {
        public PermissionsMapper()
        {
            CreateMap<Permission, GetPermissionsDTO>();
            CreateMap<Permission, GetPermissionDTO>();
            CreateMap<AddPermissionDTO, Permission>();
        }
    }
}
