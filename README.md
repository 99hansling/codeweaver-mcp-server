# CodeWeaver MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Model_Context_Protocol-blue?style=for-the-badge)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Transform your entire codebase into a single, AI-readable Markdown document through the Model Context Protocol.**

CodeWeaver MCP Server brings powerful code packaging capabilities to AI assistants like Claude Code. It converts complex project structures into clean, navigable Markdown files - perfect for code reviews, documentation, AI analysis, and sharing with teams.

## Why CodeWeaver MCP?

### 🚀 Seamless AI Integration
- **Native MCP Protocol**: Works out-of-the-box with Claude Code and other MCP-compatible AI assistants
- **Zero Context Switching**: Access codebase packaging directly from your AI workflow
- **Instant Results**: Get Markdown output immediately or save to file

### 📦 Complete Codebase Visibility
- **Full Structure Capture**: Beautiful tree-view of your entire project hierarchy
- **All Code Included**: Every file's content embedded with proper syntax highlighting
- **Smart Filtering**: Respects `.gitignore` and supports custom ignore patterns

### 💡 Perfect for Multiple Use Cases

**For AI Analysis**
- Feed entire codebases to AI models (ChatGPT, Claude, etc.)
- Enable comprehensive code understanding without manual file sharing
- Perfect for code reviews and refactoring discussions

**For Documentation**
- Generate instant project snapshots
- Create shareable codebase documentation
- Archive project states at key milestones

**For Team Collaboration**
- Share complete project context with teammates
- Onboard new developers faster
- Facilitate remote code discussions

**For Code Reviews**
- Package pull requests with full context
- Review entire features in one document
- Track code changes across multiple files

## Features

### 🎯 Pure TypeScript Implementation
- **No External Dependencies**: Built entirely in TypeScript - no Go, Python, or other runtimes required
- **Fast & Lightweight**: Efficient file scanning and processing
- **Cross-Platform**: Works on macOS, Linux, and Windows

### 🛠️ Powerful Customization
- **Flexible Filtering**: Include/exclude files with glob patterns
- **Gitignore Support**: Automatically respects your `.gitignore` rules
- **Custom Patterns**: Add project-specific ignore patterns
- **Multiple Output Modes**: Return content directly or save to file

### 📝 Smart Markdown Output
- **Syntax Highlighting**: Automatic language detection for 20+ programming languages
- **Clean Formatting**: Professional tree structure using box-drawing characters
- **Organized Layout**: Logical file ordering (directories first, alphabetical)
- **Relative Paths**: Clear file location references

## Installation

### Prerequisites
- Node.js 18 or later
- npm or yarn

### Quick Install

```bash
# Clone and build
git clone https://github.com/yourusername/codeweaver-mcp-server.git
cd codeweaver-mcp-server
npm install
npm run build
```

### Add to Claude Code

```bash
claude mcp add codeweaver node /absolute/path/to/codeweaver-mcp-server/dist/index.js
```

Or manually add to `~/.claude/config.json`:

```json
{
  "mcpServers": {
    "codeweaver": {
      "command": "node",
      "args": ["/absolute/path/to/codeweaver-mcp-server/dist/index.js"]
    }
  }
}
```

## Usage

### Basic Usage

Pack current directory:
```typescript
codeweaver_pack_codebase({
  path: "."
})
```

### Save to File

```typescript
codeweaver_pack_codebase({
  path: "./src",
  output: "codebase.md"
})
```

### Include Gitignored Files

```typescript
codeweaver_pack_codebase({
  path: ".",
  include_gitignored: true
})
```

### Custom Ignore Patterns

```typescript
codeweaver_pack_codebase({
  path: ".",
  ignore_patterns: ["*.log", "tmp/*", "*.tmp"]
})
```

## Output Format

CodeWeaver generates clean, structured Markdown:

```markdown
# project-name

## Directory Structure

```
├── src
│   ├── index.ts
│   └── utils.ts
└── package.json
```

## Files

### src/index.ts

```typescript
// Full file content with syntax highlighting
import { helper } from './utils';
...
```

### src/utils.ts

```typescript
// Full file content
export function helper() { ... }
```
```

## Supported Languages

Automatic syntax highlighting for:
- TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)
- Python (`.py`)
- Go (`.go`)
- Rust (`.rs`)
- Java (`.java`)
- C/C++ (`.c`, `.cpp`, `.h`, `.hpp`)
- C# (`.cs`)
- Ruby (`.rb`)
- PHP (`.php`)
- Swift (`.swift`)
- Kotlin (`.kt`)
- SQL (`.sql`)
- Shell (`.sh`)
- YAML (`.yaml`, `.yml`)
- JSON (`.json`)
- XML (`.xml`)
- HTML (`.html`)
- CSS (`.css`)
- Markdown (`.md`)

## Default Ignore Patterns

CodeWeaver automatically skips:
- `node_modules/`
- `.git/`
- `dist/` and `build/`
- `.next/` and `.nuxt/`
- `vendor/`
- Python virtual environments (`venv/`, `.venv/`, `__pycache__/`)
- System files (`.DS_Store`, `Thumbs.db`)

## Real-World Examples

### Example 1: Share Code with ChatGPT
```typescript
// Pack your project
codeweaver_pack_codebase({
  path: "./my-app",
  output: "my-app-context.md"
})

// Copy the Markdown file content and paste into ChatGPT
// Now ChatGPT can see your entire codebase!
```

### Example 2: Code Review Documentation
```typescript
// Pack only source code
codeweaver_pack_codebase({
  path: "./src",
  ignore_patterns: ["*.test.ts", "*.spec.ts"],
  output: "review-package.md"
})
```

### Example 3: Project Snapshot
```typescript
// Capture complete project state
codeweaver_pack_codebase({
  path: ".",
  output: `snapshot-${new Date().toISOString()}.md`
})
```

## API Reference

### `codeweaver_pack_codebase`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `path` | string | ✅ Yes | - | Directory path to pack |
| `output` | string | ❌ No | - | Output file path (returns content if omitted) |
| `include_gitignored` | boolean | ❌ No | `false` | Include files listed in `.gitignore` |
| `ignore_patterns` | string[] | ❌ No | `[]` | Additional glob patterns to ignore |

**Returns:**

- If `output` specified: Success message with file path and size
- If `output` omitted: Complete Markdown content

**Error Handling:**

- `"Error: Path does not exist"` - Invalid directory path
- `"Error: Path is not a directory"` - Path points to a file
- Binary files automatically skipped with notice

## Development

### Build from Source

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

### Clean Build

```bash
npm run clean
npm run build
```

## Why Choose CodeWeaver MCP?

✅ **For AI-First Workflows**: Built specifically for AI tools, unlike generic file packers
✅ **Zero Configuration**: Works immediately with sensible defaults
✅ **Professional Output**: Clean, readable Markdown that humans and AI love
✅ **Modern Stack**: Pure TypeScript, no legacy dependencies
✅ **Active Development**: Regularly updated with new features
✅ **MIT Licensed**: Free for personal and commercial use

## Comparison with Alternatives

| Feature | CodeWeaver MCP | Command-line tools | VSCode Extensions |
|---------|----------------|-------------------|-------------------|
| AI Integration | ✅ Native MCP | ❌ Manual copy-paste | ⚠️ Limited |
| Zero Config | ✅ Yes | ❌ Complex flags | ✅ Yes |
| Cross-Platform | ✅ Yes | ⚠️ Varies | ⚠️ VSCode only |
| Real-time Use | ✅ Yes | ❌ No | ⚠️ Limited |
| TypeScript Native | ✅ Yes | ❌ Various | ⚠️ Varies |

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

Inspired by the original [CodeWeaver](https://github.com/tesserato/CodeWeaver) project and adapted for the Model Context Protocol ecosystem.

---

**Made with ❤️ for the AI development community**
