# HutchGroup LLC — Website (v2.0)

This is a lightweight static site deployment intended for Vercel.

## Files
- `hutchgroup_production_website.html` — the site (served at `/`)
- `vercel.json` — Vercel routing + security headers

## Deploy to Vercel
- Import this folder into Vercel as a new project.
- Framework preset: **Other** (static)
- Build command: **None**
- Output directory: **.**

## Domain (hutchgroupllc.com)
In Vercel: **Project → Settings → Domains**

- Add `hutchgroupllc.com` and set it as **Primary**.
- Optional: add `www.hutchgroupllc.com` and set it to **Redirect to primary**.

DNS (at your domain registrar):

- **Apex** (`hutchgroupllc.com`): set an **A record** to Vercel’s apex IP (Vercel UI will show the current value to use).
- **www** (`www.hutchgroupllc.com`): set a **CNAME** to Vercel’s target (typically `cname.vercel-dns.com`).

Notes:
- If your registrar supports **ANAME/ALIAS** at the apex, you can use the Vercel value shown in the Domains UI.
- After DNS changes, expect propagation time; Vercel will show verification status per domain.

## Local preview
Open `hutchgroup_production_website.html` directly in a browser.

## Release
- v2.0: branding/meta polish, reduced-motion safety, and hardened deploy config.
