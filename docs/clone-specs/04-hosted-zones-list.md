# AWS Route 53 Hosted Zones List Page - Exact Spec

Extracted from live AWS console via getComputedStyle() on Aug 14, 2026.

## Page Header

```
h1
  text: "Hosted zones (N)" where N = count (e.g. "Hosted zones (0)")
  font-size: 24px
  font-weight: 400
  color: rgb(15, 20, 26) /* #0f141a */
  line-height: 30px
  position: x=305, y=103 (in content area, after sidebar)
```

## Action Buttons (right side of header, in order)

All buttons are 32px tall, border-radius: 20px (pill), font-size: 14px, font-weight: 700.

1. **Refresh hosted zones** (icon button)
   - width: 32px, height: 32px
   - background: rgb(255, 255, 255) /* #ffffff */
   - color: rgb(0, 108, 224) /* #006ce0 */
   - border: 2px solid rgb(0, 108, 224)
   - padding: 4px 6px
   - Contains refresh icon SVG

2. **View details** (disabled when nothing selected)
   - width: 125px
   - background: rgb(255, 255, 255)
   - color: rgb(140, 140, 148) /* #8c8c94 - disabled gray */
   - border: 2px solid rgb(180, 180, 187) /* #b4b4bb - disabled border */
   - padding: 4px 20px

3. **Edit** (disabled when nothing selected)
   - width: 70px
   - Same disabled style as View details

4. **Delete** (disabled when nothing selected)
   - width: 87px
   - Same disabled style as View details

5. **Create hosted zone** (primary button, always enabled)
   - width: 171px
   - background: rgb(255, 153, 0) /* #ff9900 - AWS orange */
   - color: rgb(15, 20, 26) /* #0f141a - dark text */
   - border: 2px solid rgb(255, 153, 0)
   - padding: 4px 20px

## Search/Filter Bar

- **Automatic mode text**: "Automatic mode is the current search behavior optimized for best filter results. To change modes go to settings."
  - font-size: 14px
  - color: rgb(66, 70, 80) /* #424650 */

- **Search input**: (uses Cloudscape combobox)
  - width: 540px, height: 30px (when in content area, not top nav)
  - placeholder: "Filter records by property or value" (on records page)
  - border-radius: 8px

- **Pagination**: 76px wide, 34px tall (Previous | Page 1 | Next)

- **Preferences button**: 28x32px, icon button, title="Preferences"

## Table

```
table
  width: 1399px (content width)
  background: rgb(252, 252, 253) /* #fcfcfd */
```

### Table Header Cells

All th: font-size: 14px, font-weight: 700, color: rgb(66, 70, 80), background: rgb(252, 252, 253).

| # | Column | Width | Padding |
|---|--------|-------|---------|
| 1 | selection (checkbox) | 40px | 8px 20px 8px 2px |
| 2 | Hosted zone name | 250px | 4px 8px |
| 3 | Type | 222px | 4px 8px |
| 4 | Created by | 222px | 4px 8px |
| 5 | Record count | 222px | 4px 8px |
| 6 | Description | 222px | 4px 8px |
| 7 | Hosted zone ID | 222px | 4px 8px |

## Empty State

When count is 0:
- Title: "No hosted zones"
- Text: "There are no hosted zones created for this account."
- Button: "Create hosted zone" (primary, orange)

## Key Colors

| Token | Value | Usage |
|-------|-------|-------|
| H1 text | #0f141a | rgb(15, 20, 26) |
| Button primary bg | #ff9900 | rgb(255, 153, 0) |
| Button primary text | #0f141a | rgb(15, 20, 26) |
| Button normal bg | #ffffff | rgb(255, 255, 255) |
| Button normal border (active) | #006ce0 | rgb(0, 108, 224) |
| Button normal text (active) | #006ce0 | rgb(0, 108, 224) |
| Button disabled text | #8c8c94 | rgb(140, 140, 148) |
| Button disabled border | #b4b4bb | rgb(180, 180, 187) |
| Table header text | #424650 | rgb(66, 70, 80) |
| Table bg | #fcfcfd | rgb(252, 252, 253) |
| Body text | #424650 | rgb(66, 70, 80) |
