# Git Hooks & Commit Standards

This project uses Husky for Git hooks and lint-staged for pre-commit checks.

## Pre-commit Hook

Before each commit, the following checks run automatically:

| File Type      | Checks                |
| -------------- | --------------------- |
| `*.ts, *.tsx`  | ESLint fix + Prettier |
| `*.json, *.md` | Prettier              |

## Commit Message Format

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                     |
| ---------- | ------------------------------- |
| `feat`     | New feature                     |
| `fix`      | Bug fix                         |
| `docs`     | Documentation changes           |
| `style`    | Code style changes (formatting) |
| `update`   | Dependency or minor updates     |
| `refactor` | Code refactoring                |
| `test`     | Adding or updating tests        |
| `chore`    | Maintenance tasks               |
| `perf`     | Performance improvements        |
| `ci`       | CI/CD changes                   |
| `build`    | Build system changes            |
| `revert`   | Reverting previous commit       |

### Examples

```bash
# Good
feat(api-gateway): add user authentication endpoint
fix(user-service): resolve login validation issue
docs(readme): update getting started guide
refactor(resume-service): extract PDF generation to separate module

# Bad - will be rejected
added new feature
Fixed bug
WIP
```

## Branch Naming

```text
feature/<feature-name>
fix/<bug-description>
refactor/<area>
docs/<topic>
chore/<task>
```

## Setup (Already Done)

If you need to reinitialize hooks after cloning:

```bash
pnpm install  # Husky auto-installs via prepare script
```
