function datatable() {
  return (
    <div className="w-full bg-white rounded-sm shadow-md  border border-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b grid grid-cols-12 items-center p-4 py-4">
        <div className="mr-auto col-span-3">
          <h3 className="text-xl">Accounts</h3>
        </div>
        <div className="ml-auto col-span-9 gap-4 flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem key="all" className="capitalize">
                Tipo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AppLink
            variant="default"
            path="/accounts/create"
            className="mr-auto bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white flex text-sm gap-2"
          >
            <Plus className="size-5" />
            Adicionar Conta
          </AppLink>
          <Input
            placeholder="Search ..."
            value={(table.getColumn("search")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
              table.getColumn("balance")?.setFilterValue(event.target.value);
              table.getColumn("search")?.setFilterValue(event.target.value);
            }}
            className="max-w-xs ml-auto"
          />
        </div>
      </div>
      <Table className="border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return !header.column.columnDef.enableHiding ? (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ) : null;
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {Array(10)
            .fill(null)
            .map((_, id) => (
              <TableRow key={id}>
                {Array(5)
                  .fill(null)
                  .map((_, id) => (
                    <TableCell className="py-3" key={id}>
                      <div className=" grid grid-cols-12">
                        <div className="col-span-6">
                          <div className="animate-pulse flex w-full gap-2 flex-col">
                            <div className="h-4 bg-gray-200 rounded w-25"></div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex p-4 items-center justify-end space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {pageCount} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
              pagination.pageIndex--;
            }}
            disabled={pagination.pageIndex == 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
              pagination.pageIndex++;
            }}
            disabled={pagination.pageIndex >= Math.floor((pageCount - 1) / pagination.pageSize)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
