# AWS Route 53 Side Navigation - Exact Spec

Extracted from live AWS console via getComputedStyle() on Aug 14, 2026.

## Container

```
nav.awsui_navigation
  width: 280px
  background: transparent (parent has white bg rgb(255,255,255))
  color: rgb(15, 20, 26) /* #0f141a */
  font-size: 14px
  font-weight: 400
  position: starts at y=94 (below 52px top nav + 42px toolbar)
```

## Header

```
h2 (header)
  font-size: 18px
  font-weight: 700
  color: rgb(15, 20, 26) /* #0f141a */
  padding: 20px 56px 20px 28px
  height: 62px
```

Contains a link with text "Route 53" pointing to /route53/v2/home#Home

## Divider

```
hr
  height: 1px
  color: rgb(128, 128, 128)
  border-top: 1px solid transparent
```

## Navigation List

```
ul
  padding: 0 16px 0 20px
```

### Link items (top-level)

```
a.awsui_link
  height: 28px
  width: 244px (full width minus padding)
  border-radius: 8px
  padding: 4px 8px
  display: flex
  align-items: flex-start
  color (inactive): rgb(66, 70, 80) /* #424650 */
  color (active): rgb(0, 108, 224) /* #006ce0 */
  font-weight (active): 700
  font-weight (inactive): 400
  font-size: 14px
```

### Expandable group items

Groups contain a header link + child links. When expanded, children are indented.

## Navigation Items (exact order)

1. **Dashboard** (link) - href: /route53/v2/home#Dashboard
2. **Hosted zones** (link) - href: /route53/v2/hostedzones#
3. **Health checks** (link) - href: /route53/v2/healthchecks/home#
4. **Profiles** (link) - href: /route53profiles/home
5. **Global Resolver** (expandable group)
   - Global resolvers (link) - href: /route53globalresolver/home + "New" badge
   - Shared DNS views (link) - href: /route53globalresolver/home/shared-dns-views + "New" badge
6. **VPC Resolver** (expandable group)
   - VPCs (link) - href: /route53resolver/home#/vpcs
   - Inbound endpoints (link) - href: /route53resolver/home#/inbound-endpoints
   - Outbound endpoints (link) - href: /route53resolver/home#/outbound-endpoints
   - Rules (link) - href: /route53resolver/home#/rules
   - Query logging (link) - href: /route53resolver/home#/query-logging
   - Outposts (link) - href: /route53resolver/home#/resolveroutposts
7. **Domains** (expandable group)
   - Registered domains (link) - href: /route53/domains/home#/
   - Requests (link) - href: /route53/domains/home#/ListRequests
8. **IP-based routing** (expandable group)
   - CIDR collections (link) - href: /route53/v2/hostedzones#CidrCollections
9. **Traffic flow** (expandable group)
   - Traffic policies (link) - href: /route53/trafficflow/policies
   - Policy records (link) - href: /route53/trafficflow/records

### External links (after divider, open in new tab)

- DNS Firewall - href: /vpc/home#DNSFirewallRuleGroups:
- Application Recovery Controller - href: /route53recovery/home?fromRoute53=1

## Close button

```
button.awsui_navigation-close
  width: 28px, height: 32px
  border-radius: 20px (pill)
  padding: 4px
  color: rgb(66, 70, 80)
  font-weight: 700
  position: top-right of sidebar (x=236)
  title: "Close side navigation"
  Contains chevron-left SVG: <path d="M9 6L4 12l5 6"> (16x16)
```

## Key Colors

| Token | Value | Usage |
|-------|-------|-------|
| Sidebar bg | #ffffff | rgb(255, 255, 255) |
| Header text | #0f141a | rgb(15, 20, 26) |
| Link inactive | #424650 | rgb(66, 70, 80) |
| Link active | #006ce0 | rgb(0, 108, 224) |
| Divider | #808080 | rgb(128, 128, 128) |
