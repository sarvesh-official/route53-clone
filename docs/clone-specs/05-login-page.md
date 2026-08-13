# AWS Route 53 Login Page - Exact Spec

Extracted from live AWS sign-in page via getComputedStyle() on Aug 14, 2026.

## Page Body

```
body.awsui-visual-refresh
  background: rgb(250, 250, 250) /* #fafafa */
  background-image: url("background-left.png"), url("background-right.png")
  color: rgb(0, 0, 0)
  font-size: 16px (body default, but form elements use 14px)
  font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif
  width: 100%
```

The background images are decorative PNGs (474x638 left, 458x596 right) positioned at the edges.

## Layout

Two-column horizontal split:
- Left: Login form container (340px wide, centered vertically)
- Right: Marketing image (570x450px)

## AWS Logo

```
a (logo link)
  width: 84px, height: 51px (display size)
  position: top-center of form area
  contains img: 168x102 natural (2x retina), displayed at 84x51
  alt: "Amazon Web Services logo"
  href: https://aws.amazon.com/
```

## Login Form

```
form / form container
  width: 340px
  background: transparent (no card, no shadow, no border, no radius)
  padding: 0
  position: centered in left column
```

### Account Type Tiles (Root user / IAM user)

Two radio tiles, 298px wide, 74px tall each:

**Selected tile (Root user):**
```
background: rgb(240, 251, 255) /* #f0fbff - light blue */
border: 1px solid rgb(0, 108, 224) /* #006ce0 - blue */
border-radius: 8px
padding: 8px 12px 12px
```

**Unselected tile (IAM user):**
```
background: rgb(255, 255, 255) /* #ffffff */
border: 1px solid rgb(140, 140, 148) /* #8c8c94 - gray */
border-radius: 8px
padding: 8px 12px 12px
```

Each tile contains:
- Radio input (16x16, hidden native style)
- Title text (e.g. "Root user", "IAM user") - 14px, 400 weight
- Description text (e.g. "Account owner that performs tasks requiring...") - 14px, 400, gray

### Email Input

```
input[type=email]
  width: 298px
  height: 32px
  background: rgb(255, 255, 255) /* #ffffff */
  color: rgb(15, 20, 26) /* #0f141a */
  font-size: 14px
  font-weight: 400
  border-radius: 8px
  border: 1px solid rgb(0, 108, 224) /* #006ce0 - blue (focused) */
  padding: 5px 12px
  placeholder: "username@example.com"
```

### Email Label

```
label
  font-size: 14px
  font-weight: 700
  color: rgb(15, 20, 26) /* #0f141a */
  text: "Email address"
```

### Primary Button (Next / Sign in)

```
button (primary)
  width: 298px (full form width)
  height: 32px
  background: rgb(255, 153, 0) /* #ff9900 - AWS orange */
  color: rgb(15, 20, 26) /* #0f141a - dark text */
  font-size: 14px
  font-weight: 700
  border-radius: 20px (pill)
  border: 2px solid rgb(255, 153, 0)
  padding: 4px 20px
  text: "Next" (first step) or "Sign in" (password step)
```

### Secondary Button (Sign up)

```
button (secondary)
  width: 298px
  height: 32px
  background: rgb(255, 255, 255) /* #ffffff */
  color: rgb(0, 108, 224) /* #006ce0 - blue */
  font-size: 14px
  font-weight: 700
  border-radius: 20px (pill)
  border: 2px solid rgb(0, 108, 224)
  padding: 4px 20px
  text: "New to AWS? Sign up"
```

### Password Input (step 2)

Same styling as email input but type=password.
Includes "Show password" checkbox below.

### Links

```
a
  color: rgb(0, 108, 224) /* #006ce0 - blue */
  text-decoration: underline
  font-size: 14px (form links) or 12px (legal links)
```

Legal footer links (12px): AWS Customer Agreement, Privacy Notice, Cookie Notice

## Marketing Image (Right Side)

```
div[data-testid="marketing_image_container"]
  width: 570px
  height: 450px

img[alt="Amazon Web Services Marketing"]
  width: 570px
  height: 450px
  fetchpriority: high
```

### Dynamic Image Rotation

AWS serves different marketing images via server-side targeting.
The image URL is injected as JSON in `MetaDataValues.marketingTargetedContent`
with a `signin-banner.content.image_url` field.

Images rotate based on:
- A/B testing campaigns
- Account type (Root vs IAM)
- Region/locale
- Session targeting
- Time-based campaigns

We have 9 marketing images (all 570x450px) in `/public/assets/marketing/`:
- aws-marketing-01.png through aws-marketing-09.jpeg

Our clone rotates through these randomly on each page load to simulate
the dynamic behavior.

## Background Images

```
body background-image:
  url("aws-bg-left.png")   - 474x638px, left edge decoration
  url("aws-bg-right.png")  - 458x596px, right edge decoration
```

Files saved at: `/public/assets/aws-bg-left.png` and `/public/assets/aws-bg-right.png`

## Key Colors

| Token | Value | Usage |
|-------|-------|-------|
| Page bg | #fafafa | rgb(250, 250, 250) |
| Form bg | transparent | No card |
| Input bg | #ffffff | rgb(255, 255, 255) |
| Input border (focus) | #006ce0 | rgb(0, 108, 224) |
| Input border (default) | #8c8c94 | rgb(140, 140, 148) |
| Input text | #0f141a | rgb(15, 20, 26) |
| Label text | #0f141a | rgb(15, 20, 26) |
| Primary button bg | #ff9900 | rgb(255, 153, 0) |
| Primary button text | #0f141a | rgb(15, 20, 26) |
| Secondary button bg | #ffffff | rgb(255, 255, 255) |
| Secondary button border | #006ce0 | rgb(0, 108, 224) |
| Secondary button text | #006ce0 | rgb(0, 108, 224) |
| Link | #006ce0 | rgb(0, 108, 224) |
| Tile selected bg | #f0fbff | rgb(240, 251, 255) |
| Tile selected border | #006ce0 | rgb(0, 108, 224) |
| Tile unselected bg | #ffffff | rgb(255, 255, 255) |
| Tile unselected border | #8c8c94 | rgb(140, 140, 148) |

## Dimensions Summary

| Element | Width | Height |
|---------|-------|--------|
| Form | 340px | auto |
| Inputs | 298px | 32px |
| Buttons | 298px | 32px |
| Tiles | 298px | 74px |
| Logo | 84px | 51px |
| Marketing image | 570px | 450px |
| BG left | 474px | 638px |
| BG right | 458px | 596px |
| Input border-radius | 8px | - |
| Button border-radius | 20px (pill) | - |
| Input padding | 5px 12px | - |
| Button padding | 4px 20px | - |
