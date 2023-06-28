"use client";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { House } from "@/types/house";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { deleteHouse } from "@/services/houses";
import { useHouses } from "@/hooks/useHouses";
import { mutate } from "swr";
import { API_ROUTES } from "@/services/api-routes";
import { useRouter } from "next/navigation";
import HouseCard from "@/components/HouseCard";

const DeleteHouseDialog = ({
  open = false,
  houseId = null,
  onClose,
}: {
  open: boolean;
  houseId: House["id"] | null;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const onConfirm = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!houseId) return;
    setLoading(true);

    try {
      await deleteHouse(houseId);
      await mutate(API_ROUTES.houses.list);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estas seguro de eliminar esta casa?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no se puede deshacer
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <Button onClick={onConfirm} loading={loading}>
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DashboardPage = () => {
  const [open, setOpen] = useState<number | null>(null);

  const { push } = useRouter();

  const { houses } = useHouses();

  return (
    <div className="flex flex-col gap-6">
      <DeleteHouseDialog
        open={!!open}
        houseId={open}
        onClose={() => {
          setOpen(null);
        }}
      />
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Tu Lista
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            <Button
              leftIcon={<Plus aria-hidden="true" />}
              onClick={() => {
                push("/dashboard/houses/create");
              }}
            >
              Agregar
            </Button>
          </span>
        </div>
      </div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {houses?.map((h) => (
          <HouseCard
            key={h.id}
            house={h}
            onEdit={() => {
              push(`/dashboard/houses/update/${h.id}`);
            }}
            onDelete={() => {
              setOpen(h.id);
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
