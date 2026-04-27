#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createRequire } from 'module';
import { z } from 'zod';
import { createJwt } from './createJwt.js';
import { findDocs } from './findDocs.js';
import { getVersion } from './getVersion.js';
import { getBestPractices } from './getBestPractices.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const server = new McpServer({
  name: 'Dev Proxy',
  version: packageJson.version
});

server.tool('GetBestPractices', 'Gets a list of best practices for configuring and using Dev Proxy. Call it for any code generation or operation involving Dev Proxy. These best practices do not change so once it has been called during the current session, you do not need to invoke it again. Returns a markdown string.',
  {
    title: 'Get best practices',
  },
  async () => ({
    content: [{ type: 'text', text: await getBestPractices() }]
  })
);

server.tool('FindDocs', 'Finds the relevant Dev Proxy documentation for the given query',
  {
    query: z.string().describe('The keyword search query to find documentation for'),
    version: z.string().optional().describe('Dev Proxy version to get documentation for in the format x.y.z, eg. 0.27.0')
  },
  {
    title: 'Find docs'
  },
  async ({ query, version }) => ({
    content: [{ type: 'text', text: await findDocs(query, version === null ? undefined : version) }]
  })
);

server.tool('GetVersion', 'Gets the currently installed Dev Proxy version',
  {
    title: 'Get version',
  },
  async () => ({
    content: [{ type: 'text', text: await getVersion() }]
  })
);

server.tool('CreateJwt', 'Creates a JSON Web Token (JWT) using the Dev Proxy jwt create command. Returns the generated token.',
  {
    name: z.string().optional().describe('The name of the user to create the token for'),
    issuer: z.string().optional().describe('The token issuer'),
    audiences: z.array(z.string()).optional().describe('The audiences for the token'),
    roles: z.array(z.string()).optional().describe('The roles to include in the token'),
    scopes: z.array(z.string()).optional().describe('The scopes to include in the token'),
    claims: z.array(z.string()).optional().describe('Custom claims to include in the token in the format name:value'),
    validFor: z.number().optional().describe('The token validity in minutes'),
    signingKey: z.string().optional().describe('The signing key for the token. Must be at least 32 characters'),
  },
  {
    title: 'Create JWT',
  },
  async ({ name, issuer, audiences, roles, scopes, claims, validFor, signingKey }) => ({
    content: [{ type: 'text', text: await createJwt({ name, issuer, audiences, roles, scopes, claims, validFor, signingKey }) }]
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);