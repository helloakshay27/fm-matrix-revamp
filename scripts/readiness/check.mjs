#!/usr/bin/env node
/**
 * Frontend production readiness check.
 *
 * Usage:
 *   node scripts/readiness/check.mjs [--base origin/main] [--json] [--out report.md]
 *
 * Inputs (all optional, set by .github/workflows/production-readiness.yml):
 *   READINESS_BUILD / READINESS_LINT / READINESS_TYPECHECK / READINESS_TEST
 *       step outcomes: success | failure | skipped
 *   PR_BODY          pull request description (for the sign-off checklist)
 *   GITHUB_BASE_REF  target branch of the PR
 *   READINESS_MODE   overrides config "mode" (report | enforce)
 *
 * Exit code is non-zero only in "enforce" mode when at least one check fails.
 * Config lives in readiness.config.json at the repo root.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const argVal = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const config = JSON.parse(readFileSync(resolve(root, "readiness.config.json"), "utf8"));
const mode = (process.env.READINESS_MODE || config.mode || "report").toLowerCase();
const baseRef =
  argVal("--base") ||
  (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main");

const git = (...a) => {
  try {
    return execFileSync("git", a, { cwd: root, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  } catch (e) {
    return e.stdout?.toString() ?? "";
  }
};

// ---------------------------------------------------------------- results
const PASS = "pass", WARN = "warn", FAIL = "fail", INFO = "info", MANUAL = "manual";
const ICON = { pass: "✅", warn: "⚠️", fail: "❌", info: "ℹ️", manual: "📝" };
const SECTIONS = [
  "Branding",
  "Environment Configuration",
  "Code Quality",
  "Build Verification",
  "Functionality",
  "UI/UX",
  "Security",
  "Testing",
  "Deployment Readiness",
  "Final Approval",
];
const results = Object.fromEntries(SECTIONS.map((s) => [s, []]));
const add = (section, status, title, details = []) =>
  results[section].push({ status, title, details });

// ---------------------------------------------------------------- diff (added lines only)
const mergeBase = git("merge-base", baseRef, "HEAD").trim();
const scanPaths = config.scan.sourceGlobs;
const exts = config.scan.extensions;
const addedLines = []; // { file, line, text }

if (!mergeBase) {
  add("Deployment Readiness", WARN, `Could not find merge-base with \`${baseRef}\` — diff checks skipped`, [
    "Run `git fetch origin` or pass `--base <ref>`.",
  ]);
} else {
  const diff = git("diff", "--unified=0", "--no-color", "--no-ext-diff", `${mergeBase}...HEAD`, "--", ...scanPaths);
  let file = null, lineNo = 0;
  for (const raw of diff.split("\n")) {
    if (raw.startsWith("+++ ")) {
      file = raw.startsWith("+++ b/") ? raw.slice(6) : null;
      if (file && !exts.some((e) => file.endsWith(e))) file = null;
    } else if (raw.startsWith("@@")) {
      const m = /\+(\d+)/.exec(raw);
      lineNo = m ? Number(m[1]) : 0;
    } else if (file && raw.startsWith("+") && !raw.startsWith("+++")) {
      addedLines.push({ file, line: lineNo, text: raw.slice(1) });
      lineNo++;
    }
  }
}
const loc = (l) => `\`${l.file}:${l.line}\` — \`${l.text.trim().slice(0, 120).replace(/`/g, "'")}\``;
const isComment = (t) => /^\s*(\/\/|\*|\/\*)/.test(t);

// ---------------------------------------------------------------- Branding
{
  const b = config.branding;
  const htmlPath = resolve(root, b.indexHtml);
  if (!existsSync(htmlPath)) {
    add("Branding", FAIL, `\`${b.indexHtml}\` not found`);
  } else {
    const html = readFileSync(htmlPath, "utf8");
    const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
    add("Branding", title === b.title ? PASS : FAIL, `Page title is "${title ?? "(missing)"}"`,
      title === b.title ? [] : [`Expected "${b.title}"`]);
    const theme = /<meta\s+name=["']theme-color["']\s+content=["']([^"']+)["']/i.exec(html)?.[1];
    const themeOk = theme?.toLowerCase() === b.themeColor.toLowerCase();
    add("Branding", themeOk ? PASS : WARN, `theme-color is ${theme ?? "(missing)"}`,
      themeOk ? [] : [`Expected brand color ${b.themeColor} (see src/styles/theme.css)`]);
    if (!/rel=["'](shortcut )?icon["']/i.test(html)) add("Branding", FAIL, "No favicon <link> in index.html");
  }
  const missing = b.icons.filter((p) => !existsSync(resolve(root, p)));
  add("Branding", missing.length ? FAIL : PASS,
    missing.length ? `${missing.length} logo/favicon file(s) missing` : `All ${b.icons.length} logo/favicon files present`,
    missing.map((m) => `\`${m}\``));
  add("Branding", MANUAL, "Logo, favicon and theme look correct for every tenant layout");
}

// ---------------------------------------------------------------- Environment Configuration
{
  const hostOf = (u) => { try { return new URL(u).hostname; } catch { return null; } };
  const forbidden = config.scan.forbiddenUrlPatterns.map((p) => new RegExp(p, "i"));
  const nonProd = config.scan.nonProdHostPatterns.map((p) => new RegExp(p, "i"));
  const allowed = config.scan.allowedHostSuffixes;
  const bad = [], nonProdHits = [], unknown = [];
  for (const l of addedLines) {
    if (isComment(l.text)) continue;
    for (const [url] of l.text.matchAll(/https?:\/\/[^\s"'`)<>]+/g)) {
      const host = hostOf(url.replace(/\$\{.*$/, ""));
      if (forbidden.some((r) => r.test(url))) bad.push(loc(l));
      else if (host && nonProd.some((r) => r.test(host))) nonProdHits.push(loc(l));
      else if (host && !allowed.some((s) => host === s || host.endsWith("." + s))) unknown.push(`${host} — ${loc(l)}`);
    }
    if (/\b(localhost|127\.0\.0\.1):\d+/.test(l.text) && !/https?:\/\//.test(l.text)) bad.push(loc(l));
  }
  add("Environment Configuration", bad.length ? FAIL : PASS,
    bad.length ? `${bad.length} new localhost/dev URL(s) added` : "No new localhost/dev URLs", bad);
  add("Environment Configuration", nonProdHits.length ? WARN : PASS,
    nonProdHits.length ? `${nonProdHits.length} new non-production (dev/UAT/staging) host(s) added` : "No new non-production hosts",
    nonProdHits.length ? [...nonProdHits, "OK only if part of tenant routing (src/utils/auth.ts)."] : []);
  add("Environment Configuration", unknown.length ? WARN : PASS,
    unknown.length ? `${unknown.length} new URL(s) on hosts not in the allow-list` : "All new URLs use allowed hosts",
    unknown.length ? [...unknown, "Add legit hosts to scan.allowedHostSuffixes in readiness.config.json."] : []);

  const envFile = [".env.production", ".env"].map((f) => resolve(root, f)).find(existsSync);
  const envText = envFile ? readFileSync(envFile, "utf8") : "";
  const missingEnv = config.environment.requiredEnvVars.filter(
    (v) => !process.env[v] && !new RegExp(`^${v}=.+`, "m").test(envText));
  if (config.environment.requiredEnvVars.length)
    add("Environment Configuration", missingEnv.length ? FAIL : PASS,
      missingEnv.length ? `Missing env vars: ${missingEnv.join(", ")}` : "All required env vars set");
  else add("Environment Configuration", INFO, "No required build-time env vars configured (base URL resolved at runtime)");

  const vite = ["vite.config.ts", "vite.config.js"].map((f) => resolve(root, f)).find(existsSync);
  if (vite && /sourcemap:\s*true/.test(readFileSync(vite, "utf8")))
    add("Environment Configuration", WARN, "Production sourcemaps are enabled in vite config");
  add("Environment Configuration", MANUAL, "Production Base URL / API endpoints verified for each tenant");
}

// ---------------------------------------------------------------- Code Quality
{
  const logs = addedLines.filter((l) => /\bconsole\.log\s*\(/.test(l.text) && !isComment(l.text));
  const dbg = addedLines.filter((l) => /^\s*debugger\s*;?\s*$/.test(l.text));
  add("Code Quality", logs.length ? WARN : PASS,
    logs.length ? `${logs.length} new console.log call(s) added` : "No new console.log calls",
    logs.length ? [...logs.map(loc), "Stripped from the production bundle by vite esbuild `pure`, but please remove."] : []);
  add("Code Quality", dbg.length ? FAIL : PASS,
    dbg.length ? `${dbg.length} new debugger statement(s) added` : "No new debugger statements", dbg.map(loc));

  const countMatches = (re, path) =>
    git("grep", "-c", "-E", re, "--", path).split("\n").filter(Boolean)
      .reduce((n, line) => n + Number(line.split(":").pop() || 0), 0);
  const totalLogs = countMatches("console\\.log\\(", "src");
  const dbgFiles = git("grep", "-n", "-E", "^\\s*debugger\\s*;?\\s*$", "--", "src").split("\n").filter(Boolean);
  add("Code Quality", INFO, `Tracked debt: ${totalLogs} console.log call(s) in src/`);
  add("Code Quality", dbgFiles.length ? WARN : PASS,
    dbgFiles.length ? `${dbgFiles.length} existing debugger statement(s) in src/` : "No debugger statements in src/",
    dbgFiles.map((d) => `\`${d.slice(0, 140)}\``));

  for (const [key, label] of [["LINT", "ESLint"], ["TYPECHECK", "TypeScript (tsc --noEmit)"]]) {
    const r = process.env[`READINESS_${key}`];
    add("Code Quality", r === "success" ? PASS : r === "failure" ? FAIL : INFO,
      `${label}: ${r || "not run (run in CI)"}`);
  }
  add("Code Quality", MANUAL, "Unused code / dead imports removed from changed files");
}

// ---------------------------------------------------------------- Build Verification
{
  const r = process.env.READINESS_BUILD;
  add("Build Verification", r === "success" ? PASS : r === "failure" ? FAIL : INFO,
    `Production build (npm run build): ${r || "not run (run in CI)"}`,
    r === "failure" ? ["**Critical** — a failing build cannot be deployed. See the workflow log."] : []);
}

// ---------------------------------------------------------------- Functionality / UI/UX (manual)
for (const t of [
  "Login / logout / session expiry work",
  "RBAC: every Add / Edit / View / bulk action is gated with useDynamicPermissions().shouldShow",
  "All changed API integrations return success and show errors (no silent failures)",
  "Forms validate and submit correctly",
  "Critical workflows of the touched module verified end-to-end",
]) add("Functionality", MANUAL, t);
for (const t of [
  "Responsive at mobile / tablet / desktop widths",
  "No cut-off content, broken layouts or pagination",
  "Images and icons load",
  "Checked on Chrome, Safari, Firefox and Edge",
]) add("UI/UX", MANUAL, t);

// ---------------------------------------------------------------- Security
{
  const SECRET_RES = [
    [/(api[_-]?key|secret|passw(or)?d|client[_-]?secret|access[_-]?token|auth[_-]?token)["']?\s*[:=]\s*["'`][^"'`\s${}]{6,}["'`]/i, "credential literal"],
    [/Bearer\s+[A-Za-z0-9._~+/-]{20,}/, "hardcoded Bearer token"],
    [/AKIA[0-9A-Z]{16}/, "AWS access key"],
    [/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, "JWT"],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
  ];
  const hits = [];
  for (const l of addedLines) {
    const m = SECRET_RES.find(([re]) => re.test(l.text));
    if (m) hits.push(`${m[1]}: \`${l.file}:${l.line}\``); // never echo the secret itself
  }
  add("Security", hits.length ? FAIL : PASS,
    hits.length ? `${hits.length} possible hardcoded credential(s)` : "No hardcoded credentials in added lines", hits);

  const envAdded = mergeBase
    ? git("diff", "--name-only", "--diff-filter=A", `${mergeBase}...HEAD`).split("\n")
        .filter((f) => /(^|\/)\.env(\.[\w-]+)?$/.test(f) && !/\.example$|\.sample$/.test(f))
    : [];
  add("Security", envAdded.length ? FAIL : PASS,
    envAdded.length ? "Environment file(s) committed" : "No .env files committed", envAdded.map((f) => `\`${f}\``));
  add("Security", MANUAL, "No dev-only flags, test users or debug panels enabled in production");
}

// ---------------------------------------------------------------- Testing
{
  const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
  const hasTest = Boolean(pkg.scripts?.test);
  const r = process.env.READINESS_TEST;
  if (!hasTest) add("Testing", WARN, "Unit tests: not configured (no `test` script in package.json)");
  else add("Testing", r === "success" ? PASS : r === "failure" ? FAIL : INFO, `Unit tests: ${r || "not run (run in CI)"}`);
  add("Testing", MANUAL, "Functional testing done by developer");
  add("Testing", MANUAL, "QA verification done on UAT");
}

// ---------------------------------------------------------------- Deployment Readiness
{
  const target = process.env.GITHUB_BASE_REF;
  if (target)
    add("Deployment Readiness", config.productionBranches.includes(target) ? PASS : WARN,
      `Target branch: \`${target}\``,
      config.productionBranches.includes(target) ? [] : [`Not a production branch (${config.productionBranches.join(", ")})`]);
  const headVer = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version;
  let baseVer = null;
  try { baseVer = JSON.parse(git("show", `${mergeBase || baseRef}:package.json`)).version; } catch { /* no base */ }
  add("Deployment Readiness", baseVer && baseVer === headVer ? WARN : PASS,
    `Release version: ${headVer}${baseVer ? ` (base: ${baseVer})` : ""}`,
    baseVer === headVer ? ["Bump `version` in package.json for this release."] : []);
  const lastTag = git("describe", "--tags", "--abbrev=0").trim();
  add("Deployment Readiness", lastTag ? PASS : WARN,
    lastTag ? `Rollback target: last release tag \`${lastTag}\`` : "No release tag found — nothing to roll back to",
    lastTag ? [] : ["Tag the current production commit, e.g. `git tag v1.0.0 && git push --tags`."]);
  add("Deployment Readiness", MANUAL, "Rollback plan written in the PR (previous tag / CodeDeploy revision)");
}

// ---------------------------------------------------------------- Final Approval
{
  const body = process.env.PR_BODY;
  for (const role of ["Developer", "QA", "Frontend Lead"]) {
    if (body === undefined) { add("Final Approval", MANUAL, `${role} sign-off`); continue; }
    const re = new RegExp(`- \\[( |x|X)\\]\\s*\\*\\*${role}\\*\\*`);
    const m = re.exec(body);
    add("Final Approval", m && m[1].toLowerCase() === "x" ? PASS : FAIL,
      `${role} sign-off ${m ? (m[1].toLowerCase() === "x" ? "ticked" : "not ticked") : "missing from PR description"}`);
  }
}

// ---------------------------------------------------------------- report
const all = Object.values(results).flat();
const count = (s) => all.filter((r) => r.status === s).length;
const sectionStatus = (items) =>
  items.some((i) => i.status === FAIL) ? FAIL : items.some((i) => i.status === WARN) ? WARN
    : items.every((i) => i.status === MANUAL) ? MANUAL : PASS;

if (args.includes("--json")) {
  process.stdout.write(JSON.stringify({ mode, baseRef, results }, null, 2));
} else {
  const MAX = 25;
  const checklistPath = "docs/deployment/PRODUCTION_CHECKLIST.md";
  const { GITHUB_SERVER_URL: gh, GITHUB_REPOSITORY: repo, GITHUB_SHA: sha } = process.env;
  const checklistLink = gh && repo ? `[${checklistPath}](${gh}/${repo}/blob/${sha || "HEAD"}/${checklistPath})` : `\`${checklistPath}\``;
  let md = `<!-- production-readiness-report -->\n## 🚦 Production Readiness Report\n\n`;
  md += `Mode: **${mode}**${mode === "report" ? " (results are informational, nothing is blocked)" : ""} · Base: \`${baseRef}\` · Checklist: ${checklistLink}\n\n`;
  md += `**${count(FAIL)}** failed · **${count(WARN)}** warnings · **${count(PASS)}** passed · **${count(MANUAL)}** manual items\n\n`;
  md += `| Section | Status |\n|---|---|\n`;
  for (const s of SECTIONS) md += `| ${s} | ${ICON[sectionStatus(results[s])]} |\n`;
  for (const s of SECTIONS) {
    md += `\n### ${ICON[sectionStatus(results[s])]} ${s}\n`;
    for (const r of results[s]) {
      md += `- ${ICON[r.status]} ${r.title}\n`;
      if (r.details.length) {
        const shown = r.details.slice(0, MAX);
        md += `  <details><summary>${r.details.length} detail(s)</summary>\n\n${shown.map((d) => `  - ${d}`).join("\n")}`;
        if (r.details.length > MAX) md += `\n  - …and ${r.details.length - MAX} more`;
        md += `\n\n  </details>\n`;
      }
    }
  }
  process.stdout.write(md);
  const out = argVal("--out");
  if (out) writeFileSync(out, md);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}

if (mode === "enforce" && count(FAIL) > 0) {
  console.error(`\nProduction readiness: ${count(FAIL)} check(s) failed (enforce mode).`);
  process.exit(1);
}
