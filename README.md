# Pulse Skills

Installable agent skills for [Pulse](https://github.com/reachoutlabs/pulse) — marketing automation for the AI-age.

These skills allow AI coding agents (Claude, ChatGPT, Opencode, Pi) to interact with a Pulse instance via MCP.

## Supported Agents

| Agent | Install |
|-------|---------|
| Claude | Copy `claude/SKILL.md` to your `.agents/skills/pulse/` directory |
| ChatGPT | Import `chatgpt/pulse-gpt-action.json` as a GPT action |
| Opencode | Add `opencode/pulse-opencode.yaml` to your opencode config |
| Pi | Install via `pi skill install reachoutlabs/pulse-skills` |

## Configuration

All skills require a Pulse API key. Set the `PULSE_API_KEY` environment variable or provide it during skill configuration.

## License

MIT
