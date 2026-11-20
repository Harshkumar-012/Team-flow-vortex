import { useState } from 'react';
import { X } from 'lucide-react';

export function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Academic • Product & Engineering');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('Dec 12, 2026');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !goal.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      category: category.trim() || 'Team Workspace',
      goal: goal.trim(),
      status: 'Active',
      deadline: deadline.trim() || 'TBD',
      progress: 0,
      sprintNote: 'Workspace just created',
      members: [
        { id: 'm-you', name: 'You', initials: 'YO', role: 'Project Lead' },
      ],
      deliverables: ['Define initial milestones & assign owners'],
      tasks: [
        {
          id: `t-${Date.now()}`,
          title: 'Kickoff: invite team & assign first tasks',
          owner: 'You',
          dueDate: 'Tomorrow',
          priority: 'High',
          status: 'In Progress',
          mode: 'Shared group deliverable',
          subtasksDone: 0,
          subtasksTotal: 2,
        },
      ],
      flowTrace: [
        {
          id: `ft-${Date.now()}`,
          timestamp: 'Just now',
          type: 'task',
          title: 'Project workspace created',
          description: `Created "${name.trim()}" with shared goal and deadline.`,
          actor: 'You',
        },
      ],
      files: [],
    };

    onCreate(newProject);
    onClose();
  };

  return (
    <div className="tf-modal-backdrop" onClick={onClose}>
      <div className="tf-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <div>
            <p className="tf-eyebrow" style={{ marginBottom: '4px' }}>
              NEW WORKSPACE
            </p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Create Team Project
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              color: 'var(--tf-text-secondary)',
              padding: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--tf-text-secondary)',
                marginBottom: '6px',
              }}
            >
              Project Name
            </label>
            <input
              type="text"
              className="tf-input-field"
              placeholder="e.g. Mobile App Sprint 2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--tf-text-secondary)',
                marginBottom: '6px',
              }}
            >
              Category
            </label>
            <input
              type="text"
              className="tf-input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--tf-text-secondary)',
                marginBottom: '6px',
              }}
            >
              Shared Project Goal
            </label>
            <textarea
              className="tf-input-field"
              rows={3}
              placeholder="What is the team trying to finish?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--tf-text-secondary)',
                marginBottom: '6px',
              }}
            >
              Target Deadline
            </label>
            <input
              type="text"
              className="tf-input-field"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '8px',
            }}
          >
            <button
              type="button"
              className="tf-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="tf-btn-primary">
              Create Project →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
