"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdditionalStorage } from "@/types/additional-storage";
import { Warehouse } from "lucide-react";

interface StorageSelectProps {
  storages: AdditionalStorage[] | undefined;
  isLoading: boolean;
  value: string | null;
  onValueChange: (value: string) => void;
}

export function StorageSelect({
  storages,
  isLoading,
  value,
  onValueChange,
}: StorageSelectProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-[240px]" />;
  }

  return (
    <Select value={value ?? ""} onValueChange={onValueChange}>
      <SelectTrigger className="w-[240px] bg-card border-border">
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Выберите склад" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {storages?.map((storage) => (
          <SelectItem key={storage.id} value={storage.id}>
            {storage.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
