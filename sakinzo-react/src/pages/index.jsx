import ContactLinks from "../components/ContactLinks.jsx";
import { NoTranslate } from "../context/LanguageContext.jsx";
import RouteLink from "../components/AppLink.jsx";
import { T } from "../context/LanguageContext.jsx";
import { assetUrl } from "../lib/paths.js";
import Reveal from "../components/Reveal.jsx";
import HomeServices from "../features/home/HomeServices.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import FooterColumn from "../components/FooterColumn.jsx";
import { useSiteData } from "../context/SiteDataContext.jsx";
import { FooterContactForm } from "../features/contact/ContactForms.jsx";
import localBlogPosts from "../../content/blogs/posts.json";
import { contentPath } from "../lib/content-slugs.js";
import {
  HomeSection,
  HomeStats,
  HomeClients,
  HomeProjects,
  HomeInsights,
  HomeTestimonials,
  HomeMap,
} from "../features/home/HomeContent.jsx";
export default function Page() {
  const { site } = useSiteData();
  return (
    <>
      {"\n\n    "}
      {"\n    "}
      <SiteHeader />
      {"\n\n    "}
      {"\n    "}

      {"\n\n    "}
      {"\n    "}
      <HomeSection sectionKey="hero">
        <section className="hero home-hero-photo" id={"home"}>
          {"\n        "}
          <div className={"hero-bg-canvas"} aria-hidden={"true"}>
            {"\n            "}
            <svg
              className={"hero-network"}
              viewBox={"0 0 1440 900"}
              xmlns={"http://www.w3.org/2000/svg"}
              preserveAspectRatio={"none"}
            >
              {"\n                "}
              <defs>
                {"\n                    "}
                <filter
                  id={"heroNodeGlow"}
                  x={"-80%"}
                  y={"-80%"}
                  width={"260%"}
                  height={"260%"}
                >
                  {"\n                        "}
                  <feGaussianBlur
                    stdDeviation={"5"}
                    result={"blur"}
                  ></feGaussianBlur>
                  {"\n                        "}
                  <feMerge>
                    {"\n                            "}
                    <feMergeNode in={"blur"}></feMergeNode>
                    {"\n                            "}
                    <feMergeNode in={"SourceGraphic"}></feMergeNode>
                    {"\n                        "}
                  </feMerge>
                  {"\n                    "}
                </filter>
                {"\n                    "}
                <linearGradient
                  id={"heroLineBlue"}
                  x1={"0"}
                  y1={"0"}
                  x2={"1"}
                  y2={"1"}
                >
                  {"\n                        "}
                  <stop
                    offset={"0%"}
                    stopColor={"#00d9ff"}
                    stopOpacity={".95"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"52%"}
                    stopColor={"#147cff"}
                    stopOpacity={".54"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"100%"}
                    stopColor={"#0a2b88"}
                    stopOpacity={".12"}
                  ></stop>
                  {"\n                    "}
                </linearGradient>
                {"\n                "}
              </defs>
              {"\n                "}
              <g
                fill={"none"}
                stroke={"url(#heroLineBlue)"}
                strokeWidth={"1"}
                opacity={".72"}
              >
                {"\n                    "}
                <path
                  d={
                    "M-40 150 L112 250 L48 360 L126 506 L24 642 L122 752 L-20 808"
                  }
                ></path>
                {"\n                    "}
                <path d={"M112 250 L196 368 L126 506 L270 586 L242 742"}></path>
                {"\n                    "}
                <path d={"M48 360 L196 368 L304 512 L270 586 L384 690"}></path>
                {"\n                    "}
                <path d={"M126 506 L24 642 L242 742 L384 690"}></path>
                {"\n                    "}
                <path
                  d={
                    "M1440 160 L1310 276 L1374 404 L1298 544 L1418 666 L1320 758 L1460 824"
                  }
                ></path>
                {"\n                    "}
                <path
                  d={"M1310 276 L1214 372 L1298 544 L1168 646 L1196 788"}
                ></path>
                {"\n                    "}
                <path
                  d={"M1374 404 L1214 372 L1120 518 L1168 646 L1048 718"}
                ></path>
                {"\n                    "}
                <path d={"M1298 544 L1418 666 L1196 788 L1048 718"}></path>
                {"\n                    "}
                <path
                  d={
                    "M58 778 C260 688 438 788 602 734 C800 668 946 740 1094 700 C1248 658 1326 702 1448 650"
                  }
                  opacity={".28"}
                ></path>
                {"\n                "}
              </g>
              {"\n                "}
              <g fill={"#08cfff"} filter={"url(#heroNodeGlow)"}>
                {"\n                    "}
                <circle cx={"112"} cy={"250"} r={"5"}>
                  {"\n                        "}
                  <animate
                    attributeName={"opacity"}
                    values={".65;1;.65"}
                    dur={"2.4s"}
                    repeatCount={"indefinite"}
                  ></animate>
                  {"\n                    "}
                </circle>
                {"\n                    "}
                <circle cx={"48"} cy={"360"} r={"4"} opacity={".9"}></circle>
                {"\n                    "}
                <circle cx={"126"} cy={"506"} r={"5"}>
                  {"\n                        "}
                  <animate
                    attributeName={"opacity"}
                    values={".45;1;.45"}
                    dur={"3s"}
                    repeatCount={"indefinite"}
                  ></animate>
                  {"\n                    "}
                </circle>
                {"\n                    "}
                <circle cx={"24"} cy={"642"} r={"4"} opacity={".72"}></circle>
                {"\n                    "}
                <circle cx={"242"} cy={"742"} r={"5"} opacity={".86"}></circle>
                {"\n                    "}
                <circle cx={"384"} cy={"690"} r={"4"} opacity={".78"}></circle>
                {"\n                    "}
                <circle cx={"1310"} cy={"276"} r={"4"} opacity={".78"}></circle>
                {"\n                    "}
                <circle cx={"1374"} cy={"404"} r={"5"}>
                  {"\n                        "}
                  <animate
                    attributeName={"opacity"}
                    values={".48;1;.48"}
                    dur={"2.7s"}
                    repeatCount={"indefinite"}
                  ></animate>
                  {"\n                    "}
                </circle>
                {"\n                    "}
                <circle cx={"1298"} cy={"544"} r={"5"} opacity={".9"}></circle>
                {"\n                    "}
                <circle cx={"1418"} cy={"666"} r={"4"} opacity={".72"}></circle>
                {"\n                    "}
                <circle cx={"1196"} cy={"788"} r={"5"} opacity={".86"}></circle>
                {"\n                    "}
                <circle cx={"1048"} cy={"718"} r={"4"} opacity={".78"}></circle>
                {"\n                "}
              </g>
              {"\n                "}
              <g fill={"#126dff"} opacity={".48"}>
                {"\n                    "}
                <circle cx={"196"} cy={"368"} r={"3"}></circle>
                {"\n                    "}
                <circle cx={"270"} cy={"586"} r={"3"}></circle>
                {"\n                    "}
                <circle cx={"602"} cy={"734"} r={"3"}></circle>
                {"\n                    "}
                <circle cx={"1094"} cy={"700"} r={"3"}></circle>
                {"\n                    "}
                <circle cx={"1214"} cy={"372"} r={"3"}></circle>
                {"\n                    "}
                <circle cx={"1168"} cy={"646"} r={"3"}></circle>
                {"\n                "}
              </g>
              {"\n            "}
            </svg>
            {"\n            "}
            <div className={"hero-glow"}></div>
            {"\n        "}
          </div>
          {"\n\n        "}
          <div className={"hero-content"}>
            {"\n            "}
            <div className={"hero-kicker"}>
              {"\n                "}
              <span>
                <T>{"Innovation • Technology"}</T>
              </span>
              {"\n                "}
              <span className={"kicker-success"}>
                <T>{"Your Success"}</T>
              </span>
              {"\n            "}
            </div>
            {"\n            "}
            <h1 aria-label={"Developing solutions that transform business"}>
              {"\n                "}
              <span className={"hero-desktop-line"} aria-hidden={"true"}>
                <T>{"Developing Solutions"}</T>
              </span>
              {"\n                "}
              <span className={"hero-desktop-line"} aria-hidden={"true"}>
                <T>{"That "}</T>
                <span className={"hero-title-blue"}>
                  <T>{"Transform"}</T>
                </span>
              </span>
              {"\n                "}
              <span className={"hero-desktop-line"} aria-hidden={"true"}>
                <T>{"Business"}</T>
              </span>
              {"\n                "}
              <span className={"hero-mobile-line"} aria-hidden={"true"}>
                <T>{"Developing"}</T>
              </span>
              {"\n                "}
              <span className={"hero-mobile-line"} aria-hidden={"true"}>
                <T>{"Solutions That"}</T>
              </span>
              {"\n                "}
              <span
                className={"hero-mobile-line hero-title-blue"}
                aria-hidden={"true"}
              >
                <T>{"Transform"}</T>
              </span>
              {"\n                "}
              <span className={"hero-mobile-line"} aria-hidden={"true"}>
                <T>{"Business"}</T>
              </span>
              {"\n            "}
            </h1>
            {"\n            "}
            <p className={"hero-copy"}>
              <T>
                {
                  "Sakin.zo builds custom websites, mobile apps, AI solutions and connected IoT products for businesses in Mumbai and Thane."
                }
              </T>
            </p>
            {"\n            "}
            <RouteLink href={"/contact#form-section"} className={"hero-cta"}>
              {"\n                "}
              <span>
                <T>{"Get in touch"}</T>
              </span>
              {"\n                "}
              <svg viewBox={"0 0 32 32"} fill={"none"} aria-hidden={"true"}>
                {"\n                    "}
                <path
                  d={"M5 16H26"}
                  stroke={"currentColor"}
                  strokeWidth={"2.4"}
                  strokeLinecap={"round"}
                ></path>
                {"\n                    "}
                <path
                  d={"M17.5 7.5L26 16L17.5 24.5"}
                  stroke={"currentColor"}
                  strokeWidth={"2.4"}
                  strokeLinecap={"round"}
                  strokeLinejoin={"round"}
                ></path>
                {"\n                "}
              </svg>
              {"\n            "}
            </RouteLink>
            {"\n        "}
          </div>
          {"\n\n        "}
          <div className={"hero-wave-wrap"}>
            {"\n            "}
            <svg
              viewBox={"0 0 1440 260"}
              xmlns={"http://www.w3.org/2000/svg"}
              preserveAspectRatio={"none"}
              aria-hidden={"true"}
            >
              {"\n                "}
              <defs>
                {"\n                    "}
                <filter
                  id={"heroWaveGlow"}
                  x={"-8%"}
                  y={"-80%"}
                  width={"116%"}
                  height={"260%"}
                >
                  {"\n                        "}
                  <feGaussianBlur
                    stdDeviation={"8"}
                    result={"blur"}
                  ></feGaussianBlur>
                  {"\n                        "}
                  <feMerge>
                    {"\n                            "}
                    <feMergeNode in={"blur"}></feMergeNode>
                    {"\n                            "}
                    <feMergeNode in={"SourceGraphic"}></feMergeNode>
                    {"\n                        "}
                  </feMerge>
                  {"\n                    "}
                </filter>
                {"\n                    "}
                <linearGradient
                  id={"heroWaveCyan"}
                  x1={"0"}
                  y1={"0"}
                  x2={"1"}
                  y2={"0"}
                >
                  {"\n                        "}
                  <stop
                    offset={"0%"}
                    stopColor={"#00aaff"}
                    stopOpacity={".0"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"25%"}
                    stopColor={"#00cfff"}
                    stopOpacity={".7"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"50%"}
                    stopColor={"#0088ff"}
                    stopOpacity={".9"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"75%"}
                    stopColor={"#00cfff"}
                    stopOpacity={".7"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"100%"}
                    stopColor={"#00aaff"}
                    stopOpacity={".0"}
                  ></stop>
                  {"\n                    "}
                </linearGradient>
                {"\n                    "}
                <linearGradient
                  id={"heroWaveBlue"}
                  x1={"0"}
                  y1={"0"}
                  x2={"1"}
                  y2={"0"}
                >
                  {"\n                        "}
                  <stop
                    offset={"0%"}
                    stopColor={"#1673FF"}
                    stopOpacity={".0"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"30%"}
                    stopColor={"#1673FF"}
                    stopOpacity={".5"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"70%"}
                    stopColor={"#1673FF"}
                    stopOpacity={".5"}
                  ></stop>
                  {"\n                        "}
                  <stop
                    offset={"100%"}
                    stopColor={"#1673FF"}
                    stopOpacity={".0"}
                  ></stop>
                  {"\n                    "}
                </linearGradient>
                {"\n                "}
              </defs>
              {"\n                "}
              <rect
                y={"145"}
                width={"1440"}
                height={"115"}
                fill={"#031026"}
                opacity={".72"}
              ></rect>
              {"\n                "}
              <path
                d={
                  "M0,166 C210,96 362,172 548,136 C744,98 900,176 1088,132 C1268,92 1358,134 1440,126 L1440,260 L0,260Z"
                }
                fill={"#031026"}
                opacity={".58"}
              ></path>
              {"\n                "}
              <path
                d={
                  "M0,166 C210,96 362,172 548,136 C744,98 900,176 1088,132 C1268,92 1358,134 1440,126"
                }
                fill={"none"}
                stroke={"url(#heroWaveCyan)"}
                strokeWidth={"3"}
                filter={"url(#heroWaveGlow)"}
                opacity={".95"}
              >
                {"\n                    "}
                <animate
                  attributeName={"d"}
                  dur={"7s"}
                  repeatCount={"indefinite"}
                  values={
                    "M0,166 C210,96 362,172 548,136 C744,98 900,176 1088,132 C1268,92 1358,134 1440,126;\n                  M0,148 C198,188 386,110 560,154 C734,196 920,118 1094,148 C1264,178 1356,108 1440,142;\n                  M0,166 C210,96 362,172 548,136 C744,98 900,176 1088,132 C1268,92 1358,134 1440,126"
                  }
                ></animate>
                {"\n                "}
              </path>
              {"\n                "}
              <path
                d={
                  "M0,188 C192,138 380,210 604,172 C812,136 1004,204 1210,164 C1328,142 1390,172 1440,162"
                }
                fill={"none"}
                stroke={"url(#heroWaveBlue)"}
                strokeWidth={"1.8"}
                filter={"url(#heroWaveGlow)"}
                opacity={".62"}
              >
                {"\n                    "}
                <animate
                  attributeName={"d"}
                  dur={"9s"}
                  repeatCount={"indefinite"}
                  values={
                    "M0,188 C192,138 380,210 604,172 C812,136 1004,204 1210,164 C1328,142 1390,172 1440,162;\n                  M0,204 C206,180 404,136 606,190 C810,222 1010,152 1208,190 C1326,214 1392,154 1440,178;\n                  M0,188 C192,138 380,210 604,172 C812,136 1004,204 1210,164 C1328,142 1390,172 1440,162"
                  }
                ></animate>
                {"\n                "}
              </path>
              {"\n                "}
              <path
                d={
                  "M0,210 C260,166 528,224 786,194 C1010,168 1218,206 1440,188"
                }
                fill={"none"}
                stroke={"url(#heroWaveCyan)"}
                strokeWidth={"1"}
                opacity={".3"}
              >
                {"\n                    "}
                <animate
                  attributeName={"d"}
                  dur={"11s"}
                  repeatCount={"indefinite"}
                  values={
                    "M0,210 C260,166 528,224 786,194 C1010,168 1218,206 1440,188;\n                  M0,228 C260,204 528,172 786,214 C1010,232 1218,176 1440,206;\n                  M0,210 C260,166 528,224 786,194 C1010,168 1218,206 1440,188"
                  }
                ></animate>
                {"\n                "}
              </path>
              {"\n                "}
              <circle
                r={"3"}
                fill={"#00ddff"}
                opacity={".8"}
                filter={"url(#heroWaveGlow)"}
              >
                {"\n                    "}
                <animateMotion
                  dur={"8s"}
                  repeatCount={"indefinite"}
                  path={
                    "M0,166 C210,96 362,172 548,136 C744,98 900,176 1088,132 C1268,92 1358,134 1440,126"
                  }
                ></animateMotion>
                {"\n                "}
              </circle>
              {"\n                "}
              <circle
                r={"2.5"}
                fill={"#4db8ff"}
                opacity={".7"}
                filter={"url(#heroWaveGlow)"}
              >
                {"\n                    "}
                <animateMotion
                  dur={"10s"}
                  repeatCount={"indefinite"}
                  begin={"-3s"}
                  path={
                    "M1440,126 C1358,134 1268,92 1088,132 C900,176 744,98 548,136 C362,172 210,96 0,166"
                  }
                ></animateMotion>
                {"\n                "}
              </circle>
              {"\n                "}
              <circle
                r={"2"}
                fill={"#99e8ff"}
                opacity={".6"}
                filter={"url(#heroWaveGlow)"}
              >
                {"\n                    "}
                <animateMotion
                  dur={"7s"}
                  repeatCount={"indefinite"}
                  begin={"-1.5s"}
                  path={
                    "M0,188 C192,138 380,210 604,172 C812,136 1004,204 1210,164 C1328,142 1390,172 1440,162"
                  }
                ></animateMotion>
                {"\n                "}
              </circle>
              {"\n            "}
            </svg>
            {"\n        "}
          </div>
          {"\n    "}
        </section>
      </HomeSection>
      {"\n\n    "}
      {"\n    "}
      <HomeSection sectionKey="why">
        <section className={"why-sec"} id={"sec-why"}>
          {"\n        "}
          <Reveal>
            <div className={"wrap sec reveal"}>
              {"\n            "}
              <div className={"why-panel"}>
                {"\n                "}
                <div className={"why-heading"}>
                  {"\n                    "}
                  <div>
                    <span className={"why-eyebrow"}>
                      <T>{"Why Sakin.zo"}</T>
                    </span>
                    <h2>
                      <T>{"Built for impact."}</T>
                      <br />
                      <span>
                        <T>{"Chosen for partnership."}</T>
                      </span>
                    </h2>
                  </div>
                  {"\n                    "}
                  <RouteLink href={"/who-we-are"} className={"why-link"}>
                    <T>{"Discover our story  →"}</T>
                  </RouteLink>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"why-body"}>
                  {"\n                    "}
                  <article className={"why-card"}>
                    {"\n                        "}
                    <div className={"why-card-top"}>
                      <span className={"why-icon"}>
                        <svg viewBox={"0 0 24 24"}>
                          <path
                            d={
                              "M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"
                            }
                          ></path>
                        </svg>
                      </span>
                      <span className={"why-number"}>
                        <T>{"01"}</T>
                      </span>
                    </div>
                    {"\n                        "}
                    <h3>
                      <T>{"Proven since 2011"}</T>
                    </h3>
                    {"\n                        "}
                    <p>
                      <T>
                        {
                          "We combine modern technology with efficient delivery processes to build dependable, client-driven solutions."
                        }
                      </T>
                    </p>
                    {"\n                    "}
                  </article>
                  {"\n                    "}
                  <article className={"why-card"}>
                    {"\n                        "}
                    <div className={"why-card-top"}>
                      <span className={"why-icon"}>
                        <svg viewBox={"0 0 24 24"}>
                          <circle cx={"12"} cy={"12"} r={"9"}></circle>
                          <path
                            d={
                              "M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"
                            }
                          ></path>
                        </svg>
                      </span>
                      <span className={"why-number"}>
                        <T>{"02"}</T>
                      </span>
                    </div>
                    {"\n                        "}
                    <h3>
                      <T>{"Cross-domain expertise"}</T>
                    </h3>
                    {"\n                        "}
                    <p>
                      <T>
                        {
                          "Deep experience across AI, IoT, Blockchain, eCommerce and FinTech—including work with Fortune 500 companies."
                        }
                      </T>
                    </p>
                    {"\n                    "}
                  </article>
                  {"\n                    "}
                  <article className={"why-card"}>
                    {"\n                        "}
                    <div className={"why-card-top"}>
                      <span className={"why-icon"}>
                        <svg viewBox={"0 0 24 24"}>
                          <path d={"M4 18l5-5 4 3 7-9"}></path>
                          <path d={"M15 7h5v5"}></path>
                        </svg>
                      </span>
                      <span className={"why-number"}>
                        <T>{"03"}</T>
                      </span>
                    </div>
                    {"\n                        "}
                    <h3>
                      <T>{"Outcomes over output"}</T>
                    </h3>
                    {"\n                        "}
                    <p>
                      <T>
                        {
                          "Your results are our win. We focus beyond initial requirements to create lasting value for your business and customers."
                        }
                      </T>
                    </p>
                    {"\n                    "}
                  </article>
                  {"\n                "}
                </div>
                {"\n                "}
                <HomeStats />
                {"\n            "}
              </div>
              {"\n        "}
            </div>
          </Reveal>
          {"\n    "}
        </section>
      </HomeSection>
      {"\n\n\n\n\n    "}
      {"\n  "}
      <HomeSection sectionKey="clients">
        <section className={"clients-sec"} id={"sec-clients"}>
          {"\n        "}
          <Reveal>
            <div className={"wrap sec reveal"}>
              {"\n            "}
              <div className={"sec-hd"}>
                {"\n                "}
                <h2 className={"sec-title"}>
                  <T>{"Our clients"}</T>
                </h2>
                {"\n            "}
              </div>
              {"\n            "}
              <HomeClients>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 200 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"28"}
                      r={"22"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></circle>
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"28"}
                      r={"18"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={".8"}
                      opacity={".4"}
                    ></circle>
                    {"\n                        "}
                    <line
                      x1={"28"}
                      y1={"6"}
                      x2={"28"}
                      y2={"28"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></line>
                    {"\n                        "}
                    <line
                      x1={"28"}
                      y1={"28"}
                      x2={"9"}
                      y2={"39"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></line>
                    {"\n                        "}
                    <line
                      x1={"28"}
                      y1={"28"}
                      x2={"47"}
                      y2={"39"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></line>
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"28"}
                      r={"2.5"}
                      fill={"#0d1b2e"}
                    ></circle>
                    {"\n                        "}
                    <text
                      x={"60"}
                      y={"32"}
                      fontSize={"15"}
                      fontWeight={"500"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                      letterSpacing={"-.3"}
                    >
                      <T>{"Mercedes-Benz"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 120 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <rect
                      x={"6"}
                      y={"6"}
                      width={"108"}
                      height={"44"}
                      rx={"22"}
                      fill={"#0093c8"}
                    ></rect>
                    {"\n                        "}
                    <text
                      x={"60"}
                      y={"35"}
                      textAnchor={"middle"}
                      fontSize={"22"}
                      fontWeight={"800"}
                      fill={"#fff"}
                      fontFamily={"Georgia,Times,serif"}
                      letterSpacing={"-.5"}
                    >
                      <T>{"Pfizer"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 180 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <rect
                      x={"4"}
                      y={"4"}
                      width={"48"}
                      height={"48"}
                      rx={"6"}
                      fill={"#d62028"}
                    ></rect>
                    {"\n                        "}
                    <polygon
                      points={"28,10 34,20 22,20"}
                      fill={"#fff"}
                    ></polygon>
                    {"\n                        "}
                    <rect
                      x={"25"}
                      y={"20"}
                      width={"6"}
                      height={"8"}
                      fill={"#fff"}
                    ></rect>
                    {"\n                        "}
                    <polygon
                      points={"28,46 34,36 22,36"}
                      fill={"#fff"}
                    ></polygon>
                    {"\n                        "}
                    <rect
                      x={"25"}
                      y={"28"}
                      width={"6"}
                      height={"8"}
                      fill={"#fff"}
                    ></rect>
                    {"\n                        "}
                    <polygon
                      points={"10,28 20,22 20,34"}
                      fill={"#fff"}
                    ></polygon>
                    {"\n                        "}
                    <rect
                      x={"20"}
                      y={"25"}
                      width={"8"}
                      height={"6"}
                      fill={"#fff"}
                    ></rect>
                    {"\n                        "}
                    <polygon
                      points={"46,28 36,22 36,34"}
                      fill={"#fff"}
                    ></polygon>
                    {"\n                        "}
                    <rect
                      x={"28"}
                      y={"25"}
                      width={"8"}
                      height={"6"}
                      fill={"#fff"}
                    ></rect>
                    {"\n                        "}
                    <text
                      x={"62"}
                      y={"24"}
                      fontSize={"13"}
                      fontWeight={"700"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"НОВА"}</T>
                    </text>
                    {"\n                        "}
                    <text
                      x={"62"}
                      y={"40"}
                      fontSize={"13"}
                      fontWeight={"700"}
                      fill={"#d62028"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"ПОШТА"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 170 40"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <path
                      d={"M6 20 L12 28 L22 10"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"3.5"}
                      fill={"none"}
                      strokeLinecap={"round"}
                      strokeLinejoin={"round"}
                    ></path>
                    {"\n                        "}
                    <text
                      x={"32"}
                      y={"27"}
                      fontSize={"17"}
                      fontWeight={"900"}
                      fill={"#0d1b2e"}
                      fontFamily={"'Arial Black','Arial',sans-serif"}
                      letterSpacing={"-.3"}
                    >
                      <T>{"INTERSPORT"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 190 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"28"}
                      r={"22"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></circle>
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"28"}
                      r={"14"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.2"}
                    ></circle>
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"28"}
                      r={"6"}
                      fill={"#0d1b2e"}
                    ></circle>
                    {"\n                        "}
                    <text
                      x={"60"}
                      y={"22"}
                      fontSize={"13"}
                      fontWeight={"700"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"deep dive"}</T>
                    </text>
                    {"\n                        "}
                    <text
                      x={"60"}
                      y={"38"}
                      fontSize={"12"}
                      fontWeight={"400"}
                      fill={"#5f7089"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"technology"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 100 44"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <text
                      x={"50"}
                      y={"32"}
                      textAnchor={"middle"}
                      fontSize={"32"}
                      fontWeight={"900"}
                      fill={"#0d1b2e"}
                      fontFamily={"'Arial Black','Arial',sans-serif"}
                      letterSpacing={"-1.5"}
                    >
                      <T>{"Uber"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 150 44"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <rect
                      x={"4"}
                      y={"4"}
                      width={"14"}
                      height={"14"}
                      rx={"2.5"}
                      fill={"#0d1b2e"}
                    ></rect>
                    {"\n                        "}
                    <rect
                      x={"4"}
                      y={"22"}
                      width={"14"}
                      height={"14"}
                      rx={"2.5"}
                      fill={"#0d1b2e"}
                      opacity={".45"}
                    ></rect>
                    {"\n                        "}
                    <rect
                      x={"22"}
                      y={"4"}
                      width={"14"}
                      height={"14"}
                      rx={"2.5"}
                      fill={"#0d1b2e"}
                      opacity={".45"}
                    ></rect>
                    {"\n                        "}
                    <rect
                      x={"22"}
                      y={"22"}
                      width={"14"}
                      height={"14"}
                      rx={"2.5"}
                      fill={"#0d1b2e"}
                    ></rect>
                    {"\n                        "}
                    <text
                      x={"46"}
                      y={"29"}
                      fontSize={"16"}
                      fontWeight={"700"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                      letterSpacing={"-.4"}
                    >
                      <T>{"groupby"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 150 44"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <circle
                      cx={"22"}
                      cy={"22"}
                      r={"18"}
                      fill={"#1673FF"}
                    ></circle>
                    {"\n                        "}
                    <text
                      x={"22"}
                      y={"27"}
                      textAnchor={"middle"}
                      fontSize={"14"}
                      fontWeight={"900"}
                      fill={"#fff"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"M"}</T>
                    </text>
                    {"\n                        "}
                    <text
                      x={"50"}
                      y={"27"}
                      fontSize={"15"}
                      fontWeight={"600"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                      letterSpacing={"-.3"}
                    >
                      <T>{"Medallia"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 120 44"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <circle
                      cx={"22"}
                      cy={"22"}
                      r={"6"}
                      fill={"#0d1b2e"}
                    ></circle>
                    {"\n                        "}
                    <path d={"M22 16 L18 6 L26 8 Z"} fill={"#0d1b2e"}></path>
                    {"\n                        "}
                    <path d={"M22 28 L18 38 L26 36 Z"} fill={"#0d1b2e"}></path>
                    {"\n                        "}
                    <path d={"M16 22 L6 18 L8 26 Z"} fill={"#0d1b2e"}></path>
                    {"\n                        "}
                    <path d={"M28 22 L38 18 L36 26 Z"} fill={"#0d1b2e"}></path>
                    {"\n                        "}
                    <text
                      x={"50"}
                      y={"28"}
                      fontSize={"18"}
                      fontWeight={"800"}
                      fill={"#0d1b2e"}
                      fontFamily={"'Arial Black','Arial',sans-serif"}
                      letterSpacing={"-.5"}
                    >
                      <T>{"MHP"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 170 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <circle
                      cx={"22"}
                      cy={"28"}
                      r={"18"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.6"}
                    ></circle>
                    {"\n                        "}
                    <ellipse
                      cx={"22"}
                      cy={"28"}
                      rx={"7"}
                      ry={"18"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.1"}
                    ></ellipse>
                    {"\n                        "}
                    <line
                      x1={"4"}
                      y1={"28"}
                      x2={"40"}
                      y2={"28"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1"}
                    ></line>
                    {"\n                        "}
                    <line
                      x1={"6"}
                      y1={"18"}
                      x2={"38"}
                      y2={"18"}
                      stroke={"#0d1b2e"}
                      strokeWidth={".8"}
                    ></line>
                    {"\n                        "}
                    <line
                      x1={"6"}
                      y1={"38"}
                      x2={"38"}
                      y2={"38"}
                      stroke={"#0d1b2e"}
                      strokeWidth={".8"}
                    ></line>
                    {"\n                        "}
                    <text
                      x={"50"}
                      y={"24"}
                      fontSize={"12"}
                      fontWeight={"700"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                      letterSpacing={"-.2"}
                    >
                      <T>{"world"}</T>
                      <tspan fontWeight={"400"}>
                        <T>{"ticket"}</T>
                      </tspan>
                    </text>
                    {"\n                        "}
                    <text
                      x={"50"}
                      y={"38"}
                      fontSize={"10"}
                      fontWeight={"400"}
                      fill={"#5f7089"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"solutions"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 130 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"24"}
                      r={"20"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></circle>
                    {"\n                        "}
                    <path
                      d={"M18 38 Q28 46 38 38"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.6"}
                      fill={"none"}
                    ></path>
                    {"\n                        "}
                    <circle
                      cx={"28"}
                      cy={"24"}
                      r={"4"}
                      fill={"#0d1b2e"}
                    ></circle>
                    {"\n                        "}
                    <circle
                      cx={"18"}
                      cy={"24"}
                      r={"3"}
                      fill={"#0d1b2e"}
                      opacity={".5"}
                    ></circle>
                    {"\n                        "}
                    <circle
                      cx={"38"}
                      cy={"24"}
                      r={"3"}
                      fill={"#0d1b2e"}
                      opacity={".5"}
                    ></circle>
                    {"\n                        "}
                    <text
                      x={"58"}
                      y={"30"}
                      fontSize={"16"}
                      fontWeight={"700"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                      letterSpacing={"-.3"}
                    >
                      <T>{"Elafris"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 190 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <polygon
                      points={
                        "22,4 38,4 44,14 38,24 44,34 38,44 22,44 16,34 10,24 16,14"
                      }
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></polygon>
                    {"\n                        "}
                    <polygon
                      points={
                        "22,10 34,10 38,17 34,24 38,31 34,38 22,38 18,31 14,24 18,17"
                      }
                      fill={"#0d1b2e"}
                      opacity={".15"}
                    ></polygon>
                    {"\n                        "}
                    <text
                      x={"56"}
                      y={"22"}
                      fontSize={"11"}
                      fontWeight={"700"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"Digital Health"}</T>
                    </text>
                    {"\n                        "}
                    <text
                      x={"56"}
                      y={"36"}
                      fontSize={"11"}
                      fontWeight={"400"}
                      fill={"#5f7089"}
                      fontFamily={"Inter,sans-serif"}
                    >
                      <T>{"Outcomes"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 160 44"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <rect
                      x={"4"}
                      y={"8"}
                      width={"10"}
                      height={"10"}
                      rx={"2"}
                      fill={"#0d1b2e"}
                    ></rect>
                    {"\n                        "}
                    <rect
                      x={"17"}
                      y={"8"}
                      width={"10"}
                      height={"10"}
                      rx={"2"}
                      fill={"#0d1b2e"}
                      opacity={".6"}
                    ></rect>
                    {"\n                        "}
                    <rect
                      x={"4"}
                      y={"21"}
                      width={"10"}
                      height={"10"}
                      rx={"2"}
                      fill={"#0d1b2e"}
                      opacity={".6"}
                    ></rect>
                    {"\n                        "}
                    <rect
                      x={"17"}
                      y={"21"}
                      width={"10"}
                      height={"10"}
                      rx={"2"}
                      fill={"#0d1b2e"}
                    ></rect>
                    {"\n                        "}
                    <text
                      x={"36"}
                      y={"29"}
                      fontSize={"16"}
                      fontWeight={"600"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                      letterSpacing={"-.3"}
                    >
                      <T>{"modelate"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 130 44"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <rect
                      x={"4"}
                      y={"8"}
                      width={"32"}
                      height={"24"}
                      rx={"3"}
                      fill={"none"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.8"}
                    ></rect>
                    {"\n                        "}
                    <path
                      d={"M4 10 L20 20 L36 10"}
                      stroke={"#0d1b2e"}
                      strokeWidth={"1.5"}
                      fill={"none"}
                    ></path>
                    {"\n                        "}
                    <text
                      x={"46"}
                      y={"27"}
                      fontSize={"17"}
                      fontWeight={"800"}
                      fill={"#0d1b2e"}
                      fontFamily={"'Arial Black','Arial',sans-serif"}
                      letterSpacing={".5"}
                    >
                      <T>{"SMTP"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n                "}
                <div className={"cl-card"}>
                  {"\n                    "}
                  <svg
                    viewBox={"0 0 170 56"}
                    xmlns={"http://www.w3.org/2000/svg"}
                  >
                    {"\n                        "}
                    <path
                      d={
                        "M10,36 Q10,26 20,26 Q21,18 30,20 Q34,12 42,16 Q50,10 56,18 Q66,18 66,26 Q66,34 56,34Z"
                      }
                      fill={"#1a8fcc"}
                      opacity={".85"}
                    ></path>
                    {"\n                        "}
                    <path
                      d={
                        "M14,44 Q14,38 20,38 Q22,34 26,36 Q28,30 32,34 Q36,28 42,32 Q46,32 46,38 Q46,44 40,44Z"
                      }
                      fill={"#5bbcd8"}
                      opacity={".7"}
                    ></path>
                    {"\n                        "}
                    <text
                      x={"56"}
                      y={"34"}
                      fontSize={"14"}
                      fontWeight={"600"}
                      fill={"#0d1b2e"}
                      fontFamily={"Inter,sans-serif"}
                      letterSpacing={"-.3"}
                    >
                      <T>{"cloudbeds"}</T>
                    </text>
                    {"\n                    "}
                  </svg>
                  {"\n                "}
                </div>
                {"\n            "}
              </HomeClients>
              {"\n        "}
            </div>
          </Reveal>
          {"\n    "}
        </section>
      </HomeSection>
      {"\n\n    "}
      <HomeProjects />
      {"\n\n\n    "}
      {"\n    "}
      <HomeSection sectionKey="whatwedo">
        <section className={"wwd-sec"} id={"sec-whatwedo"}>
          {"\n        "}
          <Reveal>
            <div className={"wrap sec reveal"}>
              {"\n            "}
              <div className={"sec-hd"}>
                {"\n                "}
                <h2 className={"sec-title"}>
                  <T>{"What we do"}</T>
                </h2>
                {"\n            "}
              </div>
              {"\n            "}
              <div className={"wwd-grid"}>
                {"\n\n                "}
                {"\n                "}
                <T>
                  {site.whatWeDoServices["iot"] !== false ? (
                    <RouteLink
                      href={"/iot-development"}
                      className={"wwd-card full iot-bg wwd-has-cover"}
                      data-service-key={"iot"}
                    >
                      {"\n                    "}
                      <img
                        className={"wwd-cover"}
                        src={assetUrl("assets/what-we-do-iot.webp")}
                        width={"2170"}
                        height={"725"}
                        alt={""}
                        loading={"lazy"}
                        decoding={"async"}
                        draggable={"false"}
                      />
                      {"\n                    "}
                      <div className={"wwd-inner"}>
                        {"\n                        "}
                        <div className={"wwd-ttl"}>
                          <T>{"IoT development services"}</T>
                        </div>
                        {"\n                        "}
                        <div className={"lm-btn"}>
                          <span>
                            <T>{"Learn more"}</T>
                          </span>
                          {"\n                            "}
                          <div className={"lm-circle"}>
                            <svg viewBox={"0 0 12 12"} fill={"none"}>
                              {"\n                                    "}
                              <path
                                d={"M2 6h8M7 3l3 3-3 3"}
                                stroke={"#fff"}
                                strokeWidth={"1.5"}
                                strokeLinecap={"round"}
                                strokeLinejoin={"round"}
                              ></path>
                              {"\n                                "}
                            </svg>
                          </div>
                          {"\n                        "}
                        </div>
                        {"\n                    "}
                      </div>
                      {"\n                "}
                    </RouteLink>
                  ) : null}
                </T>
                {"\n\n                "}
                {"\n                "}
                <T>
                  {site.whatWeDoServices["full-cycle"] !== false ? (
                    <RouteLink
                      href={"/full-cycle-development"}
                      className={"wwd-card full-bg wwd-has-cover"}
                      data-service-key={"full-cycle"}
                    >
                      {"\n                    "}
                      <img
                        className={"wwd-cover"}
                        src={assetUrl("assets/what-we-do-development.webp")}
                        width={"2168"}
                        height={"725"}
                        alt={""}
                        loading={"lazy"}
                        decoding={"async"}
                        draggable={"false"}
                      />
                      {"\n                    "}
                      <div className={"wwd-inner"}>
                        {"\n                        "}
                        <div className={"wwd-ttl"}>
                          <T>{"Full-cycle development"}</T>
                        </div>
                        {"\n                        "}
                        <div className={"lm-btn"}>
                          <span>
                            <T>{"Learn more"}</T>
                          </span>
                          {"\n                            "}
                          <div className={"lm-circle"}>
                            <svg viewBox={"0 0 12 12"} fill={"none"}>
                              {"\n                                    "}
                              <path
                                d={"M2 6h8M7 3l3 3-3 3"}
                                stroke={"#fff"}
                                strokeWidth={"1.5"}
                                strokeLinecap={"round"}
                                strokeLinejoin={"round"}
                              ></path>
                              {"\n                                "}
                            </svg>
                          </div>
                          {"\n                        "}
                        </div>
                        {"\n                    "}
                      </div>
                      {"\n                "}
                    </RouteLink>
                  ) : null}
                </T>
                {"\n\n                "}
                {"\n                "}
                <T>
                  {site.whatWeDoServices["ecommerce"] !== false ? (
                    <RouteLink
                      href={"/ecommerce-development"}
                      className={"wwd-card ecom-bg wwd-has-cover"}
                      data-service-key={"ecommerce"}
                    >
                      {"\n                    "}
                      <img
                        className={"wwd-cover"}
                        src={assetUrl("assets/what-we-do-ecommerce.webp")}
                        width={"2170"}
                        height={"725"}
                        alt={""}
                        loading={"lazy"}
                        decoding={"async"}
                        draggable={"false"}
                      />
                      {"\n                    "}
                      <div className={"wwd-inner"}>
                        {"\n                        "}
                        <div className={"wwd-ttl"}>
                          <T>{"eCommerce platform development"}</T>
                        </div>
                        {"\n                        "}
                        <div className={"lm-btn"}>
                          <span>
                            <T>{"Learn more"}</T>
                          </span>
                          {"\n                            "}
                          <div className={"lm-circle"}>
                            <svg viewBox={"0 0 12 12"} fill={"none"}>
                              {"\n                                    "}
                              <path
                                d={"M2 6h8M7 3l3 3-3 3"}
                                stroke={"#fff"}
                                strokeWidth={"1.5"}
                                strokeLinecap={"round"}
                                strokeLinejoin={"round"}
                              ></path>
                              {"\n                                "}
                            </svg>
                          </div>
                          {"\n                        "}
                        </div>
                        {"\n                    "}
                      </div>
                      {"\n                "}
                    </RouteLink>
                  ) : null}
                </T>
                {"\n\n                "}
                {"\n                "}
                <T>
                  {site.whatWeDoServices["blockchain"] !== false ? (
                    <RouteLink
                      href={"/blockchain-development"}
                      className={"wwd-card bc-bg wwd-has-cover"}
                      data-service-key={"blockchain"}
                    >
                      {"\n                    "}
                      <img
                        className={"wwd-cover"}
                        src={assetUrl("assets/what-we-do-blockchain.webp")}
                        width={"2157"}
                        height={"729"}
                        alt={""}
                        loading={"lazy"}
                        decoding={"async"}
                        draggable={"false"}
                      />
                      {"\n                    "}
                      <div className={"wwd-inner"}>
                        {"\n                        "}
                        <div className={"wwd-ttl"}>
                          <T>{"Blockchain development"}</T>
                        </div>
                        {"\n                        "}
                        <div className={"lm-btn"}>
                          <span>
                            <T>{"Learn more"}</T>
                          </span>
                          {"\n                            "}
                          <div className={"lm-circle"}>
                            <svg viewBox={"0 0 12 12"} fill={"none"}>
                              {"\n                                    "}
                              <path
                                d={"M2 6h8M7 3l3 3-3 3"}
                                stroke={"#fff"}
                                strokeWidth={"1.5"}
                                strokeLinecap={"round"}
                                strokeLinejoin={"round"}
                              ></path>
                              {"\n                                "}
                            </svg>
                          </div>
                          {"\n                        "}
                        </div>
                        {"\n                    "}
                      </div>
                      {"\n                "}
                    </RouteLink>
                  ) : null}
                </T>
                {"\n\n                "}
                {"\n                "}
                <T>
                  {site.whatWeDoServices["ai"] !== false ? (
                    <RouteLink
                      href={"/ai-development"}
                      className={"wwd-card ai-bg wwd-has-cover"}
                      data-service-key={"ai"}
                    >
                      {"\n                    "}
                      <img
                        className={"wwd-cover"}
                        src={assetUrl("assets/what-we-do-ai-holograms.webp")}
                        width={"2135"}
                        height={"736"}
                        alt={""}
                        loading={"lazy"}
                        decoding={"async"}
                        draggable={"false"}
                      />
                      {"\n                    "}
                      <div className={"wwd-inner"}>
                        {"\n                        "}
                        <div className={"wwd-ttl"}>
                          <T>{"AI Development Services"}</T>
                        </div>
                        {"\n                        "}
                        <div className={"lm-btn"}>
                          <span>
                            <T>{"Learn more"}</T>
                          </span>
                          {"\n                            "}
                          <div className={"lm-circle"}>
                            <svg viewBox={"0 0 12 12"} fill={"none"}>
                              {"\n                                    "}
                              <path
                                d={"M2 6h8M7 3l3 3-3 3"}
                                stroke={"#fff"}
                                strokeWidth={"1.5"}
                                strokeLinecap={"round"}
                                strokeLinejoin={"round"}
                              ></path>
                              {"\n                                "}
                            </svg>
                          </div>
                          {"\n                        "}
                        </div>
                        {"\n                    "}
                      </div>
                      {"\n                "}
                    </RouteLink>
                  ) : null}
                </T>
                {"\n\n                "}
                {"\n                "}
                <T>
                  {site.whatWeDoServices["fintech"] !== false ? (
                    <RouteLink
                      href={"/fintech-development"}
                      className={"wwd-card full fintech-bg wwd-has-cover"}
                      data-service-key={"fintech"}
                    >
                      {"\n                    "}
                      <img
                        className={"wwd-cover"}
                        src={assetUrl("assets/what-we-do-fintech.webp")}
                        width={"2171"}
                        height={"724"}
                        alt={""}
                        loading={"lazy"}
                        decoding={"async"}
                        draggable={"false"}
                      />
                      {"\n                    "}
                      <div className={"wwd-inner"}>
                        {"\n                        "}
                        <div className={"wwd-ttl"}>
                          <T>{"Fintech Software Development Services"}</T>
                        </div>
                        {"\n                        "}
                        <div className={"lm-btn"}>
                          <span>
                            <T>{"Learn more"}</T>
                          </span>
                          {"\n                            "}
                          <div className={"lm-circle"}>
                            <svg viewBox={"0 0 12 12"} fill={"none"}>
                              {"\n                                    "}
                              <path
                                d={"M2 6h8M7 3l3 3-3 3"}
                                stroke={"#fff"}
                                strokeWidth={"1.5"}
                                strokeLinecap={"round"}
                                strokeLinejoin={"round"}
                              ></path>
                              {"\n                                "}
                            </svg>
                          </div>
                          {"\n                        "}
                        </div>
                        {"\n                    "}
                      </div>
                      {"\n                "}
                    </RouteLink>
                  ) : null}
                </T>
                {"\n\n            "}
              </div>
              {"\n        "}
            </div>
          </Reveal>
          {"\n    "}
        </section>
      </HomeSection>
      {"\n\n    "}
      {"\n    "}
      <HomeServices />
      {"\n\n    "}
      {"\n    "}
      <HomeSection sectionKey="cases" />
      {"\n\n    "}
      {"\n    "}
      <div className={"cta-sec"}>
        {"\n        "}
        <div className={"cta-inner"}>
          {"\n            "}
          <div className={"cta-txt"}>
            <T>{"Launching a new project or improving an existing one?"}</T>
            <br />
            <T>{"We can bring your ideas to\n                life!"}</T>
          </div>
          {"\n            "}
          <RouteLink href={"/contact#form-section"} className={"btn-outline-w"}>
            <T>{"Get in touch"}</T>
          </RouteLink>
          {"\n        "}
        </div>
        {"\n    "}
      </div>
      {"\n\n    "}
      {"\n    "}
      <HomeMap />
      {"\n\n    "}
      {"\n    "}
      <HomeTestimonials />
      {"\n\n    "}
      {"\n    "}
      <HomeSection sectionKey="insights">
        <section id={"sec-insights"}>
          {"\n        "}
          <Reveal>
            <div className={"wrap sec reveal"}>
              {"\n            "}
              <div className={"sec-hd"}>
                {"\n                "}
                <h2 className={"sec-title"}>
                  <T>{"Insights from Sakinzo"}</T>
                </h2>
                <RouteLink href={"/blog"} className={"btn-blue"}>
                  <T>{"Browse More"}</T>
                </RouteLink>
                {"\n            "}
              </div>
              {"\n            "}
              <HomeInsights />
              {"\n            "}
              <div className={"sec-btn-row"}>
                <RouteLink href={"/blog"} className={"btn-blue"}>
                  <T>{"Browse More"}</T>
                </RouteLink>
              </div>
              {"\n        "}
            </div>
          </Reveal>
          {"\n    "}
        </section>
      </HomeSection>
      {"\n\n    "}
      {"\n    "}
      <footer id={"contact"}>
        {"\n        "}
        <div className={"ft-top"}>
          {"\n            "}
          <FooterContactForm />
          {"\n            "}
          <div className={"ft-info"}>
            {"\n                "}
            <NoTranslate>
              <div className={"ft-logo"}>
                {"\n                    "}
                <svg
                  width={"34"}
                  height={"34"}
                  viewBox={"0 0 36 36"}
                  fill={"none"}
                >
                  {"\n                        "}
                  <path
                    d={"M6 8 L18 2 L30 8 L26 14 L18 11 L10 14 Z"}
                    fill={"#1673FF"}
                  ></path>
                  {"\n                        "}
                  <path
                    d={"M6 8 L10 14 L6 20 L18 34 L30 20 L26 14 L18 11 L10 14 Z"}
                    fill={"#1673FF"}
                    opacity={".85"}
                  ></path>
                  {"\n                        "}
                  <path
                    d={"M10 14 L18 11 L26 14 L18 28 Z"}
                    fill={"rgba(255,255,255,0.3)"}
                  ></path>
                  {"\n                    "}
                </svg>
                {"\n                    "}
                <span className={"ft-logo-txt"}>
                  <T>{"Sakin"}</T>
                  <span>
                    <T>{".zo"}</T>
                  </span>
                </span>
                {"\n                "}
              </div>
            </NoTranslate>
            {"\n                "}
            <div className={"ft-lbl"}>
              <T>{"Our Offices"}</T>
            </div>
            {"\n                "}
            <address className={"ft-addr"}>
              <T>{"Mumbai & Thane, Maharashtra, India"}</T>
              <br />
              {"\n\n                "}
            </address>
            {"\n                "}
            <hr className={"ft-hr"} />
            {"\n                "}
            <ContactLinks />
            {"\n            "}
          </div>
          {"\n        "}
        </div>
        {"\n        "}
        <div className={"ft-nav"}>
          {"\n            "}
          <div className={"ft-nav-inner"}>
            {"\n                "}
            <FooterColumn className={"ft-col"}>
              {"\n                    "}
              <div className={"ft-col-ttl"}>
                <T>{"Services"}</T>
                <svg viewBox={"0 0 10 6"} fill={"none"}>
                  {"\n                            "}
                  <path
                    d={"M1 1L5 5L9 1"}
                    stroke={"rgba(255,255,255,0.5)"}
                    strokeWidth={"1.8"}
                    strokeLinecap={"round"}
                  ></path>
                  {"\n                        "}
                </svg>
              </div>
              {"\n                    "}
              <div className={"ft-col-links"}>
                <RouteLink href="/ai-development">
                  <T>{"AI Development"}</T>
                </RouteLink>
                <RouteLink href="/ai-agent-development">
                  <T>{"AI Agent Development"}</T>
                </RouteLink>
                <RouteLink href="/fintech-development">
                  <T>{"Fintech Software Development"}</T>
                </RouteLink>
                <RouteLink href="/blockchain-development">
                  <T>{"Blockchain Development"}</T>
                </RouteLink>
                <RouteLink href="/iot-development">
                  <T>{"IoT Development Services"}</T>
                </RouteLink>
                <RouteLink href="/smart-home-solutions">
                  <T>{"IoT Smart Home Solutions"}</T>
                </RouteLink>
                <RouteLink href="/ecommerce-development">
                  <T>{"eCommerce Platform Development"}</T>
                </RouteLink>
                <RouteLink href="/full-cycle-development">
                  <T>{"Full-cycle Development"}</T>
                </RouteLink>
              </div>
              {"\n                "}
            </FooterColumn>
            {"\n                "}
            <FooterColumn className={"ft-col"}>
              {"\n                    "}
              <div className={"ft-col-ttl"}>
                <T>{"About Us"}</T>
                <svg viewBox={"0 0 10 6"} fill={"none"}>
                  {"\n                            "}
                  <path
                    d={"M1 1L5 5L9 1"}
                    stroke={"rgba(255,255,255,0.5)"}
                    strokeWidth={"1.8"}
                    strokeLinecap={"round"}
                  ></path>
                  {"\n                        "}
                </svg>
              </div>
              {"\n                    "}
              <div className={"ft-col-links"}>
                <RouteLink href="/who-we-are">
                  <T>{"Who We Are"}</T>
                </RouteLink>
                <RouteLink href="/careers">
                  <T>{"Careers"}</T>
                </RouteLink>
                <RouteLink href="/leadership">
                  <T>{"Leadership"}</T>
                </RouteLink>
                <RouteLink href="/news">
                  <T>{"News"}</T>
                </RouteLink>
                <RouteLink href="/opensource">
                  <T>{"Opensource"}</T>
                </RouteLink>
                <RouteLink href="/contact">
                  <T>{"Contacts"}</T>
                </RouteLink>
              </div>
              {"\n                "}
            </FooterColumn>
            {"\n                "}
            <FooterColumn className={"ft-col"}>
              {"\n                    "}
              <div className={"ft-col-ttl"}>
                <T>{"Success Stories"}</T>
                <svg viewBox={"0 0 10 6"} fill={"none"}>
                  {"\n                            "}
                  <path
                    d={"M1 1L5 5L9 1"}
                    stroke={"rgba(255,255,255,0.5)"}
                    strokeWidth={"1.8"}
                    strokeLinecap={"round"}
                  ></path>
                  {"\n                        "}
                </svg>
              </div>
              {"\n                    "}
              <div className={"ft-col-links"}>
                <RouteLink href="/smart-hvac">
                  <T>{"Smart Automated A/C Drain Line Cleaner"}</T>
                </RouteLink>
                <RouteLink href="/market-access">
                  <T>
                    {
                      "AI-Based\n                            Market Access Planning Tool"
                    }
                  </T>
                </RouteLink>
                <RouteLink href="/ev-charging">
                  <T>{"Cloud ecosystem for EV charging"}</T>
                </RouteLink>
                <RouteLink href="/iot-cloud-platform">
                  <T>{"IoT cloud platform"}</T>
                </RouteLink>
                <RouteLink href="/projects">
                  <T>{"Browse all projects"}</T>
                </RouteLink>
                <RouteLink href="/multi-currency-wallet">
                  <T>{"Multi-currency Wallet"}</T>
                </RouteLink>
              </div>
              {"\n                "}
            </FooterColumn>
            {"\n                "}
            <FooterColumn className={"ft-col"}>
              {"\n                    "}
              <div className={"ft-col-ttl"}>
                <T>{"Blog"}</T>
                <svg viewBox={"0 0 10 6"} fill={"none"}>
                  {"\n                            "}
                  <path
                    d={"M1 1L5 5L9 1"}
                    stroke={"rgba(255,255,255,0.5)"}
                    strokeWidth={"1.8"}
                    strokeLinecap={"round"}
                  ></path>
                  {"\n                        "}
                </svg>
              </div>
              {"\n                    "}
              <div className={"ft-col-links"}>
                {(site.blogs?.length ? site.blogs.slice(0, 6) : localBlogPosts).map((post) => (
                  <RouteLink key={post._id || post.slug} href={contentPath("blog", post, site.blogs?.length ? site.blogs : localBlogPosts)}>
                    <T>{post.title}</T>
                  </RouteLink>
                ))}
              </div>
              {"\n                "}
            </FooterColumn>
            {"\n            "}
          </div>
          {"\n        "}
        </div>
        {"\n        "}
        <div className={"ft-bar"}>
          {"\n            "}
          <div className={"ft-bar-inner"}>
            {"\n                "}
            <span className={"ft-copy"}>
              <T>{"2026 SAKINZO LLC. All rights reserved."}</T>
            </span>
            {"\n                "}
            <div className={"ft-links"}>
              <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Privacy%20enquiry">
                <T>{"Privacy enquiries"}</T>
              </RouteLink>
              <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Terms%20enquiry">
                <T>{"Terms enquiries"}</T>
              </RouteLink>
              <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Accessibility%20enquiry">
                <T>
                  {"Accessibility enquiries"}
                </T>
              </RouteLink>
              <RouteLink href="mailto:sakinzo.work@gmail.com?subject=Cookie%20enquiry">
                <T>{"Cookie enquiries"}</T>
              </RouteLink>
              <RouteLink href="/sitemap.xml">
                <T>{"Sitemap"}</T>
              </RouteLink>
            </div>
            {"\n            "}
          </div>
          {"\n        "}
        </div>
        {"\n    "}
      </footer>
      {"\n\n    "}
      {"\n\n\n\n"}
    </>
  );
}
