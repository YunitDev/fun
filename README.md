# yunitdev/fun

Public fun tools and experiments by Phillip Aubrey.

## Live URL
https://yunitdev.github.io/fun/

## Tools

### Type like Phillip
**URL:** https://yunitdev.github.io/fun/type-like-phillip.html

A text transformation tool that converts formal language into casual, authentic "Phillip-style" communication.

**Features:**
- Pattern-based text replacement (contractions, slang, rewrites)
- Real-time character counting
- Keyboard shortcut: Cmd/Ctrl + Enter to transform
- Copy-to-clipboard with visual feedback
- Dark theme with neon green accents

**Example:**
```
Input:  "I apologize for the delay. I will let you know when it's ready."
Output: "my bad on the delay. ill lmk when its ready"
```

### Compound Calculator
**URL:** https://yunitdev.github.io/fun/compound

Wealth calculator that shows how much money you can make from investing. Used in Benson app share links.

**Features:**
- Age and weekly investment input
- Risk level selection (low/normal/high)
- Projected wealth visualization
- Multi-step form with name/phone collection
- Benson app download CTA

---

## File Structure

```
fun/
├── type-like-phillip.html    # Text transformation tool
├── live-notifications.html   # Live notification display
├── compound/                 # Wealth calculator (folder-based for clean URL)
│   ├── index.html
│   ├── assets/
│   ├── scripts/
│   └── styles/
└── README.md                 # This file
```

## Adding New Tools

### Naming Convention (Required)

**Every tool must have a descriptive filename. No `index.html` files.**

| Good | Bad |
|------|-----|
| `type-like-phillip.html` | `index.html` |
| `live-notifications.html` | `tool.html` |
| `word-counter.html` | `new.html` |

**Rules:**
- Lowercase only
- Hyphen-separated words
- Descriptive name that explains what the tool does
- `.html` extension

**URL pattern:** `https://yunitdev.github.io/fun/[tool-name].html`

### Quick Start
```bash
cd /Users/phillipaubrey/fun-repo
# Create your new tool with descriptive name
cp type-like-phillip.html my-new-tool.html
# Edit my-new-tool.html
git add . && git commit -m "Add my-new-tool" && git push
# Live at: https://yunitdev.github.io/fun/my-new-tool.html
```

### Step-by-Step

1. **Create the file**
   - Name it descriptively: `[what-it-does].html`
   - Use `type-like-phillip.html` as a template if helpful

2. **Follow the design system**
   - Background: `#0a0a0a` (dark)
   - Accent: `#00ff88` (neon green)
   - Font: Space Mono or system monospace
   - Keep it single-file (HTML + embedded CSS/JS)

3. **Update this README**
   - Add your tool under the "Tools" section
   - Include: name, URL, description, features

4. **Deploy**
   ```bash
   git add . && git commit -m "Add [tool-name]" && git push
   ```
   GitHub Pages auto-deploys within ~1 minute.

### File Organization
- Simple tools: Single HTML file in root (e.g., `my-tool.html`)
- Tools with assets: Create a folder with descriptive name (e.g., `my-tool/my-tool.html`, `my-tool/assets/`)

### Template Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tool Name</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Space Mono', monospace;
      background: #0a0a0a;
      color: #fff;
      min-height: 100vh;
    }
    /* Accent color: #00ff88 */
  </style>
</head>
<body>
  <!-- Your tool here -->
  <script>
    // Your JS here
  </script>
</body>
</html>
```

## Tech Stack
- HTML5
- CSS3 (with CSS variables for theming)
- Vanilla JavaScript (no frameworks)
- Hosted via GitHub Pages

## Related Repos
- [personal-website](https://github.com/yunitdev/personal-website) - phillipaubrey.com
- [compound-calculator](https://github.com/yunitdev/compound-calculator) - Wealth calculator lead-gen tool
- [benson-live-notifications](https://github.com/yunitdev/benson-live-notifications) - Live notification system

## Contact
Phillip Aubrey - [phillipaubrey.com](https://phillipaubrey.com)
