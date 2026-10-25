export function nextPageOffset(offset: number, limit: number, total: number): number | null {
  const nextOffset = offset + limit;
  return nextOffset < total ? nextOffset : null;
}
