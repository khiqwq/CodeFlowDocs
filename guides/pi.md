# Pi

Pi（Pi Coding Agent）是一款在终端中运行的轻量代理，可以读取和修改文件、执行命令，并通过技能与扩展完成开发、资料整理等任务。本页介绍使用 {{SITE_NAME}} 令牌接入 Claude 模型的方式，接入地址（Base URL）不带 `/v1`

> **注意**
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页于 2026 年 9 月 6 日对照 Pi 官方文档核对安装要求与配置方式，核对版本为 v0.85.1

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建 Claude 系列分组的令牌，参见[接入凭证与分组](/guides/access.md)
- 本页使用的接入地址为 `{{SITE_URL}}`，不带 `/v1`

## 安装 Pi

确保已安装 [Node.js](https://nodejs.org/)，Pi v0.85.1 要求 Node.js 22.19.0 或更高版本

Windows 默认使用 Git Bash 执行命令，建议先安装 [Git for Windows](https://git-scm.com/download/win)。模型使用的命令工具可按 [Pi Windows 文档](https://pi.dev/docs/latest/windows)改为 PowerShell；交互输入中的 `!`、`!!` 命令仍使用 Bash

在终端运行以下命令安装并检查版本：

```sh
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi --version
```

`--ignore-scripts` 与官方 npm 安装命令一致，Pi 的正常 npm 安装不依赖安装脚本。其他安装方式见 [Pi 官方网站](https://pi.dev/)

## 填写配置

Pi 的自定义供应商配置写在用户级 `models.json` 中：

|操作系统|默认路径|
|---|---|
|macOS／Linux|`~/.pi/agent/models.json`|
|Windows|`%USERPROFILE%\.pi\agent\models.json`|

目录或文件不存在时新建。已有配置时，将 `codeflow` 合并到现有的 `providers` 对象中，保留其他供应商；设置了 `PI_CODING_AGENT_DIR` 时，使用该目录下的 `models.json`

将下方 `apiKey` 中的 `sk-您的令牌` 替换为在 {{SITE_NAME}} 创建的令牌：

```json
{
  "providers": {
    "codeflow": {
      "baseUrl": "{{SITE_URL}}",
      "api": "anthropic-messages",
      "apiKey": "sk-您的令牌",
      "models": [
        {
          "id": "claude-fable-5-1",
          "name": "Claude Fable 5.1"
        }
      ]
    }
  }
}
```

|字段|说明|
|---|---|
|`providers.codeflow`|自定义供应商 ID，启动命令和模型选择时使用 `codeflow`|
|`baseUrl`|所选线路的接入地址，不带 `/v1`；Pi 使用的 Anthropic SDK 会补全消息接口路径|
|`api`|本页使用 `anthropic-messages`，对应 Claude 模型|
|`apiKey`|填写在 {{SITE_NAME}} 创建的 Claude 系列分组令牌，替换示例中的 `sk-您的令牌`|
|`models[].id`|实际发送给服务端的模型 ID，需与令牌分组匹配|
|`models[].name`|用于模型匹配和辅助显示；`/model` 主列表及底栏仍显示模型 `id`|

示例模型 ID 依据 2026 年 9 月 6 日的[模型广场界面留档](/guides/models-and-billing.md#模型广场)选取。使用前核对当前可用模型；更换模型时同步修改 `id`、`name` 及下文启动命令

中国优化线路与全球加速线路的账号、令牌与余额通用，可随时切换。复制所选线路的地址作为 `baseUrl`，地址格式说明见[接入凭证中的地址列表](/guides/access.md#base-url)

> **提示**
> 本示例未指定模型能力字段，Pi v0.85.1 默认使用 `reasoning: false`、`input: ["text"]`、`contextWindow: 128000` 和 `maxTokens: 16384`，即关闭思考、仅支持文字输入、上下文窗口为 128000 Token、最大输出为 16384 Token。这些是客户端默认配置，模型的实际能力上限需另行核对；调整方式见 [Pi 自定义模型文档](https://pi.dev/docs/latest/models#model-configuration)
>
> 未填写 `cost` 时，Pi 本地费用可能显示为 0，实际扣费仍以 {{SITE_NAME}} 的 **使用日志** 和 **额度流水** 为准

## 启动与验证

保存配置后，在终端中进入要处理的项目目录，指定供应商和模型启动：

```sh
pi --provider codeflow --model claude-fable-5-1
```

发送一条测试消息，例如“请回复：连接成功”。收到正常响应后，在 {{SITE_NAME}} **使用日志** 中确认对应调用，即表示基本接入成功

会话中输入 `/model` 或按 `Ctrl+L` 打开模型选择器，选择 `codeflow` 下的模型。选择器中按 `Ctrl+S` 可保存启动时的默认模型，之后在终端运行 `pi` 即可

## 常见问题

|现象|处理方式|
|---|---|
|安装提示 Node.js 版本不满足要求|运行 `node --version`，升级到 Node.js 22.19.0 或更高版本后重新安装|
|安装后找不到 `pi`|重开终端，确认 npm 全局命令目录已加入 `PATH`|
|Windows 无法执行 Bash 命令|安装 Git for Windows；自定义路径的设置方式见 [Pi Windows 文档](https://pi.dev/docs/latest/windows)|
|`/model` 中没有 `codeflow` 模型|核对 `models.json` 路径、JSON 结构，确认 `providers.codeflow` 下已填写模型与 `apiKey`，再打开 `/model`|
|提示无 API Key 或返回 401|确认 `apiKey` 已替换为有效的 Claude 系列分组令牌，且没有多余空格|
|返回 404 或模型不存在|确认 `baseUrl` 不带 `/v1`，模型 ID 当前可用且分组匹配|
|修改模型配置后未生效|确认修改的是当前用户的 `models.json`，重新打开 `/model` 并选择对应模型|
|Pi 显示费用为 0，但平台有扣费|本示例未配置 `cost`，本地估算不代表平台计费；以 **使用日志** 和 **额度流水** 为准|
|已安装的技能未加载|检查 `SKILL.md` 是否有 YAML 前置元数据并包含 `name`、`description`；缺少 `description` 的技能不会加载。项目技能需先信任项目，修改后执行 `/reload`；`/skill:名称` 使用技能声明的 `name`，详见 [Pi 技能文档](https://pi.dev/docs/latest/skills#validation)|
|如何更新 Pi 与扩展包|`pi update` 更新 Pi，`pi update --extensions` 更新扩展包，`pi update --all` 同时更新 Pi 与扩展包，详见 [Pi 包管理文档](https://pi.dev/docs/latest/packages)|
