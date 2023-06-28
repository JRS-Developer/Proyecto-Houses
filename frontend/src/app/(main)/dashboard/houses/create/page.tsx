import HouseForm from "@/components/HouseForm";

const CreateHouse = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Crear propiedad
          </h2>
        </div>
      </div>

      <HouseForm />
    </div>
  );
};

export default CreateHouse;
