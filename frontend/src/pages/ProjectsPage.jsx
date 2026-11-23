import { useState } from 'react';
import { Plus } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/mockProjects';
import { ProjectListing } from '../components/Projects/ProjectListing';
import { ProjectDetails } from '../components/Projects/ProjectDetails';
import { NewProjectModal } from '../components/Projects/NewProjectModal';
import '../components/Projects/projects.css';

export function ProjectsPage({ onNavigateHome }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) ?? null;

  const handleCreateProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
  };

  const handleUpdateTaskStatus = (projectId, taskId, nextStatus) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedTasks = proj.tasks.map((t) =>
          t.id === taskId ? { ...t, status: nextStatus } : t
        );
        const acceptedCount = updatedTasks.filter(
          (t) => t.status === 'Accepted'
        ).length;
        const progress =
          updatedTasks.length > 0
            ? Math.round((acceptedCount / updatedTasks.length) * 100)
            : proj.progress;
        return { ...proj, tasks: updatedTasks, progress };
      })
    );
  };

  return (
    <div className="tf-projects-shell">
      <header className="tf-navbar">
        <div className="tf-navbar-inner">
          <button
            type="button"
            className="tf-brand"
            onClick={onNavigateHome}
            aria-label="Back to TeamFlow Home"
          >
            <span className="tf-brand-icon">T</span>
            <span>TeamFlow</span>
          </button>

          <nav className="tf-nav-links" aria-label="Primary">
            <button
              type="button"
              className="tf-nav-link"
              onClick={onNavigateHome}
            >
              Home
            </button>
            <button
              type="button"
              className={`tf-nav-link ${!selectedProject ? 'active' : ''}`}
              onClick={() => setSelectedProjectId(null)}
            >
              Projects
            </button>
          </nav>

          <button
            type="button"
            className="tf-btn-primary"
            onClick={() => setIsNewModalOpen(true)}
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {selectedProject ? (
        <ProjectDetails
          project={selectedProject}
          onBack={() => setSelectedProjectId(null)}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      ) : (
        <ProjectListing
          projects={projects}
          onSelectProject={(id) => setSelectedProjectId(id)}
          onOpenNewProject={() => setIsNewModalOpen(true)}
        />
      )}

      {isNewModalOpen && (
        <NewProjectModal
          onClose={() => setIsNewModalOpen(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
}
