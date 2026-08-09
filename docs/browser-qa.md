# V1 Browser QA

- QA code commit: `15fa3e6 test: add stable V1 browser e2e coverage`
- Date: 2026-08-09
- Browser: local Google Chrome via Playwright 1.55.0
- Environment: production build, `next start`, `BASE_URL=http://localhost:3004`

| Check | Result | Evidence |
| --- | --- | --- |
| Flow A | PASS | Landing → 28 questions → complete result/report → PNG download. Validates `xhs_post_01`, 10 report sections, no paywall copy, analytics, PNG signature, and 1080×1440 dimensions. |
| Flow B | PASS | Reload after 14 answers preserves session ID, source, selected questions, option order, answers, and question 15 progress; completion succeeds. |
| Flow C | PASS | Three result-page refreshes preserve Life Profile, Destiny City, and persisted report snapshot. |
| Flow D | PASS | Cache key and creation time remain unchanged after the three refreshes; no duplicate report record is created. |
| 375 × 812 | PASS | Landing, questions, result, report/share preview, PNG download, and horizontal-overflow check pass. |
| 390 × 844 | PASS | Landing, questions, result, report/share preview, PNG download, and horizontal-overflow check pass. |
| 430 × 932 | PASS | Landing, questions, result, report/share preview, PNG download, and horizontal-overflow check pass. |
| Analytics | PASS | Required events are recorded; no `paywall_*` or `payment_*` event exists in the active flow. |
| Console / network | PASS | E2E captures console errors, page exceptions, and failed requests: none observed. |

## Bugs found and fixes

- Initial E2E environment lacked Playwright's cached headless-shell binary. The stable suite now deliberately uses the locally installed Chrome channel, so its execution does not depend on that cache.
- The desktop flow was initially selected for each mobile project. Project-level test matching now keeps desktop flow checks and mobile checks separate.
- Removed the visible session short code from the result eyebrow: it now reads only `你的完整城市观察`.

## Retest result

`BASE_URL=http://localhost:3004 npm run test:e2e`: **5 passed**.
