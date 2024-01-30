"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, buttonVariants } from "./ui/button";
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
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import { zodInputStringPipe } from "@/utils/zod";
import Image from "next/image";
import { handleAxiosError } from "@/lib/axios";

type FormSchema = {
  title: string;
  address: string;
  garageCars: string | number;
  yearBuilt: string | number;
  salePrice: string | number;
  kitchenAbvGr: string | number;
  bedRoomAbvGr: string | number;
  fullBath: string | number;
  image: string;
};

const formSchema = z.object({
  title: z
    .string({
      required_error: "El titulo es requerido",
    })
    .trim()
    .min(1, "El titulo es requerido"),
  address: z
    .string({
      required_error: "La dirección es requerida",
    })
    .trim()
    .min(1, "La dirección es requerida"),
  garageCars: zodInputStringPipe(
    z
      .number({
        required_error: "La cantidad de cocheras es requerida",
        invalid_type_error: "La cantidad de cocheras debe ser un numero",
      })
      .min(0, "La cantidad de cocheras es requerida"),
  ),

  yearBuilt: zodInputStringPipe(
    z
      .number({
        required_error: "El año de construcción es requerido",
        invalid_type_error: "El año de construcción debe ser un numero",
      })
      .min(0, "El año de construcción es requerido")
      .min(1900, "El año de construcción no puede ser menor al año 1900")
      .max(
        new Date().getFullYear(),
        "El año de construcción no puede ser mayor al año actual",
      ),
  ),
  bedRoomAbvGr: zodInputStringPipe(
    z
      .number({
        required_error: "La cantidad de dormitorios es requerida",
        invalid_type_error: "La cantidad de dormitorios debe ser un numero",
      })
      .min(0, "La cantidad de dormitorios no puede ser menor a 0")
      .max(10, "La cantidad de dormitorios no puede ser mayor a 10"),
  ),

  fullBath: zodInputStringPipe(
    z
      .number({
        required_error: "La cantidad de baños es requerida",
        invalid_type_error: "La cantidad de baños debe ser un numero",
      })
      .min(0, "La cantidad de baños no puede ser menor a 0")
      .max(10, "La cantidad de baños no puede ser mayor a 10"),
  ),

  salePrice: zodInputStringPipe(
    z
      .number({
        required_error: "El precio de venta es requerido",
        invalid_type_error: "El precio de venta debe ser un numero",
      })
      .min(0, "El precio de venta es requerido"),
  ),

  image: z
    .string({
      required_error: "La imagen es requerida",
    })
    .trim()
    .min(1, "La imagen es requerida")
    .url("La imagen debe ser una URL valida"),
});

const defaultValues: FormSchema = {
  title: "",
  kitchenAbvGr: "",
  address: "",
  bedRoomAbvGr: "",
  fullBath: "",
  garageCars: "",
  salePrice: "",
  yearBuilt: "",
  image: "",
};
export default function Component({
  isEdit,
  house,
}: {
  isEdit?: boolean;
  house?: House;
}) {
  const [loadingPrice, setLoadingPrice] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: isEdit
      ? {
          title: house?.title ?? defaultValues.title,
          yearBuilt: house?.yearBuilt ?? defaultValues.yearBuilt,
          garageCars: house?.garageCars ?? defaultValues.garageCars,
          salePrice: house?.salePrice ?? defaultValues.salePrice,
          address: house?.address ?? defaultValues.address,
          bedRoomAbvGr: house?.bedRoomAbvGr ?? defaultValues.bedRoomAbvGr,
          fullBath: house?.fullBath ?? defaultValues.fullBath,
          kitchenAbvGr: house?.kitchenAbvGr ?? defaultValues.kitchenAbvGr,
          image: house?.image ?? defaultValues.image,
        }
      : defaultValues,
  });
  const { push, refresh } = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    trigger,
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      if (isEdit && house) {
        await updateHouse(house.id, {
          title: data.title,
          garageCars: Number(data.garageCars),
          yearBuilt: Number(data.yearBuilt),
          salePrice: Number(data.salePrice),
          address: data.address,
          bedRoomAbvGr: Number(data.bedRoomAbvGr),
          fullBath: Number(data.fullBath),
          kitchenAbvGr: Number(data.kitchenAbvGr),
          image: data.image,
        });
        toast.success("Propiedad actualizada");
      } else {
        await createHouse({
          title: data.title,
          garageCars: Number(data.garageCars),
          yearBuilt: Number(data.yearBuilt),
          salePrice: Number(data.salePrice),
          address: data.address,
          bedRoomAbvGr: Number(data.bedRoomAbvGr),
          fullBath: Number(data.fullBath),
          kitchenAbvGr: Number(data.kitchenAbvGr),
          image: data.image,
        });
        toast.success("Propiedad creada");
      }

      push("/dashboard");
      // refresh has to be after push() so it resets the cache
      // why? I don't know, nextjs magic
      refresh();
    } catch (error) {
      handleAxiosError(error, (m) => {
        toast.error(m);
      });
    }
  };

  const handlePrice = async () => {
    const isValid = await trigger([
      "title",
      "image",
      "fullBath",
      "bedRoomAbvGr",
      "garageCars",
      "yearBuilt",
      "address",
      "kitchenAbvGr",
    ]);

    if (!isValid) return;

    setLoadingPrice(true);
    const formData = getValues();

    try {
      const { data } = await getPriceRecommendation({
        yearBuilt: Number(formData.yearBuilt),
        garageCars: Number(formData.garageCars),
        address: formData.address,
        bedRoomAbvGr: Number(formData.bedRoomAbvGr),
        fullBath: Number(formData.fullBath),
        kitchenAbvGr: Number(formData.kitchenAbvGr),
        image: formData.image,
      });

      if (data.price) {
        setValue("salePrice", data.price);
        if (data.price === formData.salePrice) return;

        toast.success(
          `Precio cambiado de $${formData.salePrice || 0} a $${data.price}`,
        );
      }
    } catch (error) {
      handleAxiosError(error, (m) => {
        toast.error(m);
      });
    } finally {
      setLoadingPrice(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full"
        onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}
      >
        <div>
          <div className="flex flex-col gap-4">
            <FormField
              name="title"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa un titulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direccion</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 Main St"
                      autoComplete="street-address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
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

                  return (
                    <FormItem>
                      <FormLabel>Precio de venta</FormLabel>
                      <div className="flex gap-4 items-center">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="$200,000"
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

              <FormField
                name="yearBuilt"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año de construcción</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1990" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <FormField
                name="bedRoomAbvGr"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dormitorios</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        placeholder="3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="fullBath"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baños</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2"
                        min={0}
                        max={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="garageCars"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        <SelectItem value="0">Ninguno</SelectItem>
                        <SelectItem value="1">1 Auto</SelectItem>
                        <SelectItem value="2">2 Autos</SelectItem>
                        <SelectItem value="3">3 Autos</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <div className="flex flex-col space-y-1.5"> */}
            {/*   <Label htmlFor="description">Description</Label> */}
            {/*   <Textarea */}
            {/*     id="description" */}
            {/*     placeholder="Describe the property here." */}
            {/*   /> */}
            {/* </div> */}
            <FormField
              name="image"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="flex gap-4 items-end w-full">
                  <FormItem className="w-full">
                    <FormLabel>URL de Imagen</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="http://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  {field.value && !error?.message && (
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-none relative">
                      <Image
                        src={field.value}
                        alt="House Image"
                        fill
                        sizes="50px"
                      />
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <Link
            href={"/dashboard"}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button type="submit" loading={isSubmitting} disabled={loadingPrice}>
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
