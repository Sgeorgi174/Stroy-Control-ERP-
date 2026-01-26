import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { ReportShiftDocument } from "./report-pdf-generate-shift-document";

type ReportShiftPDFButtonProps = {
  rows: {
    employeeId: string;
    employeeName: string;
    hoursByDate: Record<string, number>;
    totalHours: number;
  }[];
  objectName: string;
  month: string;
  year: string;
};
export const ReportShiftPDFButton: React.FC<ReportShiftPDFButtonProps> = ({
  rows,
  objectName,
  month,
  year,
}) => {
  const handleDownload = async () => {
    const blob = await pdf(
      <ReportShiftDocument objectName={objectName} rows={rows} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    link.href = url;
    link.download = `Табель_${objectName}_${date}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="border-2 p-2 rounded-xl border-accent text-center cursor-pointer flex gap-2 items-center justify-center"
      onClick={handleDownload}
    >
      <Download className="w-[15px]" />
      <p>{`Табель ${month} ${year}`}</p>
    </div>
  );
};
