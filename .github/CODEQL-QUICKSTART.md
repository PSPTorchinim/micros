# CodeQL Resolver - Quick Start Guide

## What This Does

The CodeQL Resolver automatically analyzes security vulnerabilities detected by CodeQL scans on Pull Requests to release branches and provides:

- 📊 **Automated Analysis**: Categorizes security issues by type and severity
- 📝 **Detailed Reports**: Provides fix strategies and recommendations
- 💬 **PR Comments**: Posts actionable guidance directly on your PRs
- 🔧 **Auto-Commit**: Can automatically commit safe fixes (when applicable)

## How to Use

### For PR Authors

When you create a PR targeting a `releases/**` branch:

1. **Wait for CI to complete**: The "PR Validation" workflow will run CodeQL scans
2. **Check for comments**: If security issues are found, the CodeQL Auto-Fix bot will comment on your PR
3. **Review the report**: The comment includes:
   - Number of issues found
   - Specific files and line numbers
   - Recommended fixes for each issue
   - Links to documentation
4. **Apply fixes**: Follow the recommendations to fix security issues
5. **Push changes**: Commit and push your fixes to the PR branch

### Example PR Comment

```markdown
## 🔍 CodeQL Security Analysis Results

This PR has **2** CodeQL security alert(s) that require attention.

## ⚠️ Manual Review Required (2)

### cs/sql-injection

**Reason**: SQL injection fixes require understanding query context

**Affected Files**:
- Services/CompanyAPI/Controllers/SearchController.cs:45

**Recommended Actions**:
- Use parameterized queries with SqlParameter
- Use Entity Framework or Dapper with parameter binding
- Never concatenate user input into SQL queries

### js/xss

**Reason**: XSS fixes depend on rendering context

**Affected Files**:
- Frontends/dj-panel/src/components/Search.tsx:128

**Recommended Actions**:
- Avoid dangerouslySetInnerHTML unless necessary
- Sanitize HTML content with DOMPurify
- Use textContent instead of innerHTML for text
```

## When Does It Run?

The CodeQL Auto-Fix workflow runs:
- ✅ After the "PR Validation" workflow completes successfully
- ✅ Only on PRs targeting `releases/**` branches
- ✅ Only when CodeQL finds security issues
- ❌ NOT on regular feature branches (only validation runs there)

## Common Security Issues & Fixes

### SQL Injection
**Problem**: User input concatenated into SQL queries
**Fix**: Use parameterized queries or ORM with parameter binding

```csharp
// ❌ Bad
var query = $"SELECT * FROM Users WHERE Name = '{userName}'";

// ✅ Good
var query = "SELECT * FROM Users WHERE Name = @userName";
command.Parameters.AddWithValue("@userName", userName);
```

### Cross-Site Scripting (XSS)
**Problem**: Unsanitized user input rendered as HTML
**Fix**: Use framework escaping or sanitize with DOMPurify

```javascript
// ❌ Bad
element.innerHTML = userInput;

// ✅ Good
element.textContent = userInput;
// or
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Path Traversal
**Problem**: User input used in file paths without validation
**Fix**: Validate paths and use allowlists

```csharp
// ❌ Bad
var filePath = Path.Combine(baseDir, userInput);

// ✅ Good
var fileName = Path.GetFileName(userInput); // Remove path components
var filePath = Path.Combine(baseDir, fileName);
var fullPath = Path.GetFullPath(filePath);
if (!fullPath.StartsWith(baseDir)) throw new SecurityException();
```

### Hardcoded Credentials
**Problem**: Passwords or API keys in source code
**Fix**: Use environment variables or secret management

```csharp
// ❌ Bad
var apiKey = "sk_live_12345abcdef";

// ✅ Good
var apiKey = Environment.GetEnvironmentVariable("API_KEY");
```

### Weak Cryptography
**Problem**: Using outdated or weak hashing algorithms
**Fix**: Use modern cryptographic algorithms

```csharp
// ❌ Bad
var hasher = new MD5CryptoServiceProvider();

// ✅ Good
var hasher = SHA256.Create();
```

## Troubleshooting

### "Workflow didn't run"
- Check that your PR targets a `releases/**` branch
- Verify the "PR Validation" workflow completed successfully
- Look at Actions tab for workflow run logs

### "No comment on my PR"
- CodeQL may not have found any issues (great!)
- Check the workflow logs to see if alerts were detected
- Visit Security > Code scanning alerts to see all alerts

### "I fixed the issue but the comment is still there"
- The comment updates automatically when new scans run
- Push your fixes and wait for CI to complete
- The comment will update or be removed on next scan

## Getting Help

- **Documentation**: See `.github/workflows/README-CODEQL.md`
- **CodeQL Docs**: https://codeql.github.com/docs/
- **Security Best Practices**: https://docs.github.com/en/code-security

## Contributing

To improve the CodeQL Resolver:

1. **Add new fix strategies**: Edit `.github/scripts/codeql-autofix.js`
2. **Update workflow**: Modify `.github/workflows/codeql-autofix.yml`
3. **Test changes**: Use sample alerts to verify behavior
4. **Submit PR**: Follow standard contribution guidelines

---

**Note**: This system is designed to help, not replace, manual security review. Always understand the security implications of your fixes before merging.
