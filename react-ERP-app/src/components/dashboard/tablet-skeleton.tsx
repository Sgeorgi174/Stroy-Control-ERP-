import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const skeleton = [1, 2, 3, 4, 5, 6, 7, 8];

export function TabletSkeleton() {
  return skeleton.map((item) => (
    <TableRow key={item}>
      <TableCell></TableCell>
      <TableCell>
        <Skeleton className="h-[30px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[30px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[30px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[30px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[30px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[30px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[30px]" />
      </TableCell>
    </TableRow>
  ));
}
