# MusicAPI - Music Library Management Service

## 📋 Overview

The MusicAPI service manages the complete music library for the DJ Beat Blaster platform. It handles music tracks, albums, artists, playlists, and all metadata related to the DJ's music collection.

**Port**: 5002  
**Database**: SQL Server (MusicDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides comprehensive music management for:

- Music library organization and cataloging
- Playlist creation and management
- Track metadata and tagging
- Artist and album information
- Genre classification and labeling
- Music search and discovery

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         MusicAPI Service            │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ TracksController (TBD)          │
│  ├─ PlaylistsController (TBD)       │
│  ├─ ArtistsController (TBD)         │
│  └─ AlbumsController (TBD)          │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ MusicLibraryService             │
│  ├─ PlaylistService                 │
│  └─ MetadataService                 │
├─────────────────────────────────────┤
│  Data Layer (EF Core)               │
│  └─ SQL Server (MusicDB)            │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

- **Song** - Individual music tracks with metadata
- **Album** - Album information and track collections
- **Artist** - Artist profiles and discography
- **AlbumArtist** - Many-to-many relationship for compilations
- **Playlist** - User-created and curated playlists
- **Genre** - Music genre classifications
- **Tag** - Custom tags for organizing music
- **Directory** - File system organization
- **Label** - Record label information

## 🔌 API Endpoints

### Tracks

- `GET /api/tracks` - Browse music library (paginated, filterable)
- `GET /api/tracks/{id}` - Get track details
- `POST /api/tracks` - Add new track
- `PUT /api/tracks/{id}` - Update track metadata
- `DELETE /api/tracks/{id}` - Remove track from library
- `GET /api/tracks/search` - Search tracks by title, artist, album
- `POST /api/tracks/upload` - Upload music files

### Playlists

- `GET /api/playlists` - List all playlists
- `GET /api/playlists/{id}` - Get playlist with tracks
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/{id}` - Update playlist metadata
- `DELETE /api/playlists/{id}` - Delete playlist
- `POST /api/playlists/{id}/tracks` - Add tracks to playlist
- `DELETE /api/playlists/{id}/tracks/{trackId}` - Remove track from playlist

### Artists

- `GET /api/artists` - List all artists
- `GET /api/artists/{id}` - Get artist details and discography
- `POST /api/artists` - Add new artist
- `PUT /api/artists/{id}` - Update artist information
- `DELETE /api/artists/{id}` - Remove artist

### Albums

- `GET /api/albums` - List all albums
- `GET /api/albums/{id}` - Get album with tracks
- `POST /api/albums` - Add new album
- `PUT /api/albums/{id}` - Update album information
- `DELETE /api/albums/{id}` - Remove album

### Genres

- `GET /api/genres` - List all genres
- `GET /api/genres/{id}/tracks` - Get tracks by genre
- `POST /api/genres` - Create genre
- `PUT /api/genres/{id}` - Update genre
- `DELETE /api/genres/{id}` - Delete genre

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **Entity Framework Core** - ORM for SQL Server
- **SQL Server** - Primary database
- **AutoMapper** - Object mapping
- **TagLib** - Audio metadata reading (optional)
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Schema

The MusicDB contains the following tables:

- `Songs` - Track metadata (title, duration, BPM, key, etc.)
- `Albums` - Album information
- `Artists` - Artist profiles
- `AlbumArtists` - Album-Artist relationships
- `Playlists` - Playlist definitions
- `PlaylistSongs` - Playlist-Song relationships
- `Genres` - Genre definitions
- `Tags` - Custom tags
- `Directories` - File organization
- `Labels` - Record labels

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server 2022 or higher
- Visual Studio 2022 or VS Code

### Local Development

1. **Configure Database Connection**

   Edit `appsettings.Development.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=MusicDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
     }
   }
   ```

2. **Run Database Migrations**

   ```bash
   dotnet ef database update
   ```

3. **Start the Service**

   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger Documentation**

   Navigate to: http://localhost:5002/swagger

### Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "TokenConfiguration": {
    "Audience": "JWTServicePostmanClient",
    "Issuer": "JWTServiceAccessToken",
    "TokenExpireTime": "10"
  },
  "MusicLibrary": {
    "StoragePath": "/data/music",
    "AllowedFormats": ["mp3", "wav", "flac", "aac"]
  }
}
```

## 🎵 Music Metadata

The service supports rich metadata for tracks:

- **Basic**: Title, Artist, Album, Duration
- **Technical**: BPM, Key, Bitrate, Sample Rate
- **Tagging**: Genre, Mood, Energy Level
- **Performance**: Play Count, Rating, Last Played
- **File Info**: Format, File Size, File Path

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/MusicAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Authentication** - Secure API access
- **Role-Based Authorization** - DJ, Admin access levels
- **File Upload Validation** - Allowed file types and sizes
- **Path Traversal Prevention** - Secure file handling

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
SQL_CONNECTION_STRING=your-connection-string
MUSIC_STORAGE_PATH=/var/lib/djbeatblaster/music
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t musicapi:latest .
```

### Run Container

```bash
docker run -d -p 5002:5002 \
  -v /path/to/music:/data/music \
  -e SQL_CONNECTION_STRING=your-connection \
  musicapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design

## 🤝 Integration with Other Services

The MusicAPI integrates with:

- **IdentityAPI** - User authentication
- **PartyAPI** - Event playlist selection
- **Strapi CMS** - Public music metadata
- **DJ Panel Frontend** - Music library interface

## 🔧 Development Guidelines

### Adding New Endpoints

1. Create controller method with proper routing
2. Implement business logic in service layer
3. Add authorization attributes
4. Update Swagger documentation
5. Write comprehensive unit tests

### Database Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

## 🎯 Future Enhancements

- Music recommendation engine
- Automatic BPM detection
- Key detection and harmonic mixing
- Waveform generation
- Audio analysis and tagging
- Integration with music streaming services

## 📞 Support

For issues related to MusicAPI, please refer to the main project repository or contact the development team.

---

**Built with ❤️ by the DJ Beat Blaster Team**
