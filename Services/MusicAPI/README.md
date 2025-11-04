# MusicAPI - Music Library & Playlist Management Service

The Music service manages the DJ's music library, playlists, and track metadata for the DJ Beat Blaster platform.

## 📋 Overview

MusicAPI provides comprehensive music management capabilities:

- Music library management
- Playlist creation and curation
- Track metadata and tagging
- Search and filtering
- Music categorization by genre, BPM, key
- DJ-specific music analytics

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server (MusicDB)
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
MusicAPI/
├── Controllers/         # API endpoint controllers
├── Data/               # Database context and seed data
├── Entities/           # Domain models and entities
├── Repositories/       # Data access layer
├── Services/           # Business logic services
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── MusicAPI.csproj     # Project file
```

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server (local or container)
- Visual Studio 2022 or VS Code

### Running Locally

1. **Ensure SQL Server is running**:
   ```bash
   docker run -d --name sqlserver -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
   ```

2. **Update connection string** in `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost,1433;Database=MusicDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
     }
   }
   ```

3. **Run the service**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger UI**: http://localhost:5002/swagger

## 🔌 API Endpoints

### Tracks

#### GET /api/tracks
Get paginated list of music tracks.

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `search` - Search by title, artist, or album
- `genre` - Filter by genre
- `minBpm` / `maxBpm` - BPM range filter
- `key` - Musical key filter
- `sortBy` - Sort field (title, artist, bpm, addedDate)

**Response**:
```json
{
  "items": [
    {
      "id": "track-id",
      "title": "Track Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "genre": "House",
      "bpm": 128,
      "key": "Am",
      "duration": 245,
      "fileUrl": "/music/files/track.mp3",
      "addedDate": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 1500,
  "page": 1,
  "pageSize": 20
}
```

#### GET /api/tracks/{id}
Get specific track details.

#### POST /api/tracks
Add new track to library.

**Request**:
```json
{
  "title": "New Track",
  "artist": "DJ Artist",
  "album": "Latest Album",
  "genre": "House",
  "bpm": 128,
  "key": "Am",
  "duration": 240,
  "fileUrl": "/uploads/track.mp3"
}
```

#### PUT /api/tracks/{id}
Update track metadata.

#### DELETE /api/tracks/{id}
Remove track from library.

### Playlists

#### GET /api/playlists
Get user's playlists.

**Response**:
```json
{
  "items": [
    {
      "id": "playlist-id",
      "name": "Summer Vibes 2024",
      "description": "Perfect tracks for beach parties",
      "trackCount": 45,
      "duration": 10800,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/playlists/{id}
Get playlist with tracks.

#### POST /api/playlists
Create new playlist.

**Request**:
```json
{
  "name": "Wedding Reception",
  "description": "Elegant tracks for wedding receptions",
  "isPublic": false
}
```

#### PUT /api/playlists/{id}
Update playlist information.

#### DELETE /api/playlists/{id}
Delete playlist.

#### POST /api/playlists/{id}/tracks
Add track to playlist.

**Request**:
```json
{
  "trackId": "track-id",
  "position": 1
}
```

#### DELETE /api/playlists/{playlistId}/tracks/{trackId}
Remove track from playlist.

#### PUT /api/playlists/{id}/reorder
Reorder tracks in playlist.

### Search & Discovery

#### GET /api/tracks/search
Advanced search with multiple criteria.

**Query Parameters**:
- `query` - Full-text search
- `filters` - JSON filter object
- `page` / `pageSize` - Pagination

#### GET /api/tracks/similar/{id}
Find similar tracks based on BPM, key, and genre.

#### GET /api/tracks/recommendations
Get personalized track recommendations.

## 🗄️ Database Schema

### Tracks Table
- Id (PK)
- Title
- Artist
- Album
- Genre
- BPM (Beats Per Minute)
- Key (Musical Key)
- Duration (seconds)
- FileUrl
- FileSize
- Format (MP3, WAV, FLAC)
- AddedDate
- PlayCount
- LastPlayedDate
- Rating

### Playlists Table
- Id (PK)
- Name
- Description
- UserId (FK to Identity)
- IsPublic
- CreatedAt
- UpdatedAt

### PlaylistTracks Table (Junction)
- Id (PK)
- PlaylistId (FK)
- TrackId (FK)
- Position
- AddedAt

### Genres Table
- Id (PK)
- Name
- Description

### Tags Table
- Id (PK)
- Name

### TrackTags Table (Junction)
- TrackId (FK)
- TagId (FK)

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_HOST_SQLSERVER=localhost
DATABASE_PORT_SQLSERVER=1433
DATABASE_USER_SQLSERVER=sa
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd
MUSIC_DATABASE_CATALOG=MusicDB

# Security
SECURE_KEY=YourSecureAPIKeyHere
JWT_KEY=YourJWTKey

# Storage
MUSIC_STORAGE_PATH=/var/music/library
MUSIC_MAX_FILE_SIZE_MB=100

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 🎵 Music File Management

### Supported Formats
- MP3 (recommended)
- WAV (high quality)
- FLAC (lossless)
- AAC
- OGG

### File Storage
- Files stored in configured storage path
- Original filenames preserved with unique identifiers
- Automatic metadata extraction from ID3 tags
- Thumbnail generation for album art

### Upload Process
1. File validation (format, size)
2. Metadata extraction
3. File storage
4. Database entry creation
5. Optional: Audio analysis (BPM detection, key detection)

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/MusicAPI.Tests
dotnet test
```

### Test Scenarios
- Track CRUD operations
- Playlist management
- Search functionality
- File upload handling
- Metadata extraction

## 📊 Health Checks

The service exposes health check endpoints:

- **Liveness**: `/healthz/live` - Service is running
- **Readiness**: `/healthz/ready` - Service is ready (DB and file storage accessible)

## 🔍 Logging

Structured logging includes:
- Track addition/modification events
- Playlist operations
- Search queries and performance
- File upload activities
- Error tracking

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=MusicAPI \
  -t djbeatblaster/music-api:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name music-api \
  -p 5002:8080 \
  -v /path/to/music:/var/music/library \
  -e DATABASE_HOST_SQLSERVER=sqlserver \
  djbeatblaster/music-api:latest
```

## 🤝 Integration with Other Services

- **DJHostGateway**: Routes music-related requests
- **IdentityAPI**: User authentication and ownership
- **PartyAPI**: Event playlists and music scheduling
- **Strapi CMS**: Music metadata and promotional content

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [API Gateway Documentation](../DJHostGateway/README.md)

## 🐛 Troubleshooting

### File upload fails
- Check storage path permissions
- Verify file size limits
- Ensure supported file format

### BPM detection inaccurate
- Use manual BPM entry
- Verify audio file quality
- Check for tempo changes in track

### Search not returning results
- Verify database indexing
- Check search query syntax
- Rebuild search indexes if needed

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
