import FeatureCard from "./FeatureCard";
const features = [
  ["▦","Project spaces","Keep conversations, tasks, and project details together.","01"],
  ["✓","Clear task ownership","Assign work, set priorities, and make the next step obvious.","02"],
  ["◫","Visual workflows","See work move from planned to in progress to complete.","03"],
  ["♧","Team visibility","Understand who's working on what without constant check-ins.","04"],
  ["◷","Deadlines that stay visible","Keep important dates and upcoming work in view.","05"],
  ["↗","Progress at a glance","Spot progress and blockers before they become surprises.","06"]
];
export default function Features() {
  return <section className="features section-shell" id="features">
    <div className="section-heading"><div><div className="section-kicker">BUILT FOR THE WAY TEAMS WORK</div><h2>Everything in its<br/><span>right place.</span></h2></div><p>Simple tools that help your team stay organized, focused, and moving in the same direction.</p></div>
    <div className="feature-grid">{features.map(([icon,title,description,number])=><FeatureCard key={number} {...{icon,title,description,number}}/>)}</div>
  </section>;
}
