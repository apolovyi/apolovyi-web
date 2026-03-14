# Page Generator

The user will describe a product they want a web page for.
Extract or infer the following from their description and output
the filled template exactly as shown below.

- **PROJECT_NAME** — the product name
- **PRODUCT_DESCRIPTION** — write this as a brief product pitch:
  first sentence = what it is, next = who it's for and why they
  care, then key features/differentiators, pricing if mentioned.
  Write it the way a founder would explain it in 30 seconds.
- **TARGET_AUDIENCE** — describe them as a person, not a demographic.
  What do they do, what frustrates them, what are they looking for.
  e.g. "Freelance designers tired of juggling 5 different AI tools"
- **BRAND_PERSONALITY** — pick 2-3 adjectives that capture the vibe,
  then one sentence explaining what the brand would feel like if it
  were a person. Infer from context if not stated.
  e.g. "Bold, playful, confident — like a friend who's way too good
  at everything but never brags about it"
- **PAGE_TYPE** — what kind of page to build. Infer from context.
  e.g. "Marketing landing page", "Coming soon / waitlist page",
  "Product launch page", "App download page", "SaaS pricing page"
- **EXTRA_SECTIONS** — any sections the user specifically mentioned
  that go beyond what the page type normally includes. Leave empty
  if none.

## Output format

```
# Page Generator

## Product
**{PROJECT_NAME}** — {PRODUCT_DESCRIPTION}
**Audience:** {TARGET_AUDIENCE}
**Personality:** {BRAND_PERSONALITY}

## Page Type
{PAGE_TYPE}
{EXTRA_SECTIONS}

## Task
Initialize the project, then build 5 variants. Host on /1, /2, /3, /4, /5.
Each variant: completely different aesthetic — as if a different
designer made each one. Push the limits of your design capabilities.
Fully responsive. No external images — use SVGs, CSS, gradients.

## Tech Stack (fixed)
Vite, React, TypeScript, Tailwind CSS, pnpm, port 4000

## Setup
Initialize the project in the current directory, install dependencies,
set up routing, then build all variants one at a time.
```

Output ONLY the filled template. Nothing else.
