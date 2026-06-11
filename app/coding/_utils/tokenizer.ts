import { ProgrammingLanguage } from './codeSnippets';

export interface TokenChar {
  char: string;
  type: 'keyword' | 'string' | 'comment' | 'number' | 'operator' | 'punctuation' | 'type' | 'text' | 'tag' | 'preprocessor';
}

const KEYWORDS: Record<string, string[]> = {
  javascript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'async',
    'await', 'try', 'catch', 'class', 'constructor', 'this', 'import', 'export', 'from',
    'default', 'new', 'throw', 'true', 'false', 'null', 'undefined', 'in', 'of'
  ],
  python: [
    'def', 'return', 'if', 'elif', 'else', 'while', 'for', 'in', 'class', 'import', 'from',
    'as', 'lambda', 'and', 'or', 'not', 'any', 'all', 'len', 'True', 'False', 'None'
  ],
  rust: [
    'fn', 'let', 'mut', 'ref', 'impl', 'struct', 'enum', 'pub', 'use', 'mod', 'match',
    'if', 'else', 'for', 'in', 'return', 'where', 'vec', 'Ok', 'Err', 'Option', 'Self', 'self'
  ],
  cpp: [
    'auto', 'double', 'static_cast', 'reinterpret_cast', 'template', 'typename', 'class',
    'public', 'private', 'int', 'long', 'float', 'char', 'void', 'if', 'else', 'return',
    'for', 'while', 'new', 'delete', 'using', 'namespace', 'struct', 'nullptr'
  ],
  go: [
    'func', 'package', 'import', 'type', 'struct', 'select', 'case', 'chan', 'go', 'if',
    'else', 'range', 'return', 'map', 'string', 'int', 'bool', 'interface', 'true', 'false', 'nil'
  ],
  htmlcss: [
    'display', 'grid', 'repeat', 'minmax', 'gap', 'padding', 'media', 'max-width', 'flex',
    'block', 'none', 'absolute', 'relative', 'color', 'background', 'required', 'minlength'
  ]
};

const TYPES: Record<string, string[]> = {
  rust: ['i32', 'i64', 'u32', 'u64', 'f32', 'f64', 'usize', 'Box', 'Result', 'Option'],
  cpp: ['vector', 'unique_ptr', 'string', 'ListNode', 'TreeNode'],
  go: ['User', 'ID', 'Email', 'Roles', 'IsActive']
};

export function tokenizeCode(code: string, language: ProgrammingLanguage): TokenChar[] {
  const chars: TokenChar[] = [];
  let index = 0;

  // Compile full regex for language
  // 1. Comments
  let commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//;
  if (language === 'htmlcss') {
    commentRegex = /<!--[\s\S]*?-->/;
  } else if (language === 'python') {
    commentRegex = /#.*/;
  }

  // Preprocessor directives (C++ only: #include, #define, #pragma, etc.)
  const preprocessorRegex = language === 'cpp' ? /^#\w+.*$/m : /(?!)/;

  // 2. Strings
  const stringRegex = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/;

  // Regex literal (only for javascript to avoid mixing up with division operators)
  const regexLiteralRegex = /\/(?:\\\/|[^\/\r\n])+\/[gimuy]*/;

  // 3. Numbers
  const numberRegex = /\b\d+(?:\.\d+)?\b/;

  // 4. Words (Identifiers, keywords)
  const wordRegex = /[a-zA-Z_][a-zA-Z0-9_]*/;

  // 5. HTML tags (only for htmlcss)
  const tagRegex = /<\/?[a-zA-Z0-9]+[^>]*>/;

  const combinedRegex = new RegExp(
    `(?:${preprocessorRegex.source})|(?:${commentRegex.source})|(?:${stringRegex.source})|(?:${language === 'javascript' ? regexLiteralRegex.source : '(?!)'})|(?:${numberRegex.source})|(?:${language === 'htmlcss' ? tagRegex.source : '(?!)'})|(?:${wordRegex.source})|(\\s+)|(.)`,
    'gm'
  );

  const keywordsList = KEYWORDS[language] || [];
  const typesList = TYPES[language] || [];

  combinedRegex.lastIndex = 0;

  while (index < code.length) {
    combinedRegex.lastIndex = index;
    const match = combinedRegex.exec(code);

    if (!match) {
      // Fallback
      chars.push({ char: code[index], type: 'text' });
      index++;
      continue;
    }

    const matchedStr = match[0];
    let type: TokenChar['type'] = 'text';

    if (matchedStr.trim() === '') {
      type = 'text';
    } else if (language === 'cpp' && matchedStr.startsWith('#')) {
      type = 'preprocessor';
    } else if (matchedStr.startsWith('//') || matchedStr.startsWith('/*') || matchedStr.startsWith('#') || matchedStr.startsWith('<!--')) {
      type = 'comment';
    } else if (
      matchedStr.startsWith('"') || 
      matchedStr.startsWith("'") || 
      matchedStr.startsWith('`') ||
      (language === 'javascript' && matchedStr.startsWith('/') && !matchedStr.startsWith('//') && matchedStr.length > 1)
    ) {
      type = 'string';
    } else if (!isNaN(Number(matchedStr)) && matchedStr !== '') {
      type = 'number';
    } else if (language === 'htmlcss' && matchedStr.startsWith('<')) {
      type = 'tag';
    } else if (keywordsList.includes(matchedStr)) {
      type = 'keyword';
    } else if (typesList.includes(matchedStr)) {
      type = 'type';
    } else if (['+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&', '|', '^', '!', '?', ':', '=>'].includes(matchedStr)) {
      type = 'operator';
    } else if (['{', '}', '[', ']', '(', ')', ';', ',', '.'].includes(matchedStr)) {
      type = 'punctuation';
    }

    for (let i = 0; i < matchedStr.length; i++) {
      chars.push({ char: matchedStr[i], type });
    }

    index += matchedStr.length;
  }

  return chars;
}
