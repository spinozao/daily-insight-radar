const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const parser = new Parser();

async function fetchFromRSS(source) {
    try {
        // Add minimal timeout to avoid hanging
        const feed = await parser.parseURL(source.url);
        if (!feed.items) return [];

        return feed.items.slice(0, 20).map(item => ({
            title: item.title,
            link: item.link,
            content: item.contentSnippet || item.content || item.summary || item.title, // Fallback
            source: source.name,
            date: item.pubDate
        }));
    } catch (error) {
        console.warn(`[RSS] Failed ${source.name}: ${error.message}`);
        return [];
    }
}

async function fetchFromWeb(source) {
    try {
        const { data } = await axios.get(source.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml'
            },
            timeout: 10000
        });
        const $ = cheerio.load(data);
        const items = [];

        $(source.selector).each((i, el) => {
            if (items.length >= 20) return false;
            const title = $(el).text().trim();
            let link = $(el).attr('href');

            if (!title) return;

            // Resolve relative URLs
            if (link && !link.startsWith('http')) {
                try {
                    const baseUrl = new URL(source.url);
                    link = new URL(link, baseUrl.href).href;
                } catch (e) {
                    return; // Skip invalid
                }
            }

            if (link) {
                items.push({
                    title,
                    link,
                    source: source.name,
                    content: title // Initial content is title
                });
            }
        });

        // Fetch details for top 20 to get rich text for LLM
        const detailedItems = [];
        // Try to fetch details for all found items
        for (const item of items) {
            try {
                const detailRes = await axios.get(item.link, { timeout: 8000 });
                const $$ = cheerio.load(detailRes.data);

                // Try to find the main article body. Common selectors:
                const bodySelector = 'article, .article-content, .entry-content, .rich_media_content, #content, .post-content';
                let text = $$(bodySelector).text().trim();

                // Fallback: just get all paragraphs
                if (!text || text.length < 50) {
                    text = $$('p').text().trim();
                }

                if (text.length > 50) {
                    item.content = text.substring(0, 3000); // Truncate
                } else {
                    // If text is short, use title as content fallback
                    item.content = item.title + (text ? ': ' + text : '');
                }
            } catch (e) {
                // Determine if we should keep it just with title. 
                // For LLM analysis, title alone isn't enough for "Deep" analysis.
                // But user wants ITEMS. So we keep it.
                // console.warn(`Detail fetch failed for ${item.link}: ${e.message}`);
            }
            // Always push the item, even if detail fetch failed (it has basic info)
            detailedItems.push(item);
        }
        return detailedItems;

    } catch (error) {
        console.warn(`[Web] Failed ${source.name}: ${error.message}`);
        return [];
    }
}

async function fetchMock(source) {
    // For mocked/placeholder social sources, we return synthetic data 
    // to prove the pipeline works, or simply warn.
    console.log(`[Mock] Generating simulation for ${source.name}`);
    return [
        {
            title: 'Mock: Workplace Anxiety Discussion',
            link: 'http://mock-source.com',
            source: source.name,
            content: 'User A: "35岁是一个坎..." User B: "I feel lost at work..." (This is a placeholder for actual social scraping which requires API keys)'
        }
    ];
}

async function fetchAllSources(sources) {
    let allItems = [];
    const results = await Promise.allSettled(sources.map(async (source) => {
        if (source.type === 'rss') return fetchFromRSS(source);
        if (source.type === 'web') return fetchFromWeb(source);
        if (source.type === 'mock') return fetchMock(source);
        return [];
    }));

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            allItems = allItems.concat(result.value);
        }
    });

    return allItems;
}

module.exports = { fetchAllSources };
