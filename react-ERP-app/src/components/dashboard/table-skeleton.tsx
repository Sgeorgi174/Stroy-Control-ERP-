import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

type TableSkeletonProps = {
  small?: boolean;
};

export function TableSkeleton({ small = false }: TableSkeletonProps) {
  const skeleton: number[] = [1, 2, 3, 4, 5, 6];
  const smallSkeleton: number[] = [1, 2];

  return small
    ? smallSkeleton.map((item) => (
        <TableRow key={item}>
          <TableCell colSpan={9}>
            <Skeleton className="w-full h-[25px]" />
          </TableCell>
        </TableRow>
      ))
    : skeleton.map((item) => (
        <TableRow key={item}>
          <TableCell colSpan={9}>
            <Skeleton className="w-full h-[25px]" />
          </TableCell>
        </TableRow>
      ));
}
