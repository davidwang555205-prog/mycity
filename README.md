# 你的命定城市 / Destiny City

一个面向移动端的轻量生活方式测试：用户完成 28 道情境题，系统以可复现的确定性规则生成生活偏好画像，并匹配中国城市。它用于娱乐、自我观察与生活方式探索，不构成专业建议。

## 本地运行

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

默认地址为 `http://localhost:3000`。当前没有必需环境变量；完整报告在开发模式下由 deterministic fallback 直接生成。正式接入 LLM 或支付前，需通过 Provider Adapter 注入，并保留报告版本与 session 的持久化关联。

## 技术与目录

- Next.js 15、React 19、TypeScript、CSS（移动端优先）
- `src/data/questions.ts`：V1 题库（96 题；每维度 1 个 anchor）
- `src/data/cities.ts`：30 个城市的 V1 编辑校准画像
- `src/lib/engine.ts`：seeded sampling、画像评分、分维度城市匹配
- `src/app/page.tsx`：Landing → Test → Free Result → Development Unlock → Report → Share Card

## 测试逻辑

自动测试覆盖：同 session 稳定抽题、28 题/12 anchor、维度覆盖、题目不重复、跨 session 差异、画像归一化、空答案阻断、城市排行稳定和全部城市有合法分数。

## 城市匹配

城市排名不由 LLM 决定。流程为：答案 → `LifeProfile` → matching engine → 四类固定 ranking（命定/事业/舒服生活/相对不适配）→ fallback 报告。V1 匹配将基础生活方式、职业倾向、成本兼容性与气候偏好拆分计算；权重集中在 `src/lib/engine.ts`，后续应迁入独立的 `matching.config.ts`。

城市分数是用于产品体验的编辑校准，`sources` 字段已预留，当前不应被视作客观城市排名或事实数据库。

## 数据版本

- Question bank: `2026.08.v1`
- City profile: `2026.08.v1`
- Matching: `2026.08.v1`

## 当前限制与正式上线待办

- 当前 persistence 是浏览器 localStorage；生产环境应迁至匿名 session + PostgreSQL/Supabase。
- 需补 `test_sessions`、`answers`、`life_profiles`、`city_results`、`payments`、`reports`、`share_cards` 数据表和完整版本字段。
- 需实现真正的 `PaymentProvider` 与报告持久化，避免刷新重新生成报告。
- 分享卡目前是可视化预览；上线前需增加 1080×1440 导出图片。
- 需为每项城市标定补充可追踪来源和审校流程，并完成真实手机浏览器及生产支付/LLM E2E 验证。
