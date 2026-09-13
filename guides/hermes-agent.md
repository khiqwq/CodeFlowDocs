# Hermes Agent

Hermes Agent 是 Nous Research 开源的终端自主代理，可以执行命令、读写文件、调用工具，并通过记忆与技能持续积累经验。接入 {{SITE_NAME}} 时，以自定义供应商方式使用 `anthropic_messages` 协议调用 Claude 模型，接入地址（Base URL）不带 `/v1`

> **配置说明**
>
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 9 月 13 日对照 Hermes Agent 官方文档与源码核验的信息整理，核验版本为 Hermes Agent v0.21.2

> **提示**
>
> 推荐使用 [CodeFlow 命令行工具](/guides/codeflow-cli.md#一键配置客户端) 一键写入本页配置，无需手动编辑文件。本页说明手动配置方式

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建 Claude 系列分组的令牌，参见[接入凭证与分组](/guides/access.md)
- 本页使用的接入地址为 `{{SITE_URL}}`，不带 `/v1`

## 安装 Hermes Agent

以下命令来自 Hermes Agent 官方安装入口，安装脚本会自行准备所需的 Python 与 Node.js 运行环境

**macOS／Linux／WSL2：**

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

**Windows PowerShell：**

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

安装脚本结尾会启动设置向导；向导中的模型供应商由下文配置文件覆盖，其余项按需选择或保持默认。安装完成后重新打开终端，验证命令是否可用：

```bash
hermes --version
```

## 填写配置

Hermes Agent 的配置由 `config.yaml` 与 `.env` 两个文件组成，位于同一目录；文件不存在时新建：

|操作系统|默认目录|
|---|---|
|macOS／Linux|`~/.hermes/`|
|Windows|`%LOCALAPPDATA%\hermes\`|

### config.yaml

在 `config.yaml` 中加入以下内容。已有配置时，将 `codeflow` 合并到现有的 `providers` 映射中，并把 `model` 段的 `provider` 与 `default` 改为下方的值：

```yaml
providers:
  codeflow:
    api: "{{SITE_URL}}"
    key_env: CODEFLOW_API_KEY
    transport: anthropic_messages
    discover_models: false
    models:
      claude-fable-5-1:
        context_length: 200000

model:
  provider: custom:codeflow
  default: claude-fable-5-1
```

|字段|说明|
|---|---|
|`providers.codeflow`|自定义供应商 ID，`model.provider` 与 `/model` 命令中以 `custom:codeflow` 引用|
|`api`|所选线路的接入地址，不带 `/v1`；Hermes Agent 使用的 Anthropic SDK 会补全消息接口路径|
|`key_env`|存放令牌的环境变量名，令牌本身写在 `.env` 中|
|`transport`|本页使用 `anthropic_messages`，对应 Claude 模型|
|`discover_models`|`false` 表示不向接入地址探测模型列表，`/model` 只显示下方配置的模型|
|`models.<模型 ID>.context_length`|模型上下文窗口，Hermes Agent 据此判断何时压缩对话，需与 **模型广场** 当前信息一致|
|`model.provider`|默认供应商，填写 `custom:codeflow`|
|`model.default`|默认模型 ID，需与令牌分组匹配|

示例模型 ID 依据 2026 年 9 月 6 日的[模型广场界面留档](/guides/models-and-billing.md#模型广场)选取。使用前核对当前可用模型；更换模型时同步修改 `models` 与 `default`

中国优化线路与全球加速线路的账号、令牌与余额通用，可随时切换。复制所选线路的地址作为 `api`，地址格式说明见[接入凭证中的地址列表](/guides/access.md#base-url)

> **提示**
>
> 未填写 `context_length` 时，Hermes Agent 会向接入地址与公开模型目录探测上下文窗口，探测失败按 256000 Token 处理，可能超出模型实际上限；Hermes Agent 要求上下文窗口不低于 64000 Token

### .env

在同一目录的 `.env` 中加入一行，将 `sk-您的令牌` 替换为在 {{SITE_NAME}} 创建的令牌：

```text
CODEFLOW_API_KEY=sk-您的令牌
```

也可以在终端运行 `hermes config set CODEFLOW_API_KEY sk-您的令牌`，以 `_API_KEY` 结尾的键会自动写入 `.env`

## 验证接入

保存两个文件后，在终端中进入要处理的项目目录并运行：

```bash
hermes
```

发送一条测试消息，例如「请回复：连接成功」。收到正常响应，即表示接入成功；可在 {{SITE_NAME}} **使用日志** 中核对对应调用

首次通过 Anthropic 协议发起请求时，Hermes Agent 会自动安装 `anthropic` 依赖。会话中输入 `/model` 可在 `codeflow` 下切换模型；在终端运行 `hermes model` 也可以重新选择供应商与模型

## 常见问题

|现象|处理方式|
|---|---|
|安装后找不到 `hermes`|重新打开终端，确认安装脚本写入的 `PATH` 已生效|
|返回 401 或认证失败|重新复制 Claude 系列分组的令牌写入 `.env`，确认变量名与 `key_env` 一致|
|返回 404 或模型不存在|确认 `api` 不带 `/v1`，模型 ID 当前可用且分组匹配|
|`/model` 中没有 `codeflow` 模型|核对 `providers.codeflow` 的缩进与字段，确认 `models` 已填写|
|修改配置后未生效|配置只对新会话生效，退出后重新运行 `hermes`|
|自动安装 `anthropic` 依赖失败|确认网络可访问 PyPI 后重新发送消息|
|如何更新 Hermes Agent|运行 `hermes update`|
|如何排查运行环境|运行 `hermes doctor`|
