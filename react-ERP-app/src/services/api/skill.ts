import { api } from "@/lib/api";
import type { CreateSkillDto, UpdateSkillDto } from "@/types/dto/skill.dto";
import type { Skill } from "@/types/employee";

export const createSkill = async (data: CreateSkillDto): Promise<Skill> => {
  const res = await api.post(`skills/create`, data);
  return res.data;
};

export const updateSkill = async (
  id: string,
  data: UpdateSkillDto
): Promise<Skill> => {
  const res = await api.put(`skills/update/${id}`, data);
  return res.data;
};

export const getAllSkills = async (): Promise<Skill[]> => {
  const res = await api.get(`skills/all`);
  return res.data;
};

export const deleteSkill = async (id: string): Promise<boolean> => {
  return await api.delete(`skills/delete/${id}`);
};
