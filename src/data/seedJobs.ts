import { Job } from '../types/job';

export const seedJobs: Job[] = [
  {
    job_id: 'JOB-2026-001',
    slug: 'senior-ai-research-engineer-anthropic',
    job_title: 'Senior AI Research Engineer',
    company_name: 'Anthropic',
    company_logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&h=160&fit=crop&q=80',
    company_website: 'https://www.anthropic.com',
    company_description: 'Anthropic is an AI safety and research company dedicated to building reliable, interpretable, and steerable AI systems.',
    job_description: `### Role Overview
We are looking for a Senior AI Research Engineer to help train and evaluate our next generation of frontier AI models. You will be responsible for scaling pre-training and post-training pipelines, designing automated evaluation harnesses, and researching novel safety guardrails.

### Responsibilities
- Architect high-throughput distributed training algorithms across thousands of accelerators.
- Develop programmatic evals for reasoning, code synthesis, and tool-use fidelity.
- Collaborate closely with alignment researchers to quantify and mitigate model vulnerabilities.
- Profile and optimize PyTorch CUDA kernels to reduce training latency and memory overhead.

### Qualifications & Requirements
- 4+ years of production experience in machine learning or deep learning infrastructure.
- Strong proficiency with Python, PyTorch, Ray, and distributed training frameworks (DeepSpeed, Megatron-LM).
- Experience evaluating frontier LLMs or building automated benchmark suites.
- Degree in Computer Science, Mathematics, Physics, or equivalent self-taught engineering mastery.

### Compensation & Benefits
- Annual base salary: $210,000 – $280,000 USD + meaningful equity.
- Comprehensive health, vision, and dental insurance (100% employer paid for you and dependents).
- $5,000 annual learning and home office stipend.
- Flexible remote work policy with periodic team retreats.`,
    about_role: 'Join the alignment research team building frontier AI models with steerability and interpretability at the core.',
    application_url: 'https://www.anthropic.com/careers',
    tags: ['Artificial Intelligence', 'Machine Learning', 'Python', 'Remote', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-28',
    last_updated: '2026-10-30',
  },
  {
    job_id: 'JOB-2026-002',
    slug: 'fullstack-platform-engineer-stripe',
    job_title: 'Fullstack Platform Engineer',
    company_name: 'Stripe',
    company_logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=160&h=160&fit=crop&q=80',
    company_website: 'https://stripe.com',
    company_description: 'Stripe builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage operations online.',
    job_description: `### About the Opportunity
Stripe's Dashboard Platform team designs and maintains the foundational frontend and API tier powering millions of businesses daily. As a Fullstack Platform Engineer, you will craft the developer interfaces, merchant analytics dashboards, and real-time transaction monitors.

### What You'll Do
- Engineer responsive, accessible, and ultra-reliable web interfaces using React, TypeScript, and Tailwind.
- Design resilient backend services in Ruby and Go that scale seamlessly during peak shopping periods.
- Spearhead frontend performance improvements, optimizing core web vitals and reducing bundle sizes.
- Author robust component abstractions adopted across over 20 product engineering teams.

### Candidate Profile
- 3+ years of experience building modern web applications with React and TypeScript.
- Working knowledge of RESTful or gRPC API design and database query optimization (PostgreSQL).
- Passion for polished micro-interactions, accessibility (WCAG AA), and typed codebases.
- Exceptional communication skills and customer empathy.

### Perks & Culture
- Competitive compensation: $175,000 – $240,000 USD + equity package.
- Choice between remote work or modern hubs in SF, Seattle, Dublin, or Singapore.
- Generous parental leave and continuous wellness allowances.`,
    about_role: 'Help scale Stripe’s core merchant dashboard and global payments infrastructure.',
    application_url: 'https://stripe.com/jobs',
    tags: ['Fullstack', 'TypeScript', 'React', 'Remote', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-25',
    last_updated: '2026-10-26',
  },
  {
    job_id: 'JOB-2026-003',
    slug: 'mlops-infrastructure-engineer-cohere',
    job_title: 'MLOps Infrastructure Engineer',
    company_name: 'Cohere',
    company_logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&h=160&fit=crop&q=80',
    company_website: 'https://cohere.com',
    company_description: 'Cohere provides enterprise-grade AI models for search, classification, and generative conversation.',
    job_description: `### The Role
Cohere is expanding its model serving infrastructure to serve billions of embedding queries and LLM tokens every day. We are looking for an experienced MLOps & Infrastructure Engineer to scale our low-latency inference fleet.

### Key Responsibilities
- Deploy, monitor, and scale Kubernetes clusters hosting tensor-parallel LLM inference engines (vLLM, TensorRT-LLM).
- Build CI/CD pipelines for automated model weight verification, latency regression testing, and canary rollouts.
- Reduce p99 inference latency for enterprise retrieval-augmented generation (RAG) workloads.
- Implement cost-efficiency optimizations across cloud GPU instances (AWS, GCP, OCI).

### Who You Are
- Hands-on experience with Kubernetes, Terraform, and cloud networking at scale.
- Solid understanding of Linux systems internals, CUDA drivers, and GPU orchestration.
- Fluent in Python, Go, or Rust for systems automation.
- Familiarity with enterprise compliance and security standards.

### What We Offer
- Salary range: $180,000 – $230,000 USD + stock options.
- Hybrid flexibility with office options in Toronto, London, and San Francisco.
- Comprehensive health benefits and annual conference travel budget.`,
    about_role: 'Scale enterprise LLM inference clusters delivering sub-second response times worldwide.',
    application_url: 'https://cohere.com/careers',
    tags: ['Artificial Intelligence', 'Machine Learning', 'Python', 'DevOps', 'Hybrid'],
    status: 'Published',
    date_added: '2026-10-22',
    last_updated: '2026-10-22',
  },
  {
    job_id: 'JOB-2026-004',
    slug: 'lead-frontend-engineer-figma',
    job_title: 'Lead Frontend Engineer, Collaboration',
    company_name: 'Figma',
    company_logo_url: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=160&h=160&fit=crop&q=80',
    company_website: 'https://figma.com',
    company_description: 'Figma connects everyone in the design process so teams can deliver better products, faster.',
    job_description: `### About This Role
Figma's real-time multiplayer engine powers creative collaboration for millions of designers and product managers. As a Lead Frontend Engineer on Collaboration, you will build novel canvas tools, multiplayer presence systems, and audio/video spatial interactions.

### What You'll Tackle
- Push the boundaries of WebAssembly, WebGL, and canvas rendering performance in the browser.
- Design operational transformation and CRDT algorithms for sub-50ms collaborative sync.
- Mentor junior and mid-level engineers through rigorous code reviews and architecture docs.
- Partner with product designers to prototype cutting-edge workflow interactions.

### Desired Background
- 6+ years building complex, state-heavy client applications in TypeScript or C++/Wasm.
- Deep expertise in browser rendering pipelines, memory profiling, and animation math.
- Track record of shipping customer-facing features that delight users.

### Compensation
- $215,000 – $265,000 USD base + Figma equity + full health coverage.`,
    about_role: 'Build real-time multiplayer canvas systems used by millions of product creators.',
    application_url: 'https://www.figma.com/careers',
    tags: ['Frontend Development', 'TypeScript', 'Remote', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-18',
  },
  {
    job_id: 'JOB-2026-005',
    slug: 'backend-systems-architect-supabase',
    job_title: 'Backend Systems Architect',
    company_name: 'Supabase',
    company_logo_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=160&h=160&fit=crop&q=80',
    company_website: 'https://supabase.com',
    company_description: 'Supabase is the open source Firebase alternative, providing Postgres database, Authentication, Instant APIs, Realtime, and Vector Storage.',
    job_description: `### Why Supabase?
Supabase is building the backend stack for the next generation of internet applications. We run hundreds of thousands of PostgreSQL databases in production, orchestrating real-time streaming, automated backups, and AI vector search.

### Scope of Work
- Architect high-availability PostgreSQL control planes and distributed connection pooling engines.
- Write high-performance Go, Rust, and Elixir services to handle millions of concurrent WebSocket connections.
- Contribute upstream to open-source database tooling and Postgres extensions (pgvector).
- Troubleshoot low-level Linux kernel networking and storage throughput bottlenecks.

### What We Are Seeking
- Extensive experience managing PostgreSQL in mission-critical high-write production setups.
- Strong proficiency in Go, Rust, or Elixir.
- True passion for open-source software, transparent public development, and clear documentation.

### Perks
- 100% remote company with teammates in over 30 countries.
- Competitive salary ($190,000 – $240,000 USD) + token/equity grants.
- Minimum 30 days mandatory annual vacation.`,
    about_role: 'Build open-source PostgreSQL control planes and distributed realtime backends.',
    application_url: 'https://supabase.com/careers',
    tags: ['Backend Development', 'Software Development', 'Remote', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-14',
  },
  {
    job_id: 'JOB-2026-006',
    slug: 'ai-product-designer-mistral',
    job_title: 'AI Product & Interface Designer',
    company_name: 'Mistral AI',
    company_logo_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=160&h=160&fit=crop&q=80',
    company_website: 'https://mistral.ai',
    company_description: 'Mistral AI creates open-weight and commercial frontier language models built for European and global enterprise deployment.',
    job_description: `### The Challenge
Generative AI requires reimagined human-computer interaction paradigms. We are hiring a founding Product & Interface Designer to shape how millions of developers and enterprise users interact with Mistral models, APIs, and Le Chat.

### Responsibilities
- Lead end-to-end design from user research and wireframing to high-fidelity interaction prototypes.
- Design developer platform consoles, token playground interfaces, and prompt engineering utilities.
- Maintain and expand our design system with high accessibility standards.
- Partner with frontend engineers to ensure pixel-perfect implementation of layouts and micro-interactions.

### Requirements
- 4+ years of product design experience for SaaS, developer tools, or AI products.
- Master level proficiency in Figma, design systems, and rapid prototyping.
- Deep curiosity about generative AI workflows, agentic interfaces, and coding assistants.

### Benefits
- Competitive compensation package with attractive equity.
- Paris HQ or remote within CET +/- 2 hours.
- Latest high-end Apple hardware setup.`,
    about_role: 'Shape next-generation developer consoles and interfaces for frontier open-weight AI models.',
    application_url: 'https://mistral.ai/careers',
    tags: ['UI/UX Design', 'Artificial Intelligence', 'Remote', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-10',
  },
  {
    job_id: 'JOB-2026-007',
    slug: 'cloud-security-engineer-datadog',
    job_title: 'Cloud Security & DevSecOps Engineer',
    company_name: 'Datadog',
    company_logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=160&h=160&fit=crop&q=80',
    company_website: 'https://datadoghq.com',
    company_description: 'Datadog is the monitoring and security platform for cloud applications.',
    job_description: `### Position Overview
Datadog processes tens of trillions of events daily. Our Cloud Security Engineering team protects multi-cloud infrastructure spanning AWS, Azure, and Google Cloud Platform.

### Key Duties
- Build automated security detection pipelines and threat scanning harnesses for container workloads.
- Implement least-privilege IAM policies, secrets management, and cryptographic key rotation.
- Conduct threat modeling reviews for newly architected microservices.
- Coordinate red-team exercises and incident response runbooks.

### Qualifications
- 3+ years in cloud security engineering or security-focused SRE roles.
- Familiarity with Kubernetes security (eBPF, Falco, OPA/Gatekeeper).
- Scripting fluency in Python or Go.

### Compensation & Perks
- $165,000 – $210,000 USD base + equity + bonus.
- Generous 401(k) matching and healthcare options.`,
    about_role: 'Defend massive multi-cloud telemetry infrastructure against advanced security threats.',
    application_url: 'https://careers.datadoghq.com',
    tags: ['DevOps', 'Software Development', 'Hybrid', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-05',
  },
  {
    job_id: 'JOB-2026-008',
    slug: 'junior-python-ai-intern-cohere',
    job_title: 'AI Engineering Intern (Summer 2027)',
    company_name: 'Cohere',
    company_logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&h=160&fit=crop&q=80',
    company_website: 'https://cohere.com',
    company_description: 'Cohere provides enterprise-grade AI models for search, classification, and generative conversation.',
    job_description: `### Internship Details
Are you an aspiring AI developer looking to gain real-world experience training and evaluating commercial language models? Cohere is accepting applications for our upcoming Engineering Internship cohort.

### What You Will Learn
- Work alongside world-class NLP researchers and engineering mentors.
- Implement data processing pipelines for pre-training corpora.
- Build benchmark test scripts evaluating model reasoning across multilingual datasets.
- Gain hands-on exposure to distributed PyTorch clusters and vector databases.

### Qualifications
- Currently enrolled in a Bachelor's, Master's, or PhD program in CS, Data Science, or related STEM field.
- Solid understanding of Python, data structures, and foundational machine learning concepts.
- Eager learner with self-starter motivation and curiosity.

### Compensation
- $55 – $65 / hour paid internship + housing relocation stipend.`,
    about_role: 'Hands-on paid engineering internship working on real-world NLP and embeddings models.',
    application_url: 'https://cohere.com/careers',
    tags: ['Artificial Intelligence', 'Python', 'Internship', 'Entry Level', 'Hybrid'],
    status: 'Published',
    date_added: '2026-10-02',
  },
];
