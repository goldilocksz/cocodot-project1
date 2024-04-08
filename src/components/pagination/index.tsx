import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'
import React, { useCallback, useMemo } from 'react'
export interface PaginationProps {
  totalPages: number
  totalPagesToDisplay?: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function PaginationUI({
  totalPages,
  totalPagesToDisplay = 5,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  const showLeftEllipsis = currentPage - 1 > totalPagesToDisplay / 2
  const showRightEllipsis = totalPages - currentPage > totalPagesToDisplay / 2

  const getPageNumbers = () => {
    if (totalPages <= totalPagesToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      const half = Math.floor(totalPagesToDisplay / 2)
      let start = currentPage - half
      let end = currentPage + half
      if (start < 1) {
        start = 1
        end = totalPagesToDisplay
      }
      if (end > totalPages) {
        start = totalPages - totalPagesToDisplay + 1
        end = totalPages
      }
      if (showLeftEllipsis) {
        start++
      }
      if (showRightEllipsis) {
        end--
      }
      console.log(totalPages, totalPagesToDisplay)

      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
  }

  const renderPaginationItems = () => {
    const pageNumbers = getPageNumbers()
    return pageNumbers.map((pageNumber) => (
      <PaginationItem key={pageNumber}>
        <PaginationLink
          isActive={pageNumber === currentPage}
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ))
  }

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>
        {showLeftEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {renderPaginationItems()}
        {showRightEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
