import { useQuery } from "@tanstack/react-query";
import { getAllSkills } from "@/services/api/skill";

export const useSkill = (enabled = true) => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => getAllSkills(),
    enabled,
  });
};
