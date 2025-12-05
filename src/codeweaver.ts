/**
 * CodeWeaver Core - Pure TypeScript Implementation
 * Converts a codebase into a single Markdown document
 */

import * as fs from "fs/promises";
import * as path from "path";
import { glob } from "glob";

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

interface PackOptions {
  rootPath: string;
  includeGitignored?: boolean;
  ignorePatterns?: string[];
}

/**
 * Default patterns to ignore
 */
const DEFAULT_IGNORE_PATTERNS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/.nuxt/**",
  "**/vendor/**",
  "**/.venv/**",
  "**/venv/**",
  "**/__pycache__/**",
  "**/*.pyc",
  "**/.DS_Store",
  "**/Thumbs.db"
];

/**
 * Build file tree structure
 */
async function buildFileTree(rootPath: string, ignorePatterns: string[]): Promise<FileNode> {
  const files = await glob("**/*", {
    cwd: rootPath,
    dot: true,
    ignore: ignorePatterns,
    nodir: false,
    absolute: false
  });

  const root: FileNode = {
    name: path.basename(rootPath),
    path: "",
    isDirectory: true,
    children: []
  };

  // Build tree structure
  const tree = new Map<string, FileNode>();
  tree.set("", root);

  for (const file of files) {
    const parts = file.split(path.sep);
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? path.join(currentPath, part) : part;

      if (!tree.has(currentPath)) {
        const isDirectory = i < parts.length - 1 || await isDir(path.join(rootPath, currentPath));
        const node: FileNode = {
          name: part,
          path: currentPath,
          isDirectory,
          children: isDirectory ? [] : undefined
        };

        tree.set(currentPath, node);

        // Add to parent
        const parent = tree.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(node);
        }
      }
    }
  }

  return root;
}

/**
 * Check if path is a directory
 */
async function isDir(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Generate tree view string
 */
function generateTreeView(node: FileNode, prefix: string = "", isLast: boolean = true): string {
  let result = "";

  if (node.path) {
    const connector = isLast ? "└── " : "├── ";
    result += prefix + connector + node.name + "\n";
  }

  if (node.children && node.children.length > 0) {
    const sortedChildren = [...node.children].sort((a, b) => {
      // Directories first, then files
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    for (let i = 0; i < sortedChildren.length; i++) {
      const child = sortedChildren[i];
      const isChildLast = i === sortedChildren.length - 1;
      const childPrefix = node.path ? prefix + (isLast ? "    " : "│   ") : "";
      result += generateTreeView(child, childPrefix, isChildLast);
    }
  }

  return result;
}

/**
 * Get file extension for language detection
 */
function getLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const languageMap: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "jsx",
    ".py": "python",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".h": "c",
    ".hpp": "cpp",
    ".cs": "csharp",
    ".rb": "ruby",
    ".php": "php",
    ".swift": "swift",
    ".kt": "kotlin",
    ".sql": "sql",
    ".sh": "bash",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".json": "json",
    ".xml": "xml",
    ".html": "html",
    ".css": "css",
    ".md": "markdown"
  };

  return languageMap[ext] || "";
}

/**
 * Get all files from tree (flat list)
 */
function getAllFiles(node: FileNode, rootPath: string): string[] {
  const files: string[] = [];

  if (!node.isDirectory && node.path) {
    files.push(path.join(rootPath, node.path));
  }

  if (node.children) {
    for (const child of node.children) {
      files.push(...getAllFiles(child, rootPath));
    }
  }

  return files;
}

/**
 * Pack codebase into Markdown
 */
export async function packCodebase(options: PackOptions): Promise<string> {
  const { rootPath, includeGitignored = false, ignorePatterns = [] } = options;

  // Combine ignore patterns
  const allIgnorePatterns = [...DEFAULT_IGNORE_PATTERNS, ...ignorePatterns];

  // If respecting .gitignore, read it
  if (!includeGitignored) {
    try {
      const gitignorePath = path.join(rootPath, ".gitignore");
      const gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
      const patterns = gitignoreContent
        .split("\n")
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("#"))
        .map(pattern => pattern.startsWith("!") ? pattern.slice(1) : `**/${pattern}`);
      allIgnorePatterns.push(...patterns);
    } catch {
      // No .gitignore file, that's okay
    }
  }

  // Build file tree
  const tree = await buildFileTree(rootPath, allIgnorePatterns);

  // Generate tree view
  const treeView = generateTreeView(tree);

  // Get all files
  const files = getAllFiles(tree, rootPath);

  // Start building markdown
  let markdown = `# ${path.basename(rootPath)}\n\n`;
  markdown += `## Directory Structure\n\n\`\`\`\n${treeView}\`\`\`\n\n`;
  markdown += `## Files\n\n`;

  // Add file contents
  for (const file of files) {
    const relativePath = path.relative(rootPath, file);
    const language = getLanguage(file);

    try {
      const content = await fs.readFile(file, "utf-8");
      markdown += `### ${relativePath}\n\n`;
      markdown += `\`\`\`${language}\n${content}\n\`\`\`\n\n`;
    } catch (error) {
      // Skip binary files or files that can't be read
      markdown += `### ${relativePath}\n\n`;
      markdown += `*[Binary file or unable to read]*\n\n`;
    }
  }

  return markdown;
}
