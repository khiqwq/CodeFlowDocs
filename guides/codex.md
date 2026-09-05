# Codex

Codex 是 OpenAI 官方的编码代理，提供命令行与桌面端，二者共用用户级 `~/.codex` 目录，配置一次即对两端同时生效。按 Responses 协议接入 {{SITE_NAME}}，接入地址（Base URL）带 `/v1`

> **配置说明**
>
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 9 月 6 日核验的信息整理

> **提示**
>
> 推荐使用 [CodeFlow 命令行工具](/guides/codeflow-cli.md#一键配置客户端) 一键写入本页配置，无需手动编辑文件。本页说明手动配置方式

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建 Codex 官方分组的令牌，参见[接入凭证与分组](/guides/access.md)
- 本页使用的接入地址为 `{{SITE_URL}}/v1`，带 `/v1`

## 安装 Codex

确保已安装 [Node.js](https://nodejs.org/)（建议使用当前 LTS 版本），然后安装 Codex：

```bash
npm install -g @openai/codex
```

安装完成后，验证命令是否可用：

```bash
codex --version
```

## 填写配置

Codex 的配置由 `config.toml` 与 `auth.json` 两个文件组成，都位于用户级 `~/.codex` 目录（Windows 为 `%USERPROFILE%\.codex`）；文件不存在时新建

### config.toml

编辑 `~/.codex/config.toml`，填入以下内容：

```toml
model_provider = "codeflow"
model = "gpt-6-astra"

[model_providers.codeflow]
name = "codeflow"
base_url = "{{SITE_URL}}/v1"
wire_api = "responses"
requires_openai_auth = true
```

示例使用 `gpt-6-astra`，实际填写以 **模型广场** 当前可用的 GPT 模型 ID 为准；该模型下线时，只需替换 `model` 的值，不要修改供应商配置字段

> **注意**
>
> `base_url` 必须带 `/v1`；令牌选择 Codex 官方分组

### auth.json

在同一目录编辑 `auth.json`，将 `OPENAI_API_KEY` 的值替换为在 **令牌管理** 中创建的令牌：

```json
{
  "OPENAI_API_KEY": "sk-您的令牌"
}
```

## 验证接入

保存两个文件后，完全退出并重新启动 Codex，确保配置被重新读取。在终端运行：

```bash
codex
```

发送一条测试消息，收到正常响应，即表示接入成功。桌面端与命令行读取同一 `~/.codex` 目录，无需另行设置

## 常见问题

|现象|处理方式|
|---|---|
|返回 401 或认证失败|确认 `auth.json` 合法且字段名为 `OPENAI_API_KEY`|
|返回 404 或模型不存在|确认 `model` 可用且令牌属于 Codex 官方分组|
|无法连接服务|确认 `base_url` 带 `/v1`，然后重启 Codex|
|桌面端未生效|完全退出并重新启动 Codex，两端共用同一 `~/.codex` 目录|
|修改配置后未生效|确认两个文件位于当前用户的 `~/.codex` 目录|
