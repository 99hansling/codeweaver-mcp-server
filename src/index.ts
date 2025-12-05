#!/usr/bin/env node
/**
 * CodeWeaver MCP Server
 *
 * Converts codebases into a single Markdown document.
 * Pure TypeScript implementation - no external dependencies required.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import { packCodebase } from "./codeweaver.js";

// Zod schema for input validation
const PackCodebaseInputSchema = z.object({
  path: z.string()
    .min(1, "Path is required")
    .describe("Directory path to pack into Markdown"),
  output: z.string()
    .optional()
    .describe("Output file path (optional, returns content if not specified)"),
  include_gitignored: z.boolean()
    .optional()
    .default(false)
    .describe("Include files listed in .gitignore (default: false)"),
  ignore_patterns: z.array(z.string())
    .optional()
    .describe("Additional patterns to ignore (e.g., ['*.log', 'temp/*'])")
}).strict();

type PackCodebaseInput = z.infer<typeof PackCodebaseInputSchema>;

// Create MCP server instance
const server = new McpServer({
  name: "codeweaver-mcp-server",
  version: "1.0.0"
});

// Register pack_codebase tool
server.registerTool(
  "codeweaver_pack_codebase",
  {
    title: "Pack Codebase to Markdown",
    description: `Convert a codebase into a single Markdown document.

This tool analyzes a directory and creates a Markdown file containing:
- A tree view of the file structure
- The content of each file in code blocks
- Organized by file path with syntax highlighting

This is a READ-ONLY operation that does not modify any files.

Args:
  - path (string, required): Directory path to pack
  - output (string, optional): Output file path. If not specified, returns content directly
  - include_gitignored (boolean, optional): Include files in .gitignore (default: false)
  - ignore_patterns (array, optional): Additional patterns to ignore (e.g., ['*.log', 'temp/*'])

Returns:
  Either the Markdown content directly, or a success message if output file was written.

Examples:
  - Pack current project: { "path": "." }
  - Pack with output file: { "path": "./src", "output": "codebase.md" }
  - Include gitignored files: { "path": ".", "include_gitignored": true }
  - Custom ignore: { "path": ".", "ignore_patterns": ["*.log", "tmp/*"] }

Error Handling:
  - Returns "Error: Path does not exist" if path is invalid
  - Returns "Error: Path is not a directory" if path is a file
  - Skips binary files automatically`,
    inputSchema: PackCodebaseInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  async (params: PackCodebaseInput) => {
    try {
      // Check if path exists
      try {
        const stats = await fs.stat(params.path);
        if (!stats.isDirectory()) {
          return {
            content: [{
              type: "text",
              text: `Error: Path is not a directory: ${params.path}`
            }]
          };
        }
      } catch {
        return {
          content: [{
            type: "text",
            text: `Error: Path does not exist: ${params.path}`
          }]
        };
      }

      // Pack the codebase
      const markdown = await packCodebase({
        rootPath: params.path,
        includeGitignored: params.include_gitignored,
        ignorePatterns: params.ignore_patterns
      });

      // Write to file or return content
      if (params.output) {
        await fs.writeFile(params.output, markdown, "utf-8");
        return {
          content: [{
            type: "text",
            text: `✅ Codebase packed successfully!\n\nOutput written to: ${params.output}\n\nFile size: ${markdown.length} characters`
          }]
        };
      } else {
        return {
          content: [{
            type: "text",
            text: markdown
          }]
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{
          type: "text",
          text: `Error packing codebase: ${errorMessage}`
        }]
      };
    }
  }
);

// Main function
async function main() {
  console.error("CodeWeaver MCP Server starting...");
  console.error("Pure TypeScript implementation - no Go required");

  try {
    // Create stdio transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.connect(transport);

    console.error("✓ CodeWeaver MCP Server running on stdio");
    console.error("Available tools:");
    console.error("  - codeweaver_pack_codebase: Pack codebase into Markdown");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on("SIGINT", () => {
  console.error("Shutting down CodeWeaver MCP Server...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("Shutting down CodeWeaver MCP Server...");
  process.exit(0);
});

// Run the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
