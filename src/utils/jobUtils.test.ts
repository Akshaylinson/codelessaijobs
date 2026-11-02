import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTags,
  isValidPublishedJob,
  filterJobs,
  paginateJobs,
  extractUniqueTags,
  getRelatedJobs,
  generateExcerpt,
  isValidUrl,
  sanitizeUrl,
} from './jobUtils';
import { Job } from '../types/job';

const mockJobs: Job[] = [
  {
    job_id: 'job-001',
    slug: 'senior-ai-engineer-anthropic',
    job_title: 'Senior AI Research Engineer',
    company_name: 'Anthropic',
    company_logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    company_website: 'https://anthropic.com',
    company_description: 'Anthropic is an AI safety and research company.',
    job_description: 'We are seeking a senior AI research engineer to work on frontier alignment models and LLM evals.\n\n### Responsibilities\n- Build evaluation suites\n- Train deep learning models.',
    about_role: 'Work on cutting edge AI safety.',
    application_url: 'https://anthropic.com/careers/senior-ai-engineer',
    tags: ['Artificial Intelligence', 'Machine Learning', 'Python', 'Remote', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-25',
    last_updated: '2026-10-28',
  },
  {
    job_id: 'job-002',
    slug: 'fullstack-developer-stripe',
    job_title: 'Fullstack Platform Engineer',
    company_name: 'Stripe',
    company_logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop',
    company_website: 'https://stripe.com',
    job_description: 'Build developer-first payment APIs and dashboards using React, TypeScript, and Go.',
    application_url: 'https://stripe.com/jobs/fullstack-platform',
    tags: ['Fullstack', 'TypeScript', 'React', 'Remote', 'Full-Time'],
    status: 'Published',
    date_added: '2026-10-20',
  },
  {
    job_id: 'job-003',
    slug: 'python-backend-cohere',
    job_title: 'Python Backend Engineer',
    company_name: 'Cohere',
    job_description: 'High-throughput embeddings infrastructure with Python and gRPC.',
    application_url: 'https://cohere.com/careers/python-backend',
    tags: ['Python', 'Backend', 'Artificial Intelligence', 'Hybrid'],
    status: 'Published',
    date_added: '2026-10-15',
  },
  {
    job_id: 'job-004-draft',
    slug: 'draft-engineer',
    job_title: 'Draft Position',
    company_name: 'Stealth Startup',
    job_description: 'Draft listing should not appear publicly.',
    application_url: 'https://example.com/apply',
    tags: ['Python'],
    status: 'Draft',
    date_added: '2026-10-30',
  },
  {
    job_id: 'job-005-closed',
    slug: 'closed-role',
    job_title: 'Closed Position',
    company_name: 'Acme Corp',
    job_description: 'Closed role should be hidden from public listings.',
    application_url: 'https://example.com/apply',
    tags: ['Remote'],
    status: 'Closed',
    date_added: '2026-10-01',
  },
  {
    job_id: 'job-006-invalid',
    slug: '',
    job_title: 'Missing Slug',
    company_name: 'Invalid Corp',
    job_description: 'Missing required publication fields',
    application_url: '',
    tags: [],
    status: 'Published',
    date_added: '2026-10-01',
  },
];

test('parseTags handles pipe separation, trims whitespace, deduplicates case-insensitively', () => {
  const input = ' Python Developer | Software Development | Remote | python developer | Full-Time ';
  const parsed = parseTags(input);
  assert.deepEqual(parsed, ['Python Developer', 'Software Development', 'Remote', 'Full-Time']);
});

test('parseTags handles empty or invalid inputs gracefully', () => {
  assert.deepEqual(parseTags(''), []);
  assert.deepEqual(parseTags(null), []);
  assert.deepEqual(parseTags(undefined), []);
  assert.deepEqual(parseTags('   |  |   '), []);
});

test('isValidPublishedJob validates publication requirements strictly', () => {
  assert.equal(isValidPublishedJob(mockJobs[0]), true);
  assert.equal(isValidPublishedJob(mockJobs[1]), true);
  // Draft should be false
  assert.equal(isValidPublishedJob(mockJobs[3]), false);
  // Closed should be false
  assert.equal(isValidPublishedJob(mockJobs[4]), false);
  // Missing slug & application_url should be false
  assert.equal(isValidPublishedJob(mockJobs[5]), false);
  // Null or missing fields
  assert.equal(isValidPublishedJob(null), false);
  assert.equal(isValidPublishedJob({ ...mockJobs[0], application_url: 'javascript:alert(1)' }), false);
});

test('isValidUrl verifies safe web protocols', () => {
  assert.equal(isValidUrl('https://jobs.codelessai.in'), true);
  assert.equal(isValidUrl('http://example.com'), true);
  assert.equal(isValidUrl('ftp://invalid.com'), false);
  assert.equal(isValidUrl('javascript:alert(1)'), false);
  assert.equal(isValidUrl(''), false);
  assert.equal(isValidUrl(undefined), false);
});

test('filterJobs performs keyword search across title, company, tags, description', () => {
  // Search by company
  const searchCompany = filterJobs(mockJobs, 'Anthropic');
  assert.equal(searchCompany.length, 1);
  assert.equal(searchCompany[0].job_id, 'job-001');

  // Search by title
  const searchTitle = filterJobs(mockJobs, 'Platform Engineer');
  assert.equal(searchTitle.length, 1);
  assert.equal(searchTitle[0].job_id, 'job-002');

  // Search by tag
  const searchTag = filterJobs(mockJobs, 'Python');
  assert.equal(searchTag.length, 2); // Anthropic and Cohere

  // Search keyword inside description
  const searchDesc = filterJobs(mockJobs, 'embeddings');
  assert.equal(searchDesc.length, 1);
  assert.equal(searchDesc[0].job_id, 'job-003');

  // Excludes draft/closed automatically
  const allPublished = filterJobs(mockJobs, '');
  assert.equal(allPublished.length, 3);
});

test('filterJobs enforces AND matching for multiple selected tags', () => {
  // Python AND Remote -> only Anthropic
  const filtered = filterJobs(mockJobs, '', ['Python', 'Remote']);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].job_id, 'job-001');

  // Python AND Artificial Intelligence -> Anthropic and Cohere
  const aiPython = filterJobs(mockJobs, '', ['Python', 'Artificial Intelligence']);
  assert.equal(aiPython.length, 2);

  // Tag combination with no match
  const noMatch = filterJobs(mockJobs, '', ['TypeScript', 'Hybrid']);
  assert.equal(noMatch.length, 0);
});

test('filterJobs sorts correctly by newest and oldest', () => {
  const newest = filterJobs(mockJobs, '', [], 'newest');
  assert.equal(newest[0].job_id, 'job-001'); // Oct 25
  assert.equal(newest[1].job_id, 'job-002'); // Oct 20
  assert.equal(newest[2].job_id, 'job-003'); // Oct 15

  const oldest = filterJobs(mockJobs, '', [], 'oldest');
  assert.equal(oldest[0].job_id, 'job-003'); // Oct 15
  assert.equal(oldest[2].job_id, 'job-001'); // Oct 25
});

test('paginateJobs correctly splits slices and calculates total pages', () => {
  const res = paginateJobs(mockJobs.slice(0, 3), 1, 2);
  assert.equal(res.items.length, 2);
  assert.equal(res.totalCount, 3);
  assert.equal(res.totalPages, 2);
  assert.equal(res.currentPage, 1);

  const page2 = paginateJobs(mockJobs.slice(0, 3), 2, 2);
  assert.equal(page2.items.length, 1);
  assert.equal(page2.currentPage, 2);
});

test('extractUniqueTags aggregates and sorts tags by popularity', () => {
  const tags = extractUniqueTags(mockJobs);
  const pythonTag = tags.find((t) => t.tag.toLowerCase() === 'python');
  assert.ok(pythonTag);
  assert.equal(pythonTag.count, 2);
});

test('getRelatedJobs finds jobs with overlapping tags and excludes current job', () => {
  const related = getRelatedJobs(mockJobs[0], mockJobs);
  // Anthropic has tags: ['Artificial Intelligence', 'Machine Learning', 'Python', 'Remote', 'Full-Time']
  // Stripe has: ['Fullstack', 'TypeScript', 'React', 'Remote', 'Full-Time'] -> 2 overlapping (Remote, Full-Time)
  // Cohere has: ['Python', 'Backend', 'Artificial Intelligence', 'Hybrid'] -> 2 overlapping (Python, Artificial Intelligence)
  assert.equal(related.length, 2);
  // Does not include Anthropic itself
  assert.ok(!related.some((j) => j.job_id === 'job-001'));
});

test('generateExcerpt strips markdown and returns clean string', () => {
  const md = '### Welcome\n- Point 1\n- Point 2\nCheck [link](https://test.com) for details.';
  const excerpt = generateExcerpt(md, 50);
  assert.ok(!excerpt.includes('###'));
  assert.ok(!excerpt.includes('-'));
  assert.ok(excerpt.includes('Welcome'));
  assert.ok(excerpt.includes('link for details'));
});
