# CodeQL Auto-Fix Workflow

This directory contains the CodeQL Auto-Fix system that automatically analyzes and reports security vulnerabilities found by CodeQL scans on Pull Requests targeting release branches.

## Overview

The CodeQL Auto-Fix workflow (`codeql-autofix.yml`) is designed to:

1. **Trigger automatically** after the "PR Validation" workflow completes successfully
2. **Analyze CodeQL alerts** that affect files in the Pull Request
3. **Generate detailed reports** with remediation guidance
4. **Post comments** on PRs with actionable security recommendations

## Components

### 1. Workflow File
**Location**: `.github/workflows/codeql-autofix.yml`

This workflow:
- Runs after PR Validation workflow completes
- Only processes PRs targeting `releases/**` branches
- Fetches CodeQL security alerts from GitHub's Code Scanning API
- Filters alerts to only those affecting files changed in the PR
- Generates and posts a detailed report as a PR comment

### 2. Auto-Fix Script
**Location**: `.github/scripts/codeql-autofix.js`

This Node.js script:
- Parses CodeQL alerts and categorizes them by severity
- Provides fix strategies for common security issues:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Path Traversal
  - Hardcoded Credentials
  - Weak Cryptography
- Generates markdown reports with actionable recommendations
- Supports both C# and JavaScript/TypeScript codebases

## How It Works

### Workflow Trigger
```yaml
on:
  workflow_run:
    workflows: ["PR Validation"]
    types: [completed]
    branches: ['releases/**']
```

The workflow triggers when:
- The "PR Validation" workflow completes successfully
- The workflow was triggered by a pull_request event
- The PR targets a branch matching `releases/**`

### Alert Processing

1. **Fetch PR Information**: Identifies the PR associated with the workflow run
2. **Validate Target Branch**: Ensures the PR targets a release branch
3. **Fetch CodeQL Alerts**: Retrieves open CodeQL alerts from GitHub API
4. **Filter Relevant Alerts**: Only includes alerts affecting files changed in the PR
5. **Generate Report**: Creates a detailed markdown report with remediation steps
6. **Post Comment**: Updates or creates a PR comment with the report

### Security Considerations

For security reasons, the auto-fix system **does not automatically commit code changes**. Instead, it:

- ✅ Analyzes and categorizes security issues
- ✅ Provides detailed remediation guidance
- ✅ Links to relevant documentation
- ✅ Groups similar issues for easier review
- ❌ Does not automatically modify source code

This approach ensures that:
- Developers review and understand each fix
- Context-specific solutions are applied
- Business logic is preserved
- Security fixes are appropriate for each use case

## Supported Languages

- **C# (.NET)**: SQL injection, path traversal, weak crypto, hardcoded credentials
- **JavaScript/TypeScript**: XSS, SQL injection, path traversal, hardcoded credentials

## Example Report

When CodeQL alerts are found, a comment like this is posted to the PR:

```markdown
## 🔍 CodeQL Security Analysis Results

This PR has **3** CodeQL security alert(s) that require attention.

## ⚠️ Manual Review Required (3)

### cs/sql-injection

**Reason**: SQL injection fixes require understanding query context and business logic

**Affected Files**:
- Services/CompanyAPI/Controllers/SearchController.cs:45
- Services/EquipmentAPI/Repositories/EquipmentRepository.cs:128

**Recommended Actions**:
- Use parameterized queries with SqlParameter
- Use Entity Framework or Dapper with parameter binding
- Never concatenate user input into SQL queries
```

## Configuration

### Required Permissions

The workflow requires these GitHub token permissions:
```yaml
permissions:
  contents: write          # To commit fixes (if enabled)
  security-events: read    # To read CodeQL alerts
  pull-requests: write     # To post comments
```

### Environment Variables

The script uses:
- `CODEQL_ALERTS`: JSON array of CodeQL alerts (passed from workflow)

## Extending the System

### Adding New Fix Strategies

To add support for new security rules, edit `.github/scripts/codeql-autofix.js`:

```javascript
const strategies = {
  'language/rule-id': {
    canAutoFix: false,  // Set to true only if safe automated fixes are possible
    reason: 'Why manual review is needed',
    suggestions: [
      'Action item 1',
      'Action item 2'
    ]
  }
};
```

### Enabling Automatic Commits (Advanced)

If you want to enable automatic code commits for specific rule types:

1. Update the fix strategy to `canAutoFix: true`
2. Implement the fix logic in `applyAutoFixes()` function
3. Add a commit step to the workflow after the script runs
4. **Important**: Thoroughly test before deploying to production

## Testing

To test the workflow locally:

1. Set up test alerts:
```bash
export CODEQL_ALERTS='[{"rule":{"id":"cs/sql-injection"},"alertNumber":1,"message":{"text":"Test"},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"test.cs"},"region":{"startLine":10}}}]}]'
```

2. Run the script:
```bash
node .github/scripts/codeql-autofix.js
```

3. Check generated `codeql-report.md`

## Troubleshooting

### Workflow Not Triggering

- Verify PR targets `releases/**` branch
- Check that "PR Validation" workflow completed successfully
- Ensure workflow has correct permissions

### No Alerts Detected

- CodeQL scan may not have found issues (this is good!)
- Alerts may not affect files changed in the PR
- Check GitHub Code Scanning alerts page directly

### Script Errors

- Ensure Node.js 22+ is available
- Check that `CODEQL_ALERTS` environment variable is set correctly
- Review workflow logs for detailed error messages

## Resources

- [CodeQL Documentation](https://codeql.github.com/docs/)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## Maintenance

This system should be reviewed and updated when:
- New security rules are added to CodeQL
- New programming languages are added to the project
- Security best practices evolve
- GitHub Actions API changes occur

## License

This workflow is part of the Micros project and follows the same license as the main repository.
