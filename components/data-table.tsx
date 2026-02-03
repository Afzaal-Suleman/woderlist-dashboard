"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Create a separate component for the drag handle
function DragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

function DraggableRow<T>({ row }: { row: Row<T> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// Define props interface
interface DataTableProps<T extends { id: UniqueIdentifier }> {
  data: T[]
  columns: ColumnDef<T>[]
  title?: string
  description?: string
  enableDragAndDrop?: boolean
  enableColumnSelection?: boolean
  onAddNew?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onpenViewModal?: (item: T) => void
  addButtonLabel?: string
  
  // Pagination props
  serverSidePagination?: boolean
  totalCount?: number
  initialPage?: number
  initialPageSize?: number
  onPageChange?: (page: number, pageSize: number) => void
}

export function DataTable<T extends { id: UniqueIdentifier }>({
  data: initialData,
  columns,
  title = "Data",
  description = "Manage your data",
  enableDragAndDrop = true,
  enableColumnSelection = true,
  onAddNew,
  onEdit,
  onDelete,
  onpenViewModal,
  addButtonLabel = "Add Item",
  
  // Pagination props
  serverSidePagination = false,
  totalCount = 0,
  initialPage = 0,
  initialPageSize = 10,
  onPageChange,
}: DataTableProps<T>) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  
  // Simple pagination state
  const [pageIndex, setPageIndex] = React.useState(initialPage)
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  
  // State for server-side loading
  const [isLoading, setIsLoading] = React.useState(false)
  
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Handle server-side pagination
  const handleServerPageChange = React.useCallback(
    async (newPageIndex: number, newPageSize: number) => {
      if (serverSidePagination && onPageChange) {
        setIsLoading(true)
        try {
          await onPageChange(newPageIndex + 1, newPageSize)
          setPageIndex(newPageIndex)
          setPageSize(newPageSize)
        } finally {
          setIsLoading(false)
        }
      }
    },
    [serverSidePagination, onPageChange]
  )

  // Prepare columns
  const columnsWithFeatures = React.useMemo(() => {
    const cols = [...columns]
    
    // Add checkbox column
    cols.unshift({
      id: "select",
      header: ({ table }: { table: any }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }: { row: Row<T> }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    })
    
    // Add drag handle if enabled
    if (enableDragAndDrop) {
      cols.unshift({
        id: "drag",
        header: () => null,
        cell: ({ row }: any) => <DragHandle id={row.original.id} />,
        enableSorting: false,
        enableHiding: false,
      })
    }
    
    // Add actions column
    cols.push({
      id: "actions",
      cell: ({ row }: { row: Row<T> }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onpenViewModal?.(row.original)}>
              view
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Make a copy</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Favorite</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete?.(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    })
    
    return cols
  }, [columns, enableDragAndDrop, onEdit, onDelete])

  // Calculate paginated data for client-side
  const paginatedData = React.useMemo(() => {
    if (serverSidePagination) {
      return data
    }
    const start = pageIndex * pageSize
    const end = start + pageSize
    return data.slice(start, end)
  }, [data, pageIndex, pageSize, serverSidePagination])

  // Create table instance
  const table = useReactTable({
    data: paginatedData,
    columns: columnsWithFeatures,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    
    // Manual pagination control
    manualPagination: serverSidePagination,
    pageCount: serverSidePagination 
      ? Math.ceil(totalCount / pageSize) 
      : Math.ceil(data.length / pageSize),
  })

  // Handle drag and drop
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((item) => item.id) || [],
    [data]
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  // Navigation handlers
  const handleFirstPage = () => {
    if (serverSidePagination) {
      handleServerPageChange(0, pageSize)
    } else {
      setPageIndex(0)
    }
  }

  const handlePreviousPage = () => {
    const newPageIndex = pageIndex - 1
    if (serverSidePagination) {
      handleServerPageChange(newPageIndex, pageSize)
    } else {
      setPageIndex(newPageIndex)
    }
  }

  const handleNextPage = () => {
    const newPageIndex = pageIndex + 1
    if (serverSidePagination) {
      handleServerPageChange(newPageIndex, pageSize)
    } else {
      setPageIndex(newPageIndex)
    }
  }

  const handleLastPage = () => {
    const totalPages = serverSidePagination 
      ? Math.ceil(totalCount / pageSize) 
      : Math.ceil(data.length / pageSize)
    const lastPageIndex = Math.max(0, totalPages - 1)
    
    if (serverSidePagination) {
      handleServerPageChange(lastPageIndex, pageSize)
    } else {
      setPageIndex(lastPageIndex)
    }
  }

  // Handle rows per page change
  const handleRowsPerPageChange = (value: string) => {
    const newPageSize = Number(value)
    
    if (serverSidePagination) {
      // Reset to first page when changing page size
      handleServerPageChange(0, newPageSize)
    } else {
      setPageSize(newPageSize)
      setPageIndex(0) // Reset to first page
    }
  }

  // Calculate if buttons should be enabled
  const totalPages = serverSidePagination 
    ? Math.ceil(totalCount / pageSize) 
    : Math.ceil(data.length / pageSize)
  
  const canPreviousPage = pageIndex > 0 && !isLoading
  const canNextPage = pageIndex < totalPages - 1 && !isLoading

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {enableColumnSelection && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {onAddNew && (
            <Button variant="outline" size="sm" onClick={onAddNew}>
              <IconPlus />
              <span className="hidden lg:inline">{addButtonLabel}</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          {enableDragAndDrop ? (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columnsWithFeatures.length} className="h-24 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <IconLoader className="animate-spin" />
                          Loading...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columnsWithFeatures.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          ) : (
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columnsWithFeatures.length} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columnsWithFeatures.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {serverSidePagination ? totalCount : data.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            {/* Rows per page selector */}
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={pageSize.toString()}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Page info */}
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {pageIndex + 1} of {totalPages || 1}
            </div>
            
            {/* Navigation buttons */}
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={handleFirstPage}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={handlePreviousPage}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={handleNextPage}
                disabled={!canNextPage}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={handleLastPage}
                disabled={!canNextPage}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}