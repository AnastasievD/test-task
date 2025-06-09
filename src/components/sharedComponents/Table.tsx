import * as React from "react"
import classNames from "classnames"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
    <div className='relative w-full'>
        <table ref={ref} className={classNames("w-full caption-bottom text-sm", className)} {...props} />
    </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => <thead ref={ref} className={classNames("[&_tr]:border-b", className)} {...props} />
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody className={classNames("[&_tr:last-child]:border-0 overflow-auto", className)} ref={ref} {...props} />
    )
)
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={classNames("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
        {...props}
    />
))
TableRow.displayName = "TableRow"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={classNames("border border-[#EAEDF0] text-xs last:border-r-0 px-[4px] py-[8px] align-middle", className)}
        {...props}
    />
))
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableRow, TableCell }
