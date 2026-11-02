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
        <section
          className={"hero service-hero service-hero-photo service-hub-hero"}
        >
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
              <span aria-current={"page"}>
                <T>{"Services"}</T>
              </span>
            </nav>
            <span className={"service-eyebrow"}>
              <T>{"Strategy. Design. Engineering."}</T>
            </span>
            <h1>
              <T>{"Good ideas."}</T>
              <br />
              <span>
                <T>{"Built into useful products."}</T>
              </span>
            </h1>
            <div className={"service-hub-intro"}>
              <p>
                <T>
                  {
                    "From the first product question to the systems that keep it running, find the expertise your next step needs."
                  }
                </T>
              </p>
              <RouteLink
                className={"btn btn-blue"}
                href={"/contact#form-section"}
              >
                <T>{"Find your starting point "}</T>
                <span aria-hidden={"true"}>
                  <T>{"↗"}</T>
                </span>
              </RouteLink>
            </div>
          </div>
        </section>
        <nav
          className={"service-section-nav"}
          aria-label={"Service categories"}
        >
          <div className={"wrap"}>
            <RouteLink href={"#engineering"}>
              <T>{"Engineering & delivery"}</T>
            </RouteLink>
            <RouteLink href={"#technology"}>
              <T>{"Technology solutions"}</T>
            </RouteLink>
          </div>
        </nav>
        <section className={"service-section"} id={"engineering"}>
          <div className={"wrap"}>
            <div className={"service-section-heading"}>
              <span className={"kicker"}>
                <T>{"Across the product lifecycle"}</T>
              </span>
              <h2>
                <T>{"Engineering & delivery"}</T>
              </h2>
              <p>
                <T>
                  {
                    "Plan, design, build and operate software with a connected delivery team."
                  }
                </T>
              </p>
            </div>
            <div className={"service-grid"}>
              <RouteLink
                className={"service-card"}
                href={"/web-mobile-development"}
                aria-labelledby={"card-web-mobile-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"01"}</T>
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
                href={"/full-cycle-development"}
                aria-labelledby={"card-full-cycle-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"02"}</T>
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
              <RouteLink
                className={"service-card"}
                href={"/devops-solutions"}
                aria-labelledby={"card-devops-solutions"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"03"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-devops-solutions"}>
                  <T>{"DevOps Solutions"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Cloud infrastructure, delivery automation and observability that help teams release and operate software with confidence."
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
                    <T>{"04"}</T>
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
                href={"/poc-mvp-development"}
                aria-labelledby={"card-poc-mvp-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"05"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-poc-mvp-development"}>
                  <T>{"PoC, Prototype & MVP Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Focused proofs of concept, interactive prototypes and minimum viable products that answer your most important product questions."
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
                    <T>{"06"}</T>
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
                href={"/ux-ui-design"}
                aria-labelledby={"card-ux-ui-design"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"07"}</T>
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
                href={"/business-analysis"}
                aria-labelledby={"card-business-analysis"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"08"}</T>
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
            </div>
          </div>
        </section>
        <section className={"service-section service-soft"} id={"technology"}>
          <div className={"wrap"}>
            <div className={"service-section-heading"}>
              <span className={"kicker"}>
                <T>{"Specialist expertise"}</T>
              </span>
              <h2>
                <T>{"Technology solutions"}</T>
              </h2>
              <p>
                <T>
                  {
                    "Connect emerging technology and industry workflows to a practical product use case."
                  }
                </T>
              </p>
            </div>
            <div className={"service-grid"}>
              <RouteLink
                className={"service-card"}
                href={"/iot-development"}
                aria-labelledby={"card-iot-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"09"}</T>
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
                href={"/ai-development"}
                aria-labelledby={"card-ai-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"10"}</T>
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
                href={"/ai-agent-development"}
                aria-labelledby={"card-ai-agent-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"11"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-ai-agent-development"}>
                  <T>{"AI Agent Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Assistants and multi-step workflows that connect business knowledge, approved tools and human oversight."
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
                href={"/ecommerce-development"}
                aria-labelledby={"card-ecommerce-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"12"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-ecommerce-development"}>
                  <T>{"eCommerce Platform Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Storefronts, shopping applications and commerce integrations that connect the customer journey to your business."
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
                href={"/fintech-development"}
                aria-labelledby={"card-fintech-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"13"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-fintech-development"}>
                  <T>{"Fintech Software Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Wallets, payment experiences and financial operations software with considered access, traceability and integration design."
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
                href={"/blockchain-development"}
                aria-labelledby={"card-blockchain-development"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"14"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-blockchain-development"}>
                  <T>{"Blockchain Development"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Architecture, smart contracts and Web3 applications guided by the product use case and its trust requirements."
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
                href={"/smart-home-solutions"}
                aria-labelledby={"card-smart-home-solutions"}
              >
                <span className={"service-card-top"}>
                  <span className={"service-index"} aria-hidden={"true"}>
                    <T>{"15"}</T>
                  </span>
                  <span className={"service-card-arrow"} aria-hidden={"true"}>
                    <T>{"↗"}</T>
                  </span>
                </span>
                <h3 id={"card-smart-home-solutions"}>
                  <T>{"IoT Smart Home Solutions"}</T>
                </h3>
                <p>
                  <T>
                    {
                      "Software for smart-home monitoring, device integrations and automation workflows across connected living and building systems."
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
