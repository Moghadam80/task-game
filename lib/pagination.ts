export type PageMeta = {
  readonly pageId: number;
  readonly eachPerPage: number;
  readonly total: number;
};

export type PaginationInfo = {
  readonly totalPages: number;
  readonly hasMore: boolean;
  readonly nextPage: number | null;
  readonly countMismatch: boolean;
};

export function getPaginationInfo(meta: PageMeta, receivedCount: number): PaginationInfo {
  const { pageId, eachPerPage, total } = meta;
  if (eachPerPage <= 0 || total <= 0) {
    return {
      totalPages: 0,
      hasMore: false,
      nextPage: null,
      countMismatch: receivedCount !== 0,
    };
  }

  const totalPages = Math.ceil(total / eachPerPage);
  const isLastPage = pageId >= totalPages;
  const expectedCount = isLastPage ? total - eachPerPage * (totalPages - 1) : eachPerPage;
  const countMismatch = receivedCount !== expectedCount;
  const hasMore = !isLastPage && receivedCount > 0;

  return {
    totalPages,
    hasMore,
    nextPage: hasMore ? pageId + 1 : null,
    countMismatch,
  };
}
