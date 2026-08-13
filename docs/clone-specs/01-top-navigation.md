# AWS Route 53 Top Navigation - Exact Spec

Extracted from live AWS console via getComputedStyle() on Aug 14, 2026.
Viewport: 1728x1080 (browser window), 1440 CSS px after DPR scaling.

## Container

```
nav.globalNav-222
  background: rgb(22, 29, 38)  /* #161d26 */
  height: 48px
  width: 100%
  display: block
  position: relative
  font-size: 14px
  font-weight: 400
```

## Layout (3 sections in a flex row)

```
[Left: 166px] [Center/Search: flex-grow] [Right: 440px]
```

### Left Section (166px wide)

Contains 4 items in a flex row:

1. **AWS Logo Link** (65px wide, 48px tall)
   - `<a>` tag, title="AWS Console Home"
   - padding: 0 16px
   - display: flex, align-items: center, justify-content: center
   - color: rgb(222, 222, 227) /* #dedee3 */
   - Contains SVG logo: 33x19px, viewBox="0 0 29 17"
   - SVG has 3 paths: "aws" text + smile arrow + arrow head
   - SVG fill color: rgb(222, 222, 227) (inherited via currentColor)

2. **Skip to Main Content** (hidden, 1x1px, accessibility only)

3. **Amazon Q Button** (50px wide, 48px tall)
   - `<button>` tag, title="Amazon Q"
   - border-radius: 20px (pill)
   - padding: 10px 12px
   - font-weight: 700
   - Contains a 24x24 SVG with gradient (Q icon)

4. **Services Button** (50px wide, 48px tall)
   - `<button>` tag, title="Services"
   - padding: 10px 16px
   - font-weight: 500
   - color: rgb(222, 222, 227)
   - Contains 16x16 SVG: 4x4 grid of rounded squares (viewBox="0 0 16 16")
   - SVG: `<rect width="4" height="4" rx="1" fill="currentColor">` repeated in grid

### Center Section (Search, flex-grow)

Contains the search bar:

- **Search container**: 540px wide, 48px tall, position: relative, display: flex, align-items: center

- **Search icon**: 16x16px, position: absolute, left: 12px (x=178 relative to nav), color: rgb(198, 198, 205)
  - SVG: `<path d="m11 11 4 4M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z">` (magnifying glass)

- **Search input**: 540px wide, 30px tall
  - type: search, placeholder: "Search"
  - background: rgb(15, 20, 26) /* #0f141a */
  - color: rgb(235, 235, 240) /* #ebebf0 */
  - font-size: 14px, font-weight: 400
  - border-radius: 8px
  - border: 2px solid rgb(101, 104, 113) /* #656871 */
  - padding: 1px 83px 1px 35px (right padding for Option+S hint + button)
  - position: relative

- **[Option+S] hint**: 70px wide, 16px tall
  - position: absolute, right side of input
  - color: rgb(164, 164, 173) /* #a4a4ad */
  - font-size: 14px

- **Search button**: 30px wide, 24px tall
  - position: absolute, right: 10px
  - background: rgb(15, 20, 26)
  - color: rgb(198, 198, 205)
  - border-radius: 4px
  - font-weight: 600
  - Contains 16x16 SVG (same magnifying glass path)

### Right Section (440px wide)

Contains 5 items:

1. **CloudShell Link** (48px wide, 48px tall)
   - `<a>` tag, title="CloudShell"
   - padding: 0 16px, display: flex, align-items: center, justify-content: center
   - color: rgb(222, 222, 227)
   - 16x16 SVG: terminal icon
   - SVG: `<path d="M5 5l2.997 2.998L5 11m4.997-.002H12m3-7.626A2.374 2.374 0 0012.627 1H3.37A2.372 2.372 0 001 3.372v9.256a2.373 2.373 0 002.37 2.373h9.257A2.375 2.375 0 0015 12.628V3.372z" stroke="currentColor" stroke-width="2" fill="none">`

2. **Notifications Bell** (50px wide, 48px tall)
   - `<div>` wrapper, title="Notifications"
   - color: rgb(222, 222, 227)
   - 16x16 SVG: bell icon
   - SVG: `<path d="M14 12H2c-.39 0-.63-.44-.41-.76L4 8V5c0-2.21 1.79-4 4-4s4 1.79 4 4v3l2.41 3.24c.22.33-.02.76-.41.76ZM6 13c0 1.1.9 2 2 2s2-.9 2-2">`

3. **Help & Support Button** (50px wide, 48px tall)
   - `<button>` tag, title="Help & support"
   - padding: 10px 16px
   - color: rgb(222, 222, 227)
   - font-size: 12px, font-weight: 500
   - 16x16 SVG: question mark in circle
   - SVG: `<circle cx="8" cy="8" r="7"><path d="M5.75 6.338c.13-1.178.811-2.339 2.37-2.339 1.472 0 2.435 1.312 2.042 2.468-.215.633-.916 1.132-1.385 1.578C8.162 8.631 8 9.2 8 10"><path d="M8 12.01h.01V12H8v.01Z" class="filled">`

4. **Settings Button** (50px wide, 48px tall)
   - `<button>` tag, title="Settings"
   - padding: 10px 16px
   - color: rgb(222, 222, 227)
   - font-size: 12px, font-weight: 500
   - 16x16 SVG: gear icon (complex path)

5. **Region Dropdown** (86px wide, 48px tall)
   - `<button>` tag, title="Global", text="Global"
   - padding: 10px 16px
   - color: rgb(222, 222, 227)
   - font-size: 12px, font-weight: 500
   - Contains chevron-down SVG: `<path d="M12 1L5 8l7 7">`

6. **User Menu** (156px wide, 48px tall)
   - `<button>` tag, title="{username}"
   - text: "{username} ({account_id})" e.g. "sak (888577037798)"
   - color: rgb(222, 222, 227)
   - font-size: 12px, font-weight: 500
   - Contains chevron-down SVG (12x12): `<path d="M4 11h8L8 5l-4 6z">`

## Key Colors

| Token | Value | Usage |
|-------|-------|-------|
| Top nav bg | #161d26 | rgb(22, 29, 38) |
| Icon/text light | #dedee3 | rgb(222, 222, 227) |
| Search input bg | #0f141a | rgb(15, 20, 26) |
| Search input text | #ebebf0 | rgb(235, 235, 240) |
| Search input border | #656871 | rgb(101, 104, 113) |
| Search icon color | #c6c6cd | rgb(198, 198, 205) |
| Option+S hint | #a4a4ad | rgb(164, 164, 173) |

## SVG Icons (exact paths)

### AWS Logo (33x19, viewBox="0 0 29 17")
3 paths: "aws" wordmark + smile + arrow. See aws-logo-white.svg in public/assets/.

### Services Grid (16x16, viewBox="0 0 16 16")
```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <rect width="4" height="4" rx="1" fill="currentColor"/>
  <rect y="6" width="4" height="4" rx="1" fill="currentColor"/>
  <rect y="12" width="4" height="4" rx="1" fill="currentColor"/>
  <rect x="6" width="4" height="4" rx="1" fill="currentColor"/>
  <rect x="6" y="6" width="4" height="4" rx="1" fill="currentColor"/>
  <rect x="6" y="12" width="4" height="4" rx="1" fill="currentColor"/>
  <rect x="12" width="4" height="4" rx="1" fill="currentColor"/>
  <rect x="12" y="6" width="4" height="4" rx="1" fill="currentColor"/>
  <rect x="12" y="12" width="4" height="4" rx="1" fill="currentColor"/>
</svg>
```

### Search/Magnifying Glass (16x16, viewBox="0 0 16 16")
```svg
<svg viewBox="0 0 16 16">
  <path d="m11 11 4 4M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z" class="stroke-linejoin-round"/>
</svg>
```

### CloudShell/Terminal (16x16, viewBox="0 0 16 16")
```svg
<svg width="16" height="16" viewBox="0 0 16 16">
  <path d="M5 5l2.997 2.998L5 11m4.997-.002H12m3-7.626A2.374 2.374 0 0012.627 1H3.37A2.372 2.372 0 001 3.372v9.256a2.373 2.373 0 002.37 2.373h9.257A2.375 2.375 0 0015 12.628V3.372z" stroke="currentColor" stroke-width="2" stroke-miterlimit="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
```

### Notifications/Bell (16x16, viewBox="0 0 16 16")
```svg
<svg viewBox="0 0 16 16">
  <path d="M14 12H2c-.39 0-.63-.44-.41-.76L4 8V5c0-2.21 1.79-4 4-4s4 1.79 4 4v3l2.41 3.24c.22.33-.02.76-.41.76ZM6 13c0 1.1.9 2 2 2s2-.9 2-2" class="stroke-linejoin-round"/>
</svg>
```

### Help/Question (16x16, viewBox="0 0 16 16")
```svg
<svg viewBox="0 0 16 16">
  <circle cx="8" cy="8" r="7"/>
  <path d="M5.75 6.338c.13-1.178.811-2.339 2.37-2.339 1.472 0 2.435 1.312 2.042 2.468-.215.633-.916 1.132-1.385 1.578C8.162 8.631 8 9.2 8 10"/>
  <path d="M8 12.01h.01V12H8v.01Z" class="filled"/>
</svg>
```

### Settings/Gear (16x16, viewBox="0 0 16 16")
Complex gear path - see extracted HTML in raw data.

### Chevron Down (12x12, viewBox="0 0 16 16")
```svg
<svg viewBox="0 0 16 16">
  <path d="M4 11h8L8 5l-4 6z"/>
</svg>
```

### Region Chevron (16x16, viewBox="0 0 16 16")
```svg
<svg viewBox="0 0 16 16">
  <path d="M12 1L5 8l7 7"/>
</svg>
```

## Important Notes

- **NO theme toggle button** exists in the AWS top navigation.
- The search input has a dark background (#0f141a) even in light mode, because the top nav itself is always dark.
- The Amazon Q button has a gradient icon (24x24) with a pill-shaped border-radius (20px).
- All right-side buttons use font-size: 12px (smaller than the 14px body text).
- The user menu shows "username (account_id)" with a chevron-down icon.
