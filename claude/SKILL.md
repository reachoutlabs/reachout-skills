# Pulse — Marketing Automation for the AI-Age

## Overview

Pulse is a marketing automation platform that provides MCP-accessible infrastructure for data analysis, contact management, email campaigns, and analytics. This skill enables Claude to interact with a Pulse instance.

## Configuration

Set the following environment variables:
- `PULSE_API_KEY` — Your Pulse tenant API key
- `PULSE_BASE_URL` — Your Pulse instance URL (default: `https://api.usereachout.com`)

## Capabilities

When this skill is active, Claude can:

- **Data Sources**: Upload, inspect, and manage data sources (CSV, databases, APIs)
- **Contacts**: List, search, deduplicate, and merge contacts
- **Segments**: Create filter-based segments, preview segment size
- **Campaigns**: Create email campaigns, preview rendered emails, select recipients, send campaigns
- **Analytics**: Query email opens/clicks, website visits, campaign performance
- **Billing**: Check usage metrics and seat information

## Usage

Ask Claude to perform any marketing operation. Examples:
- "Upload this CSV and show me the schema"
- "Deduplicate my contacts by email"
- "Create a segment of contacts in the US who opened the last campaign"
- "Preview an email campaign for these contacts"
- "How many emails have we sent this month?"
