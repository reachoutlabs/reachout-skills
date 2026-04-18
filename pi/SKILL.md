# Pulse — Marketing Automation for the AI-Age

## Overview

Pulse is a marketing automation platform that provides MCP-accessible infrastructure for data analysis, contact management, email campaigns, and analytics. This skill enables Pi to interact with a Pulse instance.

## Configuration

Set the following environment variables:
- `PULSE_API_KEY` — Your Pulse tenant API key
- `PULSE_BASE_URL` — Your Pulse instance URL (default: `https://api.usereachout.com`)

## Capabilities

- **Data Sources**: Upload, inspect, and manage data sources
- **Contacts**: List, search, deduplicate, and merge contacts
- **Segments**: Create filter-based segments, preview segment size
- **Campaigns**: Create, preview, and send email campaigns
- **Analytics**: Query email, website, and campaign analytics
- **Billing**: Check usage and seat information

## Usage

Ask Pi to perform any marketing operation. Examples:
- "Upload this CSV and show me the schema"
- "Deduplicate my contacts by email"
- "Create a segment and estimate its size"
- "Preview and send an email campaign"
- "Show me campaign analytics for last week"
