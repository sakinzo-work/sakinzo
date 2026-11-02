# Service hero images

The `cover` entries in `frontend/services-data.js` are the source of truth for
service-page backgrounds, preload links, and social-share images. They include
the original image dimensions and separate desktop/mobile crop positions.
`alt=""` keeps these decorative backgrounds out of screen-reader announcements;
the image description is used in social metadata.

User-supplied PNGs were encoded to WebP at their original dimensions (quality 92).
The source photos were not altered. Existing What we do card photos are retained.

| Saved asset | Source | Service pages |
| --- | --- | --- |
| `service-ecommerce.webp` | Futuristic Global E-Commerce Network.png | eCommerce |
| `service-iot.webp` | Neon IoT Network Hub.png | IoT development |
| `service-ai.webp` | Neon AI Workspace with Thinking Android.png | AI development, AI agents |
| `service-software-development.webp` | Neon Software Development Workspace (1).png | Web/mobile, full-cycle, PoC/MVP, UX/UI, service directory |
| `service-fintech.webp` | Futuristic Fintech Banking Interface.png | Fintech |
| `service-business-analysis.webp` | Modern Green Analytics Workspace.png | Business analysis |
| `what-we-do-blockchain.webp` | Neon Blockchain Finance Dashboard.png | Blockchain |
| `what-we-do-iot.webp` | Connected Smart Home Ecosystem.png | Smart home |
| `service-devops.webp` | Built-in imagegen; prompt below | DevOps |
| `service-architecture.webp` | Built-in imagegen; prompt below | Architecture |
| `service-quality-assurance.webp` | Built-in imagegen; prompt below | QA/testing |

The three specialist backgrounds were created with the built-in imagegen tool,
then encoded to WebP at their original 2172 × 724 dimensions, quality 92. No API
key or external generation script was used.

## Generation prompts

### DevOps

Use case: ads-marketing. Asset type: website service hero background, panoramic 3:1 composition approximately 2160 by 720. Create one premium photorealistic cinematic technology workspace for DevOps and cloud engineering. On the RIGHT side, a realistic desktop monitor and laptop display abstract deployment pipelines, cloud infrastructure nodes, observability graphs and restrained cyan status indicators; faint server racks softly out of focus behind them. Deep navy and teal palette, tactile dark desk, subtle reflections, professional lighting consistent with a premium software engineering company. Leave the LEFT 55 percent calm, dark navy negative space for large white website headlines; keep all important equipment in the right 40 percent with generous margins so it can crop well on phones. No people, no logos, no watermark, no headings or legible writing. The image is photographic artwork, not a webpage screenshot. One continuous image, no panels.

### Architecture

Use case: ads-marketing. Asset type: website software architecture service hero background, panoramic 3:1 composition approximately 2160 by 720. Create one premium photorealistic cinematic systems-design workspace. On the RIGHT, a large realistic monitor on a dark desk shows a refined technical architecture map of interconnected application blocks, database cylinders, API connections and cloud nodes using thin luminous blue and cyan lines, with a small open notebook and a plant nearby. A few subtle translucent architecture connections rise just above the monitor, restrained and believable. Deep navy, blue and teal palette, precise professional mood, subtle reflections. The LEFT 55 percent must be calm dark negative space for large white headline copy. Keep the main architecture screen clearly on the right with generous crop-safe margins. No people, no logos, no watermark, no headings or readable text. Photographic background artwork only, not a webpage or multiple-panel collage.

### QA/testing

Use case: ads-marketing. Asset type: website software QA and testing service hero background, panoramic 3:1 composition approximately 2160 by 720. Create one premium photorealistic software quality engineering workspace. On the RIGHT, a realistic monitor displays an abstract automated test-run dashboard with a neat grid of green check indicators, browser/device test tiles and a small performance graph; a laptop, smartphone and compact tablet beside it suggest cross-device testing. Deep navy workspace with subtle teal and green illumination, realistic desk materials and soft reflections, precise trustworthy professional mood. The LEFT 55 percent should stay uncluttered and dark for white headline copy. Keep important devices on the right with crop-safe margins. No people, logos, watermark, large type or legible writing. One photographic image, no webpage framing and no multi-panel collage.
