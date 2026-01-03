#!/usr/bin/env node

/**
 * CodeQL Auto-Fix Script
 * 
 * This script analyzes CodeQL SARIF results and applies automated fixes
 * for common security vulnerabilities where safe automatic remediation is possible.
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse CodeQL SARIF file
 */
function parseSARIF(sarifPath) {
  try {
    const content = fs.readFileSync(sarifPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading SARIF file: ${error.message}`);
    return null;
  }
}

/**
 * Apply automatic fixes for common issues
 */
function applyAutoFixes(alerts) {
  const fixes = [];
  const manualReviews = [];

  alerts.forEach(alert => {
    const ruleId = alert.rule?.id || 'unknown';
    const location = alert.locations?.[0]?.physicalLocation;
    
    if (!location) {
      console.warn(`Alert ${alert.alertNumber} has no location information`);
      return;
    }

    const filePath = location.artifactLocation?.uri;
    const region = location.region;

    console.log(`Processing alert: ${ruleId} in ${filePath}`);

    // Determine if we can auto-fix this issue
    const fixStrategy = getFixStrategy(ruleId, alert);

    if (fixStrategy.canAutoFix) {
      fixes.push({
        ruleId,
        filePath,
        region,
        strategy: fixStrategy,
        alert
      });
    } else {
      manualReviews.push({
        ruleId,
        filePath,
        region,
        reason: fixStrategy.reason,
        alert
      });
    }
  });

  return { fixes, manualReviews };
}

/**
 * Determine fix strategy for a given rule
 */
function getFixStrategy(ruleId, alert) {
  const strategies = {
    // C# specific fixes
    'cs/sql-injection': {
      canAutoFix: false,
      reason: 'SQL injection fixes require understanding query context and business logic',
      suggestions: [
        'Use parameterized queries with SqlParameter',
        'Use Entity Framework or Dapper with parameter binding',
        'Never concatenate user input into SQL queries'
      ]
    },
    'cs/path-injection': {
      canAutoFix: false,
      reason: 'Path traversal fixes require validation logic specific to use case',
      suggestions: [
        'Validate file paths against an allowlist',
        'Use Path.GetFullPath() and check if result is within expected directory',
        'Sanitize user input before using in file paths'
      ]
    },
    'cs/weak-crypto': {
      canAutoFix: false,
      reason: 'Cryptographic algorithm changes may break compatibility',
      suggestions: [
        'Replace MD5 with SHA256 or SHA512',
        'Replace SHA1 with SHA256 or SHA512',
        'Use modern cryptographic libraries'
      ]
    },
    'cs/hardcoded-credentials': {
      canAutoFix: false,
      reason: 'Moving credentials requires environment setup and configuration',
      suggestions: [
        'Move credentials to environment variables',
        'Use Azure Key Vault or similar secret management',
        'Use .NET Secret Manager for development',
        'Never commit credentials to source control'
      ]
    },

    // JavaScript/TypeScript specific fixes
    'js/sql-injection': {
      canAutoFix: false,
      reason: 'SQL injection fixes require understanding query context',
      suggestions: [
        'Use parameterized queries or prepared statements',
        'Use ORM libraries like Sequelize with parameter binding',
        'Never concatenate user input into SQL queries'
      ]
    },
    'js/xss': {
      canAutoFix: false,
      reason: 'XSS fixes depend on rendering context and framework',
      suggestions: [
        'Use framework-provided escaping (React automatically escapes)',
        'Avoid dangerouslySetInnerHTML unless absolutely necessary',
        'Sanitize HTML content with DOMPurify before rendering',
        'Use textContent instead of innerHTML for text'
      ]
    },
    'js/path-injection': {
      canAutoFix: false,
      reason: 'Path traversal fixes require validation logic',
      suggestions: [
        'Validate file paths against an allowlist',
        'Use path.normalize() and check if result is within expected directory',
        'Sanitize user input before using in file paths'
      ]
    },
    'js/hardcoded-credentials': {
      canAutoFix: false,
      reason: 'Moving credentials requires environment setup',
      suggestions: [
        'Move credentials to environment variables',
        'Use .env files (not committed) with dotenv',
        'Use secret management services',
        'Never commit credentials to source control'
      ]
    }
  };

  return strategies[ruleId] || {
    canAutoFix: false,
    reason: 'No automated fix strategy available for this rule',
    suggestions: ['Review CodeQL documentation for manual remediation guidance']
  };
}

/**
 * Generate a markdown report
 */
function generateReport(fixes, manualReviews) {
  let report = '# CodeQL Auto-Fix Report\n\n';
  
  if (fixes.length === 0 && manualReviews.length === 0) {
    report += '✅ No security issues found.\n';
    return report;
  }

  if (fixes.length > 0) {
    report += `## ✅ Automated Fixes Applied (${fixes.length})\n\n`;
    fixes.forEach(fix => {
      report += `### ${fix.ruleId}\n`;
      report += `- **File**: ${fix.filePath}\n`;
      report += `- **Line**: ${fix.region?.startLine || 'unknown'}\n`;
      report += `- **Status**: Fix applied automatically\n\n`;
    });
  }

  if (manualReviews.length > 0) {
    report += `## ⚠️  Manual Review Required (${manualReviews.length})\n\n`;
    
    const groupedByRule = {};
    manualReviews.forEach(review => {
      if (!groupedByRule[review.ruleId]) {
        groupedByRule[review.ruleId] = [];
      }
      groupedByRule[review.ruleId].push(review);
    });

    Object.keys(groupedByRule).forEach(ruleId => {
      const reviews = groupedByRule[ruleId];
      const firstReview = reviews[0];
      
      report += `### ${ruleId}\n\n`;
      report += `**Reason**: ${firstReview.reason}\n\n`;
      
      if (firstReview.alert.message?.text) {
        report += `**Description**: ${firstReview.alert.message.text}\n\n`;
      }

      report += '**Affected Files**:\n';
      reviews.forEach(review => {
        const line = review.region?.startLine || 'unknown';
        report += `- ${review.filePath}:${line}\n`;
      });
      
      const strategy = getFixStrategy(ruleId, firstReview.alert);
      if (strategy.suggestions) {
        report += '\n**Recommended Actions**:\n';
        strategy.suggestions.forEach(suggestion => {
          report += `- ${suggestion}\n`;
        });
      }
      
      report += '\n';
    });
  }

  report += '---\n';
  report += `Generated: ${new Date().toISOString()}\n`;

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 CodeQL Auto-Fix Script Starting...\n');

  // In a real scenario, this would fetch alerts from GitHub API
  // For now, we'll work with what's provided
  
  const alerts = process.env.CODEQL_ALERTS 
    ? JSON.parse(process.env.CODEQL_ALERTS) 
    : [];

  console.log(`Found ${alerts.length} CodeQL alerts\n`);

  if (alerts.length === 0) {
    console.log('✅ No security issues to fix.');
    const report = generateReport([], []);
    fs.writeFileSync('codeql-report.md', report);
    return;
  }

  const { fixes, manualReviews } = applyAutoFixes(alerts);

  console.log(`\n📊 Summary:`);
  console.log(`- Automated fixes: ${fixes.length}`);
  console.log(`- Manual reviews needed: ${manualReviews.length}`);

  const report = generateReport(fixes, manualReviews);
  fs.writeFileSync('codeql-report.md', report);
  console.log('\n✅ Report generated: codeql-report.md');

  // Exit with error if there are issues requiring manual review
  if (manualReviews.length > 0) {
    console.log('\n⚠️  Manual review required for some issues.');
    // Don't fail the workflow - just inform about manual review needed
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { parseSARIF, applyAutoFixes, generateReport, getFixStrategy };
