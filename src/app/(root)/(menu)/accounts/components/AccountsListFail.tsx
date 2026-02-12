import React from "react";

const AccountsListFail = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <p className="text-muted-foreground">No accounts found</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your filters or create a new account
      </p>
    </div>
  );
};

export default AccountsListFail;
