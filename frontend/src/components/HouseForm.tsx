"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useState } from "react";
import { Loader } from "./ui/loader";
import {
  createHouse,
  getPriceRecommendation,
  updateHouse,
} from "@/services/houses";
import { useRouter } from "next/navigation";
import { House } from "@/types/house";
import { axiosAPI } from "@/lib/axios";
import axios from "axios";

const formSchema = z.object({
  title: z
    .string({
      invalid_type_error: "El titulo es requerido",
    })
    .min(1, "El titulo es requerido"),
  garageCars: z.preprocess(
    (v) => (typeof v === "string" && v !== "" ? Number(v) : v),
    z
      .number({
        invalid_type_error: "La cantidad de cocheras es requerida",
      })
      .min(0, "La cantidad de cocheras es requerida")
  ),
  yearBuilt: z.preprocess(
    (v) => (typeof v === "string" && v !== "" ? Number(v) : v),
    z
      .number({
        invalid_type_error: "El año de construcción es requerido",
      })
      .min(0, "El año de construcción es requerido")
      .min(1900, "El año de construcción no puede ser menor al año 1900")
      .max(
        new Date().getFullYear(),
        "El año de construcción no puede ser mayor al año actual"
      )
  ),
  salePrice: z.preprocess(
    (v) => (typeof v === "string" && v !== "" ? Number(v) : v),
    z
      .number({
        invalid_type_error: "El precio de venta es requerido",
      })
      .min(0, "El precio de venta es requerido")
  ),
});

type FormSchema = {
  title: string;
  garageCars: string | number;
  yearBuilt: string | number;
  salePrice: string | number;
};

const HouseForm = ({
  house,
  isEdit = false,
}: {
  house?: House;
  isEdit?: boolean;
}) => {
  const [loadingPrice, setLoadingPrice] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: isEdit
      ? {
          title: house?.title ?? "",
          yearBuilt: house?.yearBuilt ?? "",
          garageCars: house?.garageCars ?? "",
          salePrice: house?.salePrice ?? "",
        }
      : {
          title: "",
          yearBuilt: "",
          garageCars: "",
          salePrice: "",
        },
  });
  const { push } = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      if (isEdit && house) {
        await updateHouse(house.id, {
          title: data.title,
          garageCars: Number(data.garageCars),
          yearBuilt: Number(data.yearBuilt),
          salePrice: Number(data.salePrice),
        });
      } else {
        await createHouse({
          title: data.title,
          garageCars: Number(data.garageCars),
          yearBuilt: Number(data.yearBuilt),
          salePrice: Number(data.salePrice),
        });
      }
      push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrice = async () => {
    setLoadingPrice(true);
    const formData = getValues();

    try {
      const { data } = await getPriceRecommendation({
        yearBuilt: Number(formData.yearBuilt),
        garageCars: Number(formData.garageCars),
      });

      if (data.price) {
        setValue("salePrice", data.price);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPrice(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-12 gap-8">
          <FormField
            name="title"
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa un titulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="garageCars"
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Cantidad de cocheras</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ingresa una cantidad de cocheras"
                    min={0}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="yearBuilt"
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Año de construcción</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ingresa el año de construcción"
                    min={0}
                    max={new Date().getFullYear()}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="salePrice"
            control={control}
            render={({ field, formState: { errors } }) => {
              let isDisabled = false;

              if (loadingPrice || isSubmitting) {
                isDisabled = true;
              }

              // We will disable the button of request price
              // when the rest of inputs are not valid
              if (errors.title || errors.garageCars || errors.yearBuilt) {
                isDisabled = true;
              }

              const values = getValues();

              if (
                values.garageCars === "" ||
                values.yearBuilt === "" ||
                values.title === ""
              ) {
                isDisabled = true;
              }

              return (
                <FormItem className="col-span-4">
                  <FormLabel>Precio de venta</FormLabel>
                  <div className="flex gap-4 items-center">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingresa un precio de venta"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            disabled={isDisabled}
                            type="button"
                            onClick={handlePrice}
                          >
                            {loadingPrice ? (
                              <Loader size={18} />
                            ) : (
                              <Download size={18} />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Solicita una cotización de venta de tu propiedad
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" loading={isSubmitting} disabled={loadingPrice}>
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HouseForm;
