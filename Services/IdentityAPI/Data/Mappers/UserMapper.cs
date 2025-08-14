using AutoMapper;
using IdentityAPI.Data.DTO.User;
using IdentityAPI.Entities;

namespace IdentityAPI.Data.Mappers
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<User, GetUserDTO>();
        }
    }
}
