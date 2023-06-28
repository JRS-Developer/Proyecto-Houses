"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormSchema = {
  query: string;
};

const HomePage = () => {
  const form = useForm<FormSchema>({
    defaultValues: {
      query: "",
    },
  });
  const { push } = useRouter();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: FormSchema) => {
    if (data?.query) {
      push(`/search?q=${data?.query}`);
    }
  };

  return (
    <div className="bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/house.jpg')] bg-cover bg-center bg-no-repeat h-full -mx-8">
      <div className="mx-auto max-w-2xl h-full flex flex-col justify-center ">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Haz una búsqueda
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="shadow-sm border border-solid rounded-md mt-8 p-4 sm:w-full max-w-xl mx-auto bg-white"
          >
            <div className="flex flex-col sm:flex-row gap-2 gap-y-4">
              <FormField
                name="query"
                control={form?.control}
                render={({ field }) => {
                  return (
                    <div className="flex items-center gap-4 relative flex-1">
                      <Search
                        size={20}
                        className="absolute left-0 pointer-events-none"
                      />

                      <input
                        autoComplete="off"
                        className="focus-visible:outline-none pl-8 w-full h-8"
                        placeholder="Busca tu siguiente casa"
                        {...field}
                      />
                    </div>
                  );
                }}
              />
              <Button type="submit" loading={isSubmitting}>
                Search
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HomePage;
