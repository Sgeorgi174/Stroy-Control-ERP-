import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ClothingSizesDialog } from "./clothing-sizes-dialog";
import { ClothingHeightsDialog } from "./clothing-heights-dialog";
import { FootwearSizesDialog } from "./footwear-sizes-dialog";
import { ProvidersDialog } from "./providers-dialog";

export function ClothesSettingsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <ClothingSizesDialog />
        <ClothingHeightsDialog />
        <FootwearSizesDialog />
        <ProvidersDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
