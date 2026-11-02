import { useState } from "react";
import { T } from "../../context/LanguageContext.jsx";
import RouteLink from "../../components/AppLink.jsx";
import Reveal from "../../components/Reveal.jsx";
import { HomeSection } from "./HomeContent.jsx";
import ServiceArtwork from "./ServiceArtwork.jsx";

const services = [
  {
    slug: "web-mobile-development", title: "Web and Mobile Development",
    intro: "Build a modern application tailored to your needs:",
    points: ["Turnkey development with every aspect handled by our specialists.", "Active collaboration working alongside your in-house team.", "PoC and MVP creation to validate your ideas.", "Development processes setup and deployment."],
    action: "Start building your app", icon: "M3 6h18M7 3v3m4-3v3M6 12h7m-7 4h11",
  },
  {
    slug: "devops-solutions", title: "DevOps Solutions",
    points: ["Cloud solutions: AWS, GCP, and Azure.", "Comprehensive CI/CD pipeline setup.", "Interactive dashboard configuration for monitoring."],
    action: "Optimize your processes", icon: "m7 12 3 3 7-7",
  },
  {
    slug: "architecture-design", title: "Architecture Design",
    points: ["Research of your business and product domain.", "Consultations for technology selection.", "Technical documentation and due diligence."],
    action: "Design your architecture", icon: "M12 7v10m-5-5h10",
  },
  {
    slug: "poc-mvp-development", title: "PoC, Prototype, MVP",
    points: ["PoC development to demonstrate feasibility.", "Prototype development to test key features.", "MVP development to gather real-world feedback."],
    action: "Validate your idea", icon: "M12 7v5l4 3",
  },
  {
    slug: "qa-testing", title: "QA & Testing",
    points: ["Manual and automated testing to identify defects early.", "Performance evaluations for top-notch user experience.", "Security audits for reliable releases."],
    action: "Refine your app", icon: "m5 17 5-6 4 3 5-7",
  },
  {
    slug: "ux-ui-design", title: "UX/UI Design",
    points: ["User research, benchmarking, competitive analysis.", "Data analytics, customer feedback collection.", "Full cycle product design from discovery to testing."],
    action: "Create your design", icon: "m7 17 1-4L17 4l3 3-9 9-4 1Zm7-10 3 3",
  },
  {
    slug: "business-analysis", title: "BA",
    points: ["Create roadmaps for your strategies.", "Identifying non-functional and functional requirements."],
    action: "Build your strategy", icon: "M6 7h12M6 12h8M6 17h10",
  },
];

export default function HomeServices() {
  const [active, setActive] = useState(0);
  return <HomeSection sectionKey="services">
    <section className="svc-sec" id="sec-services">
      <Reveal><div className="wrap sec reveal">
        <div className="sec-hd"><h2 className="sec-title"><T>Services</T></h2></div>
        <div className="svc-layout">
          <div className="svc-img" id="svcImg"><ServiceArtwork key={services[active].slug} service={services[active]} /></div>
          <div className="svc-list">
            {services.map((service, index) => {
              const open = active === index;
              return <div className={`svc-item${open ? " open" : ""}`} key={service.slug}>
                <h3 className="svc-heading">
                  <button type="button" className="svc-head" id={`svc-heading-${service.slug}`}
                    aria-expanded={open} aria-controls={`svc-panel-${service.slug}`} onClick={() => setActive(index)}>
                    <span className="svc-left">
                      <span className="svc-ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1673ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {index < 2 && <rect x="3" y="3" width="18" height="18" rx="3" />}
                        {index === 2 && <path d="m12 3 9 5v9l-9 5-9-5V8Z" />}
                        {index === 3 && <circle cx="12" cy="12" r="9" />}
                        <path d={service.icon} />
                      </svg></span>
                      <span className="svc-name"><T text={service.title} /></span>
                    </span>
                    <span className="svc-tog" aria-hidden="true">{open ? "−" : "+"}</span>
                  </button>
                </h3>
                <div className="svc-body" id={`svc-panel-${service.slug}`} role="region" aria-labelledby={`svc-heading-${service.slug}`} hidden={!open}>
                  {open && <ServiceArtwork key={service.slug} service={service} className="svc-artwork-mobile" />}
                  {service.intro && <p><T text={service.intro} /></p>}
                  <ul>{service.points.map(point => <li key={point}><T text={point} /></li>)}</ul>
                  <RouteLink className="svc-link" href={`/${service.slug}`}><T text={service.action} /> <span className="arr-sm" aria-hidden="true" /></RouteLink>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div></Reveal>
    </section>
  </HomeSection>;
}
