import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getToolById,
  updateTool,
  updateToolStatus,
  transferTool,
  confirmToolTransfer,
  deleteTool,
} from "@/services/api/tool.api";
import type {
  UpdateToolDto,
  TransferToolDto,
  UpdateToolStatusDto,
} from "@/types/dto/tool.dto";

export const useToolById = (id: string) => {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: () => getToolById(id),
    enabled: !!id,
  });
};

export const useUpdateTool = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateToolDto) => updateTool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", id] });
    },
  });
};

export const useUpdateToolStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateToolStatusDto) => updateToolStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", id] });
    },
  });
};

export const useTransferTool = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferToolDto) => transferTool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", id] });
    },
  });
};

export const useConfirmToolTransfer = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmToolTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", id] });
    },
  });
};

export const useDeleteTool = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
};
