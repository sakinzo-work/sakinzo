import RouteLink from "./AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import pages from "../data/info-pages.json";
import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";
import PageHero from "./PageHero.jsx";
export default function InfoPage({ slug }) {
  const page = pages[slug];
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero slug={slug}>
          <div className="hero-inner">
            <div className="crumb">
              <RouteLink href="/">
                <T>{"Home"}</T>
              </RouteLink>
              <T>{" / "}</T>
              <T>{page.cat}</T>
            </div>
            <div className="eyebrow">
              <T>{page.cat}</T>
            </div>
            <h1>
              <T>{page.title}</T>
            </h1>
            <p className="hero-copy">
              <T>{page.intro}</T>
            </p>
            <div className="hero-actions">
              <RouteLink className="btn btn-blue" href="/contact#form-section">
                <T>{" Start a conversation \u2192 "}</T>
              </RouteLink>
              <RouteLink className="btn btn-ghost" href="#overview">
                <T>{" Explore more "}</T>
              </RouteLink>
            </div>
          </div>
        </PageHero>
        <section className="section" id="overview">
          <div className="wrap intro-grid">
            <div>
              <span className="kicker">
                <T>{"What we do"}</T>
              </span>
              <h2>
                <T>{page.heading}</T>
              </h2>
            </div>
            <div>
              <p className="lead">
                <T>{page.intro}</T>
              </p>
              <p className="body-copy">
                <T>{page.body}</T>
              </p>
            </div>
          </div>
        </section>
        <section className="section alt">
          <div className="wrap">
            <span className="kicker">
              <T>{"Our approach"}</T>
            </span>
            <h2>
              <T>{"Built around outcomes"}</T>
            </h2>
            <div className="cards">
              <T>
                {page.cards.map(([title, text], index) => (
                  <article className="card" key={title}>
                    <div className="card-num">
                      <T>{"0"}</T>
                      <T>{index + 1}</T>
                    </div>
                    <h3>
                      <T>{title}</T>
                    </h3>
                    <p>
                      <T>{text}</T>
                    </p>
                  </article>
                ))}
              </T>
            </div>
            <T>
              {page.stats && (
                <div className="stats">
                  <T>
                    {page.stats.map(([value, label]) => (
                      <div className="stat" key={label}>
                        <strong>
                          <T>{value}</T>
                        </strong>
                        <span>
                          <T>{label}</T>
                        </span>
                      </div>
                    ))}
                  </T>
                </div>
              )}
            </T>
          </div>
        </section>
        <section className="cta">
          <div className="cta-inner">
            <h2>
              <T>{"Have a challenge worth solving?"}</T>
            </h2>
            <RouteLink className="btn btn-blue" href="/contact#form-section">
              <T>{" Tell us about your project \u2192 "}</T>
            </RouteLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
