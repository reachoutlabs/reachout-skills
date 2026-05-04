#!/usr/bin/env node
/**
 * Pulse MCP Proxy for Opencode
 *
 * This script bridges Opencode's stdio-based MCP client to Pulse's
 * remote HTTP MCP endpoint at https://reachout-pulse-api.usereachout.com/mcp.
 *
 * Usage:
 *   PULSE_API_KEY=xxx node pulse-mcp-proxy.js
 *
 * Environment:
 *   PULSE_API_KEY    - Required. Your ReachOut tenant API key.
 *   PULSE_BASE_URL   - Optional. Default: https://reachout-pulse-api.usereachout.com
 */

const BASE = process.env.PULSE_BASE_URL || 'https://reachout-pulse-api.usereachout.com';
const API_KEY = process.env.PULSE_API_KEY;

if (!API_KEY) {
  console.error('Error: PULSE_API_KEY environment variable is required');
  process.exit(1);
}

const ENDPOINT = `${BASE}/mcp`;

let buffer = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let boundary;
  while ((boundary = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, boundary).trim();
    buffer = buffer.slice(boundary + 1);
    if (!line) continue;
    handleMessage(line);
  }
});

async function handleMessage(line) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    sendError(null, -32700, 'Parse error');
    return;
  }

  // Forward initialize/tools/list/ping directly without auth
  if (msg.method === 'initialize' || msg.method === 'tools/list' || msg.method === 'ping') {
    const resp = await forward(msg);
    console.log(JSON.stringify(resp));
    return;
  }

  // Inject Authorization header for tool calls by wrapping the request
  const wrapped = {
    ...msg,
    _pulseAuth: API_KEY,
  };

  const resp = await forward(wrapped);
  console.log(JSON.stringify(resp));
}

async function forward(msg) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (msg._pulseAuth) {
      headers['Authorization'] = `Bearer ${msg._pulseAuth}`;
      delete msg._pulseAuth;
    }

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(msg),
    });

    if (!res.ok) {
      return {
        jsonrpc: '2.0',
        id: msg.id ?? null,
        error: { code: -32603, message: `HTTP ${res.status}: ${res.statusText}` },
      };
    }

    return await res.json();
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id: msg.id ?? null,
      error: { code: -32603, message: `Network error: ${err.message}` },
    };
  }
}

function sendError(id, code, message) {
  console.log(JSON.stringify({ jsonrpc: '2.0', id: id ?? null, error: { code, message } }));
}

// Keep process alive
process.stdin.on('end', () => process.exit(0));
