# City Matching Audit — 2026-08-09

## Finding

旧实现直接把 `lowest(destinyScore)` 作为 Least Compatible，因此北京在 10,000 个随机画像中占 53.20%。这不是一条独立的“不适合”判断，而是综合适配度的反向投影，单项成本、节奏或空间差异都可能主导结果。

## Corrective design

`scoreLeastCompatible` 已独立于 Destiny scorer：

- 仅当绝对差异至少 25 时计为 meaningful mismatch；
- 每项差异按 45 封顶；
- 至少两项 meaningful mismatch 才会进入候选；
- score 为 capped weighted mismatch、multi-dimension penalty 和数据置信度的组合；
- 若没有合格候选，返回 `null`，产品显示“你的生活偏好比较开放”。

## 10,000-profile simulation

- Least Compatible：北京 20.16%、上海 14.63%、成都 5.90%、海口 5.82%、深圳 5.59%。
- `null`：0.00%；平均 significant mismatch 数：9.36。
- 北京 2,016 个命中样本的平均贡献为：COST 4.90、SPACE 4.07、PACE 4.05、AMB 2.71、ORDER 2.55、climate 2.47、CULT 2.32、SOC 2.13；它不是由单一 penalty 决定。现阶段随机 profile 会均匀抽样所有 0–100 偏好，不能代表真实产品用户分布。

## Conclusion

北京的占比仍须在真实用户数据上线后继续校准，但已经满足多维门槛和单项 cap，不再是“成本或节奏单独决定”的结构性实现缺陷。
