# OpenCode

OpenCode 是终端形态的编码代理，适合全程在命令行中完成开发任务。接入 {{SITE_NAME}} 时，供应商配置走 `@ai-sdk/anthropic`，但接入地址（Base URL）需要带 `/v1`

> **注意**
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 9 月 6 日核验的信息整理

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建分组与所用模型匹配的令牌；本页示例使用 Claude 模型，令牌需选择 Claude 系列分组，参见[接入凭证与分组](/guides/access.md)
- 本页使用带 `/v1` 的接入地址：`{{SITE_URL}}/v1`

## 安装 OpenCode

从 [OpenCode 官方网站](https://opencode.ai/) 获取安装说明，完成安装

## 填写配置

配置文件是用户级的 `~/.config/opencode/opencode.json`（Windows 为 `%USERPROFILE%\.config\opencode\opencode.json`）。填入以下内容，并将 `models` 与 `model` 中的模型 ID 替换为 **模型广场** 当前可用的 Claude 模型，保持两处 ID 一致：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "codeflow": {
      "npm": "@ai-sdk/anthropic",
      "name": "CodeFlow",
      "options": { "baseURL": "{{SITE_URL}}/v1" },
      "models": {
        "claude-fable-5-1": { "name": "Claude Fable 5.1" }
      }
    }
  },
  "model": "codeflow/claude-fable-5-1"
}
```

> **注意**
> 供应商配置必须置于 `provider.codeflow` 下，不能将 `npm`、`options`、`models` 平铺到最外层。`baseURL` 必须带 `/v1`；`@ai-sdk/anthropic` 会在此基础上拼接消息路径

示例仅保留一个模型条目，用于说明配置结构。使用前请将模型 ID、能力和计费字段替换为 **模型广场** 当前可用的信息，不要继续使用已经下线的模型 ID

## 登录与启用

保存 `opencode.json` 后，在终端运行 `opencode auth login`，按提示选择 `Other`，将 Provider ID 填为 `codeflow`，再输入令牌。令牌由 OpenCode 凭据库管理，不写入 JSON

## 验证接入

在终端运行 `opencode` 进入界面，输入 `/models`，列表中显示已配置的模型即表示接入成功

## 常见问题

|现象|处理方式|
|---|---|
|`/models` 中没有模型|确认供应商位于 `provider.codeflow` 下，且 `baseURL` 带 `/v1`|
|登录后仍认证失败|确认登录时的 Provider ID 与 JSON 中的 `codeflow` 一致|
