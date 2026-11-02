import { cloneElement, useEffect, useRef, useState } from "react";
export default function Reveal({ children }) {
  const ref = useRef(null),
    [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return cloneElement(children, {
    ref,
    className: `${children.props.className || ""}${visible ? " vis" : ""}`,
  });
}
