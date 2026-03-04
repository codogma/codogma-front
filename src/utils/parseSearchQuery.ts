/**
 * Search Query Parser
 *
 * Parses search queries with GitHub-like syntax support including:
 * - Prefix qualifiers (articles:, categories:, compilations:, authors:, tags:, content:)
 * - Boolean operators (AND, OR, NOT)
 * - Grouping with parentheses
 * - Exact match with quotes
 * - Tag search with brackets
 *
 * @example
 * parseSearchQuery('articles:react AND tags:typescript')
 * // Returns: { type: 'advanced', filters: [...], operator: 'AND' }
 *
 * @example
 * parseSearchQuery('[react]')
 * // Returns: { type: 'tag', value: 'react' }
 */

export type SearchFilterType =
  | 'articles'
  | 'categories'
  | 'compilations'
  | 'authors'
  | 'tags'
  | 'content'
  | 'info';

interface SearchFilter {
  /** Filter type (prefix) */
  type: SearchFilterType;
  /** Filter value */
  value: string;
  /** Is this a negation (NOT) */
  negated: boolean;
}

type BooleanOperator = 'AND' | 'OR';

/**
 * Parsed search query result
 */
export interface ParsedSearchQuery {
  /** Query type */
  type: 'simple' | 'advanced' | 'tag';
  /** Simple search value (for simple queries) */
  value?: string;
  /** Tag value (for tag queries) */
  tagValue?: string;
  /** Filters (for advanced queries) */
  filters?: SearchFilter[];
  /** Boolean operator between filters */
  operator?: BooleanOperator;
  /** Original query string */
  original: string;
}

/**
 * Default prefix based on current path
 */
const getDefaultPrefix = (): string => {
  if (typeof window === 'undefined') return 'articles:';

  const path = window.location.pathname;
  if (path.includes('/articles')) return 'articles:';
  if (path.includes('/categories')) return 'categories:';
  if (path.includes('/compilations')) return 'compilations:';
  if (path.includes('/authors') || path.includes('/users')) return 'authors:';
  return 'articles:';
};

/**
 * Tokenizes a search query string into tokens
 */
function tokenize(query: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;
  let inParens = false;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const nextChar = query[i + 1] || '';

    // Handle escape sequences
    if (char === '\\' && (nextChar === '"' || nextChar === '\\')) {
      current += nextChar;
      i++;
      continue;
    }

    // Handle quotes
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
      continue;
    }

    // Handle parentheses
    if (char === '(' && !inQuotes) {
      if (current.trim()) tokens.push(current.trim());
      tokens.push('(');
      current = '';
      inParens = true;
      continue;
    }

    if (char === ')' && !inQuotes) {
      if (current.trim()) tokens.push(current.trim());
      tokens.push(')');
      current = '';
      inParens = false;
      continue;
    }

    // Handle spaces (token separators)
    if (char === ' ' && !inQuotes && !inParens) {
      if (current.trim()) tokens.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) tokens.push(current.trim());

  return tokens;
}

/**
 * Parses a single token into a filter or term
 */
function parseToken(
  token: string,
  defaultPrefix: string,
): SearchFilter | string {
  // Check for negation
  let negated = false;
  let processedToken = token;

  if (token.toUpperCase().startsWith('NOT ')) {
    negated = true;
    processedToken = token.slice(4);
  }

  // Check for prefix:value pattern
  const prefixMatch = processedToken.match(/^([a-z]+):(.+)$/i);
  if (prefixMatch) {
    const [, prefix, value] = prefixMatch;
    const normalizedPrefix = prefix.toLowerCase() as SearchFilterType;

    // Validate prefix
    const validPrefixes: SearchFilterType[] = [
      'articles',
      'categories',
      'compilations',
      'authors',
      'tags',
      'content',
      'info',
    ];

    if (validPrefixes.includes(normalizedPrefix)) {
      return {
        type: normalizedPrefix,
        value: unescapeValue(value),
        negated,
      };
    }
  }

  // Check for tag search [tag]
  const tagMatch = processedToken.match(/^\[(.+)\]$/);
  if (tagMatch) {
    return {
      type: 'tags',
      value: tagMatch[1],
      negated,
    };
  }

  // Plain text - apply default prefix
  return {
    type: defaultPrefix.replace(':', '') as SearchFilterType,
    value: unescapeValue(processedToken),
    negated,
  };
}

/**
 * Removes escape sequences and quotes from a value
 */
function unescapeValue(value: string): string {
  // Remove surrounding quotes
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith('[') && value.endsWith(']'))
  ) {
    value = value.slice(1, -1);
  }

  // Unescape special characters
  return value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

/**
 * Main parsing function for advanced queries
 */
function parseAdvancedQuery(
  tokens: string[],
  defaultPrefix: string,
): ParsedSearchQuery {
  const filters: SearchFilter[] = [];
  let operator: BooleanOperator = 'AND';
  let explicitOperator = false;

  // Process tokens
  const processedTokens = tokens.filter(
    (token) => !['(', ')', 'AND', 'OR'].includes(token.toUpperCase()),
  );

  // Detect explicit operators
  const hasOr = tokens.some((t) => t.toUpperCase() === 'OR');
  const hasAnd = tokens.some((t) => t.toUpperCase() === 'AND');

  if (hasOr && !hasAnd) {
    operator = 'OR';
    explicitOperator = true;
  } else if (hasAnd && !hasOr) {
    operator = 'AND';
    explicitOperator = true;
  }

  // Parse each token
  for (const token of processedTokens) {
    const parsed = parseToken(token, defaultPrefix);
    if (typeof parsed !== 'string') {
      filters.push(parsed);
    }
  }

  // Single filter without explicit operator = simple query
  if (filters.length === 1 && !explicitOperator) {
    const filter = filters[0];
    if (filter.type === 'tags') {
      return {
        type: 'tag',
        tagValue: filter.value,
        original: tokens.join(' '),
      };
    }
    if (filter.type === (defaultPrefix.replace(':', '') as SearchFilterType)) {
      return {
        type: 'simple',
        value: filter.value,
        original: tokens.join(' '),
      };
    }
  }

  return {
    type: 'advanced',
    filters,
    operator,
    original: tokens.join(' '),
  };
}

/**
 * Parses a search query string into a structured format
 *
 * @param query - The search query string
 * @param options - Parsing options
 * @param options.defaultPrefix - Default prefix to use for plain text queries
 * @returns Parsed search query object
 */
export function parseSearchQuery(
  query: string,
  options?: {
    defaultPrefix?: string;
  },
): ParsedSearchQuery {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      type: 'simple',
      value: '',
      original: query,
    };
  }

  const defaultPrefix = options?.defaultPrefix || getDefaultPrefix();

  // Check for pure tag search [tag]
  if (trimmedQuery.startsWith('[') && trimmedQuery.endsWith(']')) {
    return {
      type: 'tag',
      tagValue: trimmedQuery.slice(1, -1),
      original: query,
    };
  }

  // Tokenize the query
  const tokens = tokenize(trimmedQuery);

  // Single token without operators = simple query
  if (tokens.length === 1 && !tokens[0].includes(':')) {
    // Check if it's a tag in brackets
    const tagMatch = tokens[0].match(/^\[(.+)\]$/);
    if (tagMatch) {
      return {
        type: 'tag',
        tagValue: tagMatch[1],
        original: query,
      };
    }

    return {
      type: 'simple',
      value: unescapeValue(tokens[0]),
      original: query,
    };
  }

  // Multiple tokens or contains operators = advanced query
  return parseAdvancedQuery(tokens, defaultPrefix);
}

/**
 * Converts a parsed query back to API parameters
 *
 * @param parsed - Parsed search query
 * @returns API parameters object
 */
function parsedQueryToApiParams(
  parsed: ParsedSearchQuery,
): Record<string, string | undefined> {
  const params: Record<string, string | undefined> = {};

  switch (parsed.type) {
    case 'simple':
      if (parsed.value) {
        params.content = parsed.value;
      }
      break;

    case 'tag':
      if (parsed.tagValue) {
        params.tag = parsed.tagValue;
      }
      break;

    case 'advanced':
      // For advanced queries, we need to handle multiple filters
      // This is a simplified version - in production you might want
      // to handle boolean operators differently
      for (const filter of parsed.filters || []) {
        if (filter.negated) continue; // Backend may not support negation

        switch (filter.type) {
          case 'articles':
          case 'content':
            params.content = filter.value;
            break;
          case 'tags':
            params.tag = filter.value;
            break;
          case 'authors':
            params.username = filter.value;
            break;
          // Add more mappings as needed
        }
      }
      break;
  }

  return params;
}

/**
 * Validates a search query syntax
 *
 * @param query - Search query string
 * @returns Validation result with errors if any
 */
export function validateSearchQuery(query: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const trimmedQuery = query.trim();

  // Check for unbalanced quotes
  const quoteCount = (trimmedQuery.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    errors.push('Unbalanced quotation marks');
  }

  // Check for unbalanced parentheses
  const openParens = (trimmedQuery.match(/\(/g) || []).length;
  const closeParens = (trimmedQuery.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push('Unbalanced parentheses');
  }

  // Check for unbalanced brackets
  const openBrackets = (trimmedQuery.match(/\[/g) || []).length;
  const closeBrackets = (trimmedQuery.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push('Unbalanced brackets');
  }

  // Check for invalid prefix format
  const prefixMatches = trimmedQuery.match(/\b([a-z]+):/gi);
  if (prefixMatches) {
    const validPrefixes = [
      'articles',
      'categories',
      'compilations',
      'authors',
      'tags',
      'content',
      'info',
    ];

    for (const match of prefixMatches) {
      const prefix = match.slice(0, -1).toLowerCase();
      if (!validPrefixes.includes(prefix)) {
        errors.push(`Invalid prefix: ${prefix}`);
      }
    }
  }

  // Check for consecutive operators
  if (/\b(AND|OR)\s+(AND|OR)\b/i.test(trimmedQuery)) {
    errors.push('Consecutive boolean operators');
  }

  // Check for operator at start/end
  if (
    /^\s*(AND|OR)\s/i.test(trimmedQuery) ||
    /\s+(AND|OR)\s*$/i.test(trimmedQuery)
  ) {
    errors.push('Boolean operator at start or end of query');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Formats a search query for display (adds syntax highlighting hints)
 *
 * @param query - Search query string
 * @returns Formatted query with metadata
 */
export function formatSearchQueryForDisplay(query: string): {
  original: string;
  parts: Array<{
    type: 'prefix' | 'value' | 'operator' | 'text' | 'tag';
    value: string;
  }>;
} {
  const parts: Array<{
    type: 'prefix' | 'value' | 'operator' | 'text' | 'tag';
    value: string;
  }> = [];

  const tokens = tokenize(query);

  for (const token of tokens) {
    const upperToken = token.toUpperCase();

    if (['AND', 'OR', 'NOT'].includes(upperToken)) {
      parts.push({ type: 'operator', value: token });
      continue;
    }

    if (token.startsWith('[') && token.endsWith(']')) {
      parts.push({ type: 'tag', value: token });
      continue;
    }

    const prefixMatch = token.match(/^([a-z]+):(.+)$/i);
    if (prefixMatch) {
      const [, prefix, value] = prefixMatch;
      parts.push({ type: 'prefix', value: `${prefix}:` });
      parts.push({ type: 'value', value });
      continue;
    }

    parts.push({ type: 'text', value: token });
  }

  return {
    original: query,
    parts,
  };
}
