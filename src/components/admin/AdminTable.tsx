import type { ReactNode } from "react";

import { EmptyState } from "@/components/feedback/States";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type AdminColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

/** Read-only listing used by every admin section until editing lands. */
export function AdminTable<T extends { id: string }>({
  rows,
  columns,
  caption,
}: {
  rows: T[];
  columns: AdminColumn<T>[];
  caption?: string;
}) {
  if (!rows.length) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
