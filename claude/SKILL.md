---
name: pulse
description: Marketing automation platform for AI agents via MCP. Manage contacts, email campaigns, audience segments, analytics, and data sources. Use when the user needs marketing operations, contact management, campaign execution, audience segmentation, or performance analytics.
---

# Pulse — Marketing Automation via MCP

ReachOut is a marketing automation platform built for the AI age. Every capability — contacts, campaigns, segments, analytics, data sources — is exposed through an MCP (Model Context Protocol) server at `https://reachout-pulse-api.usereachout.com/mcp`.

## Setup

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pulse": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-remote"],
      "env": {
        "PULSE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Or configure the remote endpoint directly if your MCP client supports HTTP transport:
- URL: `https://reachout-pulse-api.usereachout.com/mcp`
- Headers: `Authorization: Bearer <PULSE_API_KEY>`

### Claude Code

Set the environment variable before starting Claude Code:
```bash
export PULSE_API_KEY="your-api-key"
```

Then configure the MCP server in your Claude Code settings to point to `https://reachout-pulse-api.usereachout.com/mcp`.

## Organization Context

All tools are implicitly scoped to an organization (tenant). The active org is resolved from your API key.

- `get_current_organization` — Confirm active tenant
- `list_organizations` — Discover accessible orgs
- `switch_organization` — Switch tenant (24h persistence via KV)

**Best practice:** Call `get_current_organization` at the start of each session to confirm you're operating on the correct tenant.

## Tool Reference

### Contacts
| Tool | Purpose |
|------|---------|
| `list_contacts` | Query with filters, sort, free-text search, pagination. Supports fixed fields and `custom.<key>` for user-defined fields. |
| `get_contact` | Fetch single contact by ID |
| `create_contact` | Create contact (email required) |
| `list_contact_fields` | List registered custom field definitions |
| `create_contact_field` | Register a new custom field (snake_case key) |
| `update_contact_field` | Update field; use `newKey` to rename (migrates JSON values) |
| `delete_contact_field` | Remove field definition + strip values from all contacts |
| `list_duplicate_contacts` | Find groups sharing the same email |
| `deduplicate_contacts` | Bulk-merge or delete duplicates automatically |
| `resolve_duplicate_contacts` | Manual resolution: keep one, merge/delete others |

### Campaigns
| Tool | Purpose |
|------|---------|
| `list_campaigns` | List campaigns; filter by status |
| `get_campaign_stats` | Delivery + engagement: sent, opened, clicked, bounced, openRate, clickRate |
| `send_campaign` | Trigger send (requires assigned segment) |

### Segments
| Tool | Purpose |
|------|---------|
| `list_segments` | List all segments with rules and estimated sizes |

### Analytics
| Tool | Purpose |
|------|---------|
| `get_analytics` | Pre-aggregated summaries (daily/weekly/monthly), up to 30 rows |
| `get_analytics_overview` | Visitor aggregates: uniques, sessions, pageviews, bounceRate, avgSessionDurationMs + daily series |
| `get_top_pages` | Top paths with pageviews, uniques, avgDurationMs |
| `get_top_referrers` | Top referrer hosts with session counts |

### Tracking
| Tool | Purpose |
|------|---------|
| `list_tracking_clients` | Website tracking credentials |
| `create_tracking_client` | Generate new clientId (optionally with secret) |
| `delete_tracking_client` | Revoke tracking client |

## Workflows

### Import and segment contacts
```
1. list_contacts — inspect current audience
2. create_contact_field — add custom fields if needed (e.g., "plan", "region")
3. create_contact — add contacts individually (or guide user to dashboard CSV import)
4. list_segments — check existing segments
```

### Send a campaign
```
1. get_current_organization — confirm tenant
2. list_campaigns — find the campaign
3. Verify campaign.segmentId is set
4. send_campaign — trigger delivery
5. get_campaign_stats — monitor after a few minutes
```

### Clean duplicates
```
1. list_duplicate_contacts — review groups
2. Option A: deduplicate_contacts(action="merge", strategy="most_populated")
3. Option B: resolve_duplicate_contacts(keepId, removeIds, action="merge") for manual control
```

### Website analytics
```
1. get_analytics_overview(range="30d") — high-level trends
2. get_top_pages(range="30d", limit=10) — content performance
3. get_top_referrers(range="30d", limit=10) — traffic sources
```

## Filter Syntax for list_contacts

**Leaf filter:** `{ field: "email", op: "contains", value: "@example.com" }`

**Operators:** `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `contains`, `starts_with`, `in`, `is_null`

**Combine with branches:**
```json
{
  "and": [
    { "field": "status", "op": "eq", "value": "published" },
    { "or": [
      { "field": "custom.plan", "op": "eq", "value": "pro" },
      { "field": "custom.plan", "op": "eq", "value": "enterprise" }
    ]}
  ]
}
```

**Sort:** `[{ field: "createdAt", dir: "desc" }]` (max 4 entries)

## Response Format

Every successful tool response is prefixed with:
```
[organization] Acme Corp (id: org_xxx)
--------------------------------------------------------------
```

Followed by JSON: `{ organization: { id, name, slug }, result: <payload> }`

## Quotas

Metered tools consume the org's monthly MCP quota (Starter: 200, Pro: 10,000). Org-management tools (`get_current_organization`, `list_organizations`, `switch_organization`) are free.

## Links

- Dashboard: https://reachout-pulse.usereachout.com
- API / MCP: https://reachout-pulse-api.usereachout.com/mcp
- Docs: https://reachout-pulse.usereachout.com/docs/mcp
