import { Loader2 } from "lucide-react";

export const Loader = ({ size }: { size?: number }) => {
  return (
    <span className={"animate-spin"}>
      <Loader2 size={size || 24} />
    </span>
  );
};
