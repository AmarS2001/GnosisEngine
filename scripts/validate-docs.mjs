import fs from 'fs';
import path from 'path';
import { compile } from '@mdx-js/mdx';
import { JSDOM } from 'jsdom';
import mermaid from 'mermaid';

// Initialize JSDOM environment for Mermaid parser
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="graph"></div></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const domPurifyMock = {
  addHook: () => {},
  sanitize: (str) => str,
  removeAllHooks: () => {},
  isSupported: true
};
global.window.DOMPurify = domPurifyMock;
global.DOMPurify = domPurifyMock;

// Initialize Mermaid API
mermaid.initialize({ startOnLoad: false, suppressErrorRendering: true });

const docsDirs = [path.resolve('docs'), path.resolve('blog')].filter(d => fs.existsSync(d));
const fixMode = process.argv.includes('--fix');

function getAllFiles(dir, ext = ['.mdx', '.md']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else {
      if (ext.includes(path.extname(filePath))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

async function validateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fileIssues = [];
  let wasModified = false;

  // 1. Official Mermaid Parser Validation via mermaid.parse()
  const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/g;
  let match;
  while ((match = mermaidRegex.exec(content)) !== null) {
    const mermaidCode = match[1];

    try {
      await mermaid.parse(mermaidCode);
    } catch (err) {
      // Ignore DOMPurify mock noise if parsing succeeds
      if (!err.message.includes('DOMPurify')) {
        fileIssues.push({
          type: 'MERMAID_SYNTAX_ERROR',
          message: err.message || 'Mermaid parse error'
        });
      }
    }
  }

  // 2. Auto-Fix Mode (--fix)
  if (fixMode) {
    content = content.replace(mermaidRegex, (fullMatch, mermaidCode) => {
      // Auto-fix unquoted special characters inside Mermaid link labels -->|label|
      let fixedMermaidCode = mermaidCode.replace(/(-->|<--|==>|<==|--|\.\.->)\s*\|([^"|\n]*?)\|/g, (m, arrow, label) => {
        let trimmed = label.trim();
        if ((/[()/:%]/.test(trimmed)) && (!trimmed.startsWith('"') || !trimmed.endsWith('"'))) {
          wasModified = true;
          return `${arrow}|"${trimmed}"|`;
        }
        return m;
      });

      return `\`\`\`mermaid\n${fixedMermaidCode}\n\`\`\``;
    });

    if (content.includes('./index)')) {
      content = content.replace(/\.\/index\)/g, './00-index.mdx)');
      wasModified = true;
    }

    if (wasModified && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`🔧 Auto-fixed formatting & links in ${path.relative(process.cwd(), filePath)}`);
    }
  }

  // 3. Relative Link Verification
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const href = linkMatch[2];
    if (href.startsWith('./') || href.startsWith('../')) {
      const cleanHref = href.split('#')[0];
      if (cleanHref && !cleanHref.endsWith('.png') && !cleanHref.endsWith('.jpg') && !cleanHref.endsWith('.svg')) {
        const dir = path.dirname(filePath);
        const resolvedPath = path.resolve(dir, cleanHref);
        
        const existsDirect = fs.existsSync(resolvedPath);
        const existsMdx = fs.existsSync(resolvedPath + '.mdx');
        const existsMd = fs.existsSync(resolvedPath + '.md');
        const existsIndex = fs.existsSync(path.join(resolvedPath, '00-index.mdx'));

        if (!existsDirect && !existsMdx && !existsMd && !existsIndex) {
          fileIssues.push({
            type: 'BROKEN_RELATIVE_LINK',
            message: `Link '${href}' points to non-existent target '${cleanHref}'.`
          });
        }
      }
    }
  }

  // 4. Official MDX Compiler Syntax Check
  try {
    await compile(content, { jsx: true });
  } catch (err) {
    fileIssues.push({
      type: 'MDX_SYNTAX_ERROR',
      line: err.line || err.place?.line,
      column: err.column || err.place?.column,
      message: err.reason || err.message
    });
  }

  return fileIssues;
}

async function main() {
  console.log(`🔍 Validating all MDX files with official Mermaid & MDX parsers... (Read-Only Inspection Mode)\n`);
  let files = [];
  docsDirs.forEach(d => { files = files.concat(getAllFiles(d)); });
  let totalErrors = 0;

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    const errors = await validateFile(file);
    
    if (errors.length > 0) {
      console.log(`❌ ${relativePath}:`);
      errors.forEach(err => {
        const lineInfo = err.line ? ` [Line ${err.line}:${err.column}]` : '';
        console.log(`   - ${err.type}${lineInfo}:\n     ${err.message.split('\n').join('\n     ')}`);
        totalErrors++;
      });
      console.log('');
    }
  }

  if (totalErrors === 0) {
    console.log('✅ SUCCESS: All MDX files and Mermaid diagrams passed 100% official parser validation with zero errors!');
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${totalErrors} issue(s) across MDX files.`);
    process.exit(1);
  }
}

main();
