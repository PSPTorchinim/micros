using Music.Repositories;
using Music.Services;
using Shared.Services.App;

internal class MusicScope : Scope
{
    public override void CreateScope(IServiceCollection services)
    {
        services.AddScoped<IAlbumRepository, AlbumRepository>();
        services.AddScoped<IArtistsRepository, ArtistsRepository>();
        services.AddScoped<IDirectoriesRepository, DirectoriesRepository>();
        services.AddScoped<IGenresRepository, GenresRepository>();
        services.AddScoped<ILabelsRepository, LabelsRepository>();
        services.AddScoped<IPlaylistsRepository, PlaylistsRepository>();
        services.AddScoped<ISongsRepository, SongsRepository>();
        services.AddScoped<ITagsRepository, TagsRepository>();

        services.AddScoped<ISongsService, SongsService>();
    }
}