const assert = require('node:assert/strict');
const { test } = require('node:test');
const { render } = require('../../frontend/blog-content');
const { loadPosts, publish } = require('../../scripts/publish-blogs');

test('blog formatting supports navigable sections, lists and code while escaping HTML and unsafe links', () => {
  const result = render('## A useful section\n\nA **clear** paragraph with `recordId` and [a source](https://example.com/guide).\n\n- First item\n- Second item\n\n## A useful section\n\n```html\n<script>alert(1)</script>\n```\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert(1))');
  assert.equal(result.headings.length, 2);
  assert.notEqual(result.headings[0].id, result.headings[1].id);
  assert.match(result.html, /<strong>clear<\/strong>/);
  assert.match(result.html, /<ul><li>First item<\/li><li>Second item<\/li><\/ul>/);
  assert.match(result.html, /<pre><code class="language-html">&lt;script&gt;/);
  assert.ok(!/<script|<img|href="javascript:/i.test(result.html));
  assert.match(result.html, /href="https:\/\/example.com\/guide"/);
});

test('the four original guides have distinct topics, substantial guidance and valid section links', async () => {
  const posts = await loadPosts('2026-10-30T00:00:00Z');
  assert.equal(posts.length, 4);
  assert.equal(new Set(posts.map(post => post.slug)).size, 4);
  assert.equal(new Set(posts.map(post => post.coverImage)).size, 4);
  for (const post of posts) {
    const result = render(post.body);
    assert.ok(post.body.split(/\s+/).length >= 900, post.slug);
    assert.ok(result.headings.length >= 8, post.slug);
    assert.equal(new Set(result.headings.map(heading => heading.id)).size, result.headings.length);
    assert.ok(!result.html.includes('<h1'), post.slug);
    assert.match(result.html, /<a href="https:\/\//, post.slug);
    assert.equal(post.author, 'Sakinzo Team');
  }
});

test('publishing is idempotent, creates matching homepage cards and refuses to overwrite edited records', async () => {
  const posts = await loadPosts('2026-10-30T00:00:00Z');
  const blogs = [], insights = [], writes = [];
  const fetchImpl = async (url, options) => {
    const route = new URL(url).pathname.replace(/^\/api/, '');
    const ok = data => ({ ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(data)) });
    if (route === '/auth/login') return ok({ token: 'test-session' });
    assert.equal(options.headers.Authorization, 'Bearer test-session');
    if (route === '/blogs/admin/all' || route === '/blogs') {
      if (options.method === 'POST') { const item = { _id: `b${blogs.length + 1}`, ...JSON.parse(options.body) }; blogs.push(item); writes.push(route); return ok(item); }
      return ok(blogs);
    }
    if (route === '/insights/admin/all') return ok(insights);
    if (route === '/insights' && options.method === 'POST') { const item = { _id: `i${insights.length + 1}`, ...JSON.parse(options.body) }; insights.push(item); writes.push(route); return ok(item); }
    throw new Error('Unexpected publishing route');
  };
  const args = { email: 'test@example.com', password: 'test-password', apiBase: 'https://publish.test/api', posts, fetchImpl };
  assert.equal((await publish(args)).filter(item => item.created).length, 4);
  assert.equal(writes.length, 8);
  assert.ok(insights.every(item => item.articleUrl.includes('blog.html?slug=') && item.rating === 0));
  assert.equal((await publish(args)).filter(item => item.created).length, 0);
  assert.equal(writes.length, 8);
  blogs[0].body += '\nReviewed by the editor.';
  await assert.rejects(() => publish(args), /manual review/);
  assert.equal(writes.length, 8);
});
