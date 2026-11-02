import { Children, cloneElement, useState } from "react";
export default function FooterColumn({ children, className }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      {Children.map(children, (child) => {
        if (!child?.props) return child;
        const title = String(child.props.className || "").includes(
          "ft-col-ttl",
        );
        const links = String(child.props.className || "").includes(
          "ft-col-links",
        );
        return title
          ? cloneElement(child, {
              className: `${child.props.className}${open ? " ft-open" : ""}`,
              onClick: () => setOpen((value) => !value),
              role: "button",
              tabIndex: 0,
              "aria-expanded": open,
              onKeyDown: (event) => {
                if (["Enter", " "].includes(event.key)) {
                  event.preventDefault();
                  setOpen((value) => !value);
                }
              },
            })
          : links
            ? cloneElement(child, {
                className: `${child.props.className}${open ? " ft-open" : ""}`,
              })
            : child;
      })}
    </div>
  );
}
