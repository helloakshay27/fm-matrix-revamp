# Gophygital — Round 1 Vulnerability Assessment (VAPT)

> **Source documents** (both by ARM Innovations Private Limited / AICERT, marked *Confidential*):
> - `Gophygital-API-round-1-vulnerability-report.pdf` — 56 pages
> - `Gophygital-Web-round-1-vulnerability-report.pdf` — 155 pages
>
> This file is a full transcription/digest of both reports, with emphasis on **API report §5 (Detailed Observations)** and **Web report §6 (Pass Cases)** as requested. Everything in Parts A–C below is the auditor's content. Part D is *our own analysis* and is labelled as such.

---

## Table of Contents

- [Part A — API Report](#part-a--api-report)
  - [A.1 Executive Summary](#a1-executive-summary)
  - [A.2 Vulnerability Summary Table (16)](#a2-vulnerability-summary-table-16)
  - [A.3 §5 Detailed Observations — ALL 16 FINDINGS](#a3-5-detailed-observations--all-16-findings)
- [Part B — Web Report](#part-b--web-report)
  - [B.1 Executive Summary](#b1-executive-summary)
  - [B.2 Severity & Risk Rating Criteria](#b2-severity--risk-rating-criteria)
  - [B.3 §5 Detailed Observations (29) — Digest](#b3-5-detailed-observations-29--digest)
  - [B.4 §6 Pass Cases — ALL 22 CONTROLS](#b4-6-pass-cases--all-22-controls)
  - [B.5 Appendices](#b5-appendices)
- [Part C — Tooling & Methodology](#part-c--tooling--methodology)
- [Part D — Our Analysis (NOT from the reports)](#part-d--our-analysis-not-from-the-reports)

---

# Part A — API Report

## A.1 Executive Summary

A security assessment was conducted on the target API endpoints and associated backend infrastructure. **24 API endpoints** were provided for assessment.

**16 vulnerabilities identified:**

| Severity | Count |
|---|---|
| Critical | 2 |
| High | 6 |
| Medium | 5 |
| Low | 3 |
| Informational | 0 |
| **Total** | **16** |

**Overall risk rating of the API infrastructure: `Critical`**

Recommendations from the auditor:
- Perform regular security assessments of API endpoints and backend services.
- Following remediation, a retest should be conducted to verify the identified vulnerabilities have been effectively addressed and that no additional security issues remain.

**Primary target host:** `https://fm-uat-api.lockated.com`

---

## A.2 Vulnerability Summary Table (16)

| # | Affected Asset | Vulnerability | CWE | Severity | New/Repeat |
|---|---|---|---|---|---|
| 1 | `/pms/users/12345/delete_vi_user` | IDOR in User Deletion Endpoint Allows Unauthorized Deletion of Arbitrary Users | CWE-639 | **Critical** | New |
| 2 | `/pms/users/4546/user_show.json` | Improper Authentication Allows Use of Spree API Key as Bearer Token | CWE-287 | **Critical** | New |
| 3 | `fm-uat-api.lockated.com` | BOLA/IDOR in Ticket Details API | CWE-639 | High | New |
| 4 | `fm-uat-api.lockated.com` | BOLA/IDOR in Ticket Feeds API | CWE-639 | High | New |
| 5 | `fm-uat-api.lockated.com` | Access Token Included in URL Query Parameter | CWE-598 | High | New |
| 6 | 14 endpoints (attachfiles, attendances, krcc_forms, suppliers, asset_amcs, users, incidents, escalation, incidence_tags) | BOLA in Attachment Download API | CWE-639 | High | New |
| 7 | `/smts/11.json`, `/krcc_forms/20001.json` | EXIF Metadata Disclosure | CWE-200 | High | New |
| 8 | `fm-uat-api.lockated.com` | Stored XSS via Malicious PDF Upload | CWE-434 | High | New |
| 9 | `fm-uat-api.lockated.com` | Image Metadata (EXIF) Disclosure via Publicly Accessible Attachment | CWE-200 | Medium | New |
| 10 | `/pms/users/get_circles.json?company_id=123` | Improper CORS Configuration: Wildcard Origin with Credentialed Requests | CWE-942 | Medium | New |
| 11 | `/pms/custom_forms/checklist_create_pms.json`, `/pms/asset_amcs.json` | Missing Rate Limiting on Master Checklist Creation API | CWE-770 | Medium | New |
| 12 | `/pms/incidence_tags.json`, `/circles.json` | Lack of Rate Limiting on Incident Category Creation | CWE-770 | Medium | New |
| 13 | `fm-uat-api.lockated.com` | IDOR in Attachment Download API Allows Unauthorized Access to Files | CWE-639, CWE-284 | Medium | New |
| 14 | `fm-uat-api.lockated.com` | Information Disclosure via HTTP Response Headers | CWE-200 | Low | New |
| 15 | `fm-uat-api.lockated.com` | Improper Server-Side Input Length Validation in `task_comments` | CWE-20 | Low | New |
| 16 | `fm-uat-api.lockated.com` | Information Disclosure via Internal Temporary File Path in File Upload Error Response | CWE-209 | Low | New |

---

## A.3 §5 Detailed Observations — ALL 16 FINDINGS

### 5.1 IDOR in User Deletion Endpoint Allows Unauthorized Deletion of Arbitrary Users

- **Affected Asset:** `https://fm-uat-api.lockated.com/pms/users/12345/delete_vi_user`
- **Affected Parameter:** `user_id`
- **CWE:** CWE-639 – Authorization Bypass Through User-Controlled Key
- **Severity:** `Critical`

**Description:** The user deletion API fails to perform proper server-side authorization checks before deleting a user account. A valid user ID could be obtained from another API endpoint and then supplied to the deletion endpoint. By replacing the `user_id` path parameter with the ID of another user, the application successfully deleted the targeted account without verifying whether the authenticated user had sufficient privileges. This allows an authenticated **low-privileged** attacker to delete arbitrary user accounts by enumerating valid user IDs.

**Impact:**
- Unauthorized deletion of arbitrary user accounts.
- Permanent loss of user accounts and associated business data.
- Potential deletion of privileged or administrative accounts.
- Denial of service for legitimate users whose accounts are deleted.
- Compromise of integrity and availability of the user management system.
- Business disruption requiring administrative intervention or data restoration.
- Violation of access control and least privilege principles.

**PoC steps:**
1. Authenticate with a low-privileged user account.
2. Identify a valid user ID: `GET /pms/users/12345/user_show.json`
3. Note the valid `user_id` returned in the response.
4. Send: `DELETE /pms/users/12345/delete_vi_user`
5. Observe the request is processed successfully and the targeted user's account is deleted, even though the authenticated user is not authorized.

**Recommendations:**
- Enforce strict server-side authorization checks on every user deletion request.
- Verify the authenticated user has explicit permission to delete the specified user before processing.
- Implement RBAC or ABAC for all administrative operations.
- Do not rely solely on client-supplied object identifiers for authorization decisions.
- Return HTTP 403 Forbidden for unauthorized deletion attempts.
- Log and monitor all user deletion events (requesting user, target user, timestamp, source IP).
- Conduct regular authorization testing on all endpoints referencing user-controlled identifiers.

---

### 5.2 Improper Authentication Allows Use of Spree API Key as Bearer Token

- **Affected Asset:** `https://fm-uat-api.lockated.com/pms/users/4546/user_show.json`
- **Affected Parameter:** `Authorization` HTTP Header
- **CWE:** CWE-287 – Improper Authentication
- **Severity:** `Critical`

**Description:** The application accepts a **Spree API key** in place of the expected Bearer access token for authentication. The Spree API key, obtained from an API response, can be supplied in the `Authorization` header and is accepted by the server as valid authentication. The API key effectively acts as a substitute authentication credential, enabling the requester to perform the same actions possible with the original Bearer token. This indicates the application does not properly distinguish between different authentication credentials or enforce the intended authentication mechanism.

**Impact:**
- Authentication can be bypassed using an exposed API key.
- An attacker possessing the API key can perform authenticated API operations.
- Unauthorized access to protected resources.
- Increased attack surface if API keys are exposed through API responses, logs, or client-side code.
- Potential compromise of confidentiality, integrity, and availability depending on API key permissions.
- Difficulty auditing user actions if multiple authentication mechanisms are treated identically.

**PoC steps:**
1. Authenticate using a valid user account.
2. Intercept an API response and identify the exposed Spree API key.
3. Capture a legitimate API request containing `Authorization: Bearer <valid_access_token>`.
4. Replace the Bearer token with the retrieved Spree API key.
5. Send the modified request.
6. Observe the server accepts the request and performs the operation successfully.

**Recommendations:**
- Enforce a single, well-defined authentication mechanism for protected APIs.
- Ensure Spree API keys cannot substitute for user access tokens unless explicitly intended and properly scoped.
- Avoid exposing sensitive API keys in API responses or client-accessible locations.
- Validate the type, scope, and intended usage of every authentication credential presented.
- **Rotate existing API keys if exposure is confirmed.**
- Implement least-privilege access controls for API keys.

---

### 5.3 Broken Object Level Authorization (BOLA/IDOR) in Ticket Details API

- **Affected Asset:** `https://fm-uat-api.lockated.com`
- **Affected Parameter:** `GET /pms/admin/complaints/30002.json`
- **CWE:** CWE-639
- **Severity:** `High`

**Description:** The Ticket Details API fails to enforce object-level authorization on the `id` path parameter. An authenticated user can access details of arbitrary tickets by modifying the numeric ticket identifier in the request URL. The application validates the Bearer token but does not verify whether the authenticated user is authorized to access the requested ticket.

**Impact:** An authenticated attacker can access other users' ticket details; enumerate sequential ticket IDs; view sensitive maintenance information, employee names, assigned personnel, complaint descriptions, ticket status and workflow information; and potentially disclose internal operational data. **If the API is multi-tenant, this may also allow access to another organization's data.**

**PoC steps:**
1. Intercept the request in Burp Suite or capture from Postman.
2. Send to Repeater: `GET /pms/admin/complaints/30001.json` with `Authorization: Bearer <Valid Token>`
3. Modify the ticket ID to `30002`.
4. Send the modified request.
5. Observe HTTP 200 OK with the details of ticket 30002.

**Recommendations:**
- Implement object-level authorization checks before returning ticket data.
- Verify the authenticated user's identity, and that the requested ticket belongs to them or they hold the required role.
- Return HTTP 403 Forbidden when access is not permitted.
- Avoid exposing sequential resource identifiers; consider UUIDs.
- Log unauthorized access attempts.

**References:** OWASP API Security Top 10: API1:2023 – Broken Object Level Authorization (BOLA)

---

### 5.4 Broken Object Level Authorization (BOLA/IDOR) in Ticket Feeds API

- **Affected Asset:** `https://fm-uat-api.lockated.com`
- **Affected Parameter:** `/pms/admin/complaints/30003/feeds.json`
- **CWE:** CWE-639
- **Severity:** `High`

**Description:** The Ticket Feeds API does not enforce object-level authorization on the `ticket_id` path parameter. An authenticated user can modify the ticket ID and retrieve details of other tickets. The application validates the Bearer token but fails to verify authorization for the requested ticket.

**Impact:** Enumeration of ticket IDs exposing: ticket numbers, complaint headings, ticket creator names, categories/subcategories, site names, site addresses, ticket creation dates, ticket feed information, internal maintenance records. If ticket feeds contain comments, attachments, status updates, or internal notes, those could also be exposed.

**PoC steps:**
1. Capture the request using Burp Suite or Postman.
2. Server returns e.g.:
   ```json
   { "ticket_number":"3544-21789", "heading":"Washroom outside leakage",
     "created_on":"18/10/2019 05:05 PM", "created_by":"Prashant Singh",
     "category":"Plumbing", "feeds":[] }
   ```
3. Modify only the ticket ID: `GET /pms/admin/complaints/30003/feeds.json`
4. Forward the modified request.
5. Observe HTTP 200 OK exposing another ticket:
   ```json
   { "ticket_number":"36-10011", "heading":"No electricity",
     "created_on":"18/10/2019 05:37 PM", "created_by":"Rahul Sharma",
     "category":"Electrical", "sub_category":"Lights", "site_name":"Site 1", "feeds":[] }
   ```

**Recommendations:**
- Implement object-level authorization for every request.
- Verify ownership or role-based permissions before returning ticket details.
- Return HTTP 403 Forbidden when unauthorized.
- Avoid predictable sequential numeric identifiers (use UUIDs).
- Log and monitor unauthorized access attempts.

**References:** OWASP API Security Top 10 2023: API1 – Broken Object Level Authorization

---

### 5.5 Access Token Included in URL Query Parameter

- **Affected Asset:** `fm-uat-api.lockated.com`
- **Affected Parameter:** `/pms/admin/complaints/tickets_categorywise_proactive_reactive.json?site_id=6&from_date=2026-06-01&to_date=2026-07-17&access_token=<JWT>`
- **CWE:** CWE-598
- **Severity:** `High`

**Description:** The application includes a JWT bearer access token as a query parameter (`access_token`) in the request URL. Bearer tokens should be transmitted using the `Authorization: Bearer` HTTP header rather than URL query parameters. URLs may be exposed through browser history, web server logs, reverse proxies, monitoring tools, analytics platforms, bookmarks, and HTTP Referer headers.

> **Auditor's note:** During testing, authentication continued to function *without* the URL parameter, indicating the Authorization header is used for authentication. Therefore **this finding is reported as a security best-practice observation, not as confirmed token leakage.**

**Impact:** Potential token exposure through browser history, web server access logs, reverse proxy logs, load balancer logs, monitoring/analytics tools, shared URLs, and HTTP Referer headers. An exposed bearer token could potentially be reused until it expires.

**PoC steps:**
1. Intercept the Postman request using Burp Suite.
2. Observe the JWT access token present in the URL as the `access_token` query parameter.
3. The same JWT is also transmitted in the Authorization header.

**Recommendations:**
- Remove the `access_token` query parameter from all URLs.
- Accept bearer tokens only via the `Authorization` header.
- Ensure access tokens are never logged in URLs.
- Rotate any tokens that may have been exposed.
- Follow RFC 6750 (OAuth 2.0 Bearer Token Usage).

---

### 5.6 Broken Object Level Authorization (BOLA) in Attachment Download API

- **Severity:** `High` | **CWE:** CWE-639
- **Affected Assets (14 endpoints):**
  - `/attachfiles/23001?show_file=true`
  - `/pms/attendances/90001.json`
  - `/krcc_forms/20025.json`
  - `/pms/suppliers/12001.json`
  - `/pms/asset_amcs.json`
  - `/pms/users/19001/user_show.json`
  - `/pms/incidents/add_inc_details.json`
  - `/pms/incidents/inc_clousure_details.json?access_token=`
  - `/pms/add_escalation.json`
  - `/pms/update_escalation.json`
  - `/pms/incidents/{{incident_id}}.json`
  - `/pms/incidents/{{incident_id}}/incident_report?access_token=`
  - `/pms/incidence_tags/{{incident_id}}.json`
  - `/pms/incidence_tags/{{incident_id}}/escalation_destroy.json`
- **Affected Parameters:** `AttachmentID`, `AttendancesID`, `krcc_form_id`, `Suppliers_id`, `supplier_id`, `user_id`, `incident_id`, `about_id`, `escalate_to_users`, `id`

**Description:** The Attachment Download API is vulnerable to IDOR due to missing object-level authorization. An authenticated user can modify the `AttachmentID` in the request URL and access attachment files belonging to other users.

**Impact:** Unauthorized download of other users' attachment files; disclosure of sensitive images and documents; compromised user privacy and data confidentiality; enumeration of attachment IDs to retrieve additional files.

**PoC steps:**
1. Log in with a normal user account.
2. Intercept the attachment download request; send to Repeater.
3. Verify the request contains the authenticated user's valid Bearer Token.
4. Send and confirm the authenticated user's image is returned.
5. Modify the Attachment-ID to another valid attachment ID belonging to a different user.
6. Keep the same Bearer Token; send the modified request.
7. Observe HTTP 200 OK returning another user's image.
8. Right-click the response → "Request in Browser".
9. Open in browser and paste the URL in the original authenticated session.
10. Observe the browser downloads the other user's image.

**Recommendations:**
- Enforce server-side object-level authorization for every attachment request.
- Verify authorization for the requested `AttachmentID` before returning the file.
- Return HTTP 403 Forbidden on unauthorized access.
- Avoid sequential numeric identifiers; use UUIDs.

---

### 5.7 EXIF Metadata Disclosure

- **Affected Assets:** `/smts/11.json`, `/krcc_forms/20001.json`
- **Affected Parameter:** `Image-Metadata`
- **CWE:** CWE-200 | **Severity:** `High`

**Description:** The application serves image files containing their original EXIF metadata, accessible by downloading the image through the publicly accessible image URL obtained from the API endpoint. The metadata exposes device information, camera configuration, timestamps, and other embedded attributes.

> Auditor notes the disclosed metadata **in this instance** does not include GPS coordinates or PII, but retaining EXIF unnecessarily increases information exposure.

**Impact:** Discloses device make/model; reveals camera configuration (aperture, focal length, ISO, exposure); exposes original image creation timestamp; may assist attacker profiling of the organization's devices or image processing workflow. **If future images contain GPS coordinates, author information, or serial numbers, impact could become significantly greater.**

**PoC steps:**
1. Access `https://fm-uat-api.lockated.com/smts/11.json`
2. Obtain the image URL from the API response.
3. Copy the image URL.
4. Extract metadata using a tool (e.g. jimpl.com).
5. Observe the image retains original EXIF metadata.

**Recommendations:**
- Remove EXIF metadata from all images before making them publicly accessible.
- Implement automatic metadata stripping during image upload/processing.
- Use image optimization tools/libraries that remove non-essential metadata.
- Periodically audit publicly accessible images.
- If metadata retention is required internally, store originals securely and serve only sanitized versions.

---

### 5.8 Stored Cross-Site Scripting (XSS) via Malicious PDF Upload

- **Affected Asset:** `fm-uat-api.lockated.com`
- **Affected Parameter:** `/pms/services.json`
- **CWE:** CWE-434 | **Severity:** `High`

**Description:** The application allows authenticated users to upload PDF files without validating or sanitizing embedded JavaScript. A crafted PDF containing JavaScript was successfully uploaded through the Create Service API. The application accepted the file, stored it on a **publicly accessible Amazon S3 bucket**, and returned a direct URL. Opening the PDF via the URL executed the embedded JavaScript (alert "XSS").

**Impact:** Execution of embedded PDF JavaScript; social engineering against users who open the document; delivery of malicious PDF payloads; increased phishing risk through trusted application-hosted files; potential exploitation of vulnerable PDF viewers.

> Auditor notes modern browsers often restrict PDF JavaScript, but some built-in viewers and desktop readers may execute embedded actions.

**PoC steps:**
1. Open Postman; create a new Service request.
2. Attach a malicious PDF (`xss.pdf`) containing embedded JavaScript.
3. Capture in Burp Suite.
4. Forward: `POST /pms/services.json` with `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`, `attachments[] = xss.pdf`
5. Server accepts the upload → `HTTP/1.1 201 Created`
6. Response:
   ```json
   { "documents": [ { "document": "https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/8416261/original/xss.pdf" } ] }
   ```
7. Open the generated PDF URL → PDF renders, confirming active JavaScript is served.

**Recommendations:**
- Validate uploaded PDF files before storage.
- Strip or reject PDFs containing JavaScript actions (`/JavaScript`, `/JS`, `/OpenAction`, `/AA`).
- Sanitize uploaded documents using a trusted PDF sanitization library.
- Serve uploaded documents with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`.
- Where feasible, flatten or re-render uploaded PDFs to remove active content.
- Scan uploaded files for malicious/active content.

**References:** CWE-434: Unrestricted Upload of File with Dangerous Type

---

### 5.9 Image Metadata (EXIF) Disclosure via Publicly Accessible Attachment

- **Affected Asset:** `fm-uat-api.lockated.com`
- **Affected Parameter:** `/pms/admin/complaints/30001.json`
- **CWE:** CWE-200 | **Severity:** `Medium`

**Description:** The API response exposes a publicly accessible image attachment URL hosted on Amazon S3. The uploaded image retains its original EXIF metadata, allowing anyone with the URL to extract device-related information.

**Impact:** Metadata may reveal device manufacturer/model, **GPS coordinates**, capture date/time, camera configuration, software/firmware details, orientation. Assists reconnaissance, privacy violations, or targeted social engineering.

**PoC steps:**
1. Retrieve a ticket using the Ticket Details API.
2. Observe the `response_attachments` field in the JSON response.
3. Copy the image URL.
4. Open in a browser to confirm public accessibility.
5. Submit the URL to an EXIF analysis tool (Jimpl or ExifTool).
6. Observe metadata is disclosed.

**Recommendations:**
- Strip EXIF metadata from all uploaded images before storing/serving.
- Re-encode images on the server to remove embedded metadata.
- Avoid exposing publicly accessible object URLs unless required.
- Use signed or authenticated URLs for sensitive attachments.
- Periodically review existing uploaded files.

**References:** OWASP ASVS v4.0: V14 – Configured Security

---

### 5.10 Improper CORS Configuration: Wildcard Origin Used with Credentialed Requests

- **Affected Asset:** `/pms/users/get_circles.json?company_id=123`
- **Affected Parameter:** CORS
- **CWE:** CWE-942 – Permissive Cross-domain Policy with Untrusted Domains
- **Severity:** `Medium`

**Description:** The CORS configuration returns:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```
This is **not compliant with the CORS specification**. When `Access-Control-Allow-Credentials` is `true`, the server must not use the wildcard `*` for `Access-Control-Allow-Origin`; it should return a specific trusted origin.

**Impact:**
- Credentialed cross-origin requests (cookies, HTTP auth, client certificates) may fail in browsers due to CORS policy enforcement.
- Indicates an insecure CORS implementation that could expose sensitive resources if changed incorrectly in future.
- May cause functionality issues for legitimate cross-origin clients.

**PoC steps:**
1. `GET /pms/users/get_circles.json?company_id=123`
2. Include header `Origin: https://evil.com`
3. Observe response headers show both `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Credentials: true`.
4. Verify the server returns both headers together (violates spec for credentialed requests).
5. **Auditor note: "check other endpoints as well and all are misconfigured with CORS"** — i.e. this is systemic, not isolated.

**Recommendations:**
- Replace the wildcard origin with a validated, trusted origin or an allowlist.
- Use `Access-Control-Allow-Credentials: true` only when credentialed cross-origin requests are required.
- If credentialed requests are not needed, remove `Access-Control-Allow-Credentials: true` and retain `Access-Control-Allow-Origin: *`.
- Regularly review and test CORS policies.

---

### 5.11 Missing Rate Limiting on Master Checklist Creation API

- **Affected Assets:** `/pms/custom_forms/checklist_create_pms.json`, `/pms/asset_amcs.json`
- **Affected Parameter:** N/A, `supplier_id`
- **CWE:** CWE-770 | **Severity:** `Medium`

**Description:** No rate limiting on requests. An authenticated user can repeatedly invoke the API to create multiple master checklists within a short period. Each request is processed successfully with a new unique identifier.

**Impact:** Large-scale checklist creation; excessive database storage/server resource consumption; automated abuse; business data cluttered with duplicate records; increased attack surface for DoS and resource exhaustion.

**PoC steps:**
1. Navigate to the Audit module and create a Master Checklist; intercept the request in Burp.
2. Send to Intruder.
3. Configure a Null Payload attack (e.g. 100 requests).
4. Start the attack.
5. Observe every request receives a successful response.
6. Observe the `id` value increments each request, confirming no rate limiting.

**Recommendations:**
- Implement server-side rate limiting.
- Restrict creation requests per user or IP within a defined time window.
- Return HTTP 429 (Too Many Requests) when exceeded.
- Monitor and log excessive API requests.
- Consider additional anti-automation controls.

---

### 5.12 Lack of Rate Limiting on Incident Category Creation Functionality

- **Affected Assets:** `/pms/incidence_tags.json`, `/circles.json`
- **Affected Parameter:** `name`
- **CWE:** CWE-770 | **Severity:** `Medium`

**Description:** No rate limiting or throttling on Incident Category creation. Multiple requests could be submitted in rapid succession without restrictions, delays, CAPTCHA challenges, or account-based throttling. The server created a new Incident Category record for each request.

**Impact:** Database growth and increased storage consumption; automated large-volume record generation; cluttered administrative interfaces; increased processing/database overhead affecting performance; may facilitate DoS conditions.

**PoC steps:**
1. Navigate to the Incident Category creation functionality.
2. Create a new category; intercept in Burp Suite.
3. Observe the request.
4. Send multiple times, adding 1 new character, via Repeater/Intruder.
5. Observe each request is processed successfully and a new category created.
6. Verify unique category records generated without throttling.

**Recommendations:**
- Implement rate limiting on category creation endpoints.
- Apply per-user and per-IP request thresholds.
- Introduce monitoring and alerting for abnormal category creation activity.
- Consider CAPTCHA or additional verification for excessive requests.
- Log and review repeated attempts.

---

### 5.13 IDOR in Attachment Download API Allows Unauthorized Access to Files

- **Affected Asset:** `fm-uat-api.lockated.com`
- **Affected Parameter:** `/attachfiles/23005?show_file=true`
- **CWE:** CWE-639, CWE-284 | **Severity:** `Medium`

**Description:** The attachment download endpoint fails to validate whether the authenticated user is authorized to access the requested attachment. By modifying `attachment_id`, an authenticated attacker can retrieve attachments belonging to other users or organizations.

**Impact:** Enumeration of attachment IDs exposing user profile images, identity documents, PDFs, internal reports, confidential business documents, and other uploaded attachments.

**PoC steps:**
1. Open Postman.
2. `GET /attachfiles/{attachment_id}?show_file=true` with `Authorization: Bearer <valid_token>`
3. Note the response for your own attachment.
4. Modify only the `attachment_id` (e.g. 23011, 23012, 23013).
5. Send again.
6. Observe the server returns a different user's image/document without authorization checks.
   - Original: `GET /attachfiles/23010?show_file=true`
   - Modified: `GET /attachfiles/23011?show_file=true` → `HTTP/1.1 200 OK`

**Recommendations:**
- Verify ownership of the requested attachment before returning it.
- Implement server-side authorization checks for every attachment request.
- Avoid exposing sequential attachment identifiers.
- Use random UUIDs or signed, time-limited download URLs.
- Return 403 Forbidden when unauthorized.

**References:** CWE-284 – Improper Access Control

---

### 5.14 Information Disclosure via HTTP Response Headers

- **Affected Asset:** `https://fm-uat-api.lockated.com`
- **Affected Parameter:** Server Version
- **CWE:** CWE-200 | **Severity:** `Low`

**Description:** The application discloses server technology through HTTP response headers:
```
Server: nginx + Phusion Passenger(R)
X-Powered-By: Phusion Passenger(R)
```

**Impact:** Reveals web server and application platform; enables targeted reconnaissance; facilitates identification of publicly known vulnerabilities; increases effectiveness of subsequent attacks by reducing fingerprinting effort.

**PoC steps:**
1. Send an HTTP request to an endpoint (e.g. `POST /pms/users/create_lmc_manager.json`).
2. Observe the HTTP response headers.
3. Verify headers include `Server: nginx + Phusion Passenger(R)` and `X-Powered-By: Phusion Passenger(R)`.

**Recommendations:**
- Remove or suppress `Server` and `X-Powered-By` response headers.
- Configure the web server/framework to return generic or no identifying information.
- Ensure reverse proxies and load balancers do not reintroduce technology disclosure headers.
- Regularly review HTTP response headers — while recognising header removal is defense-in-depth, not a complete control.

---

### 5.15 Improper Server-Side Input Length Validation in `task_comments` Parameter

- **Affected Asset:** `fm-uat-api.lockated.com`
- **Affected Parameter:** `/pms/asset_task_occurrences/40005.json`
- **CWE:** CWE-20 | **Severity:** `Low`

**Description:** The application enforces a maximum input length for `task_comments` **client-side only**. By intercepting and modifying the API request, an authenticated user can submit a value significantly larger than the intended limit. The server accepts the oversized input and returns HTTP 200 OK.

**Impact:** Bypass of application business rules; storage of unexpected oversized data; potential UI rendering issues; potential report/PDF formatting issues; increased database storage consumption; performance degradation if abused with repeated oversized submissions.

**PoC steps:**
1. Navigate to the Asset Task section.
2. Enter a comment in the Task Comments field.
3. Configure Postman to proxy through Burp; capture `PATCH /pms/asset_task_occurrences/40001.json`
4. Intercept the request in Burp.
5. Replace `task_comments` with ~2,000 characters.
6. Forward the modified request.
7. Observe `HTTP/1.1 200 OK`.
8. Verify the oversized input was accepted and stored.

**Recommendations:**
- Enforce input length validation server-side for `task_comments`.
- Reject over-length requests with 400 Bad Request or 422 Unprocessable Entity.
- Apply the same validation rules consistently across client and server.
- Define and enforce maximum lengths at API, application, and database layers.

**References:** CWE-20 – Improper Input Validation

---

### 5.16 Information Disclosure via Internal Temporary File Path in File Upload Error Response

- **Affected Asset:** `https://fm-uat-api.lockated.com`
- **Affected Parameter:** `/pms/custom_forms/bulk_upload.json`
- **CWE:** CWE-209 | **Severity:** `Low`

**Description:** The Bulk Upload API returns verbose error messages containing internal server implementation details when processing an invalid file upload, exposing the server's temporary file path, e.g. `/tmp/RackMultipart20260728-1287616-laflns`. This reveals use of Rack multipart processing and the temporary directory structure.

**Impact:** Discloses internal filesystem path (`/tmp/`), temporary file naming convention, backend multipart upload mechanism (Rack Multipart), and technology stack information aiding reconnaissance.

**PoC steps:**
1. Open Postman.
2. Capture the request in Burp Suite.
3. Send: `POST /pms/custom_forms/bulk_upload.json` with `Authorization: Bearer <valid_token>`, `Content-Type: multipart/form-data`, `custom_form_file = bing`, `filename = bing`
4. Forward the request.
5. Observe the API response:
   ```json
   HTTP/1.1 200 OK
   { "status":"error", "message":"Import failed",
     "errors":[ "Can't detect the type of /tmp/RackMultipart20260728-1287616-laflns - please use the :extension option to declare its type." ] }
   ```

**Recommendations:**
- Replace verbose exception messages with generic user-friendly error responses.
- Do not expose internal filesystem paths or framework-generated exceptions to API clients.
- Log detailed exception information only server-side.
- **Return appropriate HTTP status codes (400/422) for invalid file uploads instead of 200 OK.**
- Implement centralized exception handling to sanitize internal errors.

**References:** OWASP API Security Top 10 – API8:2023 Security Misconfiguration

---

# Part B — Web Report

## B.1 Executive Summary

A security assessment was conducted on the target web application and associated infrastructure. **21 target assets** were provided for assessment.

**29 vulnerabilities identified:**

| Severity | Count |
|---|---|
| Critical | 4 |
| High | 7 |
| Medium | 15 |
| Low | 3 |
| Informational | 0 |
| **Total** | **29** |

**Overall risk rating of the web application: `Critical`**

**Primary target hosts:** `https://web.gophygital.work`, `https://live-api.gophygital.work`, `https://lockated-api.gophygital.work`

---

## B.2 Severity & Risk Rating Criteria

Auditor uses **CVSS** (base-metric rating unless otherwise stated):

| Rating | CVSS Score |
|---|---|
| Critical | 9.0 – 10.0 |
| High | 7.0 – 8.9 |
| Medium | 4.0 – 6.9 |
| Low | 0.1 – 3.9 |
| Info | 0.0 |

**Critical** is assigned to vulnerabilities posing an immediate and severe risk — typically affecting publicly accessible environments involving sensitive data sets (PII, PHI, financial or proprietary business information) rather than isolated records; may enable remote code execution, complete system compromise, significant privacy violations, or full application takeover. These require **immediate escalation and remediation**.

Methodology: **Black Box Approach** (AICERT Web Application Penetration Testing method).

---

## B.3 §5 Detailed Observations (29) — Digest

| # | Title | CWE | Severity |
|---|---|---|---|
| 5.1 | IDOR – Unauthorized Access to Task Details | CWE-639 | **Critical** |
| 5.2 | IDOR in MSafe Detail Report Download Functionality | CWE-639 | **Critical** |
| 5.3 | IDOR and User Enumeration Leading to Sensitive Information Disclosure | CWE-639 | **Critical** |
| 5.4 | IDOR in Vendor Details Functionality | CWE-639 | **Critical** |
| 5.5 | IDOR Leading to Unauthorized Access to Sensitive Records and File Attachments | CWE-639 | High |
| 5.6 | JWT Bearer Token Exposed in URL Query Parameter | CWE-598 | High |
| 5.7 | IDOR – Unauthorized Access and Modification of Project Details | CWE-639 | High |
| 5.8 | IDOR – Unauthorized Access and Modification of Maintenance Tickets | CWE-639 | High |
| 5.9 | Stored XSS via Malicious PDF Upload | CWE-79 | High |
| 5.10 | Stored XSS via Malicious PDF Attachment Upload in Ticket Comments | CWE-79 | High |
| 5.11 | IDOR Allows Unauthorized Access to Inventory Details | CWE-639 | High |
| 5.12 | Clickjacking Vulnerability on Login Page | CWE-1021 | Medium |
| 5.13 | IDOR in Incident Details Page | CWE-639 | Medium |
| 5.14 | Session Not Invalidated After Logout | CWE-613 | Medium |
| 5.15 | Internal IP Address Disclosure | CWE-200 | Medium |
| 5.16 | Missing HTTP Security Headers | CWE-693 | Medium |
| 5.17 | Web Server Version Information Disclosure | CWE-200 | Medium |
| 5.18 | SSH Server Supports Weak MAC Algorithms (SHA-1) | CWE-327 | Medium |
| 5.19 | Replay Attack on Comment Submission API (Duplicate Comment Creation) | CWE-294 | Medium |
| 5.20 | Sensitive Information Disclosure via EXIF Metadata in Uploaded Image Attachments | CWE-200 | Medium |
| 5.21 | Denial of Service via Multiple Overlapping HTTP Byte-Range Requests | CWE-400 | Medium |
| 5.22 | Insecure Storage of Session/Bearer Token in Browser Local Storage | CWE-922 | Medium |
| 5.23 | Improper Input Validation in Restricted Dropdown Fields | CWE-20 | Medium |
| 5.24 | Session Reuse Leads To Authentication Bypass | CWE-613 | Medium |
| 5.25 | Lack of Rate Limiting on Incident Creation Functionality | CWE-770 | Medium |
| 5.26 | Improper Server-Side Validation of Character Length Restrictions | CWE-20 | Medium |
| 5.27 | Server Version Disclosure via HTTP Response Headers | CWE-200 | Low |
| 5.28 | Username Enumeration via Distinct Password Reset Error Messages | CWE-203 | Low |
| 5.29 | Account Enumeration via Authentication Response Messages | CWE-203 | Low |

### Critical findings — detail

**5.1 IDOR – Unauthorized Access to Task Details** (`https://lockated-api.gophygital.work/task_managements/{id}.json`, param `id`)
Missing server-side authorization on the `id` path parameter. Changing the task identifier from `43520` to `43420` returned another task's details. Exposes task descriptions, project names, milestones, employee names, and email addresses. Enables enumeration and large-scale data harvesting.
*Reco:* enforce server-side authorization per request; return 403/404 when unauthorized; implement object-level authorization (BOLA) consistently across all endpoints.

**5.2 IDOR in MSafe Detail Report Download** (`https://web.gophygital.work/safety/report/msafe-detail-report`, param `company_id`)
The report download uses a user-controlled `company_id`. Changing `company_id=301` to `145` generated and returned an **Excel report belonging to a different organization**, containing extensive sensitive employee and contractor information.
*Impact:* unauthorized cross-organization report access; PII disclosure; employee/contractor records; vehicle and licensing information; employment data; **data protection regulation violations**; identity theft/social engineering risk; large-scale harvesting via `company_id` enumeration.
*Reco:* strict server-side authorization on all report generation/download; **enforce tenant-level access controls for multi-organization environments**; never rely on client-supplied identifiers; audit all export/reporting functionality.

**5.3 IDOR and User Enumeration** (`https://live-api.gophygital.work/project_managements/323.json`)
Sequential-ID enumeration (Burp Intruder) over `/project_managements/{id}.json` harvests user names, email addresses, and roles. Disclosed emails can then be fed to `/api/users/get_organizations_by_email?email=<email>` to retrieve further information — **correlating data across two endpoints**.
*Impact:* identification of privileged accounts (admins/managers) for targeted phishing; large-scale PII harvesting; compliance violations.
*Reco:* validate ownership before returning project data; apply authorization consistently including the email-lookup endpoint; avoid exposing unnecessary attributes (emails, roles); rate limiting and anomaly detection.

**5.4 IDOR in Vendor Details** (`https://web.gophygital.work/maintenance/vendor/view/55820` → `/pms/suppliers/{id}.json`)
Modifying `vendor_id` grants access to vendor records not assigned to the user. Exposed records contain **contact details, banking information, financial data, audit information, attachments, and approval status**.
*Impact:* potential financial fraud, business impersonation, targeted social engineering.
*Reco:* server-side authorization per vendor request; tenant-level segregation; RBAC on vendor management; UUIDs where feasible.

### High findings — key points

- **5.5** — `/maintenance/service/details/{id}`: changing the numeric ID exposes other users' service records **and their uploaded attachments**.
- **5.6** — JWT transmitted as a URL query-string parameter (CWE-598). Risk of leakage via browser history, server/proxy/CDN logs, Referer header. *Reco:* send tokens only in the `Authorization` header; consider HttpOnly/Secure/SameSite cookies; short-lived tokens with rotation and revocation; review logs and invalidate exposed tokens.
- **5.7** — `/vas/projects/details/{project_id}`: changing project ID `323`→`324` exposes another project **and the Edit Project function was also reachable** → integrity impact, not just confidentiality.
- **5.8** — `/maintenance/ticket/details/{ticket_id}`: changing `831634`→`831635` exposes another user's ticket including internal comments, ticket history/audit logs, root cause analysis, corrective actions, vendor information — **and Edit/Comment functionality worked on unauthorized tickets** (tamper with audit records).
- **5.9 / 5.10** — Stored XSS via malicious PDF upload, in **two** places: Edit Service attachment upload (`/maintenance/service/edit/17700`) and **ticket comment attachments**. Uploaded `xss.pdf` executed its payload when opened via the application-generated URL. *Reco:* disallow active content in PDFs; sanitize before storage; `Content-Disposition: attachment`; `X-Content-Type-Options: nosniff`; validate by magic bytes not extension; implement CSP.
- **5.11** — `/maintenance/inventory/details/{id}`: sequential ID change exposes inventory records of other users/organizations (item details, asset info, stock levels, pricing, supplier information).

### Medium/Low findings — key points

- **5.12 Clickjacking** on `/login` — login page can be framed by an external site; interactions remain functional. *Reco:* `X-Frame-Options: DENY|SAMEORIGIN` and CSP `frame-ancestors`.
- **5.13** — IDOR in Incident Details (`/safety/incident/new-details/3181`).
- **5.14 Session Not Invalidated After Logout** — a previously issued JWT **remains valid after logout** until natural expiry; logout only clears client state. *Reco:* server-side token revocation/blacklisting; short-lived tokens + refresh rotation.
- **5.15 Internal IP Address Disclosure** — `172.31.16.75` disclosed in HTTP response; confirmed to be a live internal host exposing a DNS service (dnsmasq).
- **5.16 Missing HTTP Security Headers** — auditor lists as absent: CSP, X-Content-Type-Options, **HSTS**, X-Frame-Options, Referrer-Policy, Permissions-Policy, COEP, COOP, CORP, X-Permitted-Cross-Domain-Policies. *(See Part D — this contradicts pass case 6.17.)*
- **5.17 / 5.27** — `Server: nginx/1.28.0` disclosed. *Reco:* `server_tokens off;`. *(These two findings are duplicates at different severities — see Part D.)*
- **5.18 Weak SSH MACs** — `hmac-sha1`, `hmac-sha1-etm@openssh.com` supported. *Reco:* restrict to `hmac-sha2-256-etm`, `hmac-sha2-512-etm`, `umac-128-etm`.
- **5.19 Replay Attack on Comment Submission** (`POST /complaint_logs.json`) — identical authenticated request can be replayed to create duplicate comments; no nonce/one-time token and no rate limiting. *Reco:* anti-replay nonces; server-side duplicate detection; rate limiting.
- **5.20 EXIF in ticket attachments** — retained metadata **including GPS latitude/longitude**, camera make/model, timestamps, camera config, processing software. Flagged as a real risk if employees photograph corporate premises.
- **5.21 Byte-Range DoS** — CVE-2011-3192 (overlapping `Range` headers → CPU/memory exhaustion). *Reco:* upgrade/patch web server; restrict excessive byte-range requests; WAF rules.
- **5.22 Bearer Token in Local Storage** (`/business-compass/profile`) — token stored in Local Storage, readable by any JS in-origin; magnifies impact of any XSS (and note 5.9/5.10 are confirmed stored-XSS). *Reco:* use Secure/HttpOnly/SameSite cookies; strong CSP; short token lifetime + rotation; revoke on logout. *(Contradicts pass case 6.1 — see Part D.)*
- **5.23 Improper Input Validation in Restricted Dropdown Fields** — arbitrary values accepted in place of predefined dropdown/lookup/master-data options by intercepting requests. **Auditor explicitly calls this systemic**: "observed across multiple functionalities and endpoints, indicating a systemic lack of server-side validation for controlled input fields." *Reco:* server-side whitelist validation against reference data; consistent across create/update/import/API paths.
- **5.24 Session Reuse Leads To Authentication Bypass** — after account lockout ("Contact Administrator"), a previously captured valid bearer token **still worked**. Lockout prevents new logins only; existing sessions stay active. *Reco:* invalidate all active sessions/tokens on lockout; verify account status on every authenticated request.
- **5.25 Lack of Rate Limiting on Incident Creation** (`/safety/incident`, Add Incident).
- **5.26 Improper Server-Side Validation of Character Length** (`incident[description]`, 240-char client limit bypassable).
- **5.28 / 5.29 Username & Account Enumeration** — distinct messages ("No user found", "No organisation found", "No organizations found for this email address") at both `/login` and `/forgot-password` reveal whether an account/organization exists. *Reco:* generic responses; identical status codes, bodies, and **response timing**; rate limiting; CAPTCHA after repeated failures.

---

## B.4 §6 Pass Cases — ALL 22 CONTROLS

> These are the security controls the auditor tested and found **satisfactory**. No vulnerability was identified in any of these test cases.

### 6.1 Session Management: Session Token Exposure ✅
**Objective:** Verify session identifiers/auth tokens are not exposed through client-side storage accessible to malicious scripts.
**Observations:**
- `document.cookie` returned an empty value → auth cookies not accessible via JavaScript (consistent with HttpOnly cookies).
- `localStorage` contained only non-sensitive application preferences (theme settings, UI table preferences).
- `sessionStorage` contained only non-sensitive application state.
- No session IDs, JWTs, access tokens, refresh tokens, or other credentials found in client-side storage.

**PoC:** Authenticate at `https://web.gophygital.work/`, open DevTools → Console/Storage, execute `document.cookie`, `localStorage`, `sessionStorage`, review output.
**Conclusion:** The application adequately protects session identifiers from client-side access. **Passed.**
> ⚠️ **Directly contradicts finding 5.22** — see Part D.

---

### 6.2 Authentication: Improper JWT Signature Validation ✅
**Objective:** Verify the application rejects JWTs with modified payloads or invalid signatures.
**Observations:** A valid JWT returned HTTP 200 OK. The JWT was then modified, producing an invalid signature. The application rejected the tampered token with **HTTP 401 Unauthorized — "Unauthorized: invalid token"**, confirming the server verifies the JWT signature before processing authenticated requests.
**PoC:** Capture an authenticated request with a valid JWT → confirm 200 OK → decode and modify payload/signature without re-signing → replay → observe rejection.
**Conclusion:** Correctly validates JWT signatures. No authentication bypass. **Passed.**

---

### 6.3 Wrong Algorithms Usage Depending on Context ✅
**Objective:** Verify cryptographic algorithms are used appropriately for their intended purpose (certificate signatures, key exchange, cipher suites).
**Observations:** Analyzed via OpenSSL. Certificate signed with **ECDSA with SHA-384**; negotiated cipher suite **ECDHE-ECDSA-AES256-GCM-SHA384**; key exchange uses **X25519** for Forward Secrecy. No misuse of cryptographic primitives identified.
**PoC:** `openssl s_client -connect web.gophygital.work:443` → review protocol version, negotiated cipher suite, certificate signature algorithm, key exchange algorithm.
**Conclusion:** Appropriate algorithms for certificate signing, key exchange, and encrypted communication. **Passed.**

---

### 6.4 Weak Algorithms Usage ✅
**Objective:** Verify no weak/deprecated cryptographic protocols or cipher suites are supported.
**Observations:** Assessed with Nmap `ssl-enum-ciphers`. Server supports **only TLS 1.2** and negotiates strong cipher suites. **No** deprecated SSL/TLS versions or weak algorithms (RC4, DES, 3DES, MD5, NULL, EXPORT) identified.
**PoC:** `nmap --script ssl-enum-ciphers -p443 web.gophygital.work`
**Conclusion:** Strong TLS cipher suites; no weak algorithm usage. **Passed.**

---

### 6.5 Sensitive Data Encryption at Rest and In Transit ✅ (partial)
**Objective:** Verify sensitive information is encrypted in transit (TLS) and at rest where applicable.
**Observations:** Traffic captured with Wireshark. TLS handshake successfully established before any application data was exchanged; subsequent traffic transmitted as encrypted TLS Application Data over HTTPS.
> **Auditor caveat:** "The capture does not provide visibility into how data is stored on the server; therefore, **encryption of data at rest could not be verified** through this test."

**PoC:** Wireshark capture, filter `tcp.port == 443`, verify TLS handshake (Client Hello / Server Hello) and encrypted Application Data; inspect packets for plaintext.
**Conclusion:** Data in transit properly encrypted; no plaintext transmission observed. **Encryption at rest requires additional server-side assessment.**

---

### 6.6 Check for Brute Force Protection ✅
**Objective:** Verify protection against automated/repeated authentication attempts via CAPTCHA or other server-side controls.
**Observations:**
- Login required completing a CAPTCHA challenge before processing login attempts.
- Automated login attempts via Burp Suite could not proceed without a valid CAPTCHA response.
- The CAPTCHA was **validated by the server**, preventing repeated automated authentication.
- No evidence the CAPTCHA protection could be bypassed.

**PoC:** Navigate to `https://web.gophygital.work/login` → intercept auth request → attempt multiple automated logins via Intruder with varied credentials → observe CAPTCHA enforcement and rejection of requests lacking valid CAPTCHA.
**Conclusion:** Effective protection against automated brute force attacks. **Passed.**

---

### 6.7 Check for Account Lockout ✅
**Objective:** Verify an effective account lockout mechanism protects against brute-force.
**Observations:**
- Limited number of consecutive failed login attempts allowed.
- **After five consecutive invalid password attempts, the account is automatically locked.**
- Appropriate account lockout message displayed.
- Account cannot be accessed even with valid credentials while lockout is active.

**PoC:** Enter a valid email with an invalid password five consecutive times → verify lockout and message.
**Conclusion:** Correctly implements account lockout after five failed attempts. **Passed.**
> ⚠️ Note interaction with finding **5.24** — lockout blocks *new logins* but does not invalidate *existing* tokens.

---

### 6.8 Check Credentials Only Delivered Over HTTPS ✅
**Objective:** Verify credentials are transmitted only over secure HTTPS connections.
**Observations:** Credentials submitted through a secure HTTPS connection using HTTP/1.1. No credentials observed over unencrypted HTTP.
**PoC:** Access login page → enter valid credentials → intercept via Burp → verify HTTPS transport.
**Conclusion:** Credentials securely transmitted over HTTPS. **Passed.**

---

### 6.9 Check for Format String Vulnerability ✅
**Objective:** Verify user-supplied input is not interpreted as format string specifiers.
**Observations:**
- Tested with common format string inputs across multiple user-controlled fields: the **Search field** on the Tasks page and the **Username field** on the Profile page, plus other available input fields.
- Submitted values were accepted and stored/displayed as **plain text**.
- No format specifiers interpreted or processed.
- No unexpected behavior, application errors, server exceptions, crashes, or information disclosure.

**PoC:** `https://web.gophygital.work/business-compass/tasks?page=1` (Search field) and `https://web.gophygital.work/business-compass/profile` (Username field) → submit format-string test values → observe responses.
**Conclusion:** Not vulnerable to Format String Injection. **Passed.**

---

### 6.10 Check for HTTP Verb Tampering ✅
**Objective:** Verify the application enforces HTTP methods and rejects unsupported verbs.
**Observations:**
- Login endpoint `/api/users/sign_in.json` (normally POST) tested with GET, PUT, DELETE, PATCH, HEAD, OPTIONS.
- The application responded **HTTP 404 Not Found** or otherwise rejected modified requests.
- Similar testing on other accessible endpoints produced consistent rejections.
- No authentication bypass, authorization bypass, or unexpected behavior observed.

**PoC:** Intercept valid `POST /api/users/sign_in.json` → send to Repeater → change method → send each → observe rejection → repeat across other endpoints.
**Conclusion:** Correctly enforces supported HTTP methods. **Passed.**

---

### 6.11 Check Session Token Randomness ✅
**Objective:** Verify unique and sufficiently unpredictable Bearer tokens are generated per session.
**Observations:**
- Multiple authentication sessions established; issued Bearer tokens collected and compared (via `/pms/users/get_user_role.json`).
- **Each authentication session generated a unique JWT Bearer token.**
- No evidence of token reuse or obvious sequential patterns.
- JWT payload contained standard authentication claims; each token protected by a valid signature.

**PoC:** Authenticate repeatedly → capture Bearer tokens from `/pms/users/get_user_role.json` → compare for uniqueness, patterns, consistency.
**Conclusion:** Generates unique session tokens; no predictability observed. **Passed.**

---

### 6.12 Mass Assignment Validation ✅
**Objective:** Verify users cannot modify security-sensitive attributes (e.g. `role`, `isAdmin`) via client-controlled requests/responses.
**Observations:** Privileged parameters `role: "admin"` and `isAdmin: true` were injected into authenticated request bodies; privilege-related fields in server responses were also modified before client processing. The application **correctly enforced server-side validation and authorization** — injected parameters were ignored (or requests rejected), and user privileges remained unchanged. Response tampering produced no privilege escalation because the server enforces authorization independently of client-side data.
**PoC:** Log in as low-privileged user → intercept profile/update request → add `{ "role": "admin", "isAdmin": true }` → forward → verify ignored/rejected → also modify privilege fields in the response → attempt admin functionality → verify no additional privileges granted.
**Conclusion:** **Not vulnerable to Mass Assignment.** Authorization decisions enforced on the backend. **Passed.**

---

### 6.13 Check For NULL/Invalid Session Token (Bearer Token Validation) ✅
**Objective:** Verify requests with missing/null/invalid tokens are rejected.
**Observations:**
- The `Authorization` header was removed from an intercepted authenticated request.
- Server responded **HTTP 401 Unauthorized**.
- Repeated across multiple authenticated endpoints — **consistently 401** when the Bearer token was removed.
- No protected endpoint was accessible without a valid Bearer token.

**PoC:** Intercept `/pms/users/get_user_role.json` → send to Repeater → remove `Authorization: Bearer` header → send → verify 401 → repeat on additional endpoints.
**Conclusion:** Correctly enforces authentication on protected APIs. **Passed.**

---

### 6.14 Check for OTP Flooding ✅
**Objective:** Verify excessive OTP generation requests are rate-limited.
**Observations:**
- The application initially accepted a limited number of OTP requests.
- After the configured threshold, the server responded **"Too Many Requests"**.
- No additional OTPs generated after rate limiting triggered.
- Server-side rate limiting successfully enforced on the OTP generation endpoint.

**PoC:** Forgot Password → enter valid registered email → send OTP → intercept request → send to Intruder → Null Payload attack with 50 requests → observe "Too Many Requests" and blocked subsequent OTP generation.
**Conclusion:** Successfully enforces rate limiting on OTP generation, preventing OTP flooding. **Passed.**

---

### 6.15 HTTP Parameter Pollution (HPP) ✅
**Objective:** Verify secure handling of duplicate HTTP parameters.
**Observations:**
- Login request intercepted (credentials in JSON format).
- The `email` parameter was duplicated within the JSON while keeping the rest unchanged.
- Server responded **HTTP 401 Unauthorized** — malformed request not accepted for authentication.
- No evidence duplicate parameters altered authentication logic, bypassed controls, or granted unauthorized access.

**PoC:** Capture login request at `/login` → duplicate the `email` parameter in the JSON body → send → observe response.
**Conclusion:** Handles duplicate JSON parameters securely. **Passed.**

---

### 6.16 Session Termination After Logout ✅
**Objective:** Verify sessions are terminated after logout and previously authenticated pages are inaccessible without re-authentication.
**Observations:**
- After authentication, an authenticated page was accessed to confirm an active session.
- User logged out via the application's logout functionality.
- Browser **Back button** was used to attempt to revisit the previously authenticated page.
- The application **consistently redirected to the login page** instead of displaying authenticated content.
- No previously authenticated pages accessible after logout.

**PoC:** Authenticate → access `https://web.gophygital.work/vas/projects` → verify accessible → log out → press Back → observe redirect to login.
**Conclusion:** Properly invalidates authenticated sessions upon logout and enforces re-authentication. **Passed.**
> ⚠️ **Directly contradicts finding 5.14** — see Part D. (This test only checks browser-history/UI behaviour; 5.14 tested the raw JWT against the API.)

---

### 6.17 Check HTTP Strict Transport Security (HSTS) ✅
**Objective:** Verify HSTS is implemented via the `Strict-Transport-Security` response header.
**Observations:**
- The application's HTTP responses **include the `Strict-Transport-Security` header**.
- The HSTS header is returned over HTTPS responses.
- The header instructs browsers to communicate only over HTTPS.
- No issues related to HSTS configuration observed.

**PoC:** Capture an HTTPS response in Burp → inspect response headers → observe `Strict-Transport-Security` with an appropriate value.
**Conclusion:** HSTS implemented, ensuring browsers enforce secure HTTPS communication. **Passed.**
> ⚠️ **Directly contradicts finding 5.16**, which lists HSTS as absent — see Part D.

---

### 6.18 Check that CAPTCHA Cannot Be Replayed After Validation ✅
**Objective:** Verify a validated CAPTCHA cannot be reused in subsequent requests.
**Observations:**
- CAPTCHA request and validation request captured via Burp.
- A previously validated CAPTCHA value was replayed in a subsequent request.
- The application **rejected the reused CAPTCHA** and required a new one.
- CAPTCHA replay attacks successfully prevented.

**PoC:** Login → complete CAPTCHA → capture request → send to Repeater → replay with the previously validated CAPTCHA value → observe rejection.
**Conclusion:** Prevents CAPTCHA replay; requires a new CAPTCHA per attempt. **Passed.**

---

### 6.19 Check that the Login Form is Delivered Over HTTPS ✅
**Objective:** Verify the login page and credential submission are served only over HTTPS.
**Observations:**
- Login page served over HTTPS.
- Credentials transmitted through an encrypted HTTPS connection.
- **Attempts to access the login page over HTTP were automatically redirected to HTTPS.**

**PoC:** Access login page → enter valid credentials → verify in Burp that the request used HTTPS (HTTP/1.1).
**Conclusion:** Login form and authentication requests delivered over secure HTTPS. **Passed.**

---

### 6.20 Check SSL/TLS Versions and Cipher Suites ✅
**Objective:** Verify only secure SSL/TLS versions, strong algorithms, and robust cipher suites are supported.
**Observations:**
- Server supports **TLS 1.2**.
- **All supported cipher suites rated `A` by Nmap.**
- Secure cipher suites enabled: AES-GCM, ChaCha20-Poly1305, AES-CCM.
- **ECDHE** key exchange provides Perfect Forward Secrecy (PFS).
- No weak/deprecated cipher suites (RC4, DES, 3DES, NULL, EXPORT, MD5) detected.

**PoC:** `nmap --script ssl-enum-ciphers -p 443 web.gophygital.work` → observe only Grade A cipher suites for TLS 1.2.
**Conclusion:** Only strong SSL/TLS cipher suites supported. **Passed.**

---

### 6.21 Integrity and Security of CAPTCHA ✅
**Objective:** Verify CAPTCHA is validated server-side and tampered values cannot bypass authentication.
**Observations:**
- Authentication request containing the CAPTCHA value intercepted and forwarded to Repeater.
- The CAPTCHA token/value was **deliberately modified by removing one or more characters**.
- Server responded **HTTP 400 Bad Request** — modified CAPTCHA detected as invalid.
- CAPTCHA validation performed **server-side**; tampered request rejected.
- No evidence an altered CAPTCHA value could bypass verification.

**PoC:** Capture login request with CAPTCHA at `/login` → Repeater → remove characters from the CAPTCHA value → send → observe HTTP 400.
**Conclusion:** CAPTCHA integrity and validation functioning as intended. **Passed.**

---

### 6.22 Check for Cache Management on HTTP ✅
**Objective:** Verify sensitive/authenticated content is not cached by browsers or intermediary proxies.
**Observations:** The authenticated page `https://web.gophygital.work/vas/projects` returned:
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```
- These instruct browsers and intermediary caches not to store sensitive content and to always revalidate.
- **Cache control directives were also present within the HTML meta tags**, providing additional browser-side cache prevention.
- No insecure cache directives (`public`, `max-age`) observed.

**PoC:** Authenticate → access `/vas/projects` → intercept HTTP response → review cache-related directives.
**Conclusion:** Correctly implements HTTP cache management controls. **Passed.**

---

## B.5 Appendices

### Appendix A: Recommended Security Headers

| Header | Description / Recommendation |
|---|---|
| **Content Security Policy (CSP)** | Allows a whitelist defining approved sources of content. By restricting where browsers can load assets (js, css), CSP acts as a countermeasure to XSS attacks. Ref: `https://scotthelme.co.uk/content-security-policy-an-introduction/` |
| **HTTP Strict Transport Security (HSTS)** | The target website is served from both HTTP and HTTPS and lacks HSTS policy implementation. HSTS declares that complying user agents must interact using only secure HTTPS connections, communicated via the `Strict-Transport-Security` header, specifying a period during which the user agent accesses the server only securely. |
| **X-XSS-Protection** | The application is missing the X-XSS-Protection header, meaning the site could be at risk of Cross-site Scripting (XSS) attacks. |
| **Secure Flag Not Set** | This cookie does not have the Secure flag set. The Secure flag instructs the browser that the cookie can only be accessed over secure SSL/TLS channels — an important protection for session cookies. |
| **HTTP Only Flag Not Set** | If the HttpOnly flag is included in the HTTP response header, the cookie cannot be accessed through client-side script (where the browser supports the flag). |

### Appendix B: Types of Assessments

The report documents these penetration testing approaches: **Red Team Assessments**, **Bug Bounties**, **Black Box Approach**, **Grey Box Approach**, **War Dialing**, **Wireless Hacking**, **Social Engineering**, **War Driving**, **Business Risk Based Approach**, **Source Code Review**, **Internal Penetration Testing**, **Vulnerability Assessment**, **Stress Testing**, **Denial of Service Testing**.

Notable definitions:
- **Black Box:** only the URL of the website is known. Enumeration of technologies, mapping, identification of fault injection points, input validation and logical vulnerabilities, and OWASP Top 10 attacks.
- **Grey Box:** a dummy user account with least privilege is requested to test authentication/authorization, privilege escalation, and authorization bypass.
- **Source Code Review:** detects vulnerabilities early in the SDLC (dataflow attacks, XSS, injection, file inclusion/execution, information leakage).

---

# Part C — Tooling & Methodology

Tools referenced across both reports: **Burp Suite** (Proxy, Repeater, Intruder), **Postman**, **Nmap** (`ssl-enum-ciphers`), **OpenSSL**, **Wireshark**, **ExifTool / Jimpl** (EXIF metadata viewer), **WhatWeb**, **Httpx**, **Commix**, **SSTIMap** (all listed as Open Source).

Severity scoring follows **CVSS** base metrics. Web testing followed the **Black Box Approach**.

---

# Part D — Our Analysis (NOT from the reports)

> Everything below is our own review of the two documents, not auditor content. Useful when responding to the vendor or planning remediation.

## D.1 Internal contradictions between §5 findings and §6 pass cases

The Web report contains **three direct contradictions** where a control is reported as both a vulnerability and a pass. These should be raised with ARM Innovations before remediation planning, as they change scope materially:

| Finding (§5) | Pass Case (§6) | Contradiction |
|---|---|---|
| **5.22** — Bearer token **is** stored in Local Storage (Medium, CWE-922) | **6.1** — "No session IDs, JWTs, access tokens, refresh tokens... were found in client-side storage" ✅ | Mutually exclusive claims about the same storage mechanism |
| **5.14** — Session **not** invalidated after logout; JWT stays valid (Medium, CWE-613) | **6.16** — "Properly invalidates authenticated sessions upon logout" ✅ | 6.16 only tested the browser Back button (UI/route guard); 5.14 tested the raw JWT against the API. **5.14 is the more rigorous test and should be treated as authoritative.** |
| **5.16** — HSTS listed among absent security headers (Medium, CWE-693) | **6.17** — "The application's HTTP responses include the `Strict-Transport-Security` header" ✅ | Direct conflict; Appendix A also repeats the "lacks HSTS" claim |

**Likely explanation for 5.22 vs 6.1 and 5.16 vs 6.17:** different hosts/paths were tested (`web.gophygital.work` root vs `/business-compass/profile`; possibly different environments or a CDN/proxy layer). Worth asking the auditor to specify the exact host, path, and timestamp for each.

## D.2 Duplicate findings

- **Web 5.17** (Medium) and **Web 5.27** (Low) are the **same finding** — `Server: nginx/1.28.0` disclosure via HTTP response header, same asset, same CWE-200, same recommendation (`server_tokens off;`). Counted twice at two different severities. Correcting this reduces the web count from 29 → 28 and removes one Medium.
- **API 5.7** (High, EXIF disclosure) and **API 5.9** (Medium, EXIF disclosure via publicly accessible attachment) are near-duplicates of the same root cause (no EXIF stripping on upload), differing only in which endpoint surfaced it.
- **API 5.6** (High, BOLA in Attachment Download) and **API 5.13** (Medium, IDOR in Attachment Download) likewise overlap heavily — same endpoint family (`/attachfiles/{id}?show_file=true`), same root cause.

Deduplicating does not reduce the actual work: all of these collapse into a small number of **systemic** fixes.

## D.3 The real remediation picture — 45 findings collapse into ~8 root causes

| Root cause | Findings | Where it must be fixed |
|---|---|---|
| **1. Missing object-level authorization (BOLA/IDOR)** | API 5.1, 5.3, 5.4, 5.6, 5.13; Web 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8, 5.11, 5.13 — **14 of 45 findings, incl. 5 of the 6 Criticals** | **Backend only.** Every endpoint taking a client-supplied ID must verify ownership/tenancy before responding. This is the single highest-value fix in both reports. |
| **2. No EXIF stripping on image upload** | API 5.7, 5.9; Web 5.20 | Backend upload pipeline |
| **3. PDFs with active content accepted & served inline** | API 5.8; Web 5.9, 5.10 | Backend upload validation + `Content-Disposition: attachment` |
| **4. Missing rate limiting / anti-replay** | API 5.11, 5.12; Web 5.19, 5.25 | Backend |
| **5. Client-side-only input validation** | API 5.15; Web 5.23, 5.26 | Backend (auditor calls 5.23 **systemic**) |
| **6. Token lifecycle & storage** | API 5.5; Web 5.6, 5.14, 5.22, 5.24 | **Backend + frontend** (see D.4) |
| **7. Information disclosure via headers/errors** | API 5.14, 5.16; Web 5.15, 5.16, 5.17, 5.27 | Infra / nginx config + backend error handling |
| **8. Auth-response information leakage & framing** | Web 5.12, 5.28, 5.29; API 5.10 (CORS) | Backend responses + nginx headers |

**The overwhelming majority of these findings are backend/infrastructure issues, not frontend issues.** This repo (`fm-matrix-revamp`) can only address a narrow slice — see below.

## D.4 What is actionable in THIS repository

Verified against the current codebase:

1. **Web 5.22 — Bearer token in Local Storage.** ✅ **Confirmed applicable.** Verified: `src/utils/auth.ts:99` defines `TOKEN: "token"`, written at `auth.ts:142` (`localStorage.setItem`), read at `auth.ts:147,229`, cleared at `auth.ts:257`. Also read directly in `src/utils/withoutTokenBase.ts` and `src/components/Header.tsx:218`. Moving to `HttpOnly` cookies is a **joint backend+frontend change** and cannot be done frontend-only. Interim mitigations available here: tighten CSP, shorten token lifetime, ensure token clear + `posthog.reset()` on logout (already present at `auth.ts:257,262`).

2. **Web 5.16 / Appendix A — Missing security headers (CSP, X-Frame-Options, etc.).** ⚠️ *Partially applicable, with a caveat worth flagging to the auditor:* `index.html` in this repo **does** define a CSP via `<meta http-equiv="Content-Security-Policy">` (one active tag; two others are empty/commented out). However, the report checks **HTTP response headers**, and a `<meta>` CSP is not an HTTP header — it is also strictly weaker, because **`frame-ancestors` is ignored in meta-tag form**, which is exactly the directive needed for Clickjacking finding 5.12. Verified: `index.html` contains **no** `frame-ancestors` and **no** `X-Frame-Options`. **Both must be set at the nginx/server layer; they cannot be fixed from this repo.**

3. **Web 5.12 — Clickjacking on the login page.** ❌ Not fixable here — requires `X-Frame-Options` / CSP `frame-ancestors` as real response headers from nginx.

4. **Web 5.28 / 5.29 — Account enumeration via login/forgot-password messages.** ⚠️ The *message text* originates from API responses, but this repo renders them (`src/pages/LoginPage.tsx` handles the org-lookup flow). Genuinely fixing this requires the **backend** to return generic messages with consistent status codes and timing; the frontend should not display distinguishing errors. Worth a coordinated ticket.

5. **API 5.5 / Web 5.6 — Access token in URL query parameter.** ✅ **Confirmed applicable, and this is the single most frontend-actionable finding in either report.** Verified in the current codebase:
   - **72 files** under `src/` construct request URLs containing `access_token=<token>` in the query string.
   - `src/components/FinalClosureModal.tsx:343` and `src/pages/IncidentNewDetails.tsx:1157,1248` hit **exactly** the endpoint named in API §5.6's affected-asset list: `/pms/incidents/inc_clousure_details.json?access_token=`.
   - Other clusters: `src/components/InventoryAnalyticsCard.tsx` (~8 export URLs), `src/components/FBAnalyticsComponents.tsx` (3), `src/components/RestaurantOrdersTable.tsx`, `src/ViewTrainingPerformance.tsx`, `src/features/embedded/EmbeddedView.tsx`.
   - Many are **export/download URLs opened directly in the browser** (`window.open`) — which is precisely the leak path the auditor describes (browser history, Referer header, proxy/CDN logs).

   *Fix:* move these to `Authorization: Bearer` headers via `fetch`/axios + blob download instead of navigating to a tokenized URL. Note `src/features/embedded/EmbeddedView.tsx:28` may be constrained by a third-party embed contract — verify before changing.

   Reproduce the inventory: `grep -rl "access_token=" src | wc -l`

6. **API 5.10 — CORS wildcard with credentials.** ❌ Backend/nginx only.

## D.5 Suggested priority order

1. **Immediate (Critical):** Backend object-level authorization on all ID-taking endpoints — fixes 14 findings including 5 of 6 Criticals. Start with the cross-tenant ones (Web 5.2 MSafe report `company_id`, Web 5.4 vendor banking data, API 5.1 user deletion).
2. **Immediate (Critical):** API 5.2 — stop accepting the Spree API key as a Bearer token; rotate all API keys.
3. **High:** Upload pipeline hardening — EXIF stripping + PDF active-content rejection + `Content-Disposition: attachment` (fixes 6 findings at once).
4. **High:** Token lifecycle — server-side revocation on logout **and on account lockout** (Web 5.14, 5.24), stop passing tokens in URLs (API 5.5, Web 5.6). ← *the URL-token half is frontend work in this repo, 72 files; see D.4 item 5. This is the one item the frontend team can start on immediately without backend coordination.*
5. **Medium:** nginx header hardening — `server_tokens off`, X-Frame-Options/CSP `frame-ancestors`, HSTS, X-Content-Type-Options, Referrer-Policy; fix CORS wildcard+credentials.
6. **Medium:** Server-side validation (length limits, dropdown whitelists) and rate limiting on creation endpoints.
7. **Low:** Generic auth/reset error messages; sanitize verbose upload errors; SSH MAC algorithm restriction; byte-range DoS patching.

## D.6 Open questions for ARM Innovations

1. Please resolve the three §5↔§6 contradictions (5.22↔6.1, 5.14↔6.16, 5.16↔6.17), specifying exact host, path, and test timestamp for each.
2. Confirm whether 5.17 and 5.27 are intended as one finding; if so, which severity is correct.
3. §5.10 (API) states "check other endpoints as well and all are misconfigured with CORS" — please provide the **full endpoint list**, as the summary table names only one.
4. §6.5 explicitly could not verify **encryption at rest**. Is a server-side assessment in scope for Round 2?
5. Both reports were conducted against **UAT/staging** hosts (`fm-uat-api.lockated.com`, `web.gophygital.work`). Please confirm whether production carries the same configuration, particularly for the header/CORS/TLS findings.

---

*Digest generated from the two source PDFs. For any remediation decision, verify against the original PDF — this file is a transcription aid, not a substitute.*
