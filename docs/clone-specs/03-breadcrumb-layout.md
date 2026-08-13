# AWS Route 53 Breadcrumb Bar & Layout - Exact Spec

Extracted from live AWS console via getComputedStyle() on Aug 14, 2026.

## Layout Structure

```
[Top Nav: 52px (48px + 4px offset)]
[Toolbar/Breadcrumb bar: 42px]
[Side Nav: 280px wide] [Content area: rest]
```

## Layout Root

```
div.awsui_root_7nfqu
  background: rgb(252, 252, 253) /* #fcfcfd */
  width: 100%
```

## Toolbar Container

```
div.awsui_toolbar-container
  width: 100%
  height: 42px (was 41px at 1440px width, 42px at 1728px)
  background: rgb(255, 255, 255) /* #ffffff */
```

## Breadcrumb Group

```
nav.awsui_breadcrumb-group
  width: 1246px (content width)
  height: 28px
  background: transparent
  color: rgb(15, 20, 26) /* #0f141a */
  font-size: 14px
  padding: 4px 0
```

### Breadcrumb items

- **Link items** (clickable, parent pages):
  - color: rgb(0, 108, 224) /* #006ce0 - blue */
  - font-weight: 400
  - font-size: 14px
  - Example: "Route 53" -> /route53/v2/home#Home

- **Separator** (chevron between items):
  - width: 16px, height: 20px
  - color: rgb(140, 140, 148) /* #8c8c94 */
  - Contains chevron-right SVG

- **Current page** (last item, not clickable):
  - color: rgb(101, 104, 113) /* #656871 */
  - font-weight: 700
  - font-size: 14px
  - Example: "Dashboard"

### Breadcrumb pattern

```
Route 53 > [Page name]
Route 53 > Hosted zones
Route 53 > Hosted zones > [Zone name]
Route 53 > Hosted zones > Create hosted zone
```

## Help button (right side of toolbar)

```
button
  title: "Open help panel"
  position: right side of toolbar
```

## Content Area

```
Main content area
  background: rgb(252, 252, 253) /* #fcfcfd - very light gray */
  starts at x=280 (after sidebar), y=136 (after top nav + toolbar)
```

## Key Colors

| Token | Value | Usage |
|-------|-------|-------|
| Layout bg | #fcfcfd | rgb(252, 252, 253) |
| Toolbar bg | #ffffff | rgb(255, 255, 255) |
| Breadcrumb link | #006ce0 | rgb(0, 108, 224) |
| Breadcrumb current | #656871 | rgb(101, 104, 113) |
| Breadcrumb separator | #8c8c94 | rgb(140, 140, 148) |
