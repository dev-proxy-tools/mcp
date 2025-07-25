#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createRequire } from 'module';
import { z } from 'zod';
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

const transport = new StdioServerTransport();
await server.connect(transport);