# Catalog cleanup (online stores)

Use when the site is a store and the owner wants product pages fixed. Edits how products are described, nothing else: never touch price, inventory, variants, collections or publish status.

## Contents
- Scan
- Rewrite rules
- Batches

## Scan

Score every product before writing anything (platform API, or a CSV export when none is connected), then show the size of the problem:

| Field | Passes when |
|---|---|
| Title | Says what the product is in plain terms; not a bare SKU, not a keyword pile |
| Description | Says what it is, what it fits, what is included, what differs; a few real sentences |
| Image alt | Present on every image, describes the image (not the title copied in) |
| SEO title and description | Present, unique, distinct from the product title |
| Duplicates | Flag clusters of identical descriptions |

Order the work by revenue or units over the last 90 days, not by score: a product that sells once a year is not worth an approval.

## Rewrite rules

- Title: what it is, then the distinguishing detail (brand, model, size, material).
- Description: first sentence = what and for whom; then dimensions, compatibility, contents, durability.
- Alt: describe the image for someone who cannot see it.
- Facts (dimensions, materials, compatibility, certifications, origin) come from product data or the owner; when missing, flag "to confirm" instead of guessing. Keep the brand's tone from `.studio/state.json` (field `ton`) when rewriting copy.
- Product schema (`Product` + `Offer`): check what the platform already emits before adding a second block.

## Batches

- Save the original values (CSV) before the first write.
- Show 3 full before/after examples and agree on the pattern first.
- Then batches of 20-25 products; each batch gets its own yes, with changes, sample and what is not touched.
- Stop at the first surprise (write error, value that differs from what was sent) and report; after each batch report applied, skipped, failed.
- Without a connected platform: return a corrected CSV for the owner to import and spot-check.
