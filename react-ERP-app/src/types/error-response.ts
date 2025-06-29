// /types/error-response.ts
import type { AxiosError } from "axios";

export type ErrorResponse = {
  message: string;
};

export type AppAxiosError = AxiosError<ErrorResponse>;
