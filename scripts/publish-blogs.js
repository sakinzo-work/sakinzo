/* Preview: node scripts/publish-blogs.js
   Publish the reviewed batch: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/publish-blogs.js --publish
   Credentials are read from process environment or backend/.env, never saved. */
const fs = require('node:fs');
const path = require('node:path');
const Blog = require('../backend/src/models/Blog');
const Insight = require('../backend/src/models/Insight');
const contentRoot = path.resolve(__dirname, '../content/blogs');
const site = 'https://sakinzo-work.github.io/sakinzo/frontend/';

async function loadPosts(publishedAt = new Date().toISOString()) {
  const metadata = JSON.parse(fs.readFileSync(path.join(contentRoot, 'posts.json'), 'utf8'));
  const slugs = new Set();
  const posts = [];
  for (const [index, item] of metadata.entries()) {
    const bodyPath = path.resolve(contentRoot, item.bodyFile);
    if (!bodyPath.startsWith(contentRoot + path.sep)) throw new Error('Article body must be inside content/blogs.');
    const { bodyFile, ...fields } = item;
    const body = fs.readFileSync(bodyPath, 'utf8').trim();
    const words = body.split(/\s+/).length;
    const post = { ...fields, body, readTime: Math.max(1, Math.ceil(words / 220)), order: index + 1, visible: true, publishedAt };
    await new Blog(post).validate();
    if (slugs.has(post.slug)) throw new Error('Duplicate article slug.'); slugs.add(post.slug);
    const cover = new URL(post.coverImage);
    if (cover.origin !== new URL(site).origin || !fs.existsSync(path.resolve(__dirname, '../frontend/assets', path.basename(cover.pathname)))) throw new Error('A published local cover is required.');
    posts.push(post);
  }
  return posts;
}

function insightFor(post) {
  return { title: post.title, desc: post.excerpt, category: post.category, author: post.author, image: post.coverImage,
    articleUrl: new URL(`blog.html?slug=${encodeURIComponent(post.slug)}`, site).href,
    readTime: post.readTime, publishedAt: post.publishedAt, order: post.order, rating: 0, visible: true };
}

async function publish({ email, password, apiBase = 'https://sakinzo.onrender.com/api', posts, fetchImpl = fetch }) {
  if (!email || !password) throw new Error('Admin publishing credentials are required.');
  posts ||= await loadPosts();
  for (const post of posts) await new Insight(insightFor(post)).validate();
  let token;
  async function request(route, method = 'GET', body) {
    let response;
    try {
      response = await fetchImpl(`${apiBase}${route}`, { method, signal: AbortSignal.timeout(60000),
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}) });
    } catch (error) { throw new Error(`${method} ${route} request failed (${error.name || 'network error'}).`); }
    if (!response.ok) throw new Error(`${method} ${route} failed with HTTP ${response.status}.`);
    return response.json();
  }
  const login = await request('/auth/login', 'POST', { email, password }); token = login.token;
  if (!token) throw new Error('Publishing session was not established.');
  const existingPosts = await request('/blogs/admin/all'), existingInsights = await request('/insights/admin/all');
  // Preflight the whole batch; never overwrite unrelated or edited records.
  for (const post of posts) {
    const existing = existingPosts.find(item => item.slug === post.slug);
    if (existing && (existing.body !== post.body || existing.title !== post.title || existing.visible === false)) throw new Error(`Existing article needs manual review: ${post.slug}`);
    const card = existingInsights.find(item => item.articleUrl === insightFor(post).articleUrl);
    if (card && (card.title !== post.title || card.visible === false)) throw new Error(`Existing insight needs manual review: ${post.slug}`);
  }
  const result = [];
  for (const post of posts) {
    const existing = existingPosts.find(item => item.slug === post.slug);
    const saved = existing || await request('/blogs', 'POST', post);
    const insight = insightFor({ ...post, publishedAt: saved.publishedAt });
    if (!existingInsights.some(item => item.articleUrl === insight.articleUrl)) await request('/insights', 'POST', insight);
    result.push({ slug: saved.slug, title: saved.title, url: insight.articleUrl, publishedAt: saved.publishedAt, created: !existing });
  }
  const visible = await request('/blogs');
  for (const post of posts) if (!visible.some(item => item.slug === post.slug && item.body === post.body)) throw new Error(`Public verification failed: ${post.slug}`);
  return result;
}

if (require.main === module) {
  require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });
  (async () => {
    const posts = await loadPosts();
    if (process.argv.includes('--publish')) console.log(JSON.stringify(await publish({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, apiBase: process.env.BLOG_API_BASE, posts }), null, 2));
    else console.log(JSON.stringify(posts.map(post => ({ title: post.title, slug: post.slug, words: post.body.split(/\s+/).length, readTime: post.readTime, coverImage: post.coverImage })), null, 2));
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { loadPosts, publish, insightFor };
