# apolovyi.me — Project Config

## Workflow Rules

| Rule | Enforced |
|------|----------|
| Feature branches required | ✅ |
| PRs required (no direct main commits) | ✅ |
| Copilot code review | ✅ |
| Claude code review | ✅ |

## Branch Protection

Enable on GitHub:
- Require PR before merging
- Require review from Copilot
- Require review from Claude

## Deploy

- Vercel (auto-deploy from main)
- Preview deploys on PRs
