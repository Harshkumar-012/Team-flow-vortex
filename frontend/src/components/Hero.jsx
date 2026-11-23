import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="hero section-shell" id="home">
      <div className="hero-copy reveal">
        <div className="eyebrow-pill"><span/> A calmer way to work together</div>
        <h1>Good work happens<br/>when teams <span>flow.</span></h1>
        <p className="hero-description">Bring projects, tasks, and people into one clear workspace. TeamFlow helps your team stay aligned and move work forward.</p>
        <div className="hero-actions"><a className="button button-primary" href="/signup">Start your workspace <span>↗</span></a><a className="text-link" href="#features">Explore features <span>→</span></a></div>
        <div className="hero-note"><span className="note-check">✓</span> Keep your team and work in sync, without the noise.</div>
      </div>
      <DashboardPreview/>
    </section>
  );
}
