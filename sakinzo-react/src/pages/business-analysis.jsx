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
            src={assetUrl("assets/service-business-analysis.webp")}
            width={"2171"}
            height={"724"}
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
                <T>{"Business Analysis"}</T>
              </span>
            </nav>
            <div className={"service-hero-grid"}>
              <div>
                <span className={"service-eyebrow"}>
                  <T>{"Business Analysis"}</T>
                </span>
                <h1>
                  <T>
                    {"Turn business questions into a buildable product plan."}
                  </T>
                </h1>
                <p className={"service-hero-copy"}>
                  <T>
                    {
                      "Requirements, process mapping and product roadmaps that give stakeholders and engineers a shared direction."
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
                <T>{"Get clarity on what to build and why."}</T>
              </h2>
            </div>
            <div>
              <p>
                <T>
                  {
                    "Product teams need more than a list of requested features. We work with stakeholders to understand goals, existing processes, user needs and the constraints that shape the solution."
                  }
                </T>
              </p>
              <p>
                <T>
                  {
                    "We turn those discussions into prioritized requirements and clear acceptance criteria, helping your team make informed scope and delivery decisions."
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
                  <T>{"Discovery and stakeholder alignment"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Workshops and interviews that clarify the problem, desired outcomes and decision-making responsibilities."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Requirements and process mapping"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Functional and nonfunctional requirements, workflow diagrams, user stories and acceptance criteria."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Roadmaps and prioritization"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "A practical sequence of product work that accounts for dependencies, value and implementation uncertainty."
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
                <T>{"Business requirements and process maps"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Prioritized product backlog"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"User stories and acceptance criteria"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Product roadmap and decision log"}</T>
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
                  <T>{"Listen"}</T>
                </h3>
                <p>
                  <T>
                    {"Bring stakeholders together around the business problem."}
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Map"}</T>
                </h3>
                <p>
                  <T>{"Document users, processes, systems and constraints."}</T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Specify"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Write requirements and acceptance criteria the team can use."
                    }
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"04"}</T>
                </span>
                <h3>
                  <T>{"Prioritize"}</T>
                </h3>
                <p>
                  <T>
                    {"Agree the delivery sequence and unresolved decisions."}
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
                  <T>{"Is this useful before we hire developers?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "Yes. Discovery and requirements work can help you define the product scope and prepare a clearer brief for an engineering team."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"Can you work with several stakeholder teams?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "Yes. We structure discussions to identify shared goals, conflicting needs and the decisions that require explicit ownership."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"Will the requirements remain fixed?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "Requirements can evolve as the team learns. We document assumptions and priorities so changes can be evaluated against the product goals."
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
                href={"/architecture-design"}
                aria-labelledby={"card-architecture-design"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"01"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-architecture-design"}>
                  <T>{"Architecture Design"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Software architecture, technology evaluation and technical planning that connect business requirements to engineering decisions."
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
