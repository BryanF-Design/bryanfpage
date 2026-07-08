# Google Cloud, GSC and GA4 setup

Resumen sin secretos de la configuracion usada por la automatizacion SEO.

## Google Cloud

- Project name: `BryanF SEO Automation`
- Project ID: `bryanf-seo-automation`
- Project number: `474480853455`
- Organization: `bryanfdesign.com.mx`
- Enabled APIs:
  - Google Search Console API (`searchconsole.googleapis.com`)
  - Google Analytics Data API (`analyticsdata.googleapis.com`)

## Google Auth Platform

- App name: `BryanF SEO Growth Agent`
- Audience: internal
- Support email: `bryanf@bryanfdesign.com.mx`
- Contact email: `bryanf@bryanfdesign.com.mx`
- OAuth client type: Desktop
- OAuth client name: `BryanF SEO Local Automation`
- Scopes used:
  - `https://www.googleapis.com/auth/webmasters.readonly`
  - `https://www.googleapis.com/auth/analytics.readonly`

The OAuth client secret and refresh token are stored only in `.env.local`.

## Search Console

- Property: `sc-domain:bryanfdesign.com.mx`
- Validation date: `2026-07-07`
- API status: `200`
- Permission detected: `siteOwner`

## GA4

- Account/property label seen in Analytics: BryanF Design / `bryanfdesign.com.mx`
- GA4 property ID: `504755650`
- Web stream URL: `https://bryanfdesign.com.mx`
- Web stream ID: `12149305154`
- Measurement ID: `G-4GLGP6X573`
- Validation date: `2026-07-07`
- Data API status: `200`

## Service account note

- Service account: `bryanf-seo-growth-agent@bryanf-seo-automation.iam.gserviceaccount.com`
- Unique ID: `109935196588188503953`
- Intended use: read-only SEO reporting for Search Console and GA4.
- Current blocker: JSON key creation is blocked by organization policy `iam.disableServiceAccountKeyCreation`.

Because of that blocker, the active local auth method is OAuth, not service-account JSON.
