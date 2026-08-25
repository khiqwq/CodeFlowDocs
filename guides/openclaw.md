# OpenClaw

OpenClaw 是本地网关形态的代理工具。接入 {{SITE_NAME}} 时走 `anthropic-messages` 协议，接入地址（Base URL）不带 `/v1`

> **注意**
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 8 月 20 日核验的信息整理

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建 Claude 系列分组的令牌，参见[接入凭证与分组](/guides/access.md)
- 本页使用的接入地址为 `{{SITE_URL}}`，不带 `/v1`

## 安装 OpenClaw

按 [OpenClaw 官方项目文档](https://github.com/openclaw/openclaw) 完成安装，并确认本地网关可以正常启动

## 填写配置

编辑配置文件 `~/.openclaw/openclaw.json`（Windows 为 `%USERPROFILE%\.openclaw\openclaw.json`）。`baseUrl` 使用不带 `/v1` 的地址，`api` 填写 `anthropic-messages`，路径拼接方式由 OpenClaw 的当前版本决定

```json
{
    "gateway": {
        "mode": "local"
    },
    "agents": {
        "defaults": {
            "model": {
                "primary": "codeflow/claude-sonnet-5"
            },
            "models": {
                "codeflow/claude-sonnet-5": {}
            }
        }
    },
    "models": {
        "mode": "merge",
        "providers": {
            "codeflow": {
                "baseUrl": "{{SITE_URL}}",
                "apiKey": "sk-您的令牌",
                "api": "anthropic-messages",
                "models": [
                    {
                        "id": "claude-sonnet-5",
                        "name": "claude-sonnet-5",
                        "reasoning": true,
                        "input": [
                            "text"
                        ],
                        "cost": {
                            "input": 3,
                            "output": 15,
                            "cacheRead": 0.3,
                            "cacheWrite": 3.75
                        },
                        "contextWindow": 200000,
                        "maxTokens": 64000
                    }
                ]
            }
        }
    }
}
```

> **提示**
> `cost` 字段属于 OpenClaw 的本地模型元数据，用于本地用量估算，不会改变 {{SITE_NAME}} 的实际扣费。模型 ID、价格、上下文窗口和能力字段请与 **模型广场** 当前信息保持一致；这些字段可能随模型或客户端版本变化

示例仅保留一个模型条目，用于说明配置结构。使用前请将模型 ID、能力和计费字段替换为 **模型广场** 当前可用的信息，不要继续使用已经下线的模型 ID

## 保存并启用

保存文件并退出，然后运行以下命令使配置生效：

```bash
openclaw gateway restart
```

## 验证接入

在 OpenClaw 中选择 `codeflow/<模型 ID>`，发送一条测试消息，能够正常返回内容，即表示接入成功

## 常见问题

|现象|处理方式|
|---|---|
|网关启动失败|检查 `openclaw.json` 是否为合法 JSON，重点检查逗号、引号和嵌套层级|
|返回 401|检查 `apiKey` 是否为有效令牌，并确认 `baseUrl` 不带 `/v1`|
|模型不存在|改用 **模型广场** 当前可用的模型 ID，同步更新 `primary` 与 `models`|
