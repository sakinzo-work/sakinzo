import { contact } from "../data/contact.js";
import { NoTranslate, T } from "../context/LanguageContext.jsx";

function Icon({ kind }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "email" ? <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>
        : kind === "instagram" ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></>
          : <path d="M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 2a13 13 0 0 1-6-6l2-2-2-5Z" />}
    </svg>
  );
}

const channels = [
  { kind: "email", href: `mailto:${contact.email}`, text: contact.email, label: "Email us directly" },
  { kind: "phone", href: contact.phoneUrl, text: contact.phoneLabel, label: "Give us a call" },
  { kind: "instagram", href: contact.instagramUrl, text: `@${contact.instagram}`, label: "Follow us on Instagram" },
];

export default function ContactLinks({ variant = "footer" }) {
  return (
    <div className={`contact-details contact-details--${variant}`}>
      {channels.map((channel) => (
        <a key={channel.kind} href={channel.href}
          className={variant === "methods" ? "method" : "contact-detail-link"}
          id={variant === "methods" && channel.kind === "email" ? "contactEmailMethod" : undefined}
          target={channel.kind === "instagram" ? "_blank" : undefined}
          rel={channel.kind === "instagram" ? "noopener noreferrer" : undefined}>
          <span className={variant === "methods" ? `method-ico ${channel.kind}` : "contact-detail-icon"}><Icon kind={channel.kind} /></span>
          <span className="contact-detail-copy">
            <NoTranslate><strong>{channel.text}</strong></NoTranslate>
            {variant === "methods" && <span><T>{channel.label}</T></span>}
          </span>
        </a>
      ))}
    </div>
  );
}
