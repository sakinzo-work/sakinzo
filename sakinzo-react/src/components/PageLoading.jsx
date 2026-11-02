import ContentState from "./ContentState.jsx";

export default function PageLoading({ error = false, onRetry }) {
  return <main className="route-loading">
    <a className="loading-brand" href={import.meta.env.BASE_URL}>Sakin<span>.zo</span></a>
    <ContentState state={error ? "error" : "loading"} heading="h1"
      title={error ? "This page couldn't finish loading" : "Getting things ready…"}
      description={error ? "Check your connection and try again." : "Your page will be ready in a moment."}
      onAction={error ? onRetry : undefined} />
  </main>;
}
