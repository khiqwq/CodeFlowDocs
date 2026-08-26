# CodeFlowDocs

本仓库是 CodeFlow 站内文档中心的数据源。CI 检查通过后自动把提交发布到 `release` 分支，CodeFlow 服务端轮询 `release` 并原子发布完整快照；推送合规内容后数分钟内自动上线，不需要在本仓库构建或部署文档站

## 目录结构

```text
manifest.json       # 导航清单，站内侧栏的唯一来源
guides/<slug>.md    # 每篇指南，文件名即站内 URL 段
assets/             # 指南图片，子目录层级不限
scripts/check.mjs   # 内容契约校验脚本，本地与 CI 共用
README.md           # 仓库用途与维护规范
CONTRIBUTING.md     # 写作与提交前检查
```

## 新增指南

1. 在 `guides/` 新建符合 slug 规则的 Markdown 文件，并以唯一的 `# 主标题` 开头
2. 只使用 `manifest.json` 中约定的 GFM 子集；站点地址使用 `{{SITE_URL}}` 和 `{{SITE_NAME}}` 占位符
3. 如需图片，将合规文件放入 `assets/`，并在正文使用根绝对路径引用（`/assets/…`）
4. 在 `manifest.json` 对应分组的 `items` 中添加一项。`slug` 必须与文件名完全一致
5. 提交前在仓库根目录运行 `node scripts/check.mjs` 校验；push 与 PR 时 CI 会自动执行同一脚本

详细写作规范见 [`CONTRIBUTING.md`](CONTRIBUTING.md)
