export const getColorBorder = (status: string) => {
  switch (status) {
    case "REJECT":
      return "border-l-red-500 border-b-red-500";
    case "CONFIRM":
      return "border-l-green-500 border-b-green-500";
    case "CANCEL":
      return "border-l-orange-400 border-b-orange-400";
    case "IN_TRANSIT":
      return "border-l-gray-500 border-b-gray-500";
    default:
      return "border-l-gray-500 border-b-gray-500";
  }
};
