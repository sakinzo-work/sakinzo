import RouteLink from "./AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import ContactLinks from "./ContactLinks.jsx";
import { Logo } from "./SiteHeader.jsx";
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Logo className="logo footer-logo" />
        <div className="footer-links">
          <RouteLink href="/services"><T>Services</T></RouteLink>
          <RouteLink href="/who-we-are">
            <T>{"About"}</T>
          </RouteLink>
          <RouteLink href="/careers">
            <T>{"Careers"}</T>
          </RouteLink>
          <RouteLink href="/blog">
            <T>{"Insights"}</T>
          </RouteLink>
          <RouteLink href="/contact">
            <T>{"Contact"}</T>
          </RouteLink>
        </div>
        <span id="year">
          <T>{"\xA9 "}</T>
          <T>{new Date().getFullYear()}</T>
          <T>{" Sakinzo"}</T>
        </span>
      </div>
      <div className="footer-contact"><ContactLinks /></div>
    </footer>
  );
}
