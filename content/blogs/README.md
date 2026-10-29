# Sakinzo guide collection

Four original English guides cover business AI assistants, IoT platform
architecture, AI tools, and business web development. `posts.json` holds the
metadata; the Markdown files hold the article bodies. The author is Sakinzo Team.
References appear inside each guide. Covers reuse the site's existing images.

From the repository root, preview and validate the batch without publishing:

```bash
node scripts/publish-blogs.js
```

To publish, configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the process
environment or the private `backend/.env`, then run:

```bash
node scripts/publish-blogs.js --publish
```

The default API is `https://sakinzo.onrender.com/api`; `BLOG_API_BASE` can select
another deployment. The command creates four visible blog records and matching
homepage insight cards. It verifies public article content afterward. Existing
identical articles are skipped, while edited or hidden matches require review.
No existing article is overwritten, and no ratings are invented. Publish time
is set when records are created; read times are estimated from word counts.

`frontend/blog-content.js` renders headings, numbered and bulleted lists,
code blocks, emphasis and safe links. Raw HTML is displayed as text. Long guides
get a section index, and article pages include BlogPosting metadata.

Run `npm test` and `npm run test:blogs` from `backend/` for content, publishing
and responsive article checks. Screenshots go to `sakinzo-blog-guides` in the
system temporary folder.
