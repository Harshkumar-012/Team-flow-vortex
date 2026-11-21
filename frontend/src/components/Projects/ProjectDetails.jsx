import { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  GitBranch,
  Layers,
  MessageSquare,
  Users,
  Video,
} from 'lucide-react';
import { getProjectStatusPillClass } from './projectStatus';

const REVIEW_CYCLE = [
  'In Progress',
  'Submitted',
  'Changes Requested',
  'Accepted',
];

function getTaskStatusPillClass(status) {
  switch (status) {
    case 'In Progress':
      return 'tf-pill-neutral';
    case 'Submitted':
      return 'tf-pill-sky';
    case 'Changes Requested':
      return 'tf-pill-amber';
    case 'Accepted':
      return 'tf-pill-emerald';
    default:
      return 'tf-pill-neutral';
  }
}

export function ProjectDetails({ project, onBack, onUpdateTaskStatus }) {
  const [activeTab, setActiveTab] = useState('overview');

  const blockers = project.tasks.filter(
    (t) => t.status === 'Changes Requested' || Boolean(t.blockerNote)
  );
  const pendingReviews = project.tasks.filter((t) => t.status === 'Submitted');

  const statusCounts = {
    inProgress: project.tasks.filter((t) => t.status === 'In Progress').length,
    submitted: pendingReviews.length,
    changesRequested: project.tasks.filter(
      (t) => t.status === 'Changes Requested'
    ).length,
    accepted: project.tasks.filter((t) => t.status === 'Accepted').length,
  };

  return (
    <main className="tf-container">
      <button
        type="button"
        onClick={onBack}
        className="tf-btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        <ArrowLeft size={15} />
        <span>Back to Projects</span>
      </button>

      <section
        className="tf-card"
        style={{ padding: '26px', marginBottom: '24px' }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <span className="tf-eyebrow" style={{ marginBottom: 0 }}>
                {project.category}
              </span>
              <span
                className={`tf-pill ${getProjectStatusPillClass(project.status)}`}
              >
                {project.status}
              </span>
            </div>
            <h1 className="tf-page-title" style={{ fontSize: '2rem' }}>
              {project.name}
            </h1>
            <p className="tf-page-subtitle" style={{ marginTop: '8px' }}>
              {project.goal}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--tf-text-secondary)',
              }}
            >
              <Calendar size={15} color="var(--tf-emerald)" />
              <span>Deadline: {project.deadline}</span>
            </div>
            <div className="tf-avatar-stack">
              {project.members.map((m) => (
                <span
                  key={m.id}
                  className="tf-avatar"
                  title={`${m.name} (${m.role})`}
                >
                  {m.initials}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '22px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: 'var(--tf-emerald)', fontWeight: 600 }}>
              ✓ {project.sprintNote}
            </span>
            <span style={{ color: 'var(--tf-text-secondary)' }}>
              {project.progress}% complete
            </span>
          </div>
          <div className="tf-progress-track">
            <div
              className="tf-progress-fill"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </section>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          {
            id: 'tasks',
            label: `Tasks (${project.tasks.length})`,
            icon: CheckCircle2,
          },
          {
            id: 'flowtrace',
            label: `FlowTrace (${project.flowTrace.length})`,
            icon: GitBranch,
          },
          {
            id: 'files',
            label: `Files (${project.files.length})`,
            icon: FileText,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`tf-pill ${active ? 'tf-pill-emerald' : 'tf-pill-neutral'}`}
              style={{
                padding: '9px 16px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '18px',
          }}
        >
          <div className="tf-card" style={{ padding: '22px' }}>
            <p className="tf-eyebrow">1. WHAT WE ARE FINISHING</p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>
              Key Deliverables
            </h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {project.deliverables.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: 'var(--tf-text-secondary)',
                  }}
                >
                  <CheckCircle2 size={15} color="var(--tf-emerald)" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tf-card" style={{ padding: '22px' }}>
            <p className="tf-eyebrow">2. WHO IS DOING WHAT</p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>
              Team & Responsibilities
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {project.members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.86rem',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span className="tf-avatar" style={{ marginLeft: 0 }}>
                      {member.initials}
                    </span>
                    <span style={{ fontWeight: 600 }}>{member.name}</span>
                  </div>
                  <span style={{ color: 'var(--tf-text-secondary)' }}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="tf-card" style={{ padding: '22px' }}>
            <p className="tf-eyebrow">3. WHAT NEEDS ATTENTION</p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>
              Blockers & Pending Reviews
            </h3>
            {blockers.length === 0 && pendingReviews.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--tf-emerald)' }}>
                ✓ No blockers or pending reviews right now.
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {blockers.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--tf-amber-dim)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      fontSize: '0.84rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--tf-amber)',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      <AlertTriangle size={14} />
                      <span>{b.title}</span>
                    </div>
                    <p style={{ color: 'var(--tf-text-secondary)' }}>
                      {b.blockerNote || 'Changes requested during review.'}
                    </p>
                  </div>
                ))}
                {pendingReviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'var(--tf-sky-dim)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      fontSize: '0.84rem',
                    }}
                  >
                    <span style={{ color: 'var(--tf-sky)', fontWeight: 600 }}>
                      Awaiting Review: {r.title}
                    </span>
                    <p
                      style={{
                        color: 'var(--tf-text-secondary)',
                        marginTop: '2px',
                      }}
                    >
                      Submitted by {r.owner}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tf-card" style={{ padding: '22px' }}>
            <p className="tf-eyebrow">4. IS WORK ACTUALLY FINISHED?</p>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>
              Review State Breakdown
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  {statusCounts.inProgress}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--tf-text-secondary)',
                  }}
                >
                  In Progress
                </div>
              </div>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--tf-sky-dim)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--tf-sky)',
                  }}
                >
                  {statusCounts.submitted}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--tf-text-secondary)',
                  }}
                >
                  Submitted
                </div>
              </div>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--tf-amber-dim)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--tf-amber)',
                  }}
                >
                  {statusCounts.changesRequested}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--tf-text-secondary)',
                  }}
                >
                  Changes Requested
                </div>
              </div>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--tf-emerald-dim)',
                }}
              >
                <div
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--tf-emerald)',
                  }}
                >
                  {statusCounts.accepted}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--tf-text-secondary)',
                  }}
                >
                  Accepted
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {project.tasks.map((task) => {
            const nextStatus =
              REVIEW_CYCLE[
                (REVIEW_CYCLE.indexOf(task.status) + 1) % REVIEW_CYCLE.length
              ];
            return (
              <div
                key={task.id}
                className="tf-card"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ minWidth: '240px', flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.98rem' }}>
                      {task.title}
                    </span>
                    <span
                      className="tf-pill tf-pill-neutral"
                      style={{ fontSize: '0.7rem' }}
                    >
                      <Users size={11} />
                      {task.mode}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--tf-text-secondary)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <span>Owner: {task.owner}</span>
                    <span>Due: {task.dueDate}</span>
                    <span>
                      Subtasks: {task.subtasksDone}/{task.subtasksTotal}
                    </span>
                  </div>
                </div>

                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateTaskStatus(project.id, task.id, nextStatus)
                    }
                    className={`tf-pill ${getTaskStatusPillClass(task.status)}`}
                    title="Click to cycle review status"
                    style={{ cursor: 'pointer', padding: '6px 12px' }}
                  >
                    {task.status}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'flowtrace' && (
        <div className="tf-card" style={{ padding: '24px' }}>
          <p className="tf-eyebrow">SIGNATURE FEATURE • FLOWTRACE</p>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '18px' }}>
            Context-to-Completion Trail
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {project.flowTrace.map((event) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'var(--tf-emerald-dim)',
                    color: 'var(--tf-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {event.type === 'chat' && <MessageSquare size={16} />}
                  {event.type === 'meeting' && <Video size={16} />}
                  {event.type === 'file' && <FileText size={16} />}
                  {event.type === 'review' && <CheckCircle2 size={16} />}
                  {event.type === 'task' && <GitBranch size={16} />}
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.94rem' }}>
                      {event.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--tf-text-muted)',
                      }}
                    >
                      {event.timestamp} • {event.actor}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--tf-text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {event.description}
                  </p>
                  {event.linkedTask && (
                    <span
                      className="tf-pill tf-pill-emerald"
                      style={{ marginTop: '8px', fontSize: '0.72rem' }}
                    >
                      Linked task: {event.linkedTask}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px',
          }}
        >
          {project.files.map((file) => (
            <div key={file.id} className="tf-card" style={{ padding: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span className="tf-pill tf-pill-emerald">{file.type}</span>
                <span
                  style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)' }}
                >
                  {file.updatedAt}
                </span>
              </div>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                {file.name}
              </div>
              <div
                style={{ fontSize: '0.8rem', color: 'var(--tf-text-secondary)' }}
              >
                Task: {file.linkedTask}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--tf-text-muted)',
                  marginTop: '6px',
                }}
              >
                Updated by {file.updatedBy}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
