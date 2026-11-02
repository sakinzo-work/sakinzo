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
            src={assetUrl("assets/what-we-do-iot.webp")}
            width={"2170"}
            height={"725"}
            alt={""}
            fetchPriority={"high"}
            decoding={"async"}
            style={{
              "--cover-position": "78% center",
              "--cover-mobile-position": "74% center",
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
                <T>{"IoT Smart Home Solutions"}</T>
              </span>
            </nav>
            <div className={"service-hero-grid"}>
              <div>
                <span className={"service-eyebrow"}>
                  <T>{"IoT Smart Home Solutions"}</T>
                </span>
                <h1>
                  <T>
                    {"Connected spaces with controls people can understand."}
                  </T>
                </h1>
                <p className={"service-hero-copy"}>
                  <T>
                    {
                      "Software for smart-home monitoring, device integrations and automation workflows across connected living and building systems."
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
                <T>{"Bring devices, data and everyday routines together."}</T>
              </h2>
            </div>
            <div>
              <p>
                <T>
                  {
                    "Smart-home experiences need a clear view of device state and controls that behave predictably. We connect supported equipment and cloud services to applications designed around the needs of occupants and operators."
                  }
                </T>
              </p>
              <p>
                <T>
                  {
                    "We plan device identity, permissions, automation rules and the behavior of the system when a device or network is unavailable. Hardware compatibility and installation responsibilities are established during discovery."
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
                  <T>{"Device and platform integration"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Connections to supported sensors, controllers and device platforms, with a clear view of state and connectivity."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Automation and monitoring"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Rules, schedules, alerts and dashboards for agreed comfort, equipment and energy-monitoring workflows."
                    }
                  </T>
                </p>
              </article>
              <article>
                <span className={"service-index"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Resident and operator applications"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Interfaces for device controls, permissions, notifications and day-to-day management."
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
                <T>{"Device compatibility and integration plan"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Monitoring and automation services"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"User controls and management interfaces"}</T>
              </li>
              <li>
                <span aria-hidden={"true"}>
                  <T>{"✓"}</T>
                </span>
                <T>{"Testing and operational guidance"}</T>
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
                  <T>{"Map the space"}</T>
                </h3>
                <p>
                  <T>
                    {"Understand devices, users and the intended routines."}
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"02"}</T>
                </span>
                <h3>
                  <T>{"Define the controls"}</T>
                </h3>
                <p>
                  <T>{"Agree permissions, rules and connectivity behavior."}</T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"03"}</T>
                </span>
                <h3>
                  <T>{"Connect the experience"}</T>
                </h3>
                <p>
                  <T>
                    {"Build integrations, monitoring and user applications."}
                  </T>
                </p>
              </li>
              <li>
                <span className={"service-step-number"} aria-hidden={"true"}>
                  <T>{"04"}</T>
                </span>
                <h3>
                  <T>{"Validate the routines"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Test controls, alerts and offline behavior with supported devices."
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
                  <T>{"Will this work with every smart-home device?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "Compatibility depends on each device and its supported interfaces. We review the equipment and available APIs before agreeing the integration scope."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"Do you install physical hardware?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "Our service focuses on software and integrations. Hardware supply, electrical work and installation responsibilities are agreed separately with the appropriate providers."
                    }
                  </T>
                </p>
              </details>
              <details>
                <summary>
                  <T>{"Can we add devices later?"}</T>
                </summary>
                <p>
                  <T>
                    {
                      "We can design extension points for future devices, while checking compatibility and testing each new integration before it is enabled."
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
                href={"/iot-development"}
                aria-labelledby={"card-iot-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"01"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-iot-development"}>
                  <T>{"IoT Development Services"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Device integration, cloud platforms and applications for connected products, operational monitoring and robotics workflows."
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
                    <T>{"02"}</T>
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
              <RouteLink
                className={"service-card"}
                href={"/architecture-design"}
                aria-labelledby={"card-architecture-design"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"03"}</T>
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
