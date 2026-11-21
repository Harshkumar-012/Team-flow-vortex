const columns = [
  { title: "To do", count: "03", tasks: [{name:"Research competitors", tag:"Research", who:"AM"},{name:"Prepare user flows",tag:"Design",who:"TR"}] },
  { title: "In progress", count: "02", tasks: [{name:"Website landing page",tag:"Design",who:"IP"},{name:"Authentication flow",tag:"Development",who:"HK"}] },
  { title: "Done", count: "04", tasks: [{name:"Project setup",tag:"Development",who:"VK"},{name:"Brand direction",tag:"Design",who:"SD"}] }
];

export default function DashboardPreview() {
  return (
    <div className="dashboard-frame reveal">
      <div className="browser-bar"><div className="browser-dots"><i/><i/><i/></div><span>app.teamflow.io / workspace</span><span className="browser-more">•••</span></div>
      <div className="app-preview">
        <aside className="app-sidebar">
          <div className="mini-brand">T<span>.</span></div>
          <div className="sidebar-item selected">▦ <span>Overview</span></div>
          <div className="sidebar-item">▤ <span>My tasks</span></div>
          <div className="sidebar-item">◷ <span>Calendar</span></div>
          <div className="sidebar-item">♧ <span>Team</span></div>
          <div className="sidebar-bottom">⚙ <span>Settings</span></div>
        </aside>
        <main className="app-main">
          <div className="app-heading"><div><p className="eyebrow">WORKSPACE / OVERVIEW</p><h3>Good morning, Ishant.</h3><p className="muted">Here’s what’s happening with your projects.</p></div><div className="avatar">IP</div></div>
          <div className="mini-stats">
            <div><span>Active projects</span><strong>08</strong><small>Across your workspace</small></div>
            <div><span>Tasks completed</span><strong>64<em>%</em></strong><small className="green-text">↑ 12% this month</small></div>
            <div><span>Team members</span><strong>12</strong><small>Working together</small></div>
          </div>
          <div className="board-heading"><div><h4>Project tasks</h4><p className="muted">A quick look at your team's work</p></div><span className="view-label">Board view ⌄</span></div>
          <div className="kanban">
            {columns.map(col=><section className="kanban-col" key={col.title}><div className="kanban-title">{col.title}<span>{col.count}</span></div>{col.tasks.map(task=><article className="task-card" key={task.name}><span className="task-tag">{task.tag}</span><b>{task.name}</b><div className="task-meta"><span className="tiny-avatar">{task.who}</span><span>•••</span></div></article>)}</section>)}
          </div>
        </main>
      </div>
    </div>
  );
}
