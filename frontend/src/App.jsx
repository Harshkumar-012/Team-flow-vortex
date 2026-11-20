import { useEffect, useRef, useState } from 'react'
import { ProjectsPage } from './pages/ProjectsPage'

/* ---------- data ---------- */

const FEATURES = [
  { icon: 'task', title: 'Task Management', short: 'Stay organized', text: 'Create, assign, prioritize, and manage tasks with clear ownership and deadlines.' },
  { icon: 'track', title: 'Project Tracking', short: 'Track progress', text: 'See project status at a glance and keep every milestone moving forward.' },
  { icon: 'team', title: 'Team Collaboration', short: 'Work together', text: 'Bring conversations, updates, and teammates together around shared goals.' },
  { icon: 'chart', title: 'Powerful Analytics', short: 'Make data-driven decisions', text: 'Understand progress, workload, and team performance with useful insights.' },
]

const CHECKS = [
  'Modern & intuitive', 'Secure & reliable',
  'Fully responsive', 'Transparent team roles',
  'Centralized workspace', 'Built for productivity',
]

const STEPS = [
  { n: '01', title: 'Create a workspace', text: 'Set up your team space and invite the people you work with.' },
  { n: '02', title: 'Create projects', text: 'Break big goals into organized projects and milestones.' },
  { n: '03', title: 'Assign tasks', text: 'Give every task an owner, a priority, and a due date.' },
  { n: '04', title: 'Achieve goals', text: 'Track progress together and celebrate completed work.' },
]

const STATS = [
  { value: 10, suffix: 'K+', label: 'Active Users' },
  { value: 500, suffix: '+', label: 'Projects Created' },
  { value: 99.9, suffix: '%', label: 'Platform Uptime', decimals: 1 },
  { value: 100, suffix: '%', label: 'Team Commitment' },
]

/* ---------- small helpers ---------- */

function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, inView]
}

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

function Counter({ value, decimals = 0, suffix = '', run }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf
    const start = performance.now()
    const dur = 1600
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, value])
  return (
    <>
      {n.toFixed(decimals)}
      <span className="stat-suffix">{suffix}</span>
    </>
  )
}

function Icon({ name }) {
  const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'task':
      return (<svg {...p}><rect x="4" y="4" width="16" height="16" rx="3" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>)
    case 'track':
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="currentColor" /></svg>)
    case 'team':
      return (<svg {...p}><path d="M12 3c2 2.5 4 3.5 6 4-.2 5-2 8-6 10-4-2-5.8-5-6-10 2-.5 4-1.5 6-4z" /><path d="M12 17v4M9 21h6" /></svg>)
    case 'chart':
      return (<svg {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 4v16M13 4v16M17 4v16" /></svg>)
    default:
      return null
  }
}

function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4cc9f0" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path d="M8 6h20a6 6 0 0 1 6 6v20a2 2 0 0 1-2 2H14a6 6 0 0 1-6-6V6z" fill="url(#lg)" />
      <circle cx="24" cy="26" r="6" fill="#021311" />
      <circle cx="13" cy="13" r="3" fill="#7ee0c3" opacity=".9" />
    </svg>
  )
}

/* ---------- sections ---------- */

function Navbar({ onOpenProjects }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#top"><Logo /> TeamFlow</a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button
            type="button"
            onClick={onOpenProjects}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }}
          >
            Projects
          </button>
        </nav>
        <button type="button" className="btn btn-primary btn-sm" onClick={onOpenProjects}>
          Get Started →
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Team workspace</span>
          <h1>Work together.<br />Move <span className="grad">forward.</span></h1>
          <p className="lead">
            TeamFlow brings your projects, tasks, and people into one calm
            workspace so every team can plan, deliver, and celebrate together.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#contact">Get Started Free →</a>
            <a className="btn btn-ghost" href="#about">
              <span className="play"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg></span>
              Watch Demo
            </a>
          </div>
          <div className="trust">
            <div className="avatars">
              {['I', 'H', 'V', 'S'].map((c) => (<span key={c} className="avatar">{c}</span>))}
            </div>
            <span>Trusted by 10K+ teams worldwide</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dash">
            <div className="dash-row">
              <div><strong>Design system update</strong><small>Due tomorrow</small></div>
              <span className="pill">In progress</span>
            </div>
            <div className="dash-row">
              <div><strong>Prepare sprint roadmap</strong><small>Owned by Harper</small></div>
              <span className="pill">In review</span>
            </div>
            <div className="dash-row members">
              <div><strong>Team Members</strong><small>Your team is working together</small></div>
              <div className="faces">
                <i /><i /><i /><i />
                <b>+3</b>
              </div>
            </div>
          </div>
          <div className="float-badge">✓ Sprint goals on track</div>
        </div>
      </div>

      <div className="container">
        <div className="strip">
          {FEATURES.map((f) => (
            <div className="strip-item" key={f.title}>
              <span className="icon-box"><Icon name={f.icon} /></span>
              <div>
                <strong>{f.title}</strong>
                <small>{f.short}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Everything in one place</span>
          <h2>Tools that move your team forward</h2>
          <p>Less switching between apps. More time for focused work, clear communication, and meaningful results.</p>
        </Reveal>
        <div className="grid-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90} className="card feature-card">
              <span className="icon-box"><Icon name={f.icon} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <Reveal className="about-visual">
          <div className="orbit" />
          <div className="orbit-star">✦</div>
          <div className="cube"><span /></div>
        </Reveal>
        <Reveal className="about-copy" delay={120}>
          <span className="eyebrow">Built for modern teams</span>
          <h2>A smarter way to manage work</h2>
          <p>
            From student teams to growing businesses, TeamFlow helps people work
            smarter, stay connected, and deliver their best work. Keep
            responsibilities clear and projects moving without unnecessary complexity.
          </p>
          <ul className="checks">
            {CHECKS.map((c) => (<li key={c}><span>✓</span>{c}</li>))}
          </ul>
          <a className="btn btn-outline" href="#features">Explore TeamFlow →</a>
        </Reveal>
      </div>
    </section>
  )
}

function Steps() {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Simple workflow</span>
          <h2>Get started in four simple steps</h2>
          <p>Set up your workspace once, then give your team a clear path from planning to delivery.</p>
        </Reveal>
        <div className="grid-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="card step-card">
              <span className="step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const [ref, inView] = useInView({ threshold: 0.35 })
  return (
    <section className="section">
      <div className="container" ref={ref}>
        <Reveal className="section-head">
          <span className="eyebrow">Our impact</span>
          <h2>Numbers that speak for themselves</h2>
          <p>One shared space to help teams stay focused and make progress visible.</p>
        </Reveal>
        <div className="grid-4">
          {STATS.map((s) => (
            <div className="card stat-card" key={s.label}>
              <div className="stat-num">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} run={inView} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal className="cta">
          <span className="eyebrow">Make teamwork flow</span>
          <h2>Ready to do your best work?</h2>
          <p>Bring your projects, tasks, and people together with TeamFlow.</p>
          <a className="btn btn-primary" href="#top">Get Started Free →</a>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a className="brand" href="#top"><Logo size={28} /> TeamFlow</a>
        <span className="copy">© {new Date().getFullYear()} TeamFlow. All rights reserved.</span>
        <nav>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  )
}

export default function App() {
  const [showProjects, setShowProjects] = useState(false)

  if (showProjects) {
    return <ProjectsPage onNavigateHome={() => setShowProjects(false)} />
  }

  return (
    <>
      <Navbar onOpenProjects={() => setShowProjects(true)} />
      <main>
        <Hero />
        <Features />
        <About />
        <Steps />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
