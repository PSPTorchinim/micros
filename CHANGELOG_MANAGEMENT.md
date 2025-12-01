# Changelog Management

This document describes the changelog management system for all microservices in the DJ Beat Blaster platform.

## Overview

Each service maintains its own `CHANGELOG.md` file that tracks notable changes. The changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Services with Changelogs

All backend services maintain changelogs:

- **CompanyAPI** - Brand and client management service
- **DJHostGateway** - API Gateway service
- **DocumentsAPI** - Document generation service
- **EquipmentAPI** - Equipment inventory service
- **IdentityAPI** - Authentication and user management service
- **MailingAPI** - Email campaign service
- **MusicAPI** - Music library service
- **PartyAPI** - Event management service

## How It Works

### Manual Maintenance

Changelogs should be manually maintained following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format. Changes should be grouped into categories:

- **Added** - New features
- **Fixed** - Bug fixes
- **Changed** - Changes to existing functionality
- **Deprecated** - Features marked for removal
- **Removed** - Removed features
- **Security** - Security-related changes
- **Performance** - Performance improvements
- **Documentation** - Documentation updates
- **Testing** - Test updates
- **Refactored** - Code refactoring
- **Miscellaneous** - Other changes

When making changes to a service, update the corresponding `CHANGELOG.md` file in the service directory with a description of the change under the appropriate category.

## Commit Message Format

To ensure your changes appear correctly in the changelog, follow the conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Examples

**Adding a new feature:**
```
feat(CompanyAPI): add client search functionality
```

**Fixing a bug:**
```
fix(MusicAPI): resolve playlist sorting issue
```

**Security update:**
```
fix(IdentityAPI): patch JWT token validation vulnerability
```

**Breaking change:**
```
feat(PartyAPI)!: change event booking endpoint structure

BREAKING CHANGE: The event booking endpoint now requires additional fields
```

### Common Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### Scopes

Use the service name as the scope when the change affects a specific service:
- `CompanyAPI`
- `DJHostGateway`
- `DocumentsAPI`
- `EquipmentAPI`
- `IdentityAPI`
- `MailingAPI`
- `MusicAPI`
- `PartyAPI`

## Viewing Changelogs

Each service's changelog is located at:
```
Services/<ServiceName>/CHANGELOG.md
```

For example:
- `Services/CompanyAPI/CHANGELOG.md`
- `Services/IdentityAPI/CHANGELOG.md`
- `Services/MusicAPI/CHANGELOG.md`

## Changelog Format

Each changelog should follow this structure:

```markdown
# Changelog

All notable changes to this service will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features

### Fixed
- Bug fixes

### Changed
- Changes to existing functionality

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
```

## Best Practices

1. **Write meaningful commit messages** - They will appear in the changelog
2. **Use conventional commit format** - Ensures proper categorization
3. **Reference issues** - Use `#123` to link to issues
4. **Mark breaking changes** - Use `!` or `BREAKING CHANGE:` in commit messages
5. **Keep commits focused** - One logical change per commit

## Maintenance Tips

1. **Update changelogs as you make changes** - Don't wait until release time
2. **Keep entries concise** - One line per change is usually sufficient
3. **Link to issues/PRs** - Use `#123` to reference related issues
4. **Use the unreleased section** - Add new entries under `[Unreleased]` until you create a release
5. **Create version sections when releasing** - Move unreleased changes to a new version section with the release date

## Related Documentation

- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [git-cliff Documentation](https://git-cliff.org/)

## Support

For issues or questions about the changelog system:
1. Check existing changelogs for examples
2. Review the [conventional commits specification](https://www.conventionalcommits.org/)
3. Open an issue with the `documentation` label
