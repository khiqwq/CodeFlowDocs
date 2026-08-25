#!/usr/bin/env node
/**
 * CodeFlowDocs 内容契约校验（契约 v2）
 * 用法：在仓库根目录运行 node scripts/check.mjs
 * 任何违规逐条列出并以退出码 1 结束；全部通过输出 PASS
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MAX_ASSET_BYTES = 5 * 1024 * 1024;
const ASSET_EXT = /\.(png|jpe?g|webp|gif)$/i;
const ASSET_REF = /^\/assets\/[A-Za-z0-9._/-]+$/;
const GUIDE_LINK = /^\/guides\/([a-z0-9]+(?:-[a-z0-9]+)*)\.md(?:#(.+))?$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PLACEHOLDERS = new Set(['{{SITE_URL}}', '{{SITE_NAME}}']);
/* 站点地址与站点名一律写占位符，不得出现具体域名 */
const BANNED_TEXT = ['codeflow.asia'];

const problems = [];
const warnings = [];
const fail = (file, line, msg) => problems.push(`${file}${line > 0 ? `:${line}` : ''}  ${msg}`);

/* —— manifest —— */
let manifest = null;
try {
  manifest = JSON.parse(readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
} catch (e) {
  fail('manifest.json', 0, `无法读取或不是合法 JSON：${e.message}`);
}

const slugs = [];
if (manifest !== null) {
  const groups = Array.isArray(manifest.groups) ? manifest.groups : null;
  if (groups === null || groups.length === 0) fail('manifest.json', 0, 'groups 必须是非空数组');
  for (const group of groups ?? []) {
    if (typeof group?.title !== 'string' || group.title.trim() === '') {
      fail('manifest.json', 0, '存在缺少 title 的分组');
    }
    const items = Array.isArray(group?.items) ? group.items : null;
    if (items === null || items.length === 0) {
      fail('manifest.json', 0, `分组「${group?.title ?? '?'}」的 items 必须是非空数组`);
      continue;
    }
    for (const item of items) {
      if (typeof item?.slug !== 'string' || !SLUG.test(item.slug)) {
        fail('manifest.json', 0, `非法 slug：${JSON.stringify(item?.slug)}`);
        continue;
      }
      if (typeof item?.title !== 'string' || item.title.trim() === '') {
        fail('manifest.json', 0, `slug ${item.slug} 缺少 title`);
      }
      if (slugs.includes(item.slug)) fail('manifest.json', 0, `slug 重复：${item.slug}`);
      slugs.push(item.slug);
      if (!existsSync(path.join(ROOT, 'guides', `${item.slug}.md`))) {
        fail('manifest.json', 0, `guides/${item.slug}.md 不存在`);
      }
    }
  }
}

const guidesDir = path.join(ROOT, 'guides');
const guideFiles = existsSync(guidesDir)
  ? readdirSync(guidesDir).filter((f) => f.endsWith('.md'))
  : [];
for (const f of guideFiles) {
  if (!slugs.includes(f.slice(0, -3))) fail(`guides/${f}`, 0, '未在 manifest.json 中登记');
}

/* —— 围栏感知的逐行视图 —— */
function guideLines(raw) {
  const out = [];
  let fenced = false;
  raw.split(/\r?\n/).forEach((text, i) => {
    if (/^\s*(```|~~~)/.test(text)) {
      out.push({ no: i + 1, text, fenced: true });
      fenced = !fenced;
      return;
    }
    out.push({ no: i + 1, text, fenced });
  });
  return out;
}

/* —— 标题锚点算法（与站内渲染器逐字一致）—— */
function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}
function headingAnchor(raw) {
  return slugify(raw.replace(/\[([^\]]*)\]\([^)\s]*\)/g, '$1'));
}
function headingSlugsOf(lines) {
  const out = new Set();
  for (const { text, fenced } of lines) {
    if (fenced) continue;
    const m = /^#{1,6}\s+(.*)$/.exec(text);
    if (m === null) continue;
    const slug = headingAnchor(m[1]);
    if (slug !== '') out.add(slug);
  }
  return out;
}

const guideCache = new Map();
function linesOf(slug) {
  if (!guideCache.has(slug)) {
    guideCache.set(slug, guideLines(readFileSync(path.join(guidesDir, `${slug}.md`), 'utf8')));
  }
  return guideCache.get(slug);
}

/* —— 逐篇检查 —— */
const referencedAssets = new Set();
const LINK_RE = /(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const HTML_TAG_RE = /<\/?(?:img|br|div|span|a|p|table|tr|td|th|details|summary|iframe|script|style|video|audio)\b/i;

for (const slug of slugs) {
  const rel = `guides/${slug}.md`;
  if (!existsSync(path.join(guidesDir, `${slug}.md`))) continue;
  const lines = linesOf(slug);
  const ownAnchors = headingSlugsOf(lines);
  const seenAnchors = new Set();

  const first = lines[0]?.text ?? '';
  if (/^---\s*$/.test(first)) fail(rel, 1, '禁止 frontmatter（首行是 ---）');
  else if (!/^# \S/.test(first)) fail(rel, 1, '正文必须以一行 # 主标题开头');
  const h1Count = lines.filter((l) => !l.fenced && /^# /.test(l.text)).length;
  if (h1Count > 1) fail(rel, 0, `h1 只能有一个（当前 ${h1Count} 个）`);

  for (const { no, text, fenced } of lines) {
    for (const banned of BANNED_TEXT) {
      if (text.includes(banned)) fail(rel, no, `出现具体站点地址「${banned}」，应写 {{SITE_URL}}`);
    }
    const braces = text.match(/\{\{[^}]*\}\}/g) ?? [];
    for (const b of braces) {
      if (!PLACEHOLDERS.has(b)) fail(rel, no, `非法占位符 ${b}（只允许 {{SITE_URL}} 与 {{SITE_NAME}}）`);
    }
    if ((text.match(/\{\{/g) ?? []).length !== braces.length) {
      fail(rel, no, '存在未闭合的 {{ 占位符');
    }
    if (fenced) continue;

    if (/^#{5,}/.test(text)) fail(rel, no, '标题层级不得超过 h4');
    const heading = /^#{1,6}\s+(.*)$/.exec(text);
    if (heading !== null) {
      const anchor = headingAnchor(heading[1]);
      if (anchor === '') fail(rel, no, '标题文本去除标点后为空，无法生成锚点');
      else if (seenAnchors.has(anchor)) fail(rel, no, `标题锚点与同页前文重复：#${anchor}`);
      seenAnchors.add(anchor);
    }
    if (text.includes(':::')) fail(rel, no, '禁止 ::: 容器语法，提示改用引用块');
    if (/\{#[^}]+\}/.test(text)) fail(rel, no, '禁止 {#id} 自定义锚点，锚点由标题文本生成');
    if (/\[!(?:NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/.test(text)) {
      fail(rel, no, '禁止 GitHub 告示语法 [!NOTE] 等，站内不渲染');
    }
    if (/<[A-Z][A-Za-z]*/.test(text)) fail(rel, no, '禁止组件标签');
    if (HTML_TAG_RE.test(text)) fail(rel, no, '禁止原生 HTML 标签');

    for (const m of text.matchAll(LINK_RE)) {
      const [, bang, , target] = m;
      if (bang === '!') {
        if (!ASSET_REF.test(target) || !ASSET_EXT.test(target)) {
          fail(rel, no, `图片引用必须是 /assets/ 根绝对路径且为 png/jpg/jpeg/webp/gif：${target}`);
          continue;
        }
        const file = path.join(ROOT, target.slice(1));
        if (!existsSync(file)) {
          fail(rel, no, `图片不存在：${target}`);
          continue;
        }
        if (statSync(file).size > MAX_ASSET_BYTES) fail(rel, no, `图片超过 5MB：${target}`);
        referencedAssets.add(target.slice('/assets/'.length));
        continue;
      }
      if (/^(https?:\/\/|mailto:)/.test(target)) continue;
      /* 指向站点自身页面的链接写占位符前缀，渲染时替换为主地址 */
      if (/^\{\{SITE_URL\}\}(\/|$)/.test(target)) continue;
      if (target.startsWith('#')) {
        const anchor = decode(target.slice(1));
        if (!ownAnchors.has(anchor)) fail(rel, no, `页内锚点无对应标题：${target}`);
        continue;
      }
      const guide = GUIDE_LINK.exec(target);
      if (guide !== null) {
        const [, toSlug, fragment] = guide;
        if (!slugs.includes(toSlug)) {
          fail(rel, no, `互链目标不在 manifest 中：${target}`);
          continue;
        }
        if (fragment !== undefined && !headingSlugsOf(linesOf(toSlug)).has(decode(fragment))) {
          fail(rel, no, `互链锚点在 guides/${toSlug}.md 中无对应标题：#${fragment}`);
        }
        continue;
      }
      fail(rel, no, `非法链接形态（互链必须写 /guides/<slug>.md，图片必须写 /assets/…）：${target}`);
    }
  }
}

function decode(fragment) {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

/* —— assets 全量检查 —— */
function walkAssets(dir, prefix) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      walkAssets(path.join(dir, entry.name), rel);
      continue;
    }
    if (!ASSET_EXT.test(rel)) fail(`assets/${rel}`, 0, '非允许的图片格式（png/jpg/jpeg/webp/gif）');
    if (!/^[A-Za-z0-9._/-]+$/.test(rel)) fail(`assets/${rel}`, 0, '文件路径只允许字母数字与 ._/- 字符');
    if (statSync(path.join(dir, entry.name)).size > MAX_ASSET_BYTES) {
      fail(`assets/${rel}`, 0, '超过 5MB 上限');
    }
    if (!referencedAssets.has(rel)) warnings.push(`assets/${rel}  未被任何指南引用`);
  }
}
walkAssets(path.join(ROOT, 'assets'), '');

/* —— 汇总 —— */
for (const w of warnings) console.log(`WARN  ${w}`);
if (problems.length > 0) {
  for (const p of problems) console.error(`FAIL  ${p}`);
  console.error(`\n共 ${problems.length} 处违规`);
  process.exit(1);
}
console.log(`PASS  ${slugs.length} 篇指南、${referencedAssets.size} 张被引用图片全部符合契约`);
