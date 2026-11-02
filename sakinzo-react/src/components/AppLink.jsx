import { Link } from "react-router-dom";
import { appPath } from "../lib/paths.js";
import { useLanguage } from "../context/LanguageContext.jsx";
export default function AppLink({ href, to, children, ...props }) {
  const { language } = useLanguage();
  let destination = appPath(to ?? href ?? "");
  if (!destination || /^(?:[a-z]+:|\/\/|#)/i.test(destination))
    return (
      <a href={destination} {...props}>
        {children}
      </a>
    );
  if (
    /\.(?:xml|json|pdf|zip|docx|xlsx|png|jpe?g|webp|svg|mp4)(?:[?#]|$)/i.test(
      destination,
    )
  )
    return (
      <a
        href={
          destination.startsWith("/uploads/")
            ? destination
            : `${import.meta.env.BASE_URL}${destination.replace(/^\//, "")}`
        }
        {...props}
      >
        {children}
      </a>
    );
  if (language !== "en" && !destination.startsWith("/admin")) {
    const url = new URL(destination, "http://app.local");
    url.searchParams.set("lang", language);
    destination = url.pathname + url.search + url.hash;
  }
  return (
    <Link to={destination} {...props}>
      {children}
    </Link>
  );
}
