import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { ArrowDownUp, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function DataTable<T>({ data, columns, filterPlaceholder, onRowClick }: { data: T[]; columns: ColumnDef<T>[]; filterPlaceholder?: string; onRowClick?: (row: T) => void }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState("");
  const table = useReactTable({ data, columns, state: { sorting, globalFilter: filter }, onSortingChange: setSorting, onGlobalFilterChange: setFilter, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel() });
  return <>
    {filterPlaceholder && <div data-slot="table-filter" className="relative border-b border-border p-4"><Search className="absolute left-7 top-7 size-4 text-muted-foreground" /><Input aria-label={filterPlaceholder} className="h-10 bg-background/50 pl-10 pr-18" placeholder={filterPlaceholder} value={filter} onChange={(event) => setFilter(event.target.value)} />{filter && <Button aria-label="Clear search" variant="ghost" className="absolute right-5 top-5 text-xs text-primary" onClick={() => setFilter("")}>Clear</Button>}</div>}
    <Table><TableHeader>{table.getHeaderGroups().map((group) => <TableRow key={group.id}>{group.headers.map((header) => <TableHead key={header.id} className="sticky top-0 z-10 bg-card px-5 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground"><button className="inline-flex items-center gap-2" onClick={header.column.getToggleSortingHandler()} disabled={!header.column.getCanSort()}>{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getCanSort() && <ArrowDownUp className="size-3" />}</button></TableHead>)}</TableRow>)}</TableHeader><TableBody>{table.getRowModel().rows.map((row) => <TableRow key={row.id} tabIndex={onRowClick ? 0 : undefined} onClick={() => onRowClick?.(row.original)} onKeyDown={(event) => { if (onRowClick && (event.key === "Enter" || event.key === " ")) onRowClick(row.original); }} className={onRowClick ? "cursor-pointer focus:bg-muted/50 focus:outline-none" : undefined}>{row.getVisibleCells().map((cell) => <TableCell className="px-5 py-3.5" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>)}</TableBody></Table>
    {!table.getRowModel().rows.length && <div className="p-10 text-center text-sm text-muted-foreground">No results found.</div>}
  </>;
}
