import RouteLink from "./AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import Localized from "./Localized.jsx";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";
import PageHero from "./PageHero.jsx";
import Markdown from "./Markdown.jsx";
import { parseMarkdown } from "../lib/markdown.js";
import useRemoteData from "../hooks/useRemoteData.js";
import ContentState from "./ContentState.jsx";
import BlogImage from "./BlogImage.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { mediaUrl } from "../lib/api.js";
import covers from "../data/page-covers.js";
import { contentPath, contentSlug } from "../lib/content-slugs.js";
import { useParams, useSearchParams } from "react-router-dom";
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";
function PostCard({ post, posts }) {
  return (
    <article className="post-card">
      <RouteLink
        href={contentPath("blog", post, posts)}
      >
        <div className="post-cover">
          <T>
              <Localized>
                <BlogImage
                  src={post.coverImage}
                  category={post.category}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                />
              </Localized>
          </T>
        </div>
        <div className="post-body">
          <div className="post-meta">
            <span>
              <T>{post.category || "Blog"}</T>
            </span>
            <span>
              <T>{formatDate(post.publishedAt)}</T>
            </span>
            <span>
              <T>{post.readTime || 5}</T>
              <T>{" min read"}</T>
            </span>
          </div>
          <h3>
            <T>{post.title}</T>
          </h3>
          <p>
            <T>{post.excerpt}</T>
          </p>
          <span className="read-link">
            <T>{"Read article \u2192"}</T>
          </span>
        </div>
      </RouteLink>
    </article>
  );
}
function Article({ post }) {
  const content = useMemo(() => parseMarkdown(post.body || ""), [post.body]);
  const image = post.coverImage
    ? mediaUrl(post.coverImage)
    : covers.get("blog", {
        category: post.category,
      })?.image;
  useDocumentMeta(
    {
      title: `${post.title} | Sakinzo Blog`,
      description: String(
        post.excerpt || "Read the latest Sakinzo engineering insights.",
      ).slice(0, 160),
      type: "article",
      image,
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      author: {
        "@type":
          !post.author || post.author === "Sakinzo Team"
            ? "Organization"
            : "Person",
        name: post.author || "Sakinzo Team",
      },
      publisher: {
        "@type": "Organization",
        name: "Sakin.zo",
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      image,
      articleSection: post.category,
      keywords: (post.tags || []).join(", "),
      wordCount: String(post.body || "")
        .trim()
        .split(/\s+/).length,
      url: typeof location === "undefined" ? undefined : location.href,
      inLanguage: "en",
    },
    "blog-article-schema",
  );
  return (
    <>
      <PageHero
        slug="blog"
        category={post.category}
        image={image}
        className="article-header"
      >
        <div className="article-shell">
          <RouteLink className="back" href="/blog">
            <T>{" \u2190 All blogs "}</T>
          </RouteLink>
          <div className="article-meta">
            <span>
              <T>{post.category || "Blog"}</T>
            </span>
            <span>
              <T>{formatDate(post.publishedAt)}</T>
            </span>
            <span>
              <T>{post.readTime || 5}</T>
              <T>{" min read"}</T>
            </span>
            <span>
              <T>{post.author || "Sakinzo Team"}</T>
            </span>
          </div>
          <h1>
            <T>{post.title}</T>
          </h1>
          <p className="article-excerpt">
            <T>{post.excerpt}</T>
          </p>
        </div>
      </PageHero>
      <article className="article article-body">
        <div className="article-shell">
          <T>
              <Localized>
                <BlogImage
                  className="article-cover"
                  src={post.coverImage}
                  category={post.category}
                  alt={post.title}
                  decoding="async"
                />
              </Localized>
          </T>
          <T>
            {content.headings.length > 2 && (
              <Localized>
                <nav className="article-toc" aria-label="In this guide">
                  <h2>
                    <T>{"In this guide"}</T>
                  </h2>
                  <ol>
                    <T>
                      {content.headings.map((heading) => (
                        <li key={heading.id}>
                          <RouteLink href={`#${heading.id}`}>
                            <T>{heading.text}</T>
                          </RouteLink>
                        </li>
                      ))}
                    </T>
                  </ol>
                </nav>
              </Localized>
            )}
          </T>
          <div className="article-content">
            <Markdown parsed={content} />
          </div>
          <T>
            {post.tags?.length > 0 && (
              <div className="article-tags">
                <T>
                  {post.tags.map((tag) => (
                    <span key={tag}>
                      <T>{tag}</T>
                    </span>
                  ))}
                </T>
              </div>
            )}
          </T>
        </div>
      </article>
    </>
  );
}
export default function BlogPage() {
  const { data, loading, error, refresh } = useRemoteData("/blogs");
  const params = useParams(),
    [query] = useSearchParams();
  const slug = params.slug || query.get("slug") || query.get("id") || "";
  const posts = Array.isArray(data) ? data : [];
  const post = slug
    ? posts.find((item) => item.slug === slug || String(item._id) === slug || contentSlug(item, posts, "blog") === slug)
    : null;
  return (
    <>
      <SiteHeader />
      <main id="app">
        <T>
          {post ? (
            <Article post={post} />
          ) : slug ? (
            <section className="blog-article-state">
              <ContentState heading="h1" state={loading ? "loading" : error ? "error" : "empty"}
                title={loading ? "Loading article…" : error ? "This article couldn't be loaded" : "Article not found"}
                description={loading ? "Your guide will be ready in a moment." : error ? "Please try again in a moment." : "Explore our other articles for more ideas and practical guides."}
                onAction={!loading && error ? refresh : undefined} />
              <RouteLink className="blog-back-link" href="/blog"><T>← All blogs</T></RouteLink>
            </section>
          ) : (
            <>
              <PageHero slug="blog">
                <div className="wrap">
                  <div className="crumb">
                    <RouteLink href="/">
                      <T>{"Home"}</T>
                    </RouteLink>
                    <T>{" / Insights "}</T>
                  </div>
                  <div className="eyebrow">
                    <T>{"Blog"}</T>
                  </div>
                  <h1>
                    <T>{"Ideas for building better digital products"}</T>
                  </h1>
                  <p>
                    <T>
                      {
                        " Practical perspectives on product strategy, engineering, AI, IoT and business transformation from the Sakinzo team. "
                      }
                    </T>
                  </p>
                </div>
              </PageHero>
              <section className="section">
                <div className="wrap">
                  <div className="toolbar">
                    <div>
                      <h2>
                        <T>{"Latest articles"}</T>
                      </h2>
                      <p>
                        <T>
                          {
                            " Fresh thinking from the people building real products, platforms and connected systems. "
                          }
                        </T>
                      </p>
                    </div>
                  </div>
                  {!!posts.length && (loading || error) && <ContentState compact state={error ? "error" : "loading"}
                    title={error ? "Showing saved articles" : "Updating articles…"}
                    description="You can keep reading while we check for the latest updates."
                    onAction={refresh} busy={loading} />}
                  <T>
                    {!posts.length && loading ? (
                      <ContentState state="loading" title="Loading articles…" description="Our latest ideas will be ready in a moment." />
                    ) : !posts.length && error ? (
                      <ContentState state="error" title="Articles are temporarily unavailable" description="Please try again in a moment." onAction={refresh} />
                    ) : posts.length ? (
                      <div className="blog-grid">
                        <T>
                          {posts.map((item) => (
                            <PostCard key={item._id || item.slug} post={item} posts={posts} />
                          ))}
                        </T>
                      </div>
                    ) : (
                      <ContentState title="New ideas are on the way" description="Our latest articles will appear here soon." />
                    )}
                  </T>
                </div>
              </section>
              <section className="cta">
                <div className="cta-inner">
                  <h2>
                    <T>{"Have a challenge worth solving?"}</T>
                  </h2>
                  <RouteLink className="btn" href="/contact#form-section">
                    <T>{" Tell us about your project "}</T>
                  </RouteLink>
                </div>
              </section>
            </>
          )}
        </T>
      </main>
      <SiteFooter />
    </>
  );
}
