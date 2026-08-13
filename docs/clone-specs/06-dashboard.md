# AWS Route 53 Dashboard Page - Exact Spec

Extracted from live AWS Route 53 dashboard on Aug 14, 2026.

## Page Title
`Route 53 Dashboard` (H1, 24px, weight 400, color #0f141a)

## Layout Structure

The dashboard is a single-column scrollable page with content starting at x=326 (after 280px sidebar + padding).

### 1. Product Cards Row (4 cards, side by side)

Each card: 324px wide, starting at y=170

| Card | Title (H3, 18px, 700) | Description | Button |
|------|----------------------|-------------|--------|
| DNS management | DNS management | A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com. | Create hosted zone |
| Availability monitoring | Availability monitoring | Health checks monitor your applications and web resources, and direct DNS queries to healthy resources. | Create health check |
| Traffic management | Traffic management | A visual tool that lets you easily create policies for multiple endpoints in complex configurations. | Create policy |
| Domain registration | Domain registration | A domain is the name, such as example.com, that your users use to access your application. | Register domain |

Card layout:
- H3 title: 18px, weight 700, color #0f141a
- Description: 14px, color #424650
- Button: AWS orange primary button (Create hosted zone, etc.)

### 2. Register Domain Section (y=357)

H2: "Register domain" (20px, weight 700)
Body: "Find and register an available domain, or transfer your existing domains to Route 53."
Helper text: "Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)"
Input + "Check" button

### 3. Notifications Section (y=563)

H2: "Notifications" (20px, weight 700)
Table with columns: Resource | Status | Last update
Empty state: "No notifications to display"

### 4. More Resources Section (y=796)

H2: "More resources" (20px, weight 700)
Links:
- Documentation
- API reference
- FAQs
- Forum - DNS and health checks
- Forum - Domain name registration
- Request a limit increase

### 5. Service Health Section (y=1095)

H2: "Service health" (20px, weight 700)
Text: "To view the current status of Route 53, see the AWS Service Health Dashboard."

## Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 (page title) | 24px | 400 | #0f141a |
| H2 (section) | 20px | 700 | #0f141a |
| H3 (card title) | 18px | 700 | #0f141a |
| Card description | 14px | 400 | #424650 |
| Body text | 14px | 400 | #0f141a |
| Links | 14px | 400 | #006ce0 |
