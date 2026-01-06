// Source Definitions for Daily Insight Radar
// Covering: Official Media, Deep Journals, Cultural Columns, and Social/Life

module.exports = [
    // --- 1. 官媒定调 (Official / authoritative) ---
    {
        name: '人民日报·观点',
        type: 'web',
        url: 'http://opinion.people.com.cn/',
        selector: 'div.p1_left ul li a', // Generic selector, needs checking
        category: 'official'
    },
    {
        name: '新华网·评论',
        type: 'web',
        url: 'http://www.xinhuanet.com/comments/index.htm',
        selector: '.main-news-box li a',
        category: 'official'
    },
    {
        name: '求是网',
        type: 'web',
        url: 'http://www.qstheory.cn/',
        selector: '.highlight a',
        category: 'official'
    },
    {
        name: '中国青年报·冰点周刊',
        type: 'web', // Often has WeChat aggregators, using generic site for now
        url: 'http://zqb.cyol.com/html/2023-10/25/nbs.D110000zgqnb_09.htm', // Example fixed link structure, might need dynamic date generator in fetcher
        selector: 'a',
        category: 'official'
    },
    {
        name: '澎湃新闻·社论',
        type: 'rss',
        url: 'https://www.thepaper.cn/rss/25429', // Sixiang / Editorial
        category: 'official'
    },

    // --- 2. 深度刊物 & 人物 (Deep / People) ---
    {
        name: '三联生活周刊',
        type: 'rss',
        url: 'https://rsshub.app/lifeweek/channel/1', // Using RSSHub structure if available, or official
        category: 'deep'
    },
    {
        name: '看理想',
        type: 'web',
        url: 'https://www.vistopia.com.cn/',
        selector: '.article-item-title',
        category: 'deep'
    },
    {
        name: '人物 (People Magazine)',
        type: 'web',
        url: 'https://mp.weixin.qq.com/mp/homepage?__biz=MjM5NzU4ODQ2MA==&hid=2&sn=...', // WeChat logic is hard, using placeholder
        selector: '.weui-media-box__title',
        category: 'deep',
        note: 'Requires specialized WeChat scraper or RSSHub'
    },
    {
        name: '南方窗',
        type: 'rss',
        url: 'https://rsshub.app/nfcmag/home',
        category: 'deep'
    },
    {
        name: '新京报·书评周刊',
        type: 'rss',
        url: 'https://rsshub.app/bjnews/culture',
        category: 'deep'
    },

    // --- 3. 文化 & 访谈 (Culture / Interviews) ---
    // Many video programs (Thirteen Invitations, Round Table Pie) don't have direct text feeds.
    // Strategy: Scrape their Douban pages or YouTube/Bilibili descriptions for "Topics".
    {
        name: '豆瓣·圆桌派话题',
        type: 'web',
        url: 'https://movie.douban.com/subject/35723439/reviews', // Reviews often contain deep analysis
        selector: '.main-bd h2 a',
        category: 'culture'
    },
    {
        name: '豆瓣·十三邀',
        type: 'web',
        url: 'https://movie.douban.com/subject/35349303/long-comments',
        selector: '.title a',
        category: 'culture'
    },
    {
        name: '一千零一夜 (Liang Wendao)',
        type: 'web',
        url: 'https://book.douban.com/review/best/', // Proxying via Book reviews
        selector: '.main-bd h2 a',
        category: 'culture'
    },

    // --- 4. 人间烟火 & 痛点 (Social / Pain Points) ---
    // Collecting anxiety, workplace, parenting issues.
    {
        name: '知乎·热榜 (职场/生活)',
        type: 'web',
        url: 'https://www.zhihu.com/hot',
        selector: '.HotItem-title',
        category: 'social'
    },
    {
        name: '36氪·职场',
        type: 'rss',
        url: 'https://36kr.com/feed-column/zhichang',
        category: 'social'
    },
    {
        name: '小红书·热门 (via Third Party/Search)',
        type: 'mock', // Placeholder for concept
        url: 'mock://search?q=anxiety+parenting+workplace',
        category: 'social'
    }
];
