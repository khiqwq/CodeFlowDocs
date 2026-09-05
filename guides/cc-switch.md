# CC Switch

CC Switch 是第三方图形化供应商配置管理工具，可在多个供应商之间切换 Claude Code 与 Codex 的连接配置。若只接入 {{SITE_NAME}}，使用官方 [CodeFlow 命令行工具](/guides/codeflow-cli.md) 即可一键完成配置

> **配置说明**
>
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 9 月 6 日核验的信息整理

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建分组与模型系列匹配的令牌，参见[接入凭证与分组](/guides/access.md)
- 本页的 Claude 配置使用不带 `/v1` 的接入地址（Base URL），Codex 配置使用带 `/v1` 的接入地址

## 安装 CC Switch

前往 [CC Switch GitHub Releases 页面](https://github.com/farion1231/cc-switch/releases/latest)，在最新版本的 **Assets** 区域选择适用于当前系统的安装包：Windows 推荐下载 `.msi` 文件，macOS 选择 `.dmg` 文件，Linux 可按需选择 AppImage、deb 或 rpm 格式

![CC Switch Release 页面](/assets/images/cc-switch/release-page.png)

## 添加供应商

打开已安装的 CC Switch，在分组条中选择要配置的客户端

![CC Switch 初始界面](/assets/images/cc-switch/initial-screen.png)

在对应分组右侧点击 **+** 添加供应商；如果按钮不可见，先将窗口最大化。选择 **自定义配置**

![选择自定义配置](/assets/images/cc-switch/custom-config.png)

向下滚动，找到自定义供应商配置项

## 填写配置

|配置项|填写内容|
|---|---|
|**供应商名称**|`{{SITE_NAME}}`|
|**官网链接**|`{{SITE_URL}}`|
|**API Key**|`sk-您的令牌`|
|**请求地址**|Claude 使用 `{{SITE_URL}}`（不带 `/v1`），Codex 使用 `{{SITE_URL}}/v1`|

接入地址需与当前选中的客户端一致。中国优化线路与全球加速线路的账号、令牌与余额通用，可随时切换；线路选择与各客户端要求的地址格式见[接入凭证中的地址列表](/guides/access.md#base-url)

按表格填写配置，将 `sk-您的令牌` 替换为在 {{SITE_NAME}} 创建的令牌，填写完成后点击 **保存**

![填入配置内容](/assets/images/cc-switch/provider-config.png)

Claude 配置模板如下：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "{{SITE_URL}}",
    "ANTHROPIC_AUTH_TOKEN": "sk-您的令牌"
  }
}
```

配置 Codex 时，在分组条中选择 **Codex**，并使用带 `/v1` 的接入地址 `{{SITE_URL}}/v1`；模型 ID 和令牌字段按 CC Switch 当前表单填写。如需手动配置 `config.toml` 与 `auth.json`，参见 [Codex](/guides/codex.md)

## 保存并启用

添加成功后，在主界面找到刚创建的供应商，点击 **启用**，确认状态显示 **使用中**

![启用供应商](/assets/images/cc-switch/enable-provider.png)

## 验证接入

在终端启动已配置的客户端：Claude Code 运行 `claude`，Codex 运行 `codex`。进入对话界面后，发送一条测试消息，收到正常响应，即表示接入成功。下图为 Claude Code 的验证示例

![Claude Code 运行结果](/assets/images/cc-switch/claude-code-result.png)

## 常见问题

|现象|处理方式|
|---|---|
|找不到 **+** 或 **自定义配置**|最大化窗口，确认分组条选中目标客户端|
|Claude 返回 401|确认令牌有效，且 `ANTHROPIC_BASE_URL` 不带 `/v1`|
|Codex 返回 401 或 404|核对两个配置文件与模型 ID，令牌须属 Codex 官方分组|
