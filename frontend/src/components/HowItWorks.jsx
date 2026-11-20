const steps = [["01","Create your workspace","Bring your people and projects into one shared place."],["02","Organize the work","Break projects into clear tasks, owners, and deadlines."],["03","Move forward together","Share updates, track progress, and finish work as a team."]];
export default function HowItWorks() {
  return <section className="how section-shell" id="how-it-works"><div className="section-kicker">A SIMPLE START</div><div className="section-heading"><h2>From scattered to<br/><span>in sync.</span></h2><p>Get your team set up and moving in a few straightforward steps.</p></div><div className="steps">{steps.map(([n,title,desc])=><article className="step" key={n}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div><b>↗</b></article>)}</div></section>;
}
