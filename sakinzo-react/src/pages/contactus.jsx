import ContactLinks from "../components/ContactLinks.jsx";
import { NoTranslate } from "../context/LanguageContext.jsx";
import PageHero from "../components/PageHero.jsx";
import RouteLink from "../components/AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { useSiteData } from "../context/SiteDataContext.jsx";
import { ContactForm } from "../features/contact/ContactForms.jsx";
import {
  OfficeList,
  TeamAvatars,
} from "../features/contact/ContactDetails.jsx";
export default function Page() {
  const { site } = useSiteData();
  return (
    <>
      {"\n\n    "}
      {"\n    "}
      <SiteHeader />
      {"\n\n    "}
      {"\n    "}
      <PageHero slug="contactus" baseClass="hero-band">
        {"\n        "}
        <div className={"hero-inner"}>
          {"\n            "}
          <div className={"breadcrumb"}>
            {"\n                "}
            <RouteLink href={"/"}>
              <T>{"Sakinzo"}</T>
            </RouteLink>
            {"\n                "}
            <span>
              <T>{"›"}</T>
            </span>
            {"\n                "}
            <span>
              <T>{"Contact Us"}</T>
            </span>
            {"\n            "}
          </div>
          {"\n            "}
          <div className={"hero-tag"}>
            {"\n                "}
            <span className={"tag-pulse"}></span>
            <T>{"\n                Let's build together\n            "}</T>
          </div>
          {"\n            "}
          <h1>
            <T>{"Contact "}</T>
            <em>
              <T>{"Sakinzo"}</T>
            </em>
            <T>{" and start building your digital solution"}</T>
          </h1>
          {"\n            "}
          <p className={"hero-desc"}>
            <T>
              {
                "We can discuss a new project with you or talk about our future partnership. Our expert\n                team responds within 24 hours."
              }
            </T>
          </p>
          {"\n        "}
        </div>
        {"\n    "}
      </PageHero>
      {"\n\n    "}
      {"\n    "}
      <div className={"content-wrap"} id={"form-section"}>
        {"\n\n        "}
        {"\n        "}
        <div className={"form-card"}>
          {"\n            "}
          <ContactForm />
          {"\n\n            "}

          {"\n        "}
        </div>
        {"\n\n        "}
        {"\n        "}
        <div className={"sidebar-label"} id={"contactSidebarLabel"}>
          <T>
            {site.contactPage.sidebarLabel || (
              <>
                <T>{"Contact details"}</T>
              </>
            )}
          </T>
        </div>
        {"\n        "}
        <div className={"sidebar"}>
          {"\n\n            "}
          {"\n            "}
          <div className={"card-team"} id={"teamCard"}>
            {"\n                "}
            <div className={"card-team-bg"}></div>
            {"\n                "}
            <h3 id={"contactTeamTitle"}>
              <T>
                {site.contactPage.teamTitle || (
                  <>
                    <T>{"Meet the team"}</T>
                  </>
                )}
              </T>
            </h3>
            {"\n                "}
            <p id={"contactTeamSubtitle"}>
              <T>
                {site.contactPage.teamSubtitle || (
                  <>
                    <T>{"Ready to discuss your project"}</T>
                  </>
                )}
              </T>
            </p>
            {"\n                "}
            <div className={"avatars"} id={"teamAvatars"}>
              <TeamAvatars />
            </div>
            {"\n                "}
            <div className={"online-row"}>
              {"\n                    "}
              <div className={"online-dot"}></div>
              {"\n                    "}
              <span id={"contactTeamStatus"}>
                <T>
                  {site.contactPage.teamStatus || (
                    <>
                      <T>{"Team is "}</T>
                      <strong>
                        <T>{"online"}</T>
                      </strong>
                      <T>{" · Responds in < 24 h"}</T>
                    </>
                  )}
                </T>
              </span>
              {"\n                "}
            </div>
            {"\n            "}
          </div>
          {"\n\n            "}
          {"\n            "}
          <div className={"card-offices"} id={"offices"}>
            {"\n                "}
            <h3 id={"contactOfficesTitle"}>
              <T>
                {site.contactPage.officesTitle || (
                  <>
                    <T>{"Our Offices"}</T>
                  </>
                )}
              </T>
            </h3>
            {"\n                "}
            <div id={"officesList"}>
              <OfficeList>
                {"\n                    "}
                <div className={"office-item"}>
                  {"\n                        "}
                  <div className={"office-country"}>
                    <T>{"India"}</T>
                  </div>
                  {"\n                        "}
                  <address>
                    <T>{"Maharashtra,"}</T>
                    <br />
                    <T>{"Mumbai & Thane"}</T>
                  </address>
                  {"\n                        "}
                  <RouteLink
                    href={
                      "https://www.google.com/maps/search/?api=1&query=Mumbai+Thane%2C+Maharashtra%2C+India"
                    }
                    target={"_blank"}
                    rel={"noopener"}
                    className={"map-link"}
                  >
                    <T>{"Find on the map"}</T>
                  </RouteLink>
                  {"\n                    "}
                </div>
                {"\n                "}
              </OfficeList>
            </div>
            {"\n            "}
          </div>
          {"\n\n            "}
          {"\n            "}
          <div className="card-methods"><h3 id="contactMethodsTitle"><T>{site.contactPage.methodsTitle || "Other ways to reach us"}</T></h3><ContactLinks variant="methods" /></div>
          {"\n\n        "}
        </div>
        {"\n    "}
      </div>
      {"\n\n    "}
      {"\n    "}
      <section className={"process-wrap"}>
        {"\n        "}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {"\n            "}
          <div className={"section-label"}>
            <T>{"How it works"}</T>
          </div>
          {"\n            "}
          <h2>
            <T>{"From first contact to delivered product"}</T>
          </h2>
          {"\n            "}
          <div className={"steps"}>
            {"\n                "}
            <div className={"step"}>
              {"\n                    "}
              <div className={"step-icon"}>
                <T>{"💬"}</T>
              </div>
              {"\n                    "}
              <div className={"step-n"}>
                <T>{"STEP 01"}</T>
              </div>
              {"\n                    "}
              <div className={"step-title"}>
                <T>{"Submit Your Request"}</T>
              </div>
              {"\n                    "}
              <div className={"step-body"}>
                <T>
                  {
                    "Fill out the form with your project idea, goals, and any relevant documents.\n                    "
                  }
                </T>
              </div>
              {"\n                "}
            </div>
            {"\n                "}
            <div className={"step"}>
              {"\n                    "}
              <div className={"step-icon"}>
                <T>{"🎯"}</T>
              </div>
              {"\n                    "}
              <div className={"step-n"}>
                <T>{"STEP 02"}</T>
              </div>
              {"\n                    "}
              <div className={"step-title"}>
                <T>{"Discovery Call"}</T>
              </div>
              {"\n                    "}
              <div className={"step-body"}>
                <T>
                  {
                    "We schedule a call to deeply understand your vision and requirements."
                  }
                </T>
              </div>
              {"\n                "}
            </div>
            {"\n                "}
            <div className={"step"}>
              {"\n                    "}
              <div className={"step-icon"}>
                <T>{"📋"}</T>
              </div>
              {"\n                    "}
              <div className={"step-n"}>
                <T>{"STEP 03"}</T>
              </div>
              {"\n                    "}
              <div className={"step-title"}>
                <T>{"Proposal & Scope"}</T>
              </div>
              {"\n                    "}
              <div className={"step-body"}>
                <T>
                  {
                    "We deliver a tailored proposal with timeline, tech stack and transparent\n                        pricing."
                  }
                </T>
              </div>
              {"\n                "}
            </div>
            {"\n                "}
            <div className={"step"}>
              {"\n                    "}
              <div className={"step-icon"}>
                <T>{"🚀"}</T>
              </div>
              {"\n                    "}
              <div className={"step-n"}>
                <T>{"STEP 04"}</T>
              </div>
              {"\n                    "}
              <div className={"step-title"}>
                <T>{"Kickoff & Build"}</T>
              </div>
              {"\n                    "}
              <div className={"step-body"}>
                <T>
                  {
                    "Your dedicated team begins development with agile sprints and regular\n                        updates."
                  }
                </T>
              </div>
              {"\n                "}
            </div>
            {"\n            "}
          </div>
          {"\n        "}
        </div>
        {"\n    "}
      </section>
      {"\n\n    "}
      {"\n    "}
      <section className={"trust-strip"}>
        {"\n        "}
        <p>
          <T>{"Trusted by innovative companies worldwide"}</T>
        </p>
        {"\n        "}
        <div className={"client-pills"}>
          {"\n            "}
          <div className={"pill"}>
            <T>{"TechCorp"}</T>
          </div>
          {"\n            "}
          <div className={"pill"}>
            <T>{"FinStart"}</T>
          </div>
          {"\n            "}
          <div className={"pill"}>
            <T>{"MedAI"}</T>
          </div>
          {"\n            "}
          <div className={"pill"}>
            <T>{"GreenEV"}</T>
          </div>
          {"\n            "}
          <div className={"pill"}>
            <T>{"SmartHome"}</T>
          </div>
          {"\n            "}
          <div className={"pill"}>
            <T>{"BlockX"}</T>
          </div>
          {"\n        "}
        </div>
        {"\n    "}
      </section>
      {"\n\n    "}
      {"\n    "}
      <footer>
        {"\n        "}
        <div className={"footer-wrap"}>
          {"\n            "}
          <div className={"footer-top"}>
            {"\n                "}
            <NoTranslate>
              <div className={"fbrand"}>
                {"\n                    "}
                <NoTranslate>
                  <RouteLink
                    href={"/"}
                    className={"logo"}
                    aria-label={"Back to Sakinzo home"}
                  >
                    {"\n                        "}
                    <svg
                      width={"34"}
                      height={"34"}
                      viewBox={"0 0 36 36"}
                      fill={"none"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      {"\n                            "}
                      <path
                        d={"M6 8 L18 2 L30 8 L26 14 L18 11 L10 14 Z"}
                        fill={"#1673FF"}
                      ></path>
                      {"\n                            "}
                      <path
                        d={
                          "M6 8 L10 14 L6 20 L18 34 L30 20 L26 14 L18 11 L10 14 Z"
                        }
                        fill={"#1673FF"}
                        opacity={".85"}
                      ></path>
                      {"\n                            "}
                      <path
                        d={"M10 14 L18 11 L26 14 L18 28 Z"}
                        fill={"rgba(255,255,255,0.35)"}
                      ></path>
                      {"\n                        "}
                    </svg>
                    {"\n                        "}
                    <span className={"logo-name"}>
                      <T>{"Sakin"}</T>
                      <b>
                        <T>{".zo"}</T>
                      </b>
                    </span>
                    {"\n                    "}
                  </RouteLink>
                </NoTranslate>
                {"\n                    "}
                <p className={"fbrand-desc"}>
                  <T>
                    {
                      "Expert software studio specializing in IoT, AI, FinTech and full-cycle\n                        digital products."
                    }
                  </T>
                </p>
                {"\n                    "}
                <ContactLinks />
                {"\n                "}
              </div>
            </NoTranslate>
            {"\n\n                "}
            <div className={"fnav"}>
              {"\n                    "}
              <div className={"fnav-col"}>
                {"\n                        "}
                <h4>
                  <T>{"About Us"}</T>
                </h4>
                {"\n                        "}
                <RouteLink href="/who-we-are">
                  <T>{"Who We Are"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/careers">
                  <T>{"Careers"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/contact">
                  <T>{"Contacts"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/leadership">
                  <T>{"Leadership"}</T>
                </RouteLink>
                {"\n                    "}
              </div>
              {"\n                    "}
              <div className={"fnav-col"}>
                {"\n                        "}
                <h4>
                  <T>{"Success Stories"}</T>
                </h4>
                {"\n                        "}
                <RouteLink href="/ev-charging">
                  <T>{"EV Charging Cloud"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/market-access">
                  <T>{"AI Market Access"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/multi-currency-wallet">
                  <T>{"Multi-currency Wallet"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/iot-cloud-platform">
                  <T>{"IoT Cloud Platform"}</T>
                </RouteLink>
                {"\n                    "}
              </div>
              {"\n                    "}
              <div className={"fnav-col"}>
                {"\n                        "}
                <h4>
                  <T>{"Services"}</T>
                </h4>
                {"\n                        "}
                <RouteLink href="/iot-development">
                  <T>{"IoT Development"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/ai-development">
                  <T>{"AI Development"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/ecommerce-development">
                  <T>{"eCommerce"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/full-cycle-development">
                  <T>{"Full-cycle Dev"}</T>
                </RouteLink>
                {"\n                    "}
              </div>
              {"\n                    "}
              <div className={"fnav-col"}>
                {"\n                        "}
                <h4>
                  <T>{"Insights"}</T>
                </h4>
                {"\n                        "}
                <RouteLink href="/news">
                  <T>{"News"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/opensource">
                  <T>{"Opensource"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="/blog">
                  <T>{"Blog"}</T>
                </RouteLink>
                {"\n                        "}
                <h4
                  style={{
                    marginTop: "18px",
                  }}
                >
                  <T>{"Legal"}</T>
                </h4>
                {"\n                        "}
                <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Privacy%20enquiry">
                  <T>{"Privacy enquiries"}</T>
                </RouteLink>
                {"\n                        "}
                <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Terms%20enquiry">
                  <T>{"Terms enquiries"}</T>
                </RouteLink>
                {"\n                    "}
              </div>
              {"\n                "}
            </div>
            {"\n            "}
          </div>
          {"\n\n            "}
          <div className={"footer-bottom"}>
            {"\n                "}
            <div className={"fcta"}>
              {"\n                    "}
              <h3 id={"contactFooterCtaTitle"}>
                <T>
                  {site.contactPage.footerCtaTitle || (
                    <>
                      <T>{"Ready to start your project?"}</T>
                    </>
                  )}
                </T>
              </h3>
              {"\n                    "}
              <p id={"contactFooterCtaSubtitle"}>
                <T>
                  {site.contactPage.footerCtaSubtitle || (
                    <>
                      <T>{"Get a free consultation from our experts."}</T>
                    </>
                  )}
                </T>
              </p>
              {"\n                    "}
              <RouteLink
                href={"#form-section"}
                className={"btn-cta"}
                id={"contactFooterCtaButton"}
              >
                <T>
                  {site.contactPage.footerCtaButton || (
                    <>
                      <T>{"Get in touch →"}</T>
                    </>
                  )}
                </T>
              </RouteLink>
              {"\n                "}
            </div>
            {"\n                "}
            <div className={"foffices"}>
              {"\n                    "}
              <h4>
                <T>{"Our Offices"}</T>
              </h4>
              {"\n                    "}
              <div className={"foffices-cols"} id={"footerOfficesList"}>
                <OfficeList footer={true}>
                  {"\n                        "}
                  <address>
                    <T>{"Maharashtra,"}</T>
                    <br />
                    <T>{"Mumbai & Thane, India"}</T>
                  </address>
                  {"\n                    "}
                </OfficeList>
              </div>
              {"\n                "}
            </div>
            {"\n            "}
          </div>
          {"\n        "}
        </div>
        {"\n\n        "}
        <div className={"copyright"}>
          {"\n            "}
          <span>
            <T>{"2026 SAKINZO LLC. All rights reserved."}</T>
          </span>
          {"\n            "}
          <div className={"copy-links"}>
            {"\n                "}
            <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Privacy%20enquiry">
              <T>{"Privacy enquiries"}</T>
            </RouteLink>
            {"\n                "}
            <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Terms%20enquiry">
              <T>{"Terms enquiries"}</T>
            </RouteLink>
            {"\n                "}
            <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Cookie%20enquiry">
              <T>{"Cookie enquiries"}</T>
            </RouteLink>
            {"\n                "}
            <RouteLink href="/sitemap.xml">
              <T>{"Sitemap"}</T>
            </RouteLink>
            {"\n            "}
          </div>
          {"\n        "}
        </div>
        {"\n    "}
      </footer>
      {"\n\n    "}
      {"\n    "}
      {"\n\n\n\n"}
    </>
  );
}
