import { useLayoutEffect, useState } from "react";
import { loadPageStyles, pageStylesReady } from "../lib/pageStyles.js";
export default function usePageStyles(slug) {
  const [state, setState] = useState({ slug: null, ready: false, error: null });
  const [revision, setRevision] = useState(0);
  useLayoutEffect(() => {
    let active = true;
    const previousClass = document.body.className;
    document.body.className =
      slug === "services" ||
      /development|solutions|design|analysis|testing/.test(slug)
        ? "service-page"
        : "";
    document.body.dataset.page = slug;
    const promise = loadPageStyles(slug);
    setState({ slug, ready: pageStylesReady(slug), error: null });
    promise.then(() => {
      if (active) setState({ slug, ready: true, error: null });
    }, error => {
      if (active) setState({ slug, ready: false, error });
    });
    return () => {
      active = false;
      document.body.className = previousClass;
    };
  }, [slug, revision]);
  return { ready: state.slug === slug && state.ready, error: state.slug === slug ? state.error : null,
    retry: () => setRevision(value => value + 1) };
}
