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
            src={assetUrl("assets/service-iot.webp")}
            width={"1886"}
            height={"834"}
            alt={""}
            fetchPriority={"high"}
            decoding={"async"}
            style={{
              "--cover-position": "78% center",
              "--cover-mobile-position": "72% center",
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
                <T>{"IoT Development Services"}</T>
              </span>
            </nav>
            <div className={"service-hero-grid"}>
              <div>
                <span className={"service-eyebrow"}>
                  <T>{"IoT Development Services"}</T>
                </span>
                <h1>
                  <T>
                    {"Connect devices to decisions that make a difference."}
                  </T>
                </h1>
                <p className={"service-hero-copy"}>
                  <T>
                    {
                      "Device integration, cloud platforms and applications for connected products, operational monitoring and robotics workflows."
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
                <T>{"Build the whole connected ecosystem."}</T>
              </h2>
            </div>
            <div>
              <p>
                <T>
                  {
                    "Connected products span more than a device or a dashboard. We plan how hardware, firmware, connectivity, cloud services and user-facing software will work together under real operating conditions."
                  }
                </T>
              </p>
              <p>
                <T>
                  {
                    "We help define device communication, telemetry, commands and operational visibility so your team can understand and manage the connected system as it grows."
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
                  <T>{"Device and firmware integration"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Communication protocols, device interfaces and integration planning that reflect connectivity and hardware constraints."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"IoT cloud platforms"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Telemetry ingestion, device identity, fleet management and backend services for connected applications."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Monitoring and connected experiences"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Dashboards, alerts, remote workflows and interfaces that make device data useful to operators and customers."
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
                <T>{"Device-to-cloud architecture and interfaces"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Telemetry and device-management services"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Monitoring dashboards and alert workflows"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Integration tests and operational documentation"}</T>
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
                  <T>{"Define the system"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Review devices, operating conditions and the business workflow."
                    }
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Connect the layers"}</T>
                </h3>
                <p>
                  <T>
                    {"Design identity, communication and cloud interfaces."}
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Build the platform"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Implement integrations, data flows and user applications."
                    }
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"04"}</T>
                </span>
                <h3>
                  <T>{"Validate in context"}</T>
                </h3>
                <p>
                  <T>
                    {"Test connectivity, failure handling and operational use."}
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
                  <T>{"Can you integrate hardware we already use?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "We can assess the device interfaces, protocols and available documentation to determine the integration approach and any hardware dependencies."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"Do you support robotics and connected equipment?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "We can develop software integrations, monitoring and operator applications for connected equipment. Hardware-specific control and operating requirements are assessed during discovery."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"What happens when connectivity is unreliable?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "We consider buffering, retry behavior, synchronization and operator visibility according to the device capabilities and the use case."
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
                href={"/ai-development"}
                aria-labelledby={"card-ai-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"02"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-ai-development"}>
                  <T>{"AI Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Custom AI features, model integrations and data workflows designed around useful, measurable product outcomes."
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
