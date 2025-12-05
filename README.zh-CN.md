# CodeWeaver MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Model_Context_Protocol-blue?style=for-the-badge)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**通过模型上下文协议（MCP）将整个代码库转换为单个 AI 可读的 Markdown 文档。**

[English](README.md) | 简体中文

CodeWeaver MCP Server 为 Claude Code 等 AI 助手带来强大的代码打包能力。它将复杂的项目结构转换为清晰、可导航的 Markdown 文件 - 非常适合代码审查、文档生成、AI 分析和团队分享。

## 为什么选择 CodeWeaver MCP？

### 🚀 无缝 AI 集成
- **原生 MCP 协议**：开箱即用，支持 Claude Code 和其他兼容 MCP 的 AI 助手
- **零上下文切换**：直接在 AI 工作流中访问代码库打包功能
- **即时结果**：立即获取 Markdown 输出或保存到文件

### 📦 完整的代码库可见性
- **完整结构捕获**：美观的项目层级树形视图
- **包含所有代码**：每个文件的内容都嵌入并带有适当的语法高亮
- **智能过滤**：遵循 `.gitignore` 规则，支持自定义忽略模式

### 💡 完美适配多种使用场景

**AI 分析**
- 将完整代码库提供给 AI 模型（ChatGPT、Claude 等）
- 实现全面的代码理解，无需手动分享文件
- 非常适合代码审查和重构讨论

**文档生成**
- 生成即时项目快照
- 创建可分享的代码库文档
- 在关键里程碑存档项目状态

**团队协作**
- 与团队成员分享完整的项目上下文
- 更快地让新开发者上手
- 促进远程代码讨论

**代码审查**
- 打包带有完整上下文的 Pull Request
- 在单个文档中审查整个功能
- 跨多个文件跟踪代码变更

## 特性

### 🎯 纯 TypeScript 实现
- **无外部依赖**：完全用 TypeScript 构建 - 不需要 Go、Python 或其他运行时
- **快速轻量**：高效的文件扫描和处理
- **跨平台**：支持 macOS、Linux 和 Windows

### 🛠️ 强大的自定义选项
- **灵活过滤**：使用 glob 模式包含/排除文件
- **Gitignore 支持**：自动遵循你的 `.gitignore` 规则
- **自定义模式**：添加项目特定的忽略模式
- **多种输出模式**：直接返回内容或保存到文件

### 📝 智能 Markdown 输出
- **语法高亮**：自动识别 20+ 种编程语言
- **清晰格式**：使用制表符的专业树形结构
- **有序布局**：逻辑文件排序（目录优先，字母顺序）
- **相对路径**：清晰的文件位置引用

## 安装

### 前置要求
- Node.js 18 或更高版本
- npm 或 yarn

### 快速安装

```bash
# 克隆并构建
git clone https://github.com/99hansling/codeweaver-mcp-server.git
cd codeweaver-mcp-server
npm install
npm run build
```

### 添加到 Claude Code

```bash
claude mcp add codeweaver node /absolute/path/to/codeweaver-mcp-server/dist/index.js
```

或手动添加到 `~/.claude/config.json`：

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

## 使用方法

### 基础用法

打包当前目录：
```typescript
codeweaver_pack_codebase({
  path: "."
})
```

### 保存到文件

```typescript
codeweaver_pack_codebase({
  path: "./src",
  output: "codebase.md"
})
```

### 包含被 Gitignore 的文件

```typescript
codeweaver_pack_codebase({
  path: ".",
  include_gitignored: true
})
```

### 自定义忽略模式

```typescript
codeweaver_pack_codebase({
  path: ".",
  ignore_patterns: ["*.log", "tmp/*", "*.tmp"]
})
```

## 输出格式

CodeWeaver 生成清晰、结构化的 Markdown：

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
// 带语法高亮的完整文件内容
import { helper } from './utils';
...
```

### src/utils.ts

```typescript
// 完整文件内容
export function helper() { ... }
```
```

## 支持的语言

自动语法高亮支持：
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

## 默认忽略模式

CodeWeaver 自动跳过：
- `node_modules/`
- `.git/`
- `dist/` 和 `build/`
- `.next/` 和 `.nuxt/`
- `vendor/`
- Python 虚拟环境（`venv/`、`.venv/`、`__pycache__/`）
- 系统文件（`.DS_Store`、`Thumbs.db`）

## 实际应用示例

### 示例 1：与 ChatGPT 分享代码
```typescript
// 打包你的项目
codeweaver_pack_codebase({
  path: "./my-app",
  output: "my-app-context.md"
})

// 复制 Markdown 文件内容并粘贴到 ChatGPT
// 现在 ChatGPT 可以看到你的整个代码库了！
```

### 示例 2：代码审查文档
```typescript
// 只打包源代码
codeweaver_pack_codebase({
  path: "./src",
  ignore_patterns: ["*.test.ts", "*.spec.ts"],
  output: "review-package.md"
})
```

### 示例 3：项目快照
```typescript
// 捕获完整的项目状态
codeweaver_pack_codebase({
  path: ".",
  output: `snapshot-${new Date().toISOString()}.md`
})
```

## API 参考

### `codeweaver_pack_codebase`

**参数：**

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `path` | string | ✅ 是 | - | 要打包的目录路径 |
| `output` | string | ❌ 否 | - | 输出文件路径（省略则返回内容） |
| `include_gitignored` | boolean | ❌ 否 | `false` | 包含 `.gitignore` 中列出的文件 |
| `ignore_patterns` | string[] | ❌ 否 | `[]` | 额外的 glob 忽略模式 |

**返回值：**

- 如果指定了 `output`：成功消息，包含文件路径和大小
- 如果省略了 `output`：完整的 Markdown 内容

**错误处理：**

- `"Error: Path does not exist"` - 无效的目录路径
- `"Error: Path is not a directory"` - 路径指向文件
- 二进制文件自动跳过并附带说明

## 开发

### 从源码构建

```bash
npm install
npm run build
```

### 开发模式

```bash
npm run dev
```

### 清理构建

```bash
npm run clean
npm run build
```

## 为什么选择 CodeWeaver MCP？

✅ **AI 优先工作流**：专为 AI 工具构建，不同于通用文件打包器
✅ **零配置**：使用合理的默认值即可立即工作
✅ **专业输出**：人类和 AI 都喜欢的清晰可读 Markdown
✅ **现代技术栈**：纯 TypeScript，无遗留依赖
✅ **持续开发**：定期更新新功能
✅ **MIT 许可**：个人和商业使用均免费

## 与其他方案对比

| 功能 | CodeWeaver MCP | 命令行工具 | VSCode 扩展 |
|------|----------------|-----------|------------|
| AI 集成 | ✅ 原生 MCP | ❌ 手动复制粘贴 | ⚠️ 有限 |
| 零配置 | ✅ 是 | ❌ 复杂参数 | ✅ 是 |
| 跨平台 | ✅ 是 | ⚠️ 各异 | ⚠️ 仅 VSCode |
| 实时使用 | ✅ 是 | ❌ 否 | ⚠️ 有限 |
| TypeScript 原生 | ✅ 是 | ❌ 各异 | ⚠️ 各异 |

## 贡献

欢迎贡献！请随时提交 issues 或 pull requests。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 致谢

灵感来自原始的 [CodeWeaver](https://github.com/tesserato/CodeWeaver) 项目，并为模型上下文协议生态系统进行了改编。

---

**用 ❤️ 为 AI 开发社区打造**
