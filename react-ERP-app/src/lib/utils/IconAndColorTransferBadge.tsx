import { Clock } from "@/components/ui/clock";
import { CheckCircle, Package, XCircle } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "IN_TRANSIT":
      return "bg-blue-100 text-blue-800";
    case "CONFIRM":
      return "bg-green-100 text-green-800";
    case "REJECT":
      return "bg-red-100 text-red-800";
    case "CANCEL":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-4 h-4" />;
    case "IN_TRANSIT":
      return <Package className="w-4 h-4" />;
    case "CONFIRM":
      return <CheckCircle className="w-4 h-4" />;
    case "REJECT":
    case "CANCEL":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};
