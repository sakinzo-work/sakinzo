import SiteFooter from "../components/SiteFooter.jsx";
import RouteLink from "../components/AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import { assetUrl } from "../lib/paths.js";
import SiteHeader from "../components/SiteHeader.jsx";
export default function Page() {
  return (
    <>
      {"\n  "}
      <RouteLink className={"service-skip"} href={"#main-content"}>
        <T>{"Skip to content"}</T>
      </RouteLink>
      {"\n  "}
      <SiteHeader />
      {"\n  "}
      {"\n  "}
      <main id={"main-content"}>
        {"\n    "}
        <section className={"hero service-hero service-hero-photo"}>
          <img
            className={"service-hero-image"}
            src={assetUrl("assets/service-software-development.webp")}
            width={"1907"}
            height={"825"}
            alt={""}
            fetchPriority={"high"}
            decoding={"async"}
            style={{
              "--cover-position": "76% center",
              "--cover-mobile-position": "78% center",
            }}
          />
          <div className={"wrap"}>
            <nav className={"service-breadcrumbs"} aria-label={"Breadcrumb"}>
              <RouteLink href={"/"}>
                <T>{"Home"}</T>
              </RouteLink>
              <span aria-hidden={"true"}>
                <T>{"/"}</T>
              </span>
              <RouteLink href={"/services"}>
                <T>{"Services"}</T>
              </RouteLink>
              <span aria-hidden={"true"}>
                <T>{"/"}</T>
              </span>
              <span aria-current={"page"}>
                <T>{"PoC, Prototype & MVP Development"}</T>
              </span>
            </nav>
            <div className={"service-hero-grid"}>
              <div>
                <span className={"service-eyebrow"}>
                  <T>{"PoC, Prototype & MVP Development"}</T>
                </span>
                <h1>
                  <T>{"Test the idea. Learn what deserves to be built."}</T>
                </h1>
                <p className={"service-hero-copy"}>
                  <T>
                    {
                      "Focused proofs of concept, interactive prototypes and minimum viable products that answer your most important product questions."
                    }
                  </T>
                </p>
                <div className={"service-hero-actions"}>
                  <RouteLink
                    className={"btn btn-blue"}
                    href={"/contact#form-section"}
                  >
                    <T>{"Discuss your project "}</T>
                    <span aria-hidden={"true"}>
                      <T>{"↗"}</T>
                    </span>
                  </RouteLink>
                  <RouteLink
                    className={"service-hero-secondary"}
                    href={"#capabilities"}
                  >
                    <T>{"Explore capabilities "}</T>
                    <span aria-hidden={"true"}>
                      <T>{"↓"}</T>
                    </span>
                  </RouteLink>
                </div>
              </div>
            </div>
          </div>
        </section>
        {"\n    "}
        <nav className={"service-section-nav"} aria-label={"On this page"}>
          <div className={"wrap"}>
            <RouteLink href={"#overview"}>
              <T>{"Overview"}</T>
            </RouteLink>
            <RouteLink href={"#capabilities"}>
              <T>{"Capabilities"}</T>
            </RouteLink>
            <RouteLink href={"#deliverables"}>
              <T>{"Deliverables"}</T>
            </RouteLink>
            <RouteLink href={"#delivery"}>
              <T>{"How we work"}</T>
            </RouteLink>
            <RouteLink href={"#faq"}>
              <T>{"FAQs"}</T>
            </RouteLink>
          </div>
        </nav>
        {"\n    "}
        <section className={"service-section"} id={"overview"}>
          <div className={"wrap service-overview"}>
            <div>
              <span className={"kicker"}>
                <T>{"The opportunity"}</T>
              </span>
              <h2>
                <T>
                  {"Build the smallest useful step toward a better decision."}
                </T>
              </h2>
            </div>
            <div>
              <p>
                <T>
                  {
                    "An early product does not need every feature. It needs to test the assumptions that matter. We help distinguish technical feasibility, usability and market learning so the first investment has a clear purpose."
                  }
                </T>
              </p>
              <p>
                <T>
                  {
                    "We define the question, choose an appropriate experiment and build enough to gather useful evidence. The result can inform a larger delivery roadmap or help you change direction early."
                  }
                </T>
              </p>
            </div>
          </div>
        </section>
        {"\n    "}
        <section className={"service-section service-soft"} id={"capabilities"}>
          <div className={"wrap"}>
            <div className={"service-section-heading"}>
              <span className={"kicker"}>
                <T>{"What we can help with"}</T>
              </span>
              <h2>
                <T>{"Capabilities for the work ahead."}</T>
              </h2>
            </div>
            <div className={"service-capabilities"}>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"01"}</T>
                </span>
                <h3>
                  <T>{"Proof of concept"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Technical experiments that investigate an integration, model, device or architectural assumption."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Interactive prototypes"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Realistic product flows for exploring ideas with users and stakeholders before full development."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Minimum viable products"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "A focused first release with the core workflow, essential integrations and a plan for learning from use."
                    }
                  </T>
                </p>
              </article>
            </div>
          </div>
        </section>
        {"\n    "}
        <section className={"service-section"} id={"deliverables"}>
          <div className={"wrap service-deliverables"}>
            <div>
              <span className={"kicker"}>
                <T>{"What you take forward"}</T>
              </span>
              <h2>
                <T>{"Clear outputs."}</T>
                <br />
                <T>{"Useful next steps."}</T>
              </h2>
              <p>
                <T>
                  {
                    "We agree the scope and handover with you before delivery begins."
                  }
                </T>
              </p>
            </div>
            <ul>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Defined assumptions and validation criteria"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Working PoC, prototype or MVP"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Findings and user feedback summary"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Recommendations for the next product phase"}</T>
              </li>
            </ul>
          </div>
        </section>
        {"\n    "}
        <section className={"service-section service-dark"} id={"delivery"}>
          <div className={"wrap"}>
            <div className={"service-section-heading"}>
              <span className={"kicker"}>
                <T>{"How we work"}</T>
              </span>
              <h2>
                <T>{"A shared plan, from start to handover."}</T>
              </h2>
            </div>
            <ol className={"service-process"}>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"01"}</T>
                </span>
                <h3>
                  <T>{"Frame the question"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Identify the assumption that creates the most uncertainty."
                    }
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Choose the experiment"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Agree what to build and how the result will be evaluated."
                    }
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Build and learn"}</T>
                </h3>
                <p>
                  <T>{"Develop the focused experience and gather evidence."}</T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"04"}</T>
                </span>
                <h3>
                  <T>{"Decide the next step"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Review findings and plan expansion, iteration or a change of direction."
                    }
                  </T>
                </p>
              </li>
            </ol>
          </div>
        </section>
        {"\n    "}
        <section className={"service-section"} id={"faq"}>
          <div className={"wrap service-faq-grid"}>
            <div>
              <span className={"kicker"}>
                <T>{"Before we start"}</T>
              </span>
              <h2>
                <T>{"A few useful answers."}</T>
              </h2>
              <p>
                <T>{"Have something else in mind?"}</T>
                <br />
                <RouteLink href={"/contact#form-section"}>
                  <T>{"Talk to our team "}</T>
                  <span aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </RouteLink>
              </p>
            </div>
            <div className={"service-faqs"}>
              <details>
                <summary>
                  <T>
                    {"What is the difference between a PoC, prototype and MVP?"}
                  </T>
                </summary>
                <p>
                  <T>
                    {
                      "A PoC explores technical feasibility, a prototype explores an experience, and an MVP is a usable first release for learning from real users. The right choice depends on the question you need to answer."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>
                    {"Can the first version become the production product?"}
                  </T>
                </summary>
                <p>
                  <T>
                    {
                      "An MVP can be designed for continued development. Experimental PoC code or prototype assets may need to be replaced; we discuss that distinction before delivery."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"How long will it take?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "Timing follows the experiment and scope. We first define the learning goal and required integrations, then propose a delivery plan."
                    }
                  </T>
                </p>
              </details>
            </div>
          </div>
        </section>
        {"\n    "}
        <section className={"service-section service-soft"}>
          <div className={"wrap"}>
            <div className={"service-section-heading service-related-heading"}>
              <div>
                <span className={"kicker"}>
                  <T>{"Keep exploring"}</T>
                </span>
                <h2>
                  <T>{"Connected services."}</T>
                </h2>
              </div>
              <RouteLink href={"/services"}>
                <T>{"View all services "}</T>
                <span aria-hidden={"true"}>
                  <T>{"↗"}</T>
                </span>
              </RouteLink>
            </div>
            <div className={"service-grid"}>
              <RouteLink
                className={"service-card"}
                href={"/business-analysis"}
                aria-labelledby={"card-business-analysis"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"01"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-business-analysis"}>
                  <T>{"Business Analysis"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Requirements, process mapping and product roadmaps that give stakeholders and engineers a shared direction."
                    }
                  </T>
                </p>
                <span className={"service-card-link"}>
                  <T>{"Explore service "}</T>
                  <span aria-hidden={"true"}>
                    <T>{"→"}</T>
                  </span>
                </span>
              </RouteLink>
              <RouteLink
                className={"service-card"}
                href={"/ux-ui-design"}
                aria-labelledby={"card-ux-ui-design"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"02"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-ux-ui-design"}>
                  <T>{"UX/UI Design"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "User research, experience design and interface systems that connect customer needs to buildable digital products."
                    }
                  </T>
                </p>
                <span className={"service-card-link"}>
                  <T>{"Explore service "}</T>
                  <span aria-hidden={"true"}>
                    <T>{"→"}</T>
                  </span>
                </span>
              </RouteLink>
              <RouteLink
                className={"service-card"}
                href={"/full-cycle-development"}
                aria-labelledby={"card-full-cycle-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"03"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-full-cycle-development"}>
                  <T>{"Full-cycle Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "A connected product team for discovery, design, engineering, testing, launch and ongoing improvement."
                    }
                  </T>
                </p>
                <span className={"service-card-link"}>
                  <T>{"Explore service "}</T>
                  <span aria-hidden={"true"}>
                    <T>{"→"}</T>
                  </span>
                </span>
              </RouteLink>
            </div>
          </div>
        </section>
        <section className={"service-cta"}>
          <div className={"wrap"}>
            <div>
              <span className={"kicker"}>
                <T>{"Let’s build something useful"}</T>
              </span>
              <h2>
                <T>{"What would you like to make possible?"}</T>
              </h2>
              <p>
                <T>
                  {
                    "Tell us about your product, your team and the challenge ahead."
                  }
                </T>
              </p>
            </div>
            <RouteLink
              className={"btn btn-blue"}
              href={"/contact#form-section"}
            >
              <T>{"Start a conversation "}</T>
              <span aria-hidden={"true"}>
                <T>{"↗"}</T>
              </span>
            </RouteLink>
          </div>
        </section>
      </main>
      {"\n  "}
      <SiteFooter />
      {"\n\n\n"}
    </>
  );
}
