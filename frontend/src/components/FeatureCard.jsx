export default function FeatureCard({ icon, title, description, number }) {
  return <article className="feature-card"><div className="feature-top"><span className="feature-icon">{icon}</span><span className="feature-number">{number}</span></div><h3>{title}</h3><p>{description}</p></article>;
}
