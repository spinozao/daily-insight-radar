# Daily Insight Radar (每日选题情报雷达)

## 核心使命
全自动抓取官媒与深度媒体的最新报道，每日三次准时发送至邮箱。
**纯净版**：仅进行信息抓取与聚合，无需支付任何 AI API 费用。

## 功能特性
- **全天候自动运行**：基于 GitHub Actions，全年无休。
- **多维信息源覆盖**：
  - 官媒定调：央视、人民日报、新华社等。
  - 深度刊物：三联、看理想、澎湃人物等。
- **费用**：**完全免费**。

## 快速部署
1. **Push 代码** 到 GitHub。
2. **配置 Secrets**：
   在 GitHub 仓库 `Settings` -> `Secrets` 中添加：
   - `SMTP_HOST`: `smtp.qq.com`
   - `SMTP_PORT`: `465`
   - `SMTP_USER`: `你的QQ邮箱`
   - `SMTP_PASS`: `QQ邮箱授权码`
   - `EMAIL_TO`: `接收邮箱`
   
   *(不再需要 LLM_API_KEY)*

3. **完成**。机器人将在每日 11:00, 16:00, 20:00 自动工作。
