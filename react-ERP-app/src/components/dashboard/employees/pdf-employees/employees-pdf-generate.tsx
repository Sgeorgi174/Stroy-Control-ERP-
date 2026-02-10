import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { EmployeesBulkDocument } from "./employees-document";
import type { Employee } from "@/types/employee";

type EmployeePDFButtonProps = { employees: Employee[] };
export const EmployeesPDFButton: React.FC<EmployeePDFButtonProps> = ({
  employees,
}) => {
  const handleDownload = async () => {
    const blob = await pdf(
      <EmployeesBulkDocument employees={employees} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    link.href = url;
    link.download = `Список сотрудников_${date}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="border-2 p-0.5 rounded-xl border-accent text-center cursor-pointer flex gap-2 items-center justify-center"
      onClick={handleDownload}
    >
      <p>PDF</p>
      <Download className="w-[14px]" />
    </div>
  );
};
