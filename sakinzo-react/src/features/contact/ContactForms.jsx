import AttachmentField from "./AttachmentField.jsx";
import useContactForm from "../../hooks/useContactForm.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { T, useLanguage } from "../../context/LanguageContext.jsx";
export function ContactForm() {
  const form = useContactForm("Contact page"),
    { site } = useSiteData(),
    { t } = useLanguage();
  if (form.status === "success")
    return (
      <div
        className="success-state"
        id="successBox"
        style={{ display: "block" }}
        role="status"
      >
        <div className="success-icon">✓</div>
        <h2>
          <T>Thank you!</T>
        </h2>
        <p>
          <T>
            Your request has been sent successfully. Our team will get back to
            you soon.
          </T>
        </p>
        <button type="button" className="btn-reset" onClick={form.reset}>
          <T>← Send Another Request</T>
        </button>
      </div>
    );
  return (
    <div id="formBody">
      <h2 id="contactFormTitle">
        <T text={site.contactPage.formTitle || "Tell us about your project"} />
      </h2>
      <p className="form-sub" id="contactFormSubtitle">
        <T
          text={
            site.contactPage.formSubtitle ||
            "Fill in the details below and our team will get back to you within one business day."
          }
        />
      </p>
      <form id="cForm" onSubmit={form.submit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="contact-name">
              <T>Your name</T> *
            </label>
            <input
              id="contact-name"
              {...form.field("name")}
              required
              autoComplete="name"
              placeholder={t("Enter your name")}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-email">
              <T>Email address</T> *
            </label>
            <input
              id="contact-email"
              {...form.field("email")}
              type="email"
              required
              autoComplete="email"
              placeholder={t("Your work email")}
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="contact-phone">
              <T>Phone number</T>
            </label>
            <input
              id="contact-phone"
              {...form.field("phone")}
              type="tel"
              autoComplete="tel"
              placeholder={t("Your phone number")}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-company">
              <T>Company</T>
            </label>
            <input
              id="contact-company"
              {...form.field("company")}
              autoComplete="organization"
              placeholder={t("Company name")}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="contact-desc">
            <T>Project description</T> *
          </label>
          <textarea
            id="contact-desc"
            {...form.field("desc")}
            required
            rows={4}
            placeholder={t("Tell us about your project and goals")}
          />
        </div>
        <AttachmentField form={form} />
        <div className="privacy-row">
          <button
            type="button"
            id="chkBox"
            className={`chk-box${form.consent ? " on" : ""}`}
            role="checkbox"
            aria-checked={form.consent}
            aria-label={t("Agree to privacy notice")}
            onClick={() => form.setConsent((value) => !value)}
          />
          <span>
            <T>
              I agree to the processing of my personal data for this request.
            </T>
          </span>
        </div>
        {form.error && (
          <p role="alert" className="form-error">
            <T text={form.error} />
          </p>
        )}
        <button
          className={`btn-submit${form.status === "sending" ? " loading" : ""}`}
          id="subBtn"
          disabled={form.status === "sending"}
        >
          <span id="subTxt">
            <T text={form.status === "sending" ? "Sending…" : "Send Request"} />
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
export function FooterContactForm() {
  const form = useContactForm("Website footer"),
    { t } = useLanguage();
  return (
    <form className="contact-box" id="indexContactForm" onSubmit={form.submit}>
      {form.status === "success" ? (
        <div role="status">
          <h3>
            <T>Request sent successfully.</T>
          </h3>
          <button type="button" className="btn-submit" onClick={form.reset}>
            <T>Send another request</T>
          </button>
        </div>
      ) : (
        <>
          <h3>
            <T>Contact Us</T>
          </h3>
          {[["name", "email"], ["phone", "company"]].map((row, index) => (
            <div className="f-row footer-form-row" key={index}>
              {row.map((name) => (
                <input
                  className="f-inp"
                  key={name}
                  {...form.field(name)}
                  required={["name", "email"].includes(name)}
                  type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
                  placeholder={t({
                    name: "Full name *", email: "Email address *",
                    phone: "Phone number", company: "Company",
                  }[name])}
                  aria-label={t(name)}
                  autoComplete={{ name: "name", email: "email", phone: "tel", company: "organization" }[name]}
                />
              ))}
            </div>
          ))}
          <textarea
            className="f-inp footer-description"
            {...form.field("desc")}
            required
            placeholder={t("Project description *")}
            aria-label={t("Project description")}
            rows={2}
          />
          <AttachmentField form={form} footer />
          <label className="contact-consent">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => form.setConsent(event.target.checked)}
              required
            />
            <T>I agree to the processing of my personal data.</T>
          </label>
          {form.error && (
            <p role="alert">
              <T text={form.error} />
            </p>
          )}
          <button type="submit" disabled={form.status === "sending"}>
            <T text={form.status === "sending" ? "Sending…" : "Send Request"} />
          </button>
        </>
      )}
    </form>
  );
}
