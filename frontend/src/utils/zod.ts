import { z, ZodTypeAny } from "zod";

export const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z.coerce
    .string()
    .transform((value) => {
      return value === "" ? null : value;
    })
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: "Numero invalido",
    })
    .transform((value) => (value === null ? null : Number(value)))
    .pipe(zodPipe);
