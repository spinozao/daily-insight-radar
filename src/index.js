const { File } = require('node:buffer');

// Polyfill File for Node 18 environments where it's not global but required by dependencies (like undici/openai)
if (typeof global.File === 'undefined') {
    try {
        global.File = File;
    } catch (e) {
        console.warn('Failed to polyfill File:', e);
    }
}

const config = require('./config');
const { fetchAllSources } = require('./sources/fetcher');
const sources = require('./sources/definitions');
const { analyzeContent } = require('./services/llm');
const { sendDailyBrief } = require('./services/mailer');

async function main() {
    console.log('🚀 Daily Insight Radar starting...');

    // 1. Fetch raw content
    const rawItems = await fetchAllSources(sources);
    console.log(`📦 Collected ${rawItems.length} raw items.`);

    if (rawItems.length === 0) {
        console.log('No items found. Exiting.');
        return;
    }

    // 2. SKIP AI Analysis (User requested "Just Scrape")
    // Directly use the raw items for the report.
    // We shuffle or just take the freshest ones.
    const finalizedItems = rawItems
        .slice(0, 30) // Take top 30
        .map(item => ({
            title: item.title,
            link: item.link,
            source: item.source,
            summary: item.content ? item.content.substring(0, 150) + '...' : '点击查看详情',
            // No generated fields anymore
        }));

    console.log(`📝 Prepared ${finalizedItems.length} items for report.`);

    // 3. Send Email
    if (finalizedItems.length > 0) {
        console.log(`📧 Sending ${finalizedItems.length} curated items...`);
        await sendDailyBrief(finalizedItems);
    } else {
        console.log('No valuable insights found today.');
    }

    console.log('✅ Done.');
}

if (require.main === module) {
    main().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
