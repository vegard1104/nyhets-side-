/**
 * Server-side full article extractor.
 * Fetches the original article URL and extracts the main article body
 * using heuristics that work well for Norwegian and international news sites.
 */

interface ExtractedContent {
  content: string;
  extractedAt: string;
  source: "full" | "partial" | "failed";
}

// CSS selector patterns (tried in order) for article body extraction
const ARTICLE_SELECTORS = [
  // Semantic HTML5
  '<article',
  // Common article body containers
  'class="article-body',
  'class="article__body',
  'class="article-text',
  'class="article__text',
  'class="article-content',
  'class="article__content',
  'class="story-body',
  'class="story__body',
  'class="entry-content',
  'class="post-content',
  'class="content-body',
  // NRK specific
  'class="article-body-text',
  'class="article-lead-text',
  // VG specific
  'class="articleBody',
  // Aftenposten specific
  'class="article-body',
  // TV2 specific
  'class="article__body',
];

function extractBySelector(html: string, startPattern: string): string | null {
  const startIdx = html.indexOf(startPattern);
  if (startIdx === -1) return null;

  // Find the opening tag
  const tagStart = html.lastIndexOf('<', startIdx);
  if (tagStart === -1) return null;

  const tagEnd = html.indexOf('>', tagStart);
  if (tagEnd === -1) return null;

  const openingTag = html.slice(tagStart, tagEnd + 1);

  // Determine tag name
  const tagMatch = openingTag.match(/^<(\w+)/);
  if (!tagMatch) return null;
  const tagName = tagMatch[1].toLowerCase();

  // Find the matching closing tag (handle nesting)
  let depth = 1;
  let pos = tagEnd + 1;
  const openTag = `<${tagName}`;
  const closeTag = `</${tagName}>`;

  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf(openTag, pos);
    const nextClose = html.indexOf(closeTag, pos);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + openTag.length;
    } else {
      depth--;
      if (depth === 0) {
        return html.slice(tagStart, nextClose + closeTag.length);
      }
      pos = nextClose + closeTag.length;
    }
  }

  return null;
}

function cleanExtractedHtml(html: string): string {
  return html
    // Remove scripts
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Remove styles
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove event handlers
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*\S+/gi, '')
    // Remove iframes
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    // Remove object/embed
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    // Remove nav/aside/figure captions that are noise
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    // Clean up excessive whitespace
    .replace(/\s{3,}/g, ' ')
    .trim();
}

const contentCache = new Map<string, { content: ExtractedContent; ts: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function extractFullArticle(
  url: string
): Promise<ExtractedContent> {
  // Check cache first
  const cached = contentCache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.content;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'nb-NO,nb;q=0.9,no;q=0.8,en;q=0.7',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { content: '', extractedAt: new Date().toISOString(), source: 'failed' };
    }

    const html = await res.text();

    // Try each selector pattern to find article body
    for (const selector of ARTICLE_SELECTORS) {
      const extracted = extractBySelector(html, selector);
      if (extracted && extracted.length > 200) {
        const cleaned = cleanExtractedHtml(extracted);
        if (cleaned.length > 100) {
          const result: ExtractedContent = {
            content: cleaned,
            extractedAt: new Date().toISOString(),
            source: 'full',
          };
          contentCache.set(url, { content: result, ts: Date.now() });
          return result;
        }
      }
    }

    // Fallback: extract all paragraph text from the page
    const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
    if (paragraphs.length > 3) {
      // Filter out very short paragraphs (likely nav/footer text)
      const meaningful = paragraphs.filter((p) => {
        const text = p.replace(/<[^>]*>/g, '').trim();
        return text.length > 50;
      });
      if (meaningful.length > 2) {
        const result: ExtractedContent = {
          content: cleanExtractedHtml(meaningful.join('\n')),
          extractedAt: new Date().toISOString(),
          source: 'partial',
        };
        contentCache.set(url, { content: result, ts: Date.now() });
        return result;
      }
    }

    return { content: '', extractedAt: new Date().toISOString(), source: 'failed' };
  } catch {
    return { content: '', extractedAt: new Date().toISOString(), source: 'failed' };
  }
}
