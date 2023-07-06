import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { House } from "@/types/house";

const HouseCard = ({
  house: h,
  onDelete,
  onEdit,
}: {
  house: House;
  onEdit?: (h: House) => void;
  onDelete?: (h: House) => void;
}) => {
  return (
    <div className="group relative overflow-hidden">
      <div className="absolute top-2 right-2 flex flex-col items-end gap-2 z-10">
        {onEdit && (
          <Button
            className="p-2 h-fit w-fit rounded-full bg-destructive-foreground/70 hover:bg-destructive-foreground"
            variant="ghost"
            aria-label="Editar"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(h);
            }}
          >
            <Pencil size={16} />
          </Button>
        )}
        {onDelete && (
          <Button
            className="p-2 h-fit w-fit rounded-full text-destructive hover:text-destructive bg-destructive-foreground/70 hover:bg-destructive-foreground"
            variant="ghost"
            aria-label="Eliminar"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(h);
            }}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      <Link href="/dashboard/test">
        <div className="h-[250px] w-full relative rounded-md overflow-hidden ">
          <Image
            priority
            src={`https://loremflickr.com/1280/853/house?random=${h.id}`}
            alt={h.title}
            className="object-cover group-hover:opacity-75"
            fill
          />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">{h.title}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(h.salePrice)}
        </p>
      </Link>
    </div>
  );
};

export default HouseCard;
