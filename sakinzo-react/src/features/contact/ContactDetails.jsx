import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteData, visibleItems } from "../../context/SiteDataContext.jsx";
import { mediaUrl, safeUrl } from "../../lib/api.js";
import { T } from "../../context/LanguageContext.jsx";
export function OfficeList({ children, footer = false }) {
  const { site } = useSiteData(),
    offices = visibleItems(site.contactOffices);
  if (!offices.length) return children;
  return offices.map((office) => (
    <div className={footer ? "" : "office-item"} key={office._id}>
      <div className="office-country">
        <T text={office.country || office.name} />
      </div>
      <address>
        {String(
          office.address ||
            [office.city, office.country].filter(Boolean).join(", "),
        )
          .split("\n")
          .map((line, index) => (
            <span key={index}>
              <T text={line} />
              <br />
            </span>
          ))}
      </address>
      {!footer && (
        <a
          className="map-link"
          href={
            safeUrl(office.mapUrl) ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address || office.name)}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <T>Find on the map</T>
        </a>
      )}
    </div>
  ));
}
export function TeamAvatars() {
  const { site } = useSiteData(),
    members = visibleItems(site.team),
    [popup, setPopup] = useState(null);
  const panel = useRef(null);
  useEffect(() => {
    if (!popup) return;
    const close = () => setPopup(null);
    document.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [popup]);
  if (!members.length)
    return (
      <span className="team-empty">
        <T>Our team is ready to help</T>
      </span>
    );
  return (
    <>
      {members.map((member) => (
        <button
          type="button"
          className="av"
          key={member._id}
          style={{ background: member.color || "#1673ff" }}
          aria-label={member.name}
          onClick={(event) => {
            event.stopPropagation();
            const rect = event.currentTarget.getBoundingClientRect();
            setPopup({
              member,
              left: Math.max(
                12,
                Math.min(window.innerWidth - 252, rect.left - 80),
              ),
              top: rect.bottom + 12,
            });
          }}
        >
          {member.profileImage ? (
            <img src={mediaUrl(member.profileImage)} alt={member.name} />
          ) : (
            member.initials || member.name?.slice(0, 2).toUpperCase()
          )}
        </button>
      ))}
      {popup &&
        createPortal(
          <div
            ref={panel}
            className="av-links open"
            style={{ position: "fixed", left: popup.left, top: popup.top }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="av-links-name">{popup.member.name}</div>
            <div className="av-links-role">
              <T text={popup.member.role || ""} />
            </div>
            {safeUrl(popup.member.portfolio) && (
              <a
                className="av-link-btn portfolio"
                href={popup.member.portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            )}
            {safeUrl(popup.member.github) && (
              <a
                className="av-link-btn github"
                href={popup.member.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
