# Kilo Code

Kilo Code 是 VS Code 扩展形态的编码代理，适合在编辑器内直接完成编码任务的场景。它以 OpenAI Compatible 方式接入 {{SITE_NAME}}，接入地址（Base URL）带 `/v1`

> **配置说明**
>
> 客户端界面与配置字段可能随版本更新变化，模型 ID 与可用分组以 {{SITE_NAME}} 控制台实时显示为准。本页依据 2026 年 9 月 6 日核验的信息整理

## 准备工作

- 已注册 {{SITE_NAME}} 账号并有可用额度，参见[快速开始](/guides/quick-start.md)
- 已创建分组与目标模型系列匹配的令牌，参见[接入凭证与分组](/guides/access.md)
- 本页使用的接入地址为 `{{SITE_URL}}/v1`，带 `/v1`

## 安装 Kilo Code

在 VS Code 扩展市场中搜索 `Kilo Code`，安装并启动扩展

## 打开配置入口

进入 Kilo Code 扩展，点击界面右上角的设置按钮

![Kilo Code 首页](/assets/images/kilo-code/home.png)

选择左侧的 **提供商** 选项卡

![提供商选项卡](/assets/images/kilo-code/providers-tab.png)

在 **提供商** 选项卡中找到 **自定义服务商**，点击右侧的 **连接** 按钮

![添加自定义提供商](/assets/images/kilo-code/custom-provider.png)

## 填写配置

|配置项|填写内容|
|---|---|
|**提供商 ID**|`codeflow`|
|**显示名称**|`{{SITE_NAME}}`|
|**Provider API**|`OpenAI Compatible`|
|**基础 URL**|`{{SITE_URL}}/v1`|
|**API 密钥**|在 {{SITE_NAME}} 创建的令牌|
|令牌分组|按需选择，决定可获取的模型范围|

![填写基础 URL 与密钥](/assets/images/kilo-code/endpoint-and-key.png)

在 **基础 URL** 中填写接入地址，在 **API 密钥** 中填写令牌。Kilo Code 会自动获取当前分组可用的模型列表，选择需要使用的模型并添加

![添加模型](/assets/images/kilo-code/add-model.png)

## 保存并启用

确认供应商与模型信息无误后，点击 **提交**

![提交](/assets/images/kilo-code/submit.png)

![提交配置](/assets/images/kilo-code/submit-config.png)

## 验证接入

选择已添加的模型并发送一条测试消息，收到正常响应，即表示接入成功

## 常见问题

|现象|处理方式|
|---|---|
|获取不到模型|确认接入地址带 `/v1`，且令牌分组与模型系列一致|
|测试消息失败|重新复制令牌填入并保存，再选模型发送测试消息|
