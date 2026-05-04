---
name: pulse
description: Marketing automation platform for AI agents via MCP. Manage contacts, campaigns, segments, analytics, and data sources through Pulse's MCP server. Use when the user needs to perform marketing operations, email campaigns, contact management, audience segmentation, or marketing analytics.
---

# Pulse — Marketing Automation via MCP

ReachOut is a marketing automation platform built for the AI age. It exposes every capability through an MCP (Model Context Protocol) server, allowing agents to manage contacts, send campaigns, build segments, and analyze performance — all through structured tool calls.

## Setup

1. Get a ReachOut API key from your Pulse dashboard at https://reachout-pulse.usereachout.com/dashboard/settings
2. Configure Pi to connect to the Pulse MCP server by adding this to your Pi settings:

```json
{
  "mcpServers": {
    "pulse": {
      "url": "https://reachout-pulse-api.usereachout.com/mcp",
      "headers": {
        "Authorization": "Bearer ${PULSE_API_KEY}"
      }
    }
  }
}
```

Or set the environment variable:
```bash
export PULSE_API_KEY="your-api-key"
```

## Organization Context

All Pulse tools operate within an organization (tenant) context. The active org is determined by your API key. Use these tools to manage context:

- `get_current_organization` — Confirm which org is active
- `list_organizations` — See all orgs you have access to
- `switch_organization` — Switch to a different org (persists 24h)

Always call `get_current_organization` first if you're unsure which tenant you're working with.

## Capabilities

### Contacts & CRM
- `list_contacts` — Query with filters, sort, search, pagination. Supports fixed fields (email, firstName, lastName, company, role, status) and custom fields via `custom.<key>`.
- `get_contact` — Get a single contact by ID
- `create_contact` — Create a new contact (email required)
- `list_contact_fields` — See registered custom fields
- `create_contact_field` / `update_contact_field` / `delete_contact_field` — Manage the contact schema
- `list_duplicate_contacts` — Find duplicate email groups
- `deduplicate_contacts` — Bulk-merge or delete duplicates by strategy (oldest/newest/most_populated)
- `resolve_duplicate_contacts` — Manually resolve one duplicate group

### Campaigns
- `list_campaigns` — List campaigns, optionally filter by status
- `get_campaign_stats` — Get delivery + engagement stats (sent, opened, clicked, bounced, rates)
- `send_campaign` — Trigger sending a campaign (must have a segment assigned)

### Segments
- `list_segments` — List all segments

### Analytics
- `get_analytics` — Get pre-aggregated summary rows (daily/weekly/monthly)
- `get_analytics_overview` — Aggregate visitor stats + daily series (unique visitors, sessions, pageviews, bounce rate, avg duration)
- `get_top_pages` — Top viewed paths with pageviews, uniques, avg duration
- `get_top_referrers` — Top referrer hosts with session counts

### Tracking Clients
- `list_tracking_clients` — List website tracking credentials
- `create_tracking_client` — Generate new tracking client (optionally with secret)
- `delete_tracking_client` — Remove a tracking client

## Common Workflows

### Upload and inspect contacts
1. Ask the user for a CSV file or data
2. Use `create_contact` for individual contacts or guide the user to the dashboard for CSV import
3. Use `list_contacts` to verify

### Build and send a campaign
1. `list_segments` to see available audiences
2. `list_campaigns` to check existing campaigns
3. `send_campaign` with the campaign ID to trigger sending
4. `get_campaign_stats` to monitor delivery and engagement

### Analyze website performance
1. `get_analytics_overview` with range ("7d", "30d", "90d") for high-level metrics
2. `get_top_pages` and `get_top_referrers` for detailed breakdowns

### Clean up duplicate contacts
1. `list_duplicate_contacts` to see groups
2. `deduplicate_contacts` with action="merge" and strategy="most_populated" for bulk cleanup
3. Or `resolve_duplicate_contacts` for manual per-group decisions

## MCP Endpoint Reference

| Property | Value |
|----------|-------|
| Endpoint | `https://reachout-pulse-api.usereachout.com/mcp` |
| Protocol | JSON-RPC 2.0 over HTTP + SSE |
| Auth | `Authorization: Bearer <api_key>` |
| Version | 1.3.0 |

## Tips

- Every tool response includes the active organization name at the top — check it to avoid operating on the wrong tenant
- `list_contacts` supports complex filters: `{"and":[{"field":"status","op":"eq","value":"published"},{"field":"custom.country","op":"eq","value":"US"}]}`
- Campaign sends create jobs for all published contacts in the assigned segment
- The MCP server meters domain tool calls against the org's monthly quota

## Error Codes

| Code | Meaning |
|------|---------|
| -32001 | Auth required |
| -32002 | Invalid/expired API key |
| -32003 | Active organization not found |
| -32601 | Unknown tool |
| -32602 | Invalid parameters |
