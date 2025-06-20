import type { Object } from "@/types/object";

export const splitAddress = (object: Object) => {
  const splittedAddress = object.address.split(",");
  return {
    city: splittedAddress[0],
    street: splittedAddress[1],
    buldings: splittedAddress[2],
  };
};
