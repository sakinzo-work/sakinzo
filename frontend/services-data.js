/* The public service catalog is shared by page generation, navigation and SEO. */
(function (root) {
  const engineering = 'Engineering & delivery', specialist = 'Technology solutions';
  const services = [
    {
      slug: 'web-mobile-development', name: 'Web and Mobile Development', group: engineering,
      headline: 'Digital products that work wherever your customers are.',
      summary: 'Custom websites, web applications and mobile apps built around your users, workflows and business goals.',
      overviewTitle: 'One product experience, across every screen.',
      overview: ['A useful application starts with understanding the people who will use it. We turn customer journeys and operational requirements into clear, accessible interfaces backed by dependable software.', 'From a new customer portal to a mobile companion for an existing platform, we connect design, APIs, integrations and release planning so your product works as a whole.'],
      capabilities: [['Web applications', 'Customer portals, dashboards and business applications with responsive interfaces and maintainable architecture.'], ['Mobile experiences', 'iOS, Android and cross-platform applications with considered navigation, device integrations and offline behavior where required.'], ['APIs and integrations', 'Backend services, identity, payments and connections to the systems your business already uses.']],
      deliverables: ['Responsive web or mobile application', 'Documented APIs and integrations', 'Tested release and deployment configuration', 'Source code and handover documentation'],
      process: [['Define the product', 'Map users, journeys, requirements and the first useful release.'], ['Design the experience', 'Validate flows and interface prototypes before implementation.'], ['Build and test', 'Deliver working increments with integration and device testing.'], ['Release and improve', 'Prepare deployment, monitoring and the next product iteration.']],
      faqs: [['Can you work with our existing application?', 'Yes. We can assess the current codebase, identify integration points and plan improvements alongside your team. The approach depends on the architecture and condition of the product.'], ['Do we need separate web and mobile apps?', 'We help choose between a responsive website, a native application and a cross-platform app based on device needs, user behavior, delivery priorities and maintenance.'], ['What happens after launch?', 'We can plan maintenance, monitoring and future iterations with your team. Support scope and responsibilities are agreed as part of the engagement.']],
      related: ['ux-ui-design', 'qa-testing', 'full-cycle-development'], keywords: 'web application development, mobile app development, custom web and mobile software'
    },
    {
      slug: 'full-cycle-development', name: 'Full-cycle Development', group: engineering,
      headline: 'From the first question to a product people use.',
      summary: 'A connected product team for discovery, design, engineering, testing, launch and ongoing improvement.',
      overviewTitle: 'Keep the whole product moving in the same direction.',
      overview: ['Building a product means making decisions across business, design and technology. We bring those disciplines into one delivery process, with visible priorities and a shared understanding of success.', 'You can start with an early idea or an existing product that needs a new direction. We define a practical roadmap, deliver in increments and use feedback to guide what happens next.'],
      capabilities: [['Discovery and planning', 'User research, business requirements, scope, architecture and a delivery roadmap grounded in the product opportunity.'], ['Design and engineering', 'Product design, application development, integrations and quality checks working together throughout delivery.'], ['Launch and evolution', 'Release readiness, operational handover and a considered plan for support and future product development.']],
      deliverables: ['Product roadmap and release scope', 'Validated designs and working software', 'Quality and release documentation', 'Operational handover and improvement backlog'],
      process: [['Discover', 'Understand the opportunity, users and constraints.'], ['Shape', 'Agree the experience, architecture and first release.'], ['Deliver', 'Build, demonstrate and test working product increments.'], ['Evolve', 'Launch, gather feedback and prioritize improvements.']],
      faqs: [['Can we join partway through the product lifecycle?', 'Yes. We can begin with discovery, take over a defined development phase or help an existing product prepare for its next release.'], ['How will we see progress?', 'We agree a delivery cadence with demonstrations, backlog reviews and clear decisions so your team can inspect progress and adjust priorities.'], ['Who owns the source code and deliverables?', 'Ownership, licensing and handover terms are documented in the project agreement before work begins.']],
      related: ['business-analysis', 'web-mobile-development', 'devops-solutions'], keywords: 'full cycle software development, software product engineering, end to end product development'
    },
    {
      slug: 'devops-solutions', name: 'DevOps Solutions', group: engineering,
      headline: 'A clearer path from code to reliable operations.',
      summary: 'Cloud infrastructure, delivery automation and observability that help teams release and operate software with confidence.',
      overviewTitle: 'Make delivery repeatable. Make operations visible.',
      overview: ['Manual releases and unclear infrastructure ownership can make every change harder than it needs to be. We help your team establish repeatable delivery workflows and understand how the application behaves in production.', 'We work with your cloud environment and engineering practices to improve deployments, infrastructure management, access controls and operational documentation.'],
      capabilities: [['Cloud foundations', 'Infrastructure planning and configuration for AWS, Google Cloud or Azure, aligned with the application and operating constraints.'], ['Delivery automation', 'CI/CD pipelines, environment configuration and release checks that reduce repetitive manual work.'], ['Observability and operations', 'Monitoring, logging, alerting and recovery procedures that give teams useful operational context.']],
      deliverables: ['Infrastructure configuration and environment plan', 'Automated build and deployment pipelines', 'Monitoring and alert configuration', 'Deployment, rollback and recovery runbooks'],
      process: [['Assess', 'Review infrastructure, releases and operational pain points.'], ['Design', 'Plan environments, permissions and the delivery workflow.'], ['Automate', 'Implement infrastructure and deployment checks.'], ['Operate', 'Test recovery, document ownership and hand over workflows.']],
      faqs: [['Do you support our existing cloud provider?', 'We work with AWS, Google Cloud and Azure. We first review the services in use and confirm the scope of the required infrastructure and integrations.'], ['Can you improve delivery without replacing our stack?', 'Often, yes. We assess the current tools and workflows and prioritize changes that address the most important delivery and operational problems.'], ['Can you guarantee uptime or lower cloud costs?', 'Availability targets and operating budgets depend on the workload and architecture. We can assess these requirements and recommend measurable improvements without promising a fixed result before analysis.']],
      related: ['architecture-design', 'qa-testing', 'web-mobile-development'], keywords: 'DevOps services, cloud infrastructure, CI CD pipeline development, software observability'
    },
    {
      slug: 'architecture-design', name: 'Architecture Design', group: engineering,
      headline: 'A technical foundation shaped around your product.',
      summary: 'Software architecture, technology evaluation and technical planning that connect business requirements to engineering decisions.',
      overviewTitle: 'Make the important decisions before they become expensive.',
      overview: ['Architecture is a set of choices about how a product will work, change and be operated. We make those choices explicit, using your requirements and constraints to guide the design.', 'Whether you are planning a new platform or reviewing a system that has grown over time, we examine boundaries, data flows, integrations and operational risks to create a practical path forward.'],
      capabilities: [['Solution architecture', 'System boundaries, application components, data flows and integration patterns for the product you need to build.'], ['Technology evaluation', 'Clear comparisons of implementation options, dependencies and operational tradeoffs.'], ['Architecture reviews', 'Assessment of existing systems, technical risks and a prioritized modernization roadmap.']],
      deliverables: ['Architecture and data-flow diagrams', 'Technology decisions with rationale', 'Nonfunctional requirements and risk register', 'Implementation or modernization roadmap'],
      process: [['Understand', 'Gather business goals, constraints and quality requirements.'], ['Explore', 'Compare architecture options and integration needs.'], ['Validate', 'Review risks and test uncertain technical assumptions.'], ['Document', 'Provide diagrams, decisions and an actionable implementation plan.']],
      faqs: [['Do you only design new systems?', 'No. We can review an existing architecture, plan an integration or help a team modernize part of a platform.'], ['Will you recommend a particular technology stack?', 'Recommendations follow the product requirements, team experience, existing systems and operating constraints. We document the reasons and tradeoffs.'], ['Can our own engineers implement the architecture?', 'Yes. Deliverables can include diagrams, decision records and implementation guidance for your internal engineering team.']],
      related: ['business-analysis', 'devops-solutions', 'iot-development'], keywords: 'software architecture design, solution architecture consulting, technical architecture review'
    },
    {
      slug: 'poc-mvp-development', name: 'PoC, Prototype & MVP Development', group: engineering,
      headline: 'Test the idea. Learn what deserves to be built.',
      summary: 'Focused proofs of concept, interactive prototypes and minimum viable products that answer your most important product questions.',
      overviewTitle: 'Build the smallest useful step toward a better decision.',
      overview: ['An early product does not need every feature. It needs to test the assumptions that matter. We help distinguish technical feasibility, usability and market learning so the first investment has a clear purpose.', 'We define the question, choose an appropriate experiment and build enough to gather useful evidence. The result can inform a larger delivery roadmap or help you change direction early.'],
      capabilities: [['Proof of concept', 'Technical experiments that investigate an integration, model, device or architectural assumption.'], ['Interactive prototypes', 'Realistic product flows for exploring ideas with users and stakeholders before full development.'], ['Minimum viable products', 'A focused first release with the core workflow, essential integrations and a plan for learning from use.']],
      deliverables: ['Defined assumptions and validation criteria', 'Working PoC, prototype or MVP', 'Findings and user feedback summary', 'Recommendations for the next product phase'],
      process: [['Frame the question', 'Identify the assumption that creates the most uncertainty.'], ['Choose the experiment', 'Agree what to build and how the result will be evaluated.'], ['Build and learn', 'Develop the focused experience and gather evidence.'], ['Decide the next step', 'Review findings and plan expansion, iteration or a change of direction.']],
      faqs: [['What is the difference between a PoC, prototype and MVP?', 'A PoC explores technical feasibility, a prototype explores an experience, and an MVP is a usable first release for learning from real users. The right choice depends on the question you need to answer.'], ['Can the first version become the production product?', 'An MVP can be designed for continued development. Experimental PoC code or prototype assets may need to be replaced; we discuss that distinction before delivery.'], ['How long will it take?', 'Timing follows the experiment and scope. We first define the learning goal and required integrations, then propose a delivery plan.']],
      related: ['business-analysis', 'ux-ui-design', 'full-cycle-development'], keywords: 'proof of concept development, software prototyping, MVP development services'
    },
    {
      slug: 'qa-testing', name: 'QA & Testing', group: engineering,
      headline: 'Release with a clearer picture of product quality.',
      summary: 'Practical quality assurance, automated testing and release validation for web, mobile and connected software.',
      overviewTitle: 'Find the risks that matter to your users.',
      overview: ['A useful test strategy starts with understanding how the product is used and where failure would cause the most harm. We combine targeted manual testing and automation to give your team actionable release evidence.', 'We can work alongside development or assess a product preparing for launch, covering core journeys, integrations, compatibility and performance within an agreed scope.'],
      capabilities: [['Functional and exploratory testing', 'Scenario-based checks of user journeys, business rules, integrations and edge cases.'], ['Test automation', 'Repeatable regression checks connected to your delivery process, with maintainable coverage of important behavior.'], ['Performance and release checks', 'Workload evaluation, browser and device compatibility checks, and release-readiness reporting.']],
      deliverables: ['Risk-based test plan and scenarios', 'Defect reports with reproducible evidence', 'Agreed automated regression checks', 'Test summary and release recommendations'],
      process: [['Review', 'Understand requirements, product risks and the release scope.'], ['Plan', 'Agree environments, test data, scenarios and coverage.'], ['Exercise', 'Run manual and automated checks and report findings.'], ['Verify', 'Retest fixes and summarize remaining release risks.']],
      faqs: [['Can you test a product built by another team?', 'Yes. We agree access to the application, requirements and test environments, then define the assessment scope with your team.'], ['Will every test be automated?', 'No. Automation is useful for repeatable checks; exploratory and usability-related testing still need human judgment. The mix follows the product risks.'], ['Does a passed test suite mean there are no defects?', 'No test process can prove a product is defect-free. We report what was tested, what was found and the limitations of the assessment.']],
      related: ['web-mobile-development', 'devops-solutions', 'ux-ui-design'], keywords: 'software QA services, web and mobile testing, automated software testing'
    },
    {
      slug: 'ux-ui-design', name: 'UX/UI Design', group: engineering,
      headline: 'Make complex products feel clear and useful.',
      summary: 'User research, experience design and interface systems that connect customer needs to buildable digital products.',
      overviewTitle: 'Design the experience before choosing the screen.',
      overview: ['Good product design begins with a clear understanding of the job a person needs to do. We explore workflows, identify friction and turn those findings into a coherent experience across devices.', 'Design and engineering stay connected throughout the work, so the result includes both a considered interface and the states, behaviors and documentation needed to implement it.'],
      capabilities: [['Research and product journeys', 'Stakeholder interviews, workflow mapping and research activities focused on the decisions your team needs to make.'], ['Interaction and interface design', 'Information architecture, wireframes and interactive prototypes that make the product easier to understand.'], ['Design systems and handover', 'Reusable components, responsive states and implementation guidance for consistent delivery.']],
      deliverables: ['Research findings and journey maps', 'Wireframes and interactive prototypes', 'Responsive interface designs', 'Component specifications and developer handover'],
      process: [['Understand users', 'Explore goals, constraints and existing behavior.'], ['Shape the journey', 'Map information, workflows and key interactions.'], ['Design and validate', 'Create prototypes and review them with users and stakeholders.'], ['Prepare for build', 'Document components, states and implementation details.']],
      faqs: [['Can you redesign an existing product?', 'Yes. We can examine current journeys and feedback, identify the main usability problems and plan a focused or broader redesign.'], ['Do you include accessibility considerations?', 'We consider interaction, structure, contrast and keyboard use within the design scope. Any required accessibility standard and validation work are agreed with you.'], ['Can our development team use the designs?', 'Yes. We can supply component specifications, responsive states and handover sessions to support implementation by your engineers.']],
      related: ['business-analysis', 'poc-mvp-development', 'web-mobile-development'], keywords: 'UX UI design services, digital product design, user experience design'
    },
    {
      slug: 'business-analysis', name: 'Business Analysis', group: engineering,
      headline: 'Turn business questions into a buildable product plan.',
      summary: 'Requirements, process mapping and product roadmaps that give stakeholders and engineers a shared direction.',
      overviewTitle: 'Get clarity on what to build and why.',
      overview: ['Product teams need more than a list of requested features. We work with stakeholders to understand goals, existing processes, user needs and the constraints that shape the solution.', 'We turn those discussions into prioritized requirements and clear acceptance criteria, helping your team make informed scope and delivery decisions.'],
      capabilities: [['Discovery and stakeholder alignment', 'Workshops and interviews that clarify the problem, desired outcomes and decision-making responsibilities.'], ['Requirements and process mapping', 'Functional and nonfunctional requirements, workflow diagrams, user stories and acceptance criteria.'], ['Roadmaps and prioritization', 'A practical sequence of product work that accounts for dependencies, value and implementation uncertainty.']],
      deliverables: ['Business requirements and process maps', 'Prioritized product backlog', 'User stories and acceptance criteria', 'Product roadmap and decision log'],
      process: [['Listen', 'Bring stakeholders together around the business problem.'], ['Map', 'Document users, processes, systems and constraints.'], ['Specify', 'Write requirements and acceptance criteria the team can use.'], ['Prioritize', 'Agree the delivery sequence and unresolved decisions.']],
      faqs: [['Is this useful before we hire developers?', 'Yes. Discovery and requirements work can help you define the product scope and prepare a clearer brief for an engineering team.'], ['Can you work with several stakeholder teams?', 'Yes. We structure discussions to identify shared goals, conflicting needs and the decisions that require explicit ownership.'], ['Will the requirements remain fixed?', 'Requirements can evolve as the team learns. We document assumptions and priorities so changes can be evaluated against the product goals.']],
      related: ['architecture-design', 'ux-ui-design', 'full-cycle-development'], keywords: 'business analysis services, software requirements analysis, product discovery and roadmaps'
    },
    {
      slug: 'iot-development', name: 'IoT Development Services', group: specialist,
      headline: 'Connect devices to decisions that make a difference.',
      summary: 'Device integration, cloud platforms and applications for connected products, operational monitoring and robotics workflows.',
      overviewTitle: 'Build the whole connected ecosystem.',
      overview: ['Connected products span more than a device or a dashboard. We plan how hardware, firmware, connectivity, cloud services and user-facing software will work together under real operating conditions.', 'We help define device communication, telemetry, commands and operational visibility so your team can understand and manage the connected system as it grows.'],
      capabilities: [['Device and firmware integration', 'Communication protocols, device interfaces and integration planning that reflect connectivity and hardware constraints.'], ['IoT cloud platforms', 'Telemetry ingestion, device identity, fleet management and backend services for connected applications.'], ['Monitoring and connected experiences', 'Dashboards, alerts, remote workflows and interfaces that make device data useful to operators and customers.']],
      deliverables: ['Device-to-cloud architecture and interfaces', 'Telemetry and device-management services', 'Monitoring dashboards and alert workflows', 'Integration tests and operational documentation'],
      process: [['Define the system', 'Review devices, operating conditions and the business workflow.'], ['Connect the layers', 'Design identity, communication and cloud interfaces.'], ['Build the platform', 'Implement integrations, data flows and user applications.'], ['Validate in context', 'Test connectivity, failure handling and operational use.']],
      faqs: [['Can you integrate hardware we already use?', 'We can assess the device interfaces, protocols and available documentation to determine the integration approach and any hardware dependencies.'], ['Do you support robotics and connected equipment?', 'We can develop software integrations, monitoring and operator applications for connected equipment. Hardware-specific control and operating requirements are assessed during discovery.'], ['What happens when connectivity is unreliable?', 'We consider buffering, retry behavior, synchronization and operator visibility according to the device capabilities and the use case.']],
      related: ['architecture-design', 'ai-development', 'web-mobile-development'], keywords: 'IoT development services, connected device software, robotics software integration, IoT cloud platform'
    },
    {
      slug: 'ai-development', name: 'AI Development', group: specialist,
      headline: 'Put AI to work on the problems that matter.',
      summary: 'Custom AI features, model integrations and data workflows designed around useful, measurable product outcomes.',
      overviewTitle: 'Start with the use case. Build around the evidence.',
      overview: ['AI works best when the task, available data and success criteria are clear. We help your team assess opportunities and choose an approach that fits the product and its operating constraints.', 'From knowledge search to document workflows and predictive features, we connect model capabilities to your software and evaluate how the system behaves before wider rollout.'],
      capabilities: [['AI discovery and evaluation', 'Use-case definition, data readiness reviews and evaluation criteria for quality, latency and operating cost.'], ['Model and data integration', 'Model APIs, retrieval workflows and application services connected to the information and tools your product needs.'], ['Product integration and monitoring', 'User experiences, human review paths and observability for AI features in day-to-day use.']],
      deliverables: ['Use-case and data-readiness assessment', 'Integrated AI feature or application', 'Evaluation cases and results', 'Monitoring and human-review workflow'],
      process: [['Choose the task', 'Define the user need and what a useful result looks like.'], ['Prepare and compare', 'Review data and test suitable approaches.'], ['Integrate', 'Connect models, application workflows and human controls.'], ['Evaluate and improve', 'Measure behavior and plan a controlled release.']],
      faqs: [['Do we need to train a model from scratch?', 'Not always. Existing model APIs, retrieval approaches or smaller task-specific models may be suitable. We evaluate options against the use case and available data.'], ['Can AI use our internal knowledge?', 'We can design access-aware knowledge retrieval and integrations with your information sources, subject to the data and permission requirements agreed for the project.'], ['How do you assess output quality?', 'We define representative evaluation cases and review quality, limitations and failure behavior before release. Human review is included where the workflow requires it.']],
      related: ['ai-agent-development', 'poc-mvp-development', 'iot-development'], keywords: 'AI development company, custom AI solutions, machine learning integration, AI application development'
    },
    {
      slug: 'ai-agent-development', name: 'AI Agent Development', group: specialist,
      headline: 'AI agents built around real work and clear control.',
      summary: 'Assistants and multi-step workflows that connect business knowledge, approved tools and human oversight.',
      overviewTitle: 'Connect intelligence to action, with boundaries.',
      overview: ['An agent needs more than a prompt. It needs a defined job, access to the right information and tools, and clear rules for when to ask a person to decide.', 'We map the workflow, build integrations and evaluate behavior across realistic scenarios so your team can understand what the system can do and how it should be operated.'],
      capabilities: [['Workflow and agent design', 'Task boundaries, tool permissions, approval points and handoffs grounded in the business process.'], ['Agent engineering', 'Knowledge retrieval, tool integrations, orchestration and state management for multi-step tasks.'], ['Evaluation and operations', 'Scenario testing, traceability and monitoring for quality, latency, cost and failure handling.']],
      deliverables: ['Agent workflow and permission model', 'Integrated assistant or automation', 'Evaluation scenarios and trace visibility', 'Human approval and operational guidance'],
      process: [['Map the work', 'Define the task, tools, inputs and handoff points.'], ['Set the boundaries', 'Agree permissions, approvals and operating limits.'], ['Build the agent', 'Connect knowledge, orchestration and business systems.'], ['Test real scenarios', 'Evaluate completion, mistakes and escalation behavior.']],
      faqs: [['Can the agent take actions in our tools?', 'Yes, where integrations and permissions support it. We define allowed actions and approval requirements with your team before enabling them.'], ['Can people review important decisions?', 'Yes. Human review and approval points can be built into the workflow for actions that require oversight.'], ['How is an agent different from a chatbot?', 'A chatbot primarily handles a conversation. An agent can carry out a defined multi-step task using tools and context; the required level of autonomy depends on the workflow.']],
      related: ['ai-development', 'business-analysis', 'architecture-design'], keywords: 'AI agent development services, custom AI assistants, business workflow automation'
    },
    {
      slug: 'ecommerce-development', name: 'eCommerce Platform Development', group: specialist,
      headline: 'Commerce experiences built for customers and operations.',
      summary: 'Storefronts, shopping applications and commerce integrations that connect the customer journey to your business.',
      overviewTitle: 'Keep the experience connected from discovery to fulfillment.',
      overview: ['A commerce platform needs to work for shoppers and the teams behind the scenes. We connect product discovery, accounts and checkout with inventory, payment and fulfillment workflows.', 'We help you define the right platform approach, design the important journeys and build an experience that can be maintained and improved as the business changes.'],
      capabilities: [['Storefront experiences', 'Responsive catalogs, product pages, account journeys and shopping interfaces for your audience.'], ['Commerce integrations', 'Connections to payment providers, inventory, order management, shipping and business systems.'], ['Platform performance and growth', 'Performance work, analytics integration and a product foundation for testing and improving the buying journey.']],
      deliverables: ['Storefront or commerce application', 'Payment and operational integrations', 'Product and order-management workflows', 'Release checks and analytics configuration'],
      process: [['Understand the business', 'Map products, shoppers and operating workflows.'], ['Shape the platform', 'Choose the platform approach and design key journeys.'], ['Connect and build', 'Implement the storefront and business integrations.'], ['Validate the journey', 'Test discovery, checkout, orders and operational handover.']],
      faqs: [['Can you connect our inventory or order system?', 'We review the available APIs and data flows, then define the integration scope with your operational team.'], ['Do we need a custom commerce platform?', 'The right approach depends on requirements, integrations, budget and existing tools. We can compare a platform-based implementation with custom components.'], ['Will development guarantee more sales?', 'Sales depend on many factors, including demand, pricing and marketing. We can improve the product experience and measurement so your team can evaluate its impact.']],
      related: ['ux-ui-design', 'web-mobile-development', 'qa-testing'], keywords: 'ecommerce platform development, custom online store, commerce software integrations'
    },
    {
      slug: 'fintech-development', name: 'Fintech Software Development', group: specialist,
      headline: 'Financial products engineered for clear, dependable workflows.',
      summary: 'Wallets, payment experiences and financial operations software with considered access, traceability and integration design.',
      overviewTitle: 'Design for trust at every step of the workflow.',
      overview: ['Financial software connects sensitive information, complex transactions and operational responsibilities. We work with your team to make those flows understandable and testable from the start.', 'We build customer experiences and internal tools around clear requirements for identity, authorization, reconciliation and integration with financial providers.'],
      capabilities: [['Wallets and payment experiences', 'Account, wallet and payment interfaces connected to the providers and transaction flows your product requires.'], ['Financial operations', 'Reconciliation, reporting, administrative workflows and visibility into transaction states.'], ['Access and traceability', 'Authorization design, audit trails and security-focused engineering informed by the agreed requirements.']],
      deliverables: ['Financial application or operations platform', 'Provider integrations and transaction workflows', 'Access controls and audit logging', 'Test evidence and operational handover'],
      process: [['Map the flows', 'Define users, transactions, providers and responsibilities.'], ['Design the controls', 'Agree data, authorization and traceability requirements.'], ['Build and integrate', 'Implement product workflows and provider connections.'], ['Validate and hand over', 'Test edge cases, reconciliation and operational procedures.']],
      faqs: [['Do you provide regulatory or licensing advice?', 'We implement software against requirements agreed with your team. Regulatory, licensing and legal decisions should be defined with the appropriate advisers.'], ['Can you integrate an existing payment provider?', 'We assess the provider APIs, supported flows, access requirements and test environment before defining the integration.'], ['How do you handle sensitive financial data?', 'Data handling, access controls, retention and operational responsibilities are specified during discovery and reflected in the implementation scope.']],
      related: ['architecture-design', 'qa-testing', 'web-mobile-development'], keywords: 'fintech software development, digital wallet development, payment software integration'
    },
    {
      slug: 'blockchain-development', name: 'Blockchain Development', group: specialist,
      headline: 'Build blockchain products around a clear purpose.',
      summary: 'Architecture, smart contracts and Web3 applications guided by the product use case and its trust requirements.',
      overviewTitle: 'Choose the technology because the problem needs it.',
      overview: ['A blockchain system changes how data, transactions and responsibility are shared. We help clarify whether that approach fits the problem and what belongs on-chain or in conventional application services.', 'We connect network selection, contract development and user-facing software into a coherent product, with testing and operational planning included in the delivery scope.'],
      capabilities: [['Solution and network design', 'Trust boundaries, data models, network evaluation and the responsibilities of on-chain and off-chain components.'], ['Smart-contract development', 'Contract logic, automated checks and application integrations for the agreed product workflows.'], ['Web3 applications', 'Wallet-connected interfaces, backend services and administrative tools designed around understandable user journeys.']],
      deliverables: ['Blockchain solution architecture', 'Smart contracts and automated checks', 'Application and wallet integrations', 'Deployment and operational documentation'],
      process: [['Validate the use case', 'Clarify participants, trust assumptions and product value.'], ['Design the system', 'Define network, contract boundaries and application services.'], ['Build and test', 'Implement contracts and integrations with scenario-based checks.'], ['Prepare release', 'Review deployment, ownership and operational responsibilities.']],
      faqs: [['Does our product need a blockchain?', 'Not necessarily. We evaluate the requirements and trust model before recommending a blockchain architecture or a conventional application approach.'], ['Is an independent contract audit included?', 'An independent specialist audit is a separate scope unless explicitly agreed. We can help prepare the contracts and evidence for that review.'], ['Can you integrate with an existing Web3 product?', 'We can review its contracts, network and application interfaces to define a suitable integration or development scope.']],
      related: ['architecture-design', 'qa-testing', 'fintech-development'], keywords: 'blockchain development services, smart contract development, Web3 application development'
    }
  ];
  services.push({
    slug: 'smart-home-solutions', name: 'IoT Smart Home Solutions', group: specialist,
    headline: 'Connected spaces with controls people can understand.',
    summary: 'Software for smart-home monitoring, device integrations and automation workflows across connected living and building systems.',
    overviewTitle: 'Bring devices, data and everyday routines together.',
    overview: ['Smart-home experiences need a clear view of device state and controls that behave predictably. We connect supported equipment and cloud services to applications designed around the needs of occupants and operators.', 'We plan device identity, permissions, automation rules and the behavior of the system when a device or network is unavailable. Hardware compatibility and installation responsibilities are established during discovery.'],
    capabilities: [['Device and platform integration', 'Connections to supported sensors, controllers and device platforms, with a clear view of state and connectivity.'], ['Automation and monitoring', 'Rules, schedules, alerts and dashboards for agreed comfort, equipment and energy-monitoring workflows.'], ['Resident and operator applications', 'Interfaces for device controls, permissions, notifications and day-to-day management.']],
    deliverables: ['Device compatibility and integration plan', 'Monitoring and automation services', 'User controls and management interfaces', 'Testing and operational guidance'],
    process: [['Map the space', 'Understand devices, users and the intended routines.'], ['Define the controls', 'Agree permissions, rules and connectivity behavior.'], ['Connect the experience', 'Build integrations, monitoring and user applications.'], ['Validate the routines', 'Test controls, alerts and offline behavior with supported devices.']],
    faqs: [['Will this work with every smart-home device?', 'Compatibility depends on each device and its supported interfaces. We review the equipment and available APIs before agreeing the integration scope.'], ['Do you install physical hardware?', 'Our service focuses on software and integrations. Hardware supply, electrical work and installation responsibilities are agreed separately with the appropriate providers.'], ['Can we add devices later?', 'We can design extension points for future devices, while checking compatibility and testing each new integration before it is enabled.']],
    related: ['iot-development', 'web-mobile-development', 'architecture-design'], keywords: 'IoT smart home solutions, home automation software, connected building applications'
  });
  const image = (file, width, height, description, position = '76% center', mobilePosition = '78% center') => ({ image: `assets/${file}`, width, height, description, position, mobilePosition });
  const software = image('service-software-development.webp', 1907, 825, 'Software development workspace with design, testing and deployment workflows');
  const ai = image('service-ai.webp', 1896, 830, 'AI workspace with a thinking android and connected AI tools', '80% center', '76% center');
  const covers = {
    'web-mobile-development': software,
    'full-cycle-development': software,
    'devops-solutions': image('service-devops.webp', 2172, 724, 'Cloud infrastructure and deployment dashboards in a DevOps workspace'),
    'architecture-design': image('service-architecture.webp', 2172, 724, 'Connected application, database and cloud architecture on a monitor'),
    'poc-mvp-development': software,
    'qa-testing': image('service-quality-assurance.webp', 2172, 724, 'Automated quality checks across desktop, tablet and mobile devices'),
    'ux-ui-design': software,
    'business-analysis': image('service-business-analysis.webp', 2171, 724, 'Business analytics dashboards in a green workspace'),
    'iot-development': image('service-iot.webp', 1886, 834, 'IoT network connecting sensors and smart devices through a cloud platform', '78% center', '72% center'),
    'ai-development': ai,
    'ai-agent-development': ai,
    'ecommerce-development': image('service-ecommerce.webp', 1883, 835, 'Connected eCommerce storefront, shopping cart and payment network'),
    'fintech-development': image('service-fintech.webp', 1883, 835, 'Digital banking application with payment and security connections'),
    'blockchain-development': image('what-we-do-blockchain.webp', 2157, 729, 'Blockchain network and financial dashboard on a mobile device'),
    'smart-home-solutions': image('what-we-do-iot.webp', 2170, 725, 'Connected smart-home controls, sensors and devices', '78% center', '74% center')
  };
  for (const service of services) {
    service.href = `${service.slug}.html`;
    service.seoTitle = `${service.name}${service.name.endsWith('Services') ? '' : ' Services'} | Sakin.zo`;
    service.cover = covers[service.slug];
  }
  if (typeof module === 'object' && module.exports) module.exports = services;
  else root.SakinzoServices = services;
})(typeof window === 'undefined' ? globalThis : window);
