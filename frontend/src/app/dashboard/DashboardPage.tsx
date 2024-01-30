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
import { Plus } from "lucide-react";
import { MouseEvent, useState } from "react";
import { deleteHouse } from "@/services/houses";
import { useHouses } from "@/hooks/useHouses";
import { mutate } from "swr";
import { API_ROUTES } from "@/services/api-routes";
import { useRouter } from "next/navigation";
import HouseCard from "@/components/HouseCard";
import DashboardContainer from "@/components/DashboardContainer";

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
    <>
      <DeleteHouseDialog
        open={!!open}
        houseId={open}
        onClose={() => {
          setOpen(null);
        }}
      />
      <DashboardContainer
        action={
          <Button
            leftIcon={<Plus aria-hidden="true" />}
            onClick={() => {
              push("/dashboard/houses/create");
            }}
          >
            Agregar
          </Button>
        }
        title="Tu Lista"
      >
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
      </DashboardContainer>
    </>
  );
};

export default DashboardPage;
