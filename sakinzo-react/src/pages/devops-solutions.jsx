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
            src={assetUrl("assets/service-devops.webp")}
            width={"2172"}
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
                <T>{"DevOps Solutions"}</T>
              </span>
            </nav>
            <div className={"service-hero-grid"}>
              <div>
                <span className={"service-eyebrow"}>
                  <T>{"DevOps Solutions"}</T>
                </span>
                <h1>
                  <T>{"A clearer path from code to reliable operations."}</T>
                </h1>
                <p className={"service-hero-copy"}>
                  <T>
                    {
                      "Cloud infrastructure, delivery automation and observability that help teams release and operate software with confidence."
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
                <T>{"Make delivery repeatable. Make operations visible."}</T>
              </h2>
            </div>
            <div>
              <p>
                <T>
                  {
                    "Manual releases and unclear infrastructure ownership can make every change harder than it needs to be. We help your team establish repeatable delivery workflows and understand how the application behaves in production."
                  }
                </T>
              </p>
              <p>
                <T>
                  {
                    "We work with your cloud environment and engineering practices to improve deployments, infrastructure management, access controls and operational documentation."
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
                  <T>{"Cloud foundations"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Infrastructure planning and configuration for AWS, Google Cloud or Azure, aligned with the application and operating constraints."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Delivery automation"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "CI/CD pipelines, environment configuration and release checks that reduce repetitive manual work."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Observability and operations"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Monitoring, logging, alerting and recovery procedures that give teams useful operational context."
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
                <T>{"Infrastructure configuration and environment plan"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Automated build and deployment pipelines"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Monitoring and alert configuration"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Deployment, rollback and recovery runbooks"}</T>
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
                  <T>{"Assess"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Review infrastructure, releases and operational pain points."
                    }
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Design"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Plan environments, permissions and the delivery workflow."
                    }
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Automate"}</T>
                </h3>
                <p>
                  <T>{"Implement infrastructure and deployment checks."}</T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"04"}</T>
                </span>
                <h3>
                  <T>{"Operate"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Test recovery, document ownership and hand over workflows."
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
                  <T>{"Do you support our existing cloud provider?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "We work with AWS, Google Cloud and Azure. We first review the services in use and confirm the scope of the required infrastructure and integrations."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>
                    {"Can you improve delivery without replacing our stack?"}
                  </T>
                </summary>
                <p>
                  <T>
                    {
                      "Often, yes. We assess the current tools and workflows and prioritize changes that address the most important delivery and operational problems."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"Can you guarantee uptime or lower cloud costs?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "Availability targets and operating budgets depend on the workload and architecture. We can assess these requirements and recommend measurable improvements without promising a fixed result before analysis."
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
                href={"/qa-testing"}
                aria-labelledby={"card-qa-testing"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"02"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-qa-testing"}>
                  <T>{"QA & Testing"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Practical quality assurance, automated testing and release validation for web, mobile and connected software."
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
                href={"/web-mobile-development"}
                aria-labelledby={"card-web-mobile-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"03"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-web-mobile-development"}>
                  <T>{"Web and Mobile Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Custom websites, web applications and mobile apps built around your users, workflows and business goals."
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
