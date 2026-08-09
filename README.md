# 你的命定城市 / Destiny City

一个面向移动端的轻量生活方式测试：用户完成 28 道情境题，系统以可复现的确定性规则生成生活偏好画像，并匹配中国城市。它用于娱乐、自我观察与生活方式探索，不构成专业建议。

## 本地运行

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
npm run simulate
```

默认地址为 `http://localhost:3000`。当前没有必需环境变量；完整报告在开发模式下由 deterministic fallback 直接生成。正式接入 LLM 或支付前，需通过 Provider Adapter 注入，并保留报告版本与 session 的持久化关联。

## 技术与目录

- Next.js 15、React 19、TypeScript、CSS（移动端优先）
- `src/data/questions.ts`：V2 题库（96 题；每维度 1 个 anchor；每题独立情境化选项）
- `src/data/cities.ts`：30 个城市的 V1 编辑校准画像
- `src/lib/engine.ts`：seeded sampling、画像评分、分维度城市匹配
- `src/app/page.tsx`：Landing → Test → Full Result + Report → Share Card

## 测试逻辑

自动测试覆盖：同 session 稳定抽题、28 题/12 anchor、维度覆盖、题目不重复、跨 session 差异、画像归一化、空答案阻断、城市排行稳定和全部城市有合法分数。

## 城市匹配

城市排名不由 LLM 决定。流程为：答案 → `LifeProfile` → matching engine → 四类固定 ranking（命定/事业/舒服生活/相对不适配）→ fallback 报告。V1 匹配将基础生活方式、职业倾向、成本兼容性与气候偏好拆分计算；权重集中在 `src/lib/engine.ts`，后续应迁入独立的 `matching.config.ts`。

城市分数是用于产品体验的编辑校准，不能被视作客观城市排名或事实数据库。

## Product Status

**V1 technical test build.** 已有匿名测试、确定性匹配、local persistence、Fallback Report 与 PNG 分享卡流程。它不是移居、职业或财务建议。

## Distribution and Monetization

The web application contains no checkout flow. Distribution and monetization happen externally: users who receive a URL can complete the full test, report and share card without further payment. `?src=xhs_post_01` 等来源参数会原样保存为 `acquisition_source`，用于后续归因；没有小红书订单验证、兑换码或账号系统。

## City Data Methodology

每个城市的 12 个指标带 `objective`、`derived` 或 `editorial` 来源类型及 0–1 置信度。气候、成本与自然资源归为 objective；产业机会、文化与公共效率为 derived；松弛感、社交、饮食与扎根感明确为 editorial。V1 不把编辑判断表述为客观城市事实；正式发布前须为 objective/derived 指标补逐城可访问 URL 和年份审校。

## Matching Methodology

城市是生活条件的供给，匹配优先惩罚“用户的需要没有被满足”，并轻度惩罚过度供给；成本只在用户敏感度不足以覆盖城市成本时扣分。`npm run simulate` 用固定随机种子跑 10,000 个画像，输出四类榜单的城市分布，供校准复核。

## Legacy Payment Infrastructure

`PaymentProvider` / `MockPaymentProvider` 仍保留为未调用的 V1 实验基础设施，不属于当前用户路径。网站不会发起支付，也不进行微信、支付宝或小红书订单验证。

## LLM Integration Status

`FallbackReportProvider` 生成可用报告并按版本 key 缓存；`LLMReportProvider` 已留接口，当前安全地 fallback，不读取原始题目答案或改写城市排名。

## Deployment

可部署至 Vercel。生产环境应配置 Supabase/PostgreSQL persistence adapter、LLM provider 凭据与服务端报告缓存；无这些配置时保留 local/dev fallback。页面通过 `noindex,nofollow` 和 robots 规则降低搜索发现概率；**noindex 不是访问控制**。

## 数据版本

- Question bank: `2026.08.v2`
- City profile: `2026.08.v1`
- Matching: `2026.08.v1`

## Known Limitations

- 当前 persistence 是浏览器 localStorage；生产环境应迁至匿名 session + PostgreSQL/Supabase。
- 需补 `test_sessions`、`answers`、`life_profiles`、`city_results`、`reports`、`analytics_events` 数据表和完整版本字段。
- 浏览器 localStorage 已可保存报告；生产环境仍需真实 persistence adapter。
- 分享卡由浏览器 Canvas 生成 1080×1440 PNG，尚未存入远端对象存储。
- 需为每项城市标定补充可追踪来源和审校流程，并完成真实手机浏览器及生产 LLM E2E 验证。
