# Code Quality & Pre-commit Setup

This project is configured with **ESLint**, **Prettier**, and **Husky** to maintain code quality and enforce pre-commit hygiene.

---

## 🛠️ Tools Installed

### ✅ ESLint (v9.9.0)

- Lints TypeScript and JavaScript files
- Integrated with React hooks rules
- Configured with TypeScript ESLint parser

### ✅ Prettier (Latest)

- Auto-formats code for consistent style
- Integrated with ESLint to avoid conflicts
- Configured for 80-char line width, 2-space tabs, semicolons

### ✅ Husky (Latest)

- Git hooks manager
- Runs checks before commits
- Enforces code quality at commit time

### ✅ lint-staged (Latest)

- Runs linters on staged files only
- Improves performance by checking only changed files

---

## 📜 Available Scripts

### Linting

```bash
# Run ESLint on all files
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix
```

### Formatting

```bash
# Format all files with Prettier
npm run format

# Check if files are formatted (without changing them)
npm run format:check
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🚀 How It Works

### Pre-commit Hook

When you commit code, Husky automatically:

1. ✅ Runs ESLint on staged `.ts`, `.tsx`, `.js`, `.jsx` files
2. ✅ Auto-fixes ESLint issues where possible
3. ✅ Formats code with Prettier
4. ✅ Formats JSON, CSS, SCSS, and MD files
5. ❌ Blocks commit if there are unfixable errors

### What Gets Checked

- **Staged files only** (not the entire codebase)
- TypeScript/JavaScript syntax and style
- React hooks usage
- Code formatting consistency

---

## 🎯 Configuration Files

| File                | Purpose                              |
| ------------------- | ------------------------------------ |
| `eslint.config.js`  | ESLint rules and settings            |
| `.prettierrc`       | Prettier formatting rules            |
| `.prettierignore`   | Files to ignore during formatting    |
| `.husky/pre-commit` | Pre-commit hook script               |
| `.husky/commit-msg` | Commit message validation (optional) |

---

## 💡 Best Practices

### 1. **Run linting before committing**

```bash
npm run lint:fix
```

### 2. **Format code regularly**

```bash
npm run format
```

### 3. **Check formatting in CI/CD**

```bash
npm run format:check
```

### 4. **IDE Integration**

Install ESLint and Prettier extensions in VS Code:

- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

Enable format on save in VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 🔧 Customization

### ESLint Rules

Edit `eslint.config.js` to modify rules:

```javascript
rules: {
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "@typescript-eslint/no-explicit-any": "warn",
  // Add your custom rules here
}
```

### Prettier Settings

Edit `.prettierrc` to change formatting:

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Conventional Commits (Optional)

Uncomment lines in `.husky/commit-msg` to enforce commit message format:

- ✅ `feat: add new feature`
- ✅ `fix: resolve bug`
- ✅ `docs: update README`
- ❌ `random commit message`

---

## 🐛 Troubleshooting

### Hook not running?

```bash
# Reinstall Husky
npm run prepare
chmod +x .husky/pre-commit
```

### ESLint errors on commit?

```bash
# Fix automatically
npm run lint:fix

# Or fix manually and commit again
```

### Skip hooks (NOT RECOMMENDED)

```bash
git commit --no-verify -m "message"
```

---

## 📚 Learn More

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)

---

**✨ Happy coding with clean, consistent code!**
