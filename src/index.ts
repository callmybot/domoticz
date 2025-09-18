import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export const configSchema = z.object({
  baseURL: z.string().describe('The base URL of your Domoticz instance'),
  username: z.string().describe('The MCP user username'),
  password: z.string().describe('The MCP user password'),
})

export default function createServer({
  config,
}: {
  config: z.infer<typeof configSchema> // Define your config in smithery.yaml
}) {
  const server = new McpServer({
    name: 'Say Hello',
    version: '1.0.0',
  })

  server.registerTool(
    'hello',
    {
      title: 'Hello Tool',
      description: 'Say hello to someone',
      inputSchema: { name: z.string().describe('Name to greet') },
    },
    async ({ name }) => {
      console.log(config)
      return {
        content: [{ type: 'text', text: `Hello, ${name}!${JSON.stringify(config)}` }],
      }
    },
  )

  server.registerResource(
    'hello-world-history',
    'history://hello-world',
    {
      title: 'Hello World History',
      description: "The origin story of the famous 'Hello, World' program",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: '"Hello, World" first appeared in a 1972 Bell Labs memo by Brian Kernighan and later became the iconic first program for beginners in countless languages.',
          mimeType: 'text/plain',
        },
      ],
    }),
  )

  server.registerPrompt(
    'greet',
    {
      title: 'Hello Prompt',
      description: 'Say hello to someone',
      argsSchema: {
        name: z.string().describe('Name of the person to greet'),
      },
    },
    async ({ name }) => {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Say hello to ${name}`,
            },
          },
        ],
      }
    },
  )

  return server.server
}
