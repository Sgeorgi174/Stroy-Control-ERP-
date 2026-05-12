import type { PenaltyStatus } from "@/types/penalty";
import type { Role } from "@/types/user";

export const canManagePenalty = (
  role: Role | undefined,
  status: PenaltyStatus,
) => {
  if (!role) return { canApprove: false, canProcess: false, canReject: false };

  const isAdmin = role === "ADMIN";
  const isOWner = role === "OWNER" || isAdmin;
  const isAccountant = role === "ACCOUNTANT" || isAdmin;

  return {
    // Согласовать/Отклонить может Менеджер или Админ, если статус Ожидание
    canApprove: isOWner && status === "PENDING",
    canReject: isOWner && status === "PENDING",

    // Провести (обработать) может Бухгалтер или Админ, если статус Одобрено
    canProcess: isAccountant && status === "APPROVED",
  };
};

export const canManageOvertime = (
  role: Role | undefined,
  status: PenaltyStatus,
) => {
  if (!role) return { canApprove: false, canProcess: false, canReject: false };

  const isAdmin = role === "ADMIN";
  const isOWner = role === "OWNER" || isAdmin;
  const isAccountant = role === "ACCOUNTANT" || isAdmin;

  return {
    // Согласовать/Отклонить может Менеджер или Админ, если статус Ожидание
    canApprove: isOWner && status === "PENDING",
    canReject: isOWner && status === "PENDING",

    // Провести (обработать) может Бухгалтер или Админ, если статус Одобрено
    canProcess: isAccountant && status === "APPROVED",
  };
};
