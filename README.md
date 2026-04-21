# Pulse Skills

Installable agent skills for [Pulse](https://github.com/reachoutlabs/pulse) — marketing automation for the AI age.

These skills allow AI coding agents (Claude, ChatGPT, Opencode, Pi) to interact with a Pulse instance.

## Supported Agents

| Agent | File | Install |
|-------|------|---------|
| **Pi** | `pi/SKILL.md` | Copy to `.agents/skills/pulse/SKILL.md` or `~/.pi/agent/skills/pulse/SKILL.md` |
| **Claude** | `claude/SKILL.md` | Copy to `.agents/skills/pulse/SKILL.md` or `~/.claude/skills/pulse/SKILL.md` |
| **ChatGPT** | `chatgpt/pulse-gpt-action.json` | Import as a GPT Action in the ChatGPT builder |
| **Opencode** | `opencode/pulse-opencode.yaml` + `opencode/pulse-mcp-proxy.js` | Add to opencode config; proxy bridges stdio → HTTP |

## Prerequisites

All skills require a **Pulse API key**.

1. Sign up at https://320px.com
2. Go to **Dashboard → Settings**
3. Copy your API key

## Agent Setup

### Pi

```bash
mkdir -p ~/.pi/agent/skills/pulse
cp pi/SKILL.md ~/.pi/agent/skills/pulse/
```

Configure the Pulse MCP server in your Pi settings:
```json
{
  "mcpServers": {
    "pulse": {
      "url": "https://api.320px.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Claude (Claude Code / Claude Desktop)

```bash
mkdir -p ~/.claude/skills/pulse
cp claude/SKILL.md ~/.claude/skills/pulse/
```

For Claude Desktop, add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "pulse": {
      "url": "https://api.320px.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### ChatGPT (GPT Actions)

1. Go to [ChatGPT GPTs](https://chat.openai.com/gpts) → Create
2. Click **Configure** → **Add actions**
3. Import `chatgpt/pulse-gpt-action.json`
4. Set authentication type to **API Key** → **Bearer**
5. Enter your Pulse API key
6. Set privacy policy URL to `https://320px.com/privacy`

The action exposes REST endpoints for contacts, campaigns, segments, analytics, data sources, and tracking clients.

### Opencode

```bash
mkdir -p ~/.opencode/skills/pulse
cp opencode/pulse-opencode.yaml ~/.opencode/skills/pulse/
cp opencode/pulse-mcp-proxy.js ~/.opencode/skills/pulse/
```

Set your API key:
```bash
export PULSE_API_KEY="your-api-key"
```

Add to your Opencode config:
```yaml
skills:
  - ~/.opencode/skills/pulse
```

The `pulse-mcp-proxy.js` script bridges Opencode's stdio MCP client to Pulse's remote HTTP endpoint.

## What's Included

### Pi / Claude Skills
- Organization context management (switch orgs, list orgs)
- Contacts: list, search, create, deduplicate, resolve duplicates, custom fields
- Campaigns: list, create, update, delete, send, stats
- Segments: list, create, estimate, preview contacts
- Analytics: overview, top pages, top referrers
- Tracking clients: list, create, delete

### ChatGPT Action
- Full OpenAPI 3.1 schema with 30+ operations
- Contacts CRUD + advanced search + deduplication
- Campaigns CRUD + send + stats
- Segments CRUD + estimate + contacts preview
- Data sources CRUD
- Analytics: overview, pages, referrers, campaign performance
- Tracking clients CRUD
- Dashboard stats + billing usage + team seats

### Opencode
- MCP proxy script (stdio ↔ HTTP bridge)
- YAML configuration template
- Access to all Pulse MCP tools

## MCP Endpoint

- **URL:** `https://api.320px.com/mcp`
- **Protocol:** JSON-RPC 2.0 over HTTP + SSE
- **Auth:** `Authorization: Bearer <api_key>`
- **Version:** 1.3.0

## License

MIT
