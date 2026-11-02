import { cloneElement } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
export default function Localized({ children, ref }) {
  const { t } = useLanguage();
  const props = {};
  for (const key of ["title", "alt", "placeholder", "aria-label"])
    if (typeof children.props[key] === "string")
      props[key] = t(children.props[key]);
  return cloneElement(children, { ...props, ...(ref ? { ref } : {}) });
}
