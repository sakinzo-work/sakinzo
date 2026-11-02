# React architecture

The website runs as one React application with BrowserRouter. The Vite index document contains only the mount node and entry script. Thirty public route components and the admin section routes render JSX. Legacy document URLs redirect to clean routes inside the same application.

All interactive rendering belongs to React. There are no DOM controller modules, `innerHTML` page renderers, injected HTML templates, global event-handler functions, HTML parsers in the browser, or iframe-based page wrappers. Project app/video iframes remain genuine external content previews.

Home-page API content, project filters/load-more, image carousels, service accordions, testimonials, visibility settings and footer controls use state and context. Contact forms keep controlled values, consent, attachments, request status and reset state. The native admin implementation shares a session/data context and uses controlled schema-based editors, confirmation dialogs, upload state, permissions and approval workflows.

Language dictionaries are held in React context. Text, labels and metadata render through translation components and hooks, so translations do not rewrite or corrupt React-managed DOM. Form values stay outside translation. Provider errors restore English. The language URL and stored preference remain compatible, including RTL support. Unconfigured public deployments can use the external Google Translate view; local translation requires the backend provider.

Native React metadata components manage titles, social metadata, canonical URLs and JSON-LD. Page-specific styles load with route cleanup. The build creates a clean-route sitemap and the admin service-worker cache; it does not prerender a separate HTML document per route.

Direct DOM access is limited to normal browser integration: stylesheet resources, document language/theme, focus and scrolling, element measurements, observers, and the Leaflet map. Map popup content is rendered through a React portal. None of these integrations renders page markup from strings.

The backend models, routes and database behavior remain Express/MongoDB. A private runtime configuration is not included. The example configuration uses placeholders. Test coverage includes the React architecture, original-file integrity, desktop/mobile routes, SPA navigation, forms, project media/previews, owner/admin operations, employee approvals, permissions, translations and PWA offline loading, with fixture responses rather than a live database.
