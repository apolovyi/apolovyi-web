# apolovyi.me Project Configuration

## Workflow Rules

| Rule                                  | Enforced |
| ------------------------------------- | -------- |
| Feature branches required             | ✅       |
| PRs required (no direct main commits) | ✅       |
| Copilot code review                   | ✅       |
| Claude code review                    | ✅       |

## Branch Protection

Enable on GitHub:

- Require PR before merging
- Require review from Copilot
- Require review from Claude

## Deploy

- Netlify (production, auto-deploy from main)
- Vercel (internal backup)
- Preview deploys on PRs
