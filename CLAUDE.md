# Claude Instructions for Fun Repo

## Repository Purpose
Public fun tools and experiments hosted at https://yunitdev.github.io/fun/

## Critical Rules

### 1. Update README on Every Change
**After ANY file change in this repo, you MUST update README.md:**

- **Adding a tool:** Add entry under "## Tools" section with name, URL, description, features
- **Removing a tool:** Remove its entry from "## Tools" and "## File Structure"
- **Renaming a tool:** Update all references (URL, file structure, any mentions)
- **Changing functionality:** Update the tool's description/features in README

### 2. File Naming Convention
**Every tool MUST have a descriptive filename. No `index.html` files.**

```
Good: type-like-phillip.html, live-notifications.html, word-counter.html
Bad:  index.html, tool.html, new.html, test.html
```

Rules:
- Lowercase only
- Hyphen-separated words
- Descriptive name that explains what the tool does
- `.html` extension

**Exception:** `compound/` uses folder structure (`compound/index.html`) for clean URL compatibility with Benson app share links. This is the ONLY exception.

### 3. File Structure Section
Keep the "## File Structure" section in README.md accurate. Format:
```
fun/
├── tool-name.html    # Brief description
├── another-tool.html # Brief description
└── README.md
```

### 4. Design System
All tools should follow:
- Background: `#0a0a0a` (dark)
- Accent: `#00ff88` (neon green)
- Font: Space Mono or system monospace
- Single-file preferred (HTML + embedded CSS/JS)

### 5. Deploy Process
```bash
cd /Users/phillipaubrey/fun-repo
git add .
git commit -m "descriptive message"
git push
# GitHub Pages auto-deploys within ~1 minute
```

## README Update Checklist

Before committing, verify README.md includes:
- [ ] Tool listed under "## Tools" with correct URL
- [ ] Tool listed in "## File Structure"
- [ ] URL follows pattern: `https://yunitdev.github.io/fun/[tool-name].html`
- [ ] Description accurately reflects current functionality

## Related Repos (Do Not Modify From Here)
- `compound-calculator` - Separate repo, do not reference assets here
- `benson-playbook` - Private, internal docs
- `personal-website` - phillipaubrey.com
