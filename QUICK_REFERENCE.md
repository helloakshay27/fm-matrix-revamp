# 🚀 Quick Reference - Code Quality Tools

## 📝 Daily Commands

```bash
# Before committing
npm run lint:fix          # Fix linting issues
npm run format            # Format code

# Check status
npm run lint              # See all linting issues
npm run format:check      # Check if formatted

# Development
npm run dev               # Start dev server
npm run build             # Build for production
```

---

## 🎯 What Happens on Commit

```
git commit -m "message"
         ↓
    Husky runs
         ↓
   lint-staged
         ↓
  ┌─────────────┐
  │  ESLint     │ → Fix issues
  │  Prettier   │ → Format code
  └─────────────┘
         ↓
  ✅ Success → Commit goes through
  ❌ Errors  → Commit blocked (fix and try again)
```

---

## 🛠️ Tools Installed

| Tool            | Purpose             | Status        |
| --------------- | ------------------- | ------------- |
| **ESLint**      | Code linting        | ✅ Configured |
| **Prettier**    | Code formatting     | ✅ Configured |
| **Husky**       | Git hooks           | ✅ Configured |
| **lint-staged** | Staged files linter | ✅ Configured |

---

## 📁 Key Files

```
.prettierrc           → Prettier config
.prettierignore       → Files to skip
eslint.config.js      → ESLint rules
.husky/pre-commit     → Pre-commit hook
.vscode/settings.json → IDE settings
```

---

## 🔥 Quick Fixes

### Skip hooks (emergency only)

```bash
git commit --no-verify -m "message"
```

### Reinstall hooks

```bash
npm run prepare
chmod +x .husky/pre-commit
```

### Fix all auto-fixable issues

```bash
npm run lint:fix
```

---

## ⚙️ VS Code Setup

1. Install recommended extensions (notification will appear)
2. Format on save is enabled automatically
3. ESLint auto-fix on save is enabled

---

## 📊 Current Rules

### Errors (block commits):

- TypeScript syntax errors
- React hooks violations

### Warnings (don't block):

- `console.log` statements
- `any` type usage
- Missing hook dependencies

---

**💡 Tip**: Read `SETUP_SUMMARY.md` for detailed info!
