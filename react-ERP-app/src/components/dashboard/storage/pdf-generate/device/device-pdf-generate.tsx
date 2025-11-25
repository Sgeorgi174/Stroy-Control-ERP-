import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import type { Device } from "@/types/device";
import { DeviceDocument } from "./device-document";

type DevicePDFButtonProps = { devices: Device[] };
export const DevicePDFButton: React.FC<DevicePDFButtonProps> = ({
  devices,
}) => {
  const handleDownload = async () => {
    const blob = await pdf(<DeviceDocument devices={devices} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    link.href = url;
    link.download = `Быт_инвентарь_${devices[0].storage.name}_${date}.pdf`;
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
