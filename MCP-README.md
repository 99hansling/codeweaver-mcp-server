# CodeWeaver MCP Server

MCP server wrapper for CodeWeaver - converts codebases into a single Markdown document.

## Features

### `codeweaver_pack_codebase`
Pack a codebase into a single Markdown file with tree structure and file contents.

**Parameters:**
- `path` (string, required): Directory path to pack
- `output` (string, optional): Output file path
- `include_gitignored` (boolean, optional): Include .gitignored files (default: false)
- `ignore_patterns` (array, optional): Additional patterns to ignore
- `copy_to_clipboard` (boolean, optional): Copy to clipboard (default: false)

**Example:**
```json
{
  "path": ".",
  "output": "codebase.md"
}
```

## Installation

### Prerequisites

This project requires **Go** to be installed to compile the CodeWeaver binary.

**Install Go:**
- macOS: `brew install go`
- Ubuntu: `sudo apt install golang-go`
- Windows: Download from [golang.org](https://golang.org/dl/)

### Build

```bash
npm install
npm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Build the CodeWeaver Go binary

## Usage

### Add to Claude Code

```bash
claude mcp add codeweaver node /absolute/path/to/codeweaver-mcp-server/dist/index.js
```

### Manual Configuration

Add to `~/.claude/config.json`:

```json
{
  "mcpServers": {
    "codeweaver": {
      "command": "node",
      "args": [
        "/absolute/path/to/codeweaver-mcp-server/dist/index.js"
      ]
    }
  }
}
```

## Alternative: Use Without Go

If you don't want to install Go, you can use **Repomix MCP** instead, which has similar functionality and is written in TypeScript:

```bash
npm install -g repomix
claude mcp add repomix npx -y repomix --mcp
```

## License

MIT (wrapper)
CodeWeaver: See LICENSE file for original CodeWeaver license
