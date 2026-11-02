import { NoTranslate } from "../context/LanguageContext.jsx";
import RouteLink from "./AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import Localized from "./Localized.jsx";
import { useEffect, useRef, useState } from "react";
import services from "../data/services.json";
import { usePageSlug } from "../lib/PageContext.js";
import LanguagePicker from "./LanguagePicker.jsx";
import { useLocation } from "react-router-dom";
export function Logo({ className = "logo" }) {
  return (
    <Localized>
      <NoTranslate>
        <RouteLink href="/" className={className} aria-label="Sakinzo home">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <path d="M6 8L18 2L30 8L26 14L18 11L10 14Z" fill="#1673FF" />
            <path
              d="M6 8L10 14L6 20L18 34L30 20L26 14L18 11L10 14Z"
              fill="#1673FF"
              opacity=".85"
            />
            <path d="M10 14L18 11L26 14L18 28Z" fill="white" opacity=".35" />
          </svg>
          <NoTranslate>
            <span className="logo-txt">
              <T>{" Sakin"}</T>
              <span>
                <T>{".zo"}</T>
              </span>
            </span>
          </NoTranslate>
        </RouteLink>
      </NoTranslate>
    </Localized>
  );
}
const links = {
  "About Us": [
    ["Who We Are", "/who-we-are"],
    ["Careers", "/careers"],
    ["Contacts", "/contact"],
    ["Leadership", "/leadership"],
  ],
  "Success Stories": [
    ["Cloud ecosystem for EV charging", "/ev-charging"],
    ["AI-Based Market Access Tool", "/market-access"],
    ["Multi-currency Wallet", "/multi-currency-wallet"],
    ["IoT Cloud Platform", "/iot-cloud-platform"],
    ["Smart HVAC Monitoring with AI", "/smart-hvac"],
  ],
  Services: services.map((service) => [service.name, service.href]),
  Insights: [
    ["News", "/news"],
    ["Opensource", "/opensource"],
    ["Blog", "/blog"],
  ],
};
function Arrow() {
  return (
    <svg viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
export default function SiteHeader({ projectBack = false }) {
  const location = useLocation();
  const slug = usePageSlug();
  const header = useRef(null);
  const mobileMenu = useRef(null);
  const closeTimer = useRef(null);
  const [dropdown, setDropdown] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState(null);
  const [menuTop, setMenuTop] = useState(68);
  const cancelClose = () => clearTimeout(closeTimer.current);
  const openDropdown = (name) => {
    cancelClose();
    setDropdown(name);
  };
  useEffect(() => {
    clearTimeout(closeTimer.current);
    setDropdown(null);
    setMobile(false);
    setMobileGroup(null);
  }, [location.pathname, location.search, location.hash]);
  useEffect(() => {
    const close = (event) => {
      if (!header.current?.contains(event.target)) setDropdown(null);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setDropdown(null);
        setMobile(false);
      }
    };
    const resize = () => {
      if (innerWidth > 1024) setMobile(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      clearTimeout(closeTimer.current);
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    if (!mobile) return;
    const previous = document.body.style.overflow;
    const trigger = document.activeElement;
    document.body.style.overflow = "hidden";
    const measure = () =>
      setMenuTop(
        Math.max(0, header.current?.getBoundingClientRect().bottom || 68),
      );
    measure();
    const observer = new ResizeObserver(measure);
    if (header.current) observer.observe(header.current);
    window.visualViewport?.addEventListener("resize", measure);
    const frame = requestAnimationFrame(() =>
      mobileMenu.current
        ?.querySelector("button")
        ?.focus({ preventScroll: true }),
    );
    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const controls = [
        ...header.current.querySelectorAll("a,button,input"),
        ...mobileMenu.current.querySelectorAll("a,button,input"),
      ].filter(
        (element) =>
          element.getClientRects().length &&
          !element.disabled &&
          element.tabIndex !== -1,
      );
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", measure);
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previous;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [mobile]);
  const link = ([name, href]) => (
    <RouteLink
      key={href}
      href={href}
      aria-current={
        href ===
        (slug === "index"
          ? "/"
          : slug === "contactus"
            ? "/contact"
            : "/" + slug)
          ? "page"
          : undefined
      }
    >
      <T>{name}</T>
    </RouteLink>
  );
  const allServices = (
    <RouteLink
      className="service-menu-all"
      href="/services"
      aria-current={slug === "services" ? "page" : undefined}
    >
      <T>{" Explore all services "}</T>
      <span aria-hidden="true">
        <T>{"\u2197"}</T>
      </span>
    </RouteLink>
  );
  const groups = [...new Set(services.map((service) => service.group))];
  return (
    <>
      <header
        className="hdr"
        data-react-header=""
        data-service-header=""
        ref={header}
      >
        <div className="hdr-inner">
          <Logo />
          <Localized>
            <nav aria-label="Main navigation">
              <T>
                {Object.entries(links).map(([name, items]) => (
                  <div
                    key={name}
                    className={`ndrop${name === "Services" ? " service-nav-group" : ""}${dropdown === name ? " open" : ""}`}
                    onPointerEnter={(event) => {
                      if (
                        event.pointerType !== "touch" &&
                        matchMedia("(hover: hover)").matches
                      )
                        openDropdown(name);
                    }}
                    onPointerLeave={(event) => {
                      if (event.pointerType === "touch") return;
                      cancelClose();
                      closeTimer.current = setTimeout(
                        () =>
                          setDropdown((current) =>
                            current === name ? null : current,
                          ),
                        220,
                      );
                    }}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        cancelClose();
                        setDropdown((current) =>
                          current === name ? null : current,
                        );
                      }
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === "ArrowDown" &&
                        event.target.classList.contains("nbtn")
                      ) {
                        event.preventDefault();
                        openDropdown(name);
                        const group = event.currentTarget;
                        requestAnimationFrame(() =>
                          group.querySelector(".drop a")?.focus(),
                        );
                      } else if (event.key === "Escape") {
                        cancelClose();
                        setDropdown(null);
                        event.currentTarget.querySelector(".nbtn")?.focus();
                      }
                    }}
                  >
                    <button
                      className="nbtn"
                      type="button"
                      aria-expanded={dropdown === name}
                      aria-haspopup="true"
                      aria-controls={`nav-${name.toLowerCase().replaceAll(" ", "-")}`}
                      onClick={(event) => {
                        cancelClose();
                        setDropdown(
                          event.detail &&
                            matchMedia("(hover: hover) and (pointer: fine)")
                              .matches
                            ? name
                            : dropdown === name
                              ? null
                              : name,
                        );
                      }}
                    >
                      <T>{name}</T>
                      <Arrow />
                    </button>
                    <div
                      className={`drop${name === "Services" ? " service-menu" : ""}`}
                      id={`nav-${name.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      <T>
                        {name === "Services" ? (
                          <>
                            <T>{allServices}</T>
                            <div className="service-menu-columns">
                              <T>
                                {groups.map((group) => (
                                  <div key={group}>
                                    <p className="service-menu-label">
                                      <T>{group}</T>
                                    </p>
                                    <T>
                                      {services
                                        .filter(
                                          (service) => service.group === group,
                                        )
                                        .map((service) =>
                                          link([service.name, service.href]),
                                        )}
                                    </T>
                                  </div>
                                ))}
                              </T>
                            </div>
                          </>
                        ) : (
                          items.map(link)
                        )}
                      </T>
                    </div>
                  </div>
                ))}
              </T>
            </nav>
          </Localized>
          <div className="hdr-right">
            <LanguagePicker />
            {projectBack ? (
              <RouteLink className="btn-git" href="/#sec-projects">
                <T>{" ← All projects "}</T>
              </RouteLink>
            ) : (
              <RouteLink className="btn-git" href="/contact#form-section">
                <T>{" Get in touch "}</T>
              </RouteLink>
            )}
          </div>
          <Localized>
            <button
              type="button"
              className={`hamburger${mobile ? " open" : ""}`}
              id="hamburger"
              aria-label="Menu"
              aria-controls="mobileMenu"
              aria-expanded={mobile}
              onClick={() => setMobile((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </Localized>
        </div>
      </header>
      <div
        className={`mobile-menu${mobile ? " open" : ""}`}
        id="mobileMenu"
        data-react-mobile=""
        role="navigation"
        aria-label="Mobile navigation"
        hidden={!mobile}
        ref={mobileMenu}
        style={{ "--mobile-menu-top": `${menuTop}px` }}
      >
        <T>
          {Object.entries(links).map(([name, items]) => (
            <div className="mob-item" key={name}>
              <button
                className={`mob-link${mobileGroup === name ? " active" : ""}`}
                type="button"
                data-mobile-toggle=""
                aria-expanded={mobileGroup === name}
                aria-controls={`mobile-group-${name.toLowerCase().replaceAll(" ", "-")}`}
                onClick={() =>
                  setMobileGroup(mobileGroup === name ? null : name)
                }
              >
                <T>{name}</T>
                <Arrow />
              </button>
              <div
                className={`mob-sub${mobileGroup === name ? " open" : ""}`}
                id={`mobile-group-${name.toLowerCase().replaceAll(" ", "-")}`}
                hidden={mobileGroup !== name}
                onClick={(event) => {
                  if (event.target.closest("a")) setMobile(false);
                }}
              >
                <T>
                  {name === "Services" ? (
                    <>
                      <T>{allServices}</T>
                      <T>
                        {groups.map((group) => (
                          <div key={group}>
                            <p className="service-mobile-label">
                              <T>{group}</T>
                            </p>
                            <T>
                              {services
                                .filter((service) => service.group === group)
                                .map((service) =>
                                  link([service.name, service.href]),
                                )}
                            </T>
                          </div>
                        ))}
                      </T>
                    </>
                  ) : (
                    items.map(link)
                  )}
                </T>
              </div>
            </div>
          ))}
        </T>
        <RouteLink
          href={projectBack ? "/#sec-projects" : "/contact#form-section"}
          className="mob-cta"
          onClick={() => setMobile(false)}
        >
          <T>{projectBack ? " ← All projects " : " Get in touch "}</T>
        </RouteLink>
      </div>
    </>
  );
}
