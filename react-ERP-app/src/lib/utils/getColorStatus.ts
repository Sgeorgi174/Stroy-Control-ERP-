export const getColorStatus = (status: string) => {
  switch (status) {
    case "REJECT":
      return "border-red-500";
    case "CONFIRM":
      return "border-green-500 ";
    case "IN_TRANSIT":
      return "border-gray-500 ";
    default:
      return "border-gray-500 ";
  }
};
