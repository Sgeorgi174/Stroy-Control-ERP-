import type { Shift } from "@/types/shift";
import { ShiftDocument } from "./shift-pdf-generate";
import type { Object } from "@/types/object";
import { pdf } from "@react-pdf/renderer";
import { FileText } from "lucide-react";

type ShiftPDFProps = { shift: Shift; object: Object };
export const ShiftPDF: React.FC<ShiftPDFProps> = ({ shift, object }) => {
  const handleDownload = async () => {
    const blob = await pdf(
      <ShiftDocument shift={shift} object={object} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date(shift.shiftDate).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    link.href = url;
    link.download = `Развод_${object.name}_${date}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="button"
      onClick={handleDownload}
      className="p-4 bg-muted rounded-lg flex flex-col items-center  text-center cursor-pointer"
    >
      <FileText width={35} height={28} />
      <div className=" ">Скачать PDF</div>
    </div>
  );
};
