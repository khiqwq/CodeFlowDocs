# 快速开始

本页给出从注册账号到收到第一条模型响应的最短路径

## 注册账号

访问 [{{SITE_NAME}}]({{SITE_URL}}/)，点击 **免费注册**。注册支持使用邮箱，无需海外手机号；实际可用的注册方式以页面显示为准

## 充值或订阅

> **数据来源与核验**
> - **来源**：[{{SITE_NAME}}「充值优惠」]({{SITE_URL}}/#packages)
> - **核验范围**：基础换算、充值套餐优惠与余额有效期
> - **最后核验日期**：2026 年 8 月 18 日

进入 **账户充值**，选择预设档位或输入自定义金额，并按页面提示完成支付宝付款。付款成功后额度通常会自动到账；若长时间未到账，保留订单号并提交工单

![账户充值](/assets/images/quick-start/account-recharge.png)

> **注意**
> 上图为 2026 年 8 月 20 日的界面留档，未反映当前充值套餐折扣。换算比例、优惠、最低金额和余额有效期均可能调整，实际付款金额与到账额度以充值页面实时显示为准

除充值外，也可以在 **订阅套餐** 中购买套餐。两种计费方式的差异与预扣规则见[模型与计费](/guides/models-and-billing.md)

## 创建令牌

进入 **令牌管理 → 创建令牌**，填写名称、选择分组、按需设置费用限制。完整令牌只在创建时显示一次，创建后立即复制并妥善保存

分组决定令牌可调用的模型系列：`gpt-*` 模型对应 Codex 官方分组，`claude-*` 模型对应 Claude 系列分组。字段说明见[API 令牌](/guides/access.md#api-令牌)，分组差异见[分组与计费倍率](/guides/access.md#分组与计费倍率)

## 配置客户端

### CodeFlow 命令行工具（推荐）

[CodeFlow 命令行工具](/guides/codeflow-cli.md) 是官方交互式终端工具，登录后可在终端内完成控制台的用户功能，并把令牌一键写入客户端配置

macOS／Linux 在终端中运行：

```sh
curl -fsSL {{SITE_URL}}/install.sh | sh
```

Windows 在 PowerShell 中运行：

```powershell
powershell -c "irm {{SITE_URL}}/install.ps1 | iex"
```

安装完成后运行 `codeflow`，按提示登录；在 **令牌管理** 中创建令牌，选择 **写入配置**，再选要写入的客户端。写入前工具会显示将要修改的文件。详细步骤见[一键配置客户端](/guides/codeflow-cli.md#一键配置客户端)

### 手动配置

使用其他客户端，或希望自行编辑配置时，打开对应客户端页面，按页面说明填写接入地址（Base URL）与令牌：

- [Claude Code](/guides/claude-code.md)
- [Codex](/guides/codex.md)
- [CC Switch](/guides/cc-switch.md)
- [Cherry Studio](/guides/cherry-studio.md)
- [Kilo Code](/guides/kilo-code.md)
- [OpenCode](/guides/opencode.md)
- [OpenClaw](/guides/openclaw.md)

各客户端要求的接入地址形态不同（部分末尾带 `/v1`，部分不带），以对应页面为准；概念说明见[接入凭证与分组](/guides/access.md#base-url)

## 验证与观测

启动客户端并发起一条测试消息，收到正常响应即表示基本连接已建立

**数据看板** 显示账户余额、当日请求数、Token 用量与消耗：

![数据看板](/assets/images/quick-start/usage-dashboard.png)

**使用日志** 逐条显示每次调用的输入／输出 Token 与对应金额：

![使用日志](/assets/images/quick-start/usage-log.png)

## 常见问题

|现象|处理方式|
|---|---|
|返回 401 或认证失败|重新复制令牌，确认无多余空格；丢失或泄露时删除重建|
|返回 404 或模型不存在|确认模型 ID 拼写正确，且令牌分组与模型系列匹配|
|提示余额不足|确认可用余额不低于预扣的 $1；订阅额度用尽则等待恢复|
|客户端无法连接|按对应客户端页核对接入地址，确认末尾是否带 `/v1`|
|充值后未到账|刷新 **账户充值** 页核对记录，仍未到账时带订单号提交工单|
