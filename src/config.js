require('dotenv').config();

module.exports = {
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.qq.com',
        port: parseInt(process.env.SMTP_PORT) || 465,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        to: process.env.EMAIL_TO || 'mroma@qq.com'
    },
    llm: {
        apiKey: process.env.LLM_API_KEY,
        baseURL: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
        model: process.env.LLM_MODEL || 'gpt-4o-mini' // Efficient and smart enough
    },
    scrapers: {
        headless: true,
        // Limit concurrency to avoid getting blocked
        concurrency: 2
    }
};
