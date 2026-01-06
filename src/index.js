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

    // 2. Analyze with AI
    // We limit processing to avoid burning too many tokens/costs if the list is huge
    // Random shuffle or just take top 30? Let's take top 30 mixed.
    const candidates = rawItems.slice(0, 30);

    const finalizedItems = [];

    console.log(`🧠 Analyzing ${candidates.length} items with AI...`);

    for (const item of candidates) {
        if (finalizedItems.length >= 20) break; // We need 20 items per email

        const insight = await analyzeContent(item.content, item.source);
        if (insight) {
            // Merge metadata
            finalizedItems.push({
                ...insight,
                originalTitle: item.title,
                link: item.link,
                source: item.source
            });
            process.stdout.write('.'); // Progress indicator
        } else {
            process.stdout.write('x');
        }
    }
    console.log('\n');

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
