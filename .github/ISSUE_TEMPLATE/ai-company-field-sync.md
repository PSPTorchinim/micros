---
name: AI-Powered Company Field Detection
about: Implement an AI sync endpoint that proposes required registration fields for company types, with human review before saving
title: "AI Sync: Detect required company registration fields using AI (human-in-the-loop)"
labels: enhancement, company-types, ai
assignees: ''
---

## Overview

The current company type system relies on hardcoded `KnownRegistrationFields` (US, DE, FR, GB, NL, AT, CH, PL) to define which registration form fields are required for each legal entity type. This works but requires a code change for every new jurisdiction or legal form change.

This issue proposes adding an **AI-powered sync endpoint** that uses a large language model (e.g. Azure OpenAI GPT-4o) to suggest required fields for any company type in any country, with a **human review step** before results are persisted.

---

## Problem Statement

- Adding a new jurisdiction (e.g. CZ, SK, RO) or updating existing field definitions requires a developer PR
- There is no public API that exposes jurisdiction-specific registration field requirements — this is legal domain knowledge
- The admin panel already has `POST /v1/AdminCompanyTypes/import` and a GLEIF sync, but there is no AI-assisted suggestion flow

---

## Proposed Solution

### New backend endpoint

```
POST /v1/AdminCompanyTypes/ai-suggest?countryCode=PL&languageCode=en
```

- **Input:** ISO 3166-1 alpha-2 country code (required), preferred language for field labels (optional, default `en`)
- **Output:** `AiCompanySuggestResultDTO` — a list of `ExternalCompanyTypeDefinition` objects **proposed** by the AI, _not yet saved_
- The endpoint does **not** write anything to the database — it only returns suggestions

### New frontend view in `CompanyTypeAdminBlock`

Add a sixth view: **AI Suggest**

| Step | Action |
|---|---|
| 1 | Admin enters country code (e.g. `PL`) and clicks **Generate** |
| 2 | Frontend calls `POST /v1/AdminCompanyTypes/ai-suggest?countryCode=PL` |
| 3 | UI displays the AI-proposed types and fields for human review (editable) |
| 4 | Admin can accept, edit, or discard individual types/fields |
| 5 | On **Save**, the accepted definitions are submitted to `POST /v1/AdminCompanyTypes/import` |

This gives the same human-in-the-loop control as requested.

---

## Technical Design

### Backend

#### New service: `IAiCompanyTypeService` / `AiCompanyTypeService`

```csharp
public interface IAiCompanyTypeService
{
    /// <summary>
    /// Asks the configured AI model to suggest required registration fields
    /// for all common legal entity types in the given country.
    /// Returns a list of ExternalCompanyTypeDefinition objects — NOT persisted.
    /// </summary>
    Task<List<ExternalCompanyTypeDefinition>> SuggestAsync(string countryCode, string languageCode = "en");
}
```

**Prompt structure (example for PL):**

```
You are a legal data expert. List the most common legal entity types in Poland
and the registration form fields required for each. Return a JSON array matching
this schema: [{ "code": "SP_ZOO", "countryCode": "PL", "isActive": true,
"displayOrder": 1, "translations": [{"languageCode":"en","name":"..."}],
"fields": [{"fieldKey":"nip","fieldType":"text","isRequired":true,
"validationRegex":"...","translations":[{"languageCode":"en","label":"...","helpText":"..."}]}] }]
Only return valid JSON. No prose.
```

#### Configuration

| Env var | Description | Default |
|---|---|---|
| `ASPNETCORE_AI_COMPANY_SYNC_PROVIDER` | `AzureOpenAI` or `OpenAI` | `AzureOpenAI` |
| `ASPNETCORE_AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | — |
| `ASPNETCORE_AZURE_OPENAI_API_KEY` | Azure OpenAI API key | — |
| `ASPNETCORE_AZURE_OPENAI_DEPLOYMENT` | Model deployment name | `gpt-4o` |
| `ASPNETCORE_OPENAI_API_KEY` | OpenAI API key (if provider = OpenAI) | — |

#### New controller action in `AdminCompanyTypesController`

```csharp
/// <summary>
/// Uses AI to suggest required registration fields for all common company types
/// in the given country. Results are NOT saved — they are returned for human review.
/// Use POST /import to persist accepted definitions.
/// Requires: SuperOwner role.
/// </summary>
[HttpPost("ai-suggest")]
public async Task<IActionResult> AiSuggestV1([FromQuery] string countryCode, [FromQuery] string languageCode = "en")
{
    return await Handle(async () => await _aiCompanyTypeService.SuggestAsync(countryCode, languageCode));
}
```

#### New NuGet packages

| Package | Version |
|---|---|
| `Azure.AI.OpenAI` | latest stable |

### Frontend (`CompanyTypeAdminBlock`)

Add a new `AiSuggest` view state to `company-type-admin-block`:

1. Country code input + `Generate` button
2. Loading spinner while waiting for AI response
3. Editable table/accordion showing proposed types and fields
4. Per-type accept/discard checkboxes
5. `Save accepted` button → calls existing `importCompanyTypes()` service method with the accepted definitions
6. Confirmation dialog showing `Created / Updated / Failed` summary from the import endpoint

New method in `company-type-admin-service.ts`:

```typescript
aiSuggest(countryCode: string, languageCode = 'en'): Promise<ExternalCompanyTypeDefinition[]>
```

---

## Acceptance Criteria

- [ ] `POST /v1/AdminCompanyTypes/ai-suggest?countryCode=XX` returns a list of `ExternalCompanyTypeDefinition` objects without writing to the database
- [ ] AI suggestions include at minimum: field key, field type, required flag, regex (if applicable), and EN label/help text
- [ ] The frontend shows the AI-generated suggestions in an editable review UI before saving
- [ ] Admin can selectively accept or discard individual types and fields
- [ ] Accepted definitions are imported via the existing `POST /v1/AdminCompanyTypes/import` endpoint
- [ ] The AI provider (Azure OpenAI / OpenAI) is configurable via environment variables
- [ ] Appropriate error handling when the AI model returns unparseable JSON (fallback message shown to admin)
- [ ] Unit tests cover: prompt construction, response parsing, error handling for malformed AI output

---

## Out of Scope

- Auto-saving AI suggestions without human review
- Fine-tuning or training a custom model
- Legal compliance guarantees — AI output must always be reviewed by a legal/accounting professional before use

---

## Related

- PR: Add company types with international support (MongoDB-backed, GLEIF API sync, admin UI + JSON import)
- Existing endpoint: `POST /v1/AdminCompanyTypes/import` — used to persist accepted AI suggestions
- Existing endpoint: `POST /v1/AdminCompanyTypes/sync?countryCode=XX` — GLEIF sync (names only, no fields)
- `KnownRegistrationFields` — hardcoded field definitions that this feature would eventually replace
