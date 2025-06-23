export function buildStatusFilter(
  statusFilter?: string[] | string,
  excludeStatuses: string[] = ['LOST', 'WRITTEN_OFF'],
): object {
  if (!statusFilter) {
    return { status: { notIn: excludeStatuses } };
  }

  const statuses = Array.isArray(statusFilter) ? statusFilter : [statusFilter];

  if (statuses.length === 0) {
    return { status: { in: [] } };
  }

  return { status: { in: statuses } };
}
