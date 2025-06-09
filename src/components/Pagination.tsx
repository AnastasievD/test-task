import { Button } from "./sharedComponents/Button"

type PaginationProps = {
  page: number
  limit: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function Pagination({ page, limit, totalPages, onPageChange, onLimitChange }: PaginationProps) {
  return (
    <div className='border-x border-b border-gray-200 rounded-b-lg px-4 py-2 flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className='border rounded px-2 py-1'
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className='font-bold text-xs text-gray-500'>ITEMS PER PAGE</span>
      </div>
      <div className='flex items-center gap-2 text-sm text-gray-700'>
        <span>
          {(page - 1) * limit + 1} - {Math.min(page * limit, totalPages * limit)} of {totalPages * limit}
        </span>
        <Button className={page === 1 ? "text-gray-200" : "text-gray-700"} onClick={() => onPageChange(1)} disabled={page === 1}>
          {"<<"}
        </Button>
        <Button className={page === 1 ? "text-gray-200" : "text-gray-700"} onClick={() => onPageChange(Math.max(1, page - 1))}>
          {"<"}
        </Button>
        <input
          className="border rounded px-3 py-1 w-16 text-center
            [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none 
            [-moz-appearance:textfield]"
          type='number'
          value={page}
          min={1}
          max={totalPages}
          onChange={(e) => onPageChange(Math.min(Number(e.target.value), totalPages))}
        />
        <Button
          className={page === totalPages ? "text-gray-200" : "text-gray-700"}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          {">"}
        </Button>
        <Button
          className={page === totalPages ? "text-gray-200" : "text-gray-700"}
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          {">>"}
        </Button>
      </div>
    </div>
  )
}
