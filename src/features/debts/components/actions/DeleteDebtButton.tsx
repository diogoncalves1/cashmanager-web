"use client";

import { useState } from "react";
import DeleteDebtDialog from "@/features/debts/components/dialogs/DeleteDebtDialog";
import { Button } from "@/components/ui/button";
import { Debt } from "@/features/debts/types";

export default function DeleteDebtButton({ debt }: { debt: Debt }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div>
      <Button
        variant="outline"
        className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
        onClick={() => setShowDeleteDialog(true)}
      >
        Delete Debt
      </Button>

      {/* Delete Confirmation Dialog */}
      <DeleteDebtDialog
        setShowDeleteDialog={setShowDeleteDialog}
        showDeleteDialog={showDeleteDialog}
        debt={debt}
      />
    </div>
  );
}
