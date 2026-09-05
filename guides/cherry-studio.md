# Cherry Studio

Cherry Studio 是一款支持多提供商管理的桌面 AI 对话客户端。接入 {{SITE_NAME}} 的主路径是 Anthropic 提供商，接入地址（Base URL）不带 `/v1`

> **注意**
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 9 月 6 日核验的信息整理

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建匹配分组的令牌，主路径使用 Claude 系列分组，参见[接入凭证与分组](/guides/access.md)
- 本页主路径通过 Anthropic 提供商接入，接入地址为 `{{SITE_URL}}`，不带 `/v1`

## 安装 Cherry Studio

从 [Cherry Studio 官方网站](https://www.cherry-ai.com/) 下载并启动客户端

![Cherry Studio 客户端页面](/assets/images/cherry-studio/client-home.png)

按客户端提示使用邮箱注册或登录

## 添加提供商

点击左下角的设置图标并点击 **添加服务商**

![进入设置页面](/assets/images/cherry-studio/settings-entry.png)

![添加供应商](/assets/images/cherry-studio/add-provider.png)

## 填写配置

|配置项|填写内容|
|---|---|
|提供商类型|`Anthropic`|
|Base URL|`{{SITE_URL}}`（不带 `/v1`）|
|API 密钥|在 {{SITE_NAME}} 创建的令牌|
|令牌分组|Claude 系列分组|

提供商列表通常包含 `OpenAI` 与 `Anthropic`，主路径选择 `Anthropic`

![添加模型服务](/assets/images/cherry-studio/add-model-service.png)

填写完成后，在右侧供应商详情中点击 **获取模型列表**

![获取模型列表](/assets/images/cherry-studio/api-endpoint-key.png)

从返回的列表中点击您需要的模型右侧 **+** 号添加模型

![模型列表](/assets/images/cherry-studio/model-list.png)

如需通过 OpenAI 端点接入，在 `OpenAI` 提供商中将 Base URL 填写为 `{{SITE_URL}}/v1`，并使用 Codex 官方分组的令牌

## 保存并启用

在供应商详情中点击右上角的启用选项

![启用服务商](/assets/images/cherry-studio/enable-provider.png)

## 验证接入

新建对话并发送一条测试消息，能够正常返回内容即表示接入成功

## 常见问题

|现象|处理方式|
|---|---|
|获取模型列表为空|确认提供商为 `Anthropic`、地址不带 `/v1` 且分组匹配|
|返回 401|重新复制令牌填入，确认无多余空格且分组正确|
