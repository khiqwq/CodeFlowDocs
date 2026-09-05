# Claude Code

Claude Code 是 Anthropic 官方的终端编码代理，适合直接在终端内完成编码任务。它按 Anthropic 协议接入，接入地址（Base URL）不带 `/v1`

> **配置说明**
>
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 9 月 6 日核验的信息整理

> **提示**
>
> 推荐使用 [CodeFlow 命令行工具](/guides/codeflow-cli.md#一键配置客户端) 一键写入本页配置，无需手动编辑文件。本页说明手动配置方式

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建 Claude 系列分组（Claude 低价分组、Claude 稳定分组或 Claude 官方分组）的令牌，参见[接入凭证与分组](/guides/access.md)
- 本页使用的接入地址为 `{{SITE_URL}}`，不带 `/v1`

## 安装 Claude Code

以下命令来自 Claude Code 官方安装入口，按操作系统选择一种安装方式，不要在同一台设备上重复执行多种安装方式

**Homebrew（macOS／Linux）：**

```bash
brew install --cask claude-code
```

**macOS／Linux／WSL：**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell：**

```powershell
irm https://claude.ai/install.ps1 | iex
```

安装完成后，验证命令是否可用：

```bash
claude --version
```

首次安装后运行一次 `claude`，完成客户端初始化并确认命令可用。初始化过程中若出现官方账号登录引导，按实际使用的鉴权方式操作；使用 {{SITE_NAME}} 令牌时，请求鉴权由下文配置文件中的令牌完成

## 填写配置

配置写在用户级 `settings.json` 中：

|操作系统|默认路径|
|---|---|
|macOS／Linux|`~/.claude/settings.json`|
|Windows|`%USERPROFILE%\.claude\settings.json`|

文件不存在时新建。填入以下内容，并将 `ANTHROPIC_AUTH_TOKEN` 的值替换为在 **令牌管理** 中创建的令牌：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "{{SITE_URL}}",
    "ANTHROPIC_AUTH_TOKEN": "sk-您的令牌"
  }
}
```

`ANTHROPIC_BASE_URL` 不带 `/v1`，Claude Code 会自行补全接口路径

在 `env` 中将 `ANTHROPIC_MODEL` 设为 **模型广场** 中当前可用的 Claude 模型 ID；模型 ID 变化时只需更新该字段，也可在会话内用 `/model <模型 ID>` 临时切换

若要免除初始化引导，可在 `~/.claude.json`（Windows 为 `%USERPROFILE%\.claude.json`）中添加以下配置项：

```json
{
  "hasCompletedOnboarding": true
}
```

## 验证接入

保存配置后，完全退出正在运行的 Claude Code，重新打开终端，进入项目目录并运行：

```bash
claude
```

在对话界面发送一条测试消息，收到正常响应，即表示接入成功

## 常见问题

|现象|处理方式|
|---|---|
|返回 401 或认证失败|确认 `ANTHROPIC_AUTH_TOKEN` 有效且属于 Claude 系列分组|
|返回 404 或模型不存在|将 `ANTHROPIC_MODEL` 更新为 **模型广场** 当前可用的模型 ID|
|修改配置后未生效|完全退出并重新启动 Claude Code，确认修改的是用户级 `settings.json`|

更多安装信息参见 [Claude Code 官方文档](https://code.claude.com/docs/zh-CN/setup)
