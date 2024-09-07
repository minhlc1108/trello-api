import { DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

export const pagingSkipValue = (currentPage = DEFAULT_CURRENT_PAGE, itemsPerPage = DEFAULT_ITEMS_PER_PAGE) => {
  if (!currentPage || !itemsPerPage) return 0
  if (currentPage <= 0 || itemsPerPage <= 0) return 0
  return (currentPage - 1) * itemsPerPage
}