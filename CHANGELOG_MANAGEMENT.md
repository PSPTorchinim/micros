# Changelog Management

This document describes the automatic changelog generation system implemented for all microservices in the DJ Beat Blaster platform.

## Overview

Each service maintains its own `CHANGELOG.md` file that automatically tracks notable changes. The changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Services with Changelogs

All backend services have automated changelog generation:

- **CompanyAPI** - Brand and client management service
- **DJHostGateway** - API Gateway service
- **DocumentsAPI** - Document generation service
- **EquipmentAPI** - Equipment inventory service
- **IdentityAPI** - Authentication and user management service
- **MailingAPI** - Email campaign service
- **MusicAPI** - Music library service
- **PartyAPI** - Event management service

## How It Works

### Automatic Generation

Changelogs are automatically generated using [git-cliff](https://git-cliff.org/) based on commit messages. The system:

1. **Triggers** on:
   - Pushes to `production` branch
   - Pushes to `releases/**` branches
   - Published releases
   - Manual workflow dispatch

2. **Analyzes** commit messages using conventional commit format

3. **Groups** changes into categories:
   - **Added** - New features (`feat:`, `add:`)
   - **Fixed** - Bug fixes (`fix:`, `bug:`)
   - **Changed** - Changes to existing functionality (`change:`)
   - **Deprecated** - Features marked for removal
   - **Removed** - Removed features (`remove:`)
   - **Security** - Security-related changes
   - **Performance** - Performance improvements (`perf:`)
   - **Documentation** - Documentation updates (`doc:`)
   - **Testing** - Test updates (`test:`)
   - **Refactored** - Code refactoring (`refactor:`)
   - **Miscellaneous** - Other changes (`chore:`, `ci:`)

4. **Updates** the appropriate `CHANGELOG.md` file in each service directory

### Manual Generation

You can manually trigger changelog generation for all services or a specific service:

1. Navigate to **Actions** → **Generate Changelogs**
2. Click **Run workflow**
3. (Optional) Select a specific service from the dropdown
4. Click **Run workflow** button

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

## Configuration

The changelog generation is configured in:
- **Workflow**: `.github/workflows/changelog-generator.yml`
- **git-cliff config**: `.github/cliff.toml`

### Customization

To customize how changelogs are generated, edit `.github/cliff.toml`:

```toml
[changelog]
header = "..."    # Changelog header
body = "..."      # Template for changelog entries
footer = "..."    # Changelog footer

[git]
conventional_commits = true
commit_parsers = [...]  # Rules for parsing commits
```

## Best Practices

1. **Write meaningful commit messages** - They will appear in the changelog
2. **Use conventional commit format** - Ensures proper categorization
3. **Reference issues** - Use `#123` to link to issues
4. **Mark breaking changes** - Use `!` or `BREAKING CHANGE:` in commit messages
5. **Keep commits focused** - One logical change per commit

## Troubleshooting

### Changelog not updating?

1. Verify your commit messages follow the conventional format
2. Check if the workflow ran successfully in the Actions tab
3. Ensure commits affect the service directory (e.g., `Services/CompanyAPI/`)

### Manual regeneration needed?

Run the workflow manually:
```bash
# Via GitHub CLI
gh workflow run changelog-generator.yml

# Or use the GitHub UI
Actions → Generate Changelogs → Run workflow
```

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
