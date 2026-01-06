# Daily Insight Radar (每日选题情报雷达)

## 部署状态
本系统已完成核心模块开发。
- [x] **架构设计**: 包含 Scraper / LLM Analyzer / Mailer / Scheduler。
- [x] **多源支持**: 支持 RSS, Web Scraper (Cheerio), 以及 Mock 模式。
- [x] **智能分析**: 接入 OpenAI 兼容接口，按“痛点+历史+金句”逻辑提炼。
- [x] **自动化**: GitHub Actions 配置完毕，每日三更 (11:00, 16:00, 20:00)。

## 快速部署 Github
1. **Push 代码**: `git add .`, `git commit -m "init"`, `git push`
2. **配置 Secrets**: 在 GitHub 仓库 Settings -> Secret 填入 SMTP_USER, SMTP_PASS, LLM_API_KEY 等。
3. **激活 Action**: 去 Actions 页面查看 Workflow 运行。

## 本地调试
安装依赖：
```bash
cd daily-scraper
npm install
```

配置环境变量：
复制 `.env.example` 为 `.env` 并填入你的 Key。

运行：
```bash
npm start
```

## 注意
部分 RSS 源 (RSSHub) 因网络原因在 GitHub Action 环境可能不稳定，建议搭建私有 RSSHub 或替换为官方源。
社交媒体（小红书/抖音）目前为模拟接口 (Mock)，如需实战，请对接专业数据服务商 API。
