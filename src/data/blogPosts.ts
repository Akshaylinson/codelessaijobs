export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'how-to-tailor-your-resume-for-modern-ai-engineering-roles',
    title: 'How to Tailor Your Engineering Resume for Modern AI Roles',
    summary: 'A practical guide on highlighting LLM evaluations, distributed training, and production ML systems without buzzword stuffing.',
    date: '2026-10-24',
    readTime: '5 min read',
    author: 'Codeless AI Editorial',
    category: 'Career Advice',
    content: `Hiring managers reviewing applications for AI and ML engineering positions are inundated with resumes listing generic model names without tangible engineering context.

### 1. Differentiate Between Model Calling and Systems Engineering
If you built applications using LLMs, be specific about architecture:
- Did you implement semantic caching or prompt optimization?
- How did you benchmark latency, token cost, and accuracy against baseline models?
- What evaluation frameworks (e.g., RAGAS, custom programmatic evals) did you establish to prevent hallucinations?

### 2. Showcase Quantifiable Engineering Impact
Instead of writing *"Trained PyTorch models on large datasets"*, quantify the achievement:
- *"Optimized inference throughput by 3.2x using TensorRT-LLM and dynamic batching, reducing AWS GPU spend by $4,000/month."*
- *"Implemented distributed embedding indexing pipeline processing 25M documents in 45 minutes using Ray and pgvector."*

### 3. Emphasize Clean Code and Infrastructure Skills
Machine learning in production is 80% systems engineering. Highlight your familiarity with Kubernetes, Docker, CI/CD pipelines, telemetry (OpenTelemetry, Prometheus), and automated unit testing.`,
  },
  {
    id: 'post-2',
    slug: 'decoding-remote-vs-hybrid-compensation-packages',
    title: 'Understanding Global Remote vs. Hybrid Compensation Structures',
    summary: 'Analyze how technology employers structure base pay, location adjustments, and equity incentives across distributed engineering teams.',
    date: '2026-10-18',
    readTime: '4 min read',
    author: 'Codeless AI Editorial',
    category: 'Industry Insights',
    content: `When exploring job opportunities on aggregation portals, one of the most critical factors candidates weigh is compensation tiering across different work arrangements.

### Tiered vs. Flat Geographic Pay
Employers typically adopt one of two compensation philosophies:
- **Location-Independent (Flat Pay):** Companies like Basecamp, GitHub, and select high-growth startups pay the same benchmarked rate (often benchmarked to SF or US national median) regardless of where the engineer resides.
- **Geographic Tiering:** Companies adjust base pay according to regional cost-of-living tiers (Tier 1: SF/NYC, Tier 2: Austin/Seattle/London, Tier 3: Rest of World).

### What to Ask During Initial Recruiter Screens
1. *"Is this role location-agnostic or tied to a regional salary band?"*
2. *"If I relocate to another city or country within 12 months, does my compensation adjust automatically?"*
3. *"Does the equity grant vesting schedule have performance conditions or standard 1-year cliff?"*`,
  },
  {
    id: 'post-3',
    slug: 'technical-interview-prep-for-distributed-systems',
    title: 'Key Patterns to Master for Systems & Backend Job Interviews',
    summary: 'A checklist of foundational architectural patterns every backend and fullstack developer should review before interview rounds.',
    date: '2026-10-12',
    readTime: '6 min read',
    author: 'Codeless AI Editorial',
    category: 'Interview Preparation',
    content: `System design and backend interviews have evolved beyond generic URL shortener questions. High-scale employers focus on resiliency, data consistency, and distributed state management.

### Essential Topics to Review
- **Idempotency Keys:** How to prevent duplicate charges or operations in distributed financial systems using Redis leases and unique tokens.
- **Eventual Consistency vs. Strong Consistency:** Understanding Raft consensus, database read replicas, replication lag, and outbox patterns.
- **Rate Limiting Algorithms:** Token bucket, leaky bucket, and sliding window log implementations using Redis and API gateways.
- **Database Indexing Strategies:** B-Trees vs. LSM Trees, composite index column ordering, and query explain plans.

### Structured Response Technique
When presented with an ambiguous architecture prompt:
1. Clarify functional and non-functional requirements (read/write ratio, peak QPS, latency SLAs).
2. Establish data schema and high-level block diagram.
3. Dive into the primary bottleneck (network, disk I/O, lock contention).
4. Address failure scenarios: server crashes, network partitions, and data loss prevention.`,
  },
];
