export function buildStatusFilter(
  statusFilter?: string[] | string,
  includeAllStatuses = false,
  excludeStatuses: string[] = ['LOST', 'WRITTEN_OFF'],
): object {
  if (includeAllStatuses) {
    return {}; // не фильтруем по статусам вообще
  }

  if (!statusFilter) {
    return { status: { notIn: excludeStatuses } };
  }

  const statuses = Array.isArray(statusFilter) ? statusFilter : [statusFilter];

  if (statuses.length === 0) {
    return { status: { in: [] } };
  }

  return { status: { in: statuses } };
}
