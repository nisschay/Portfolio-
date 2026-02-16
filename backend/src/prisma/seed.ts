/**
 * Database Seed Script
 * Run: npm run seed
 * 
 * Creates sample projects, blog posts, and admin user
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // CREATE ADMIN USER
  // ============================================
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@nisschay.dev' },
    update: {},
    create: {
      email: 'admin@nisschay.dev',
      password: hashedPassword,
      name: 'Nisschay Khandelwal',
    },
  });
  console.log(`✓ Admin created: ${admin.email}\n`);

  // ============================================
  // CREATE PROJECTS
  // ============================================
  console.log('Creating projects...');
  
  const projects = [
    {
      title: 'Neural Stock Predictor',
      slug: 'neural-stock-predictor',
      description: 'Advanced LSTM neural network achieving 94.2% directional accuracy in market predictions with real-time sentiment analysis.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>A sophisticated stock market prediction system leveraging deep learning and natural language processing to forecast market movements with unprecedented accuracy.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>LSTM Architecture:</strong> Multi-layer LSTM network with attention mechanisms for temporal pattern recognition</li>
          <li><strong>Sentiment Analysis:</strong> Real-time processing of financial news and social media using transformer models</li>
          <li><strong>Technical Indicators:</strong> Integration of 50+ technical indicators including RSI, MACD, and Bollinger Bands</li>
          <li><strong>Risk Management:</strong> Built-in position sizing and stop-loss recommendations</li>
        </ul>
        
        <h3>Technical Stack</h3>
        <p>Python, TensorFlow 2.x, Transformers (BERT), FastAPI, PostgreSQL, Redis for caching, Docker for deployment.</p>
        
        <h3>Results</h3>
        <p>Achieved 94.2% directional accuracy on S&P 500 predictions over a 2-year backtesting period. Currently processing 100k+ data points daily.</p>
      `,
      tags: ['Machine Learning', 'Python', 'TensorFlow', 'LSTM', 'NLP'],
      category: 'ml',
      year: 2025,
      featured: true,
      metrics: { accuracy: '94.2%', dataPoints: '100k+/day', backtestPeriod: '2 years' },
      order: 1,
    },
    {
      title: 'CollabCanvas',
      slug: 'collabcanvas',
      description: 'Real-time collaborative whiteboard supporting 50+ concurrent users with sub-100ms latency and AI-powered shape recognition.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>A high-performance collaborative whiteboard application designed for remote teams, featuring real-time synchronization and intelligent tools.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Real-time Collaboration:</strong> WebSocket-based sync supporting 50+ users per board</li>
          <li><strong>AI Shape Recognition:</strong> Automatic conversion of hand-drawn shapes to perfect geometries</li>
          <li><strong>Version History:</strong> Complete undo/redo with time-travel debugging</li>
          <li><strong>Export Options:</strong> PNG, SVG, PDF export with custom sizing</li>
        </ul>
        
        <h3>Architecture</h3>
        <p>React frontend with Canvas API, Node.js backend with Socket.io, Redis for pub/sub, PostgreSQL for persistence.</p>
      `,
      tags: ['React', 'Node.js', 'WebSocket', 'Canvas API', 'Redis'],
      category: 'fullstack',
      year: 2025,
      featured: true,
      metrics: { latency: '<100ms', concurrentUsers: '50+', uptime: '99.9%' },
      order: 2,
    },
    {
      title: 'SemanticSearch Pro',
      slug: 'semanticsearch-pro',
      description: 'Enterprise-grade semantic search engine using BERT embeddings with 89% relevance improvement over keyword search.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>A semantic search platform that understands context and meaning, dramatically improving search relevance for enterprise document repositories.</p>
        
        <h3>Technology</h3>
        <ul>
          <li>BERT-based sentence transformers for document embeddings</li>
          <li>Pinecone vector database for similarity search</li>
          <li>Hybrid search combining semantic and keyword matching</li>
          <li>Query understanding with intent classification</li>
        </ul>
      `,
      tags: ['NLP', 'Transformers', 'Python', 'FastAPI', 'Vector DB'],
      category: 'ml',
      year: 2024,
      featured: false,
      metrics: { relevanceImprovement: '89%', documentsIndexed: '1M+' },
      order: 3,
    },
    {
      title: 'NeuralViz',
      slug: 'neuralviz',
      description: 'Interactive visualization tool for neural network architectures, enabling real-time weight and activation exploration.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>An educational and debugging tool that provides intuitive visualizations of neural network internals during training and inference.</p>
        
        <h3>Features</h3>
        <ul>
          <li>3D network topology visualization</li>
          <li>Real-time activation flow animation</li>
          <li>Weight distribution heatmaps</li>
          <li>Gradient flow analysis</li>
          <li>Layer-by-layer inspection</li>
        </ul>
      `,
      tags: ['D3.js', 'Python', 'TensorFlow.js', 'React', 'WebGL'],
      category: 'data',
      year: 2024,
      featured: false,
      metrics: { architecturesSupported: '15+', users: '5k+' },
      order: 4,
    },
    {
      title: 'Artisan Marketplace',
      slug: 'artisan-marketplace',
      description: 'Full-featured e-commerce platform with Stripe Connect for multi-vendor payments, real-time inventory, and ML recommendations.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>A multi-vendor marketplace connecting artisans with customers, featuring commission-free direct payments and intelligent product recommendations.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Multi-vendor Architecture:</strong> Isolated vendor dashboards with analytics</li>
          <li><strong>Stripe Connect:</strong> Direct payouts to vendors with platform fee handling</li>
          <li><strong>Recommendation Engine:</strong> Collaborative filtering for personalized suggestions</li>
          <li><strong>Inventory Management:</strong> Real-time stock tracking with low-stock alerts</li>
        </ul>
      `,
      tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma', 'Redis'],
      category: 'fullstack',
      year: 2024,
      featured: true,
      metrics: { vendors: '200+', monthlyGMV: '$50k+', products: '5000+' },
      order: 5,
    },
    {
      title: 'VisionGuard',
      slug: 'visionguard',
      description: 'Real-time defect detection system for manufacturing with 99.7% accuracy, processing 60 FPS video streams.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>An industrial computer vision system that detects manufacturing defects in real-time, reducing quality control costs by 75%.</p>
        
        <h3>Technical Details</h3>
        <ul>
          <li>YOLOv8 model fine-tuned on custom defect dataset</li>
          <li>Edge deployment on NVIDIA Jetson for low-latency inference</li>
          <li>Integration with PLC systems for automated rejection</li>
          <li>Dashboard with defect trends and analytics</li>
        </ul>
      `,
      tags: ['Computer Vision', 'PyTorch', 'YOLO', 'OpenCV', 'Edge AI'],
      category: 'ml',
      year: 2024,
      featured: false,
      metrics: { accuracy: '99.7%', fps: '60', costReduction: '75%' },
      order: 6,
    },
    {
      title: 'DocuMind AI',
      slug: 'documind-ai',
      description: 'LLM-powered document intelligence system with RAG architecture, enabling natural language queries over 100K+ documents.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>An intelligent document assistant that allows users to ask questions in natural language and receive accurate, cited answers from large document collections.</p>
        
        <h3>Architecture</h3>
        <ul>
          <li>RAG (Retrieval Augmented Generation) pipeline</li>
          <li>Custom embedding model for domain-specific content</li>
          <li>Confidence scoring and source citation</li>
          <li>Multi-format support: PDF, Word, HTML, Markdown</li>
        </ul>
      `,
      tags: ['LLM', 'RAG', 'LangChain', 'OpenAI', 'Vector DB'],
      category: 'ml',
      year: 2025,
      featured: true,
      metrics: { documentsProcessed: '100k+', queryAccuracy: '92%', avgResponseTime: '2.3s' },
      order: 7,
    },
    {
      title: 'SocialPulse',
      slug: 'socialpulse',
      description: 'Social media analytics dashboard aggregating data from 8 platforms with AI-powered content recommendations and 200K+ MAU.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>A comprehensive social media management platform that provides insights, scheduling, and AI-powered content optimization.</p>
        
        <h3>Features</h3>
        <ul>
          <li>Unified inbox for 8+ social platforms</li>
          <li>Sentiment analysis and trend detection</li>
          <li>AI content suggestions based on engagement patterns</li>
          <li>Automated performance reports</li>
          <li>Team collaboration with approval workflows</li>
        </ul>
      `,
      tags: ['React Native', 'GraphQL', 'AWS', 'Python', 'MongoDB'],
      category: 'fullstack',
      year: 2024,
      featured: false,
      metrics: { mau: '200k+', platformsIntegrated: '8', postsAnalyzed: '10M+' },
      order: 8,
    },
    {
      title: 'StreamFlow',
      slug: 'streamflow',
      description: 'Real-time data pipeline processing 1M+ events/second with automatic scaling and fault tolerance.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>A high-throughput data streaming platform designed for real-time analytics and event processing at scale.</p>
        
        <h3>Architecture</h3>
        <ul>
          <li>Apache Kafka for message streaming</li>
          <li>Apache Spark Structured Streaming for processing</li>
          <li>Kubernetes auto-scaling based on lag</li>
          <li>Dead letter queues for error handling</li>
        </ul>
      `,
      tags: ['Apache Kafka', 'Spark', 'Python', 'Kubernetes', 'dbt'],
      category: 'data',
      year: 2024,
      featured: false,
      metrics: { throughput: '1M+ events/sec', latency: '<50ms', uptime: '99.99%' },
      order: 9,
    },
    {
      title: 'CloudAPI Gateway',
      slug: 'cloudapi-gateway',
      description: 'High-performance API gateway handling 50K req/sec with JWT auth, rate limiting, and dynamic routing.',
      longDescription: `
        <h2>Project Overview</h2>
        <p>A custom API gateway built for microservices architecture, providing security, routing, and observability in a single layer.</p>
        
        <h3>Features</h3>
        <ul>
          <li>JWT validation and API key authentication</li>
          <li>Rate limiting with Redis backend</li>
          <li>Request/response transformation</li>
          <li>Circuit breaker pattern</li>
          <li>Distributed tracing integration</li>
        </ul>
      `,
      tags: ['Microservices', 'Docker', 'Kubernetes', 'Go', 'Redis'],
      category: 'fullstack',
      year: 2023,
      featured: false,
      metrics: { throughput: '50k req/sec', latencyP99: '<10ms', services: '25+' },
      order: 10,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log(`✓ Created ${projects.length} projects\n`);

  // ============================================
  // CREATE BLOG POSTS
  // ============================================
  console.log('Creating blog posts...');

  const blogPosts = [
    {
      title: 'Building Production-Ready ML Pipelines: A Comprehensive Guide',
      slug: 'building-production-ml-pipelines',
      excerpt: 'Learn how to design, implement, and deploy machine learning pipelines that scale from prototype to production.',
      content: `
        <h2>Introduction</h2>
        <p>Taking a machine learning model from Jupyter notebook to production is a journey that many data scientists struggle with. In this comprehensive guide, I'll share the patterns and practices I've learned from deploying ML systems at scale.</p>
        
        <h2>The MLOps Maturity Model</h2>
        <p>Before diving into implementation, it's important to understand where your organization stands in the MLOps maturity model:</p>
        <ul>
          <li><strong>Level 0:</strong> Manual, notebook-based workflows</li>
          <li><strong>Level 1:</strong> Automated training with manual deployment</li>
          <li><strong>Level 2:</strong> CI/CD for ML with automated testing</li>
          <li><strong>Level 3:</strong> Full automation with monitoring and retraining</li>
        </ul>
        
        <h2>Key Components of a Production Pipeline</h2>
        <p>A robust ML pipeline consists of several interconnected components:</p>
        
        <h3>1. Data Validation</h3>
        <p>Before any model training, validate your data against expected schemas and statistical properties. Tools like Great Expectations or TensorFlow Data Validation can automate this.</p>
        
        <h3>2. Feature Engineering</h3>
        <p>Centralize feature computation in a feature store to ensure consistency between training and serving. Consider tools like Feast or Tecton.</p>
        
        <h3>3. Model Training</h3>
        <p>Use experiment tracking (MLflow, W&B) and containerized training environments for reproducibility.</p>
        
        <h3>4. Model Validation</h3>
        <p>Implement automated testing including:</p>
        <ul>
          <li>Performance benchmarks on holdout sets</li>
          <li>Fairness and bias checks</li>
          <li>Latency requirements verification</li>
        </ul>
        
        <h3>5. Deployment</h3>
        <p>Use blue-green or canary deployments to minimize risk. A/B testing helps validate model improvements in production.</p>
        
        <h2>Monitoring in Production</h2>
        <p>Model monitoring is often overlooked but critical:</p>
        <ul>
          <li><strong>Data drift:</strong> Monitor input distributions</li>
          <li><strong>Concept drift:</strong> Track prediction quality</li>
          <li><strong>System health:</strong> Latency, throughput, errors</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Building production ML pipelines is a journey, not a destination. Start simple, measure everything, and iterate based on real-world feedback.</p>
      `,
      coverImage: '/uploads/blog/ml-pipelines-cover.jpg',
      author: 'Nisschay Khandelwal',
      tags: ['Machine Learning', 'MLOps', 'Python', 'Best Practices'],
      published: true,
      publishedAt: new Date('2025-01-15'),
      readTime: 12,
    },
    {
      title: 'The Art of API Design: Lessons from Building Gateway Systems',
      slug: 'art-of-api-design',
      excerpt: 'Practical insights on designing APIs that developers love to use, with examples from real-world gateway implementations.',
      content: `
        <h2>What Makes a Great API?</h2>
        <p>After building and consuming countless APIs, I've identified key principles that separate good APIs from great ones.</p>
        
        <h2>Principle 1: Consistency is King</h2>
        <p>Your API should feel predictable. If you use <code>created_at</code> in one endpoint, don't use <code>createdAt</code> in another.</p>
        
        <h2>Principle 2: Meaningful Error Messages</h2>
        <p>Generic 500 errors help no one. Provide clear, actionable error messages with error codes that users can reference.</p>
        
        <pre><code>{
  "error": {
    "code": "INVALID_EMAIL_FORMAT",
    "message": "The email address provided is not valid",
    "field": "email",
    "suggestion": "Ensure the email follows format: user@domain.com"
  }
}</code></pre>
        
        <h2>Principle 3: Version from Day One</h2>
        <p>Even if you think you won't need it, version your API. The cost of adding it later is much higher.</p>
        
        <h2>Principle 4: Rate Limiting Done Right</h2>
        <p>Always include rate limit headers so clients can manage their usage:</p>
        <pre><code>X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000</code></pre>
        
        <h2>Principle 5: Documentation as Code</h2>
        <p>Use OpenAPI/Swagger and generate documentation automatically. Out-of-sync docs are worse than no docs.</p>
      `,
      coverImage: '/uploads/blog/api-design-cover.jpg',
      author: 'Nisschay Khandelwal',
      tags: ['API Design', 'Backend', 'Best Practices', 'Architecture'],
      published: true,
      publishedAt: new Date('2024-12-01'),
      readTime: 8,
    },
    {
      title: 'React Performance Optimization: Beyond the Basics',
      slug: 'react-performance-optimization',
      excerpt: 'Advanced techniques for optimizing React applications, from virtualization to intelligent code splitting.',
      content: `
        <h2>Why Performance Matters</h2>
        <p>Every 100ms of latency costs 1% in sales. Performance isn't just a technical metric—it's a business requirement.</p>
        
        <h2>Measuring Before Optimizing</h2>
        <p>Don't optimize blindly. Use React DevTools Profiler, Lighthouse, and real user monitoring (RUM) to identify bottlenecks.</p>
        
        <h2>Technique 1: Virtualization</h2>
        <p>For long lists, render only what's visible. Libraries like react-window or react-virtualized can handle thousands of items smoothly.</p>
        
        <h2>Technique 2: Code Splitting</h2>
        <p>Use dynamic imports with React.lazy() and Suspense wisely. Split by route first, then by component.</p>
        
        <h2>Technique 3: Memoization</h2>
        <p>Use useMemo and useCallback judiciously. Remember: premature optimization is the root of all evil.</p>
        
        <h2>Technique 4: Bundle Analysis</h2>
        <p>Regularly analyze your bundle with tools like webpack-bundle-analyzer or source-map-explorer.</p>
      `,
      coverImage: '/uploads/blog/react-performance-cover.jpg',
      author: 'Nisschay Khandelwal',
      tags: ['React', 'Performance', 'Frontend', 'JavaScript'],
      published: true,
      publishedAt: new Date('2024-10-20'),
      readTime: 10,
    },
    {
      title: 'Understanding Vector Databases for AI Applications',
      slug: 'vector-databases-for-ai',
      excerpt: 'A deep dive into vector databases, their role in modern AI applications, and choosing the right one for your use case.',
      content: `
        <h2>The Rise of Vector Databases</h2>
        <p>With the explosion of AI applications, vector databases have become essential infrastructure. But what exactly are they?</p>
        
        <h2>What is a Vector Database?</h2>
        <p>Vector databases store high-dimensional vectors (embeddings) and enable fast similarity search. Unlike traditional databases that match exact values, vector databases find "similar" items.</p>
        
        <h2>Use Cases</h2>
        <ul>
          <li>Semantic search and recommendations</li>
          <li>RAG (Retrieval Augmented Generation) for LLMs</li>
          <li>Image and audio similarity search</li>
          <li>Anomaly detection</li>
        </ul>
        
        <h2>Comparing Options</h2>
        <p><strong>Pinecone:</strong> Fully managed, excellent developer experience<br/>
        <strong>Weaviate:</strong> Open source, good for hybrid search<br/>
        <strong>Milvus:</strong> Open source, highly scalable<br/>
        <strong>pgvector:</strong> PostgreSQL extension, great for existing Postgres users</p>
        
        <h2>Best Practices</h2>
        <p>Choose embedding models wisely, consider dimensionality trade-offs, and always test with your actual data.</p>
      `,
      coverImage: '/uploads/blog/vector-db-cover.jpg',
      author: 'Nisschay Khandelwal',
      tags: ['AI', 'Databases', 'Vector Search', 'LLM'],
      published: true,
      publishedAt: new Date('2024-09-05'),
      readTime: 7,
    },
    {
      title: 'Microservices vs Monolith: Making the Right Choice',
      slug: 'microservices-vs-monolith',
      excerpt: 'When to use microservices, when to stick with a monolith, and the often-overlooked middle ground.',
      content: `
        <h2>The Microservices Hype</h2>
        <p>Microservices are not a silver bullet. I've seen teams introduce unnecessary complexity by jumping to microservices too early.</p>
        
        <h2>When Monoliths Win</h2>
        <ul>
          <li>Small teams (< 10 developers)</li>
          <li>Early-stage products still finding market fit</li>
          <li>Simple domains with clear boundaries</li>
        </ul>
        
        <h2>When Microservices Make Sense</h2>
        <ul>
          <li>Multiple teams working on independent features</li>
          <li>Different scaling requirements per component</li>
          <li>Polyglot persistence needs</li>
        </ul>
        
        <h2>The Middle Ground: Modular Monolith</h2>
        <p>Start with a well-structured monolith with clear module boundaries. Extract services only when you have clear reasons.</p>
        
        <h2>My Rule of Thumb</h2>
        <p>If you can't draw clear bounded contexts, you're not ready for microservices.</p>
      `,
      coverImage: '/uploads/blog/microservices-cover.jpg',
      author: 'Nisschay Khandelwal',
      tags: ['Architecture', 'Microservices', 'Backend', 'Design Patterns'],
      published: true,
      publishedAt: new Date('2024-07-12'),
      readTime: 6,
    },
    {
      title: 'Building Real-Time Features with WebSockets',
      slug: 'realtime-websockets-guide',
      excerpt: 'A practical guide to implementing real-time features using WebSockets, with patterns for scaling and reliability.',
      content: `
        <h2>Beyond Request-Response</h2>
        <p>HTTP is great for most web applications, but real-time features like chat, live updates, and collaborative editing need a different approach.</p>
        
        <h2>WebSocket Fundamentals</h2>
        <p>WebSocket provides a persistent, bidirectional connection between client and server. Once established, both sides can send messages at any time.</p>
        
        <h2>Implementation Patterns</h2>
        
        <h3>Connection Management</h3>
        <p>Always implement reconnection logic with exponential backoff. Connections will drop—plan for it.</p>
        
        <h3>Message Protocol</h3>
        <p>Define a clear message format. I recommend JSON with event types:</p>
        <pre><code>{
  "event": "message:new",
  "data": { "content": "Hello!", "userId": "123" },
  "timestamp": 1640000000000
}</code></pre>
        
        <h3>Scaling</h3>
        <p>For multiple server instances, use Redis pub/sub or a dedicated message broker to broadcast messages across all connections.</p>
        
        <h2>Alternatives</h2>
        <p>Consider Server-Sent Events (SSE) for one-way updates, or WebTransport for newer applications.</p>
      `,
      coverImage: '/uploads/blog/websockets-cover.jpg',
      author: 'Nisschay Khandelwal',
      tags: ['WebSockets', 'Real-time', 'Node.js', 'Architecture'],
      published: true,
      publishedAt: new Date('2024-05-28'),
      readTime: 9,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`✓ Created ${blogPosts.length} blog posts\n`);

  // ============================================
  // CREATE SAMPLE CONTACT MESSAGES
  // ============================================
  console.log('Creating sample contact messages...');

  const contacts = [
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      subject: 'Collaboration Opportunity',
      message: 'Hi Nisschay, I came across your Neural Stock Predictor project and was impressed by the architecture. We are looking for ML consultants for a similar project. Would you be interested in discussing?',
      read: false,
    },
    {
      name: 'Alex Johnson',
      email: 'alex.j@startup.io',
      subject: 'Speaking Invitation',
      message: 'Hello! We are organizing a tech conference in San Francisco and would love to have you speak about production ML systems. Let me know if you are interested!',
      read: true,
    },
  ];

  for (const contact of contacts) {
    await prisma.contact.create({
      data: contact,
    });
  }
  console.log(`✓ Created ${contacts.length} contact messages\n`);

  console.log('✅ Database seeding completed!\n');
  console.log('Admin Login:');
  console.log('  Email: admin@nisschay.dev');
  console.log('  Password: Admin@123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
