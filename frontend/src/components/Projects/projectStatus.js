export function getProjectStatusPillClass(status) {
  switch (status) {
    case 'Active':
    case 'Completed':
      return 'tf-pill-emerald';
    case 'In Review':
      return 'tf-pill-sky';
    case 'Blocked':
      return 'tf-pill-rose';
    default:
      return 'tf-pill-neutral';
  }
}
