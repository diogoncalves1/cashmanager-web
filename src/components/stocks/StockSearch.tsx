"use client";
import { useState } from "react";
import Input from "../form/input/InputField";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import Image from "next/image";
import { AssetSearch } from "@/models/assetSearch";

export default function StocksSearch() {
  const [assets, setAssets] = useState<AssetSearch[]>([]);

  return (
    <>
      <Input
        type="text"
        name="search"
        placeholder="Search"
        onChange={async (e) => {
          const search = e.target.value;

          if (search == "") {
            setAssets([]);
            return;
          }

          const params = new URLSearchParams();
          params.set("search", search);

          const res = await fetch(
            `http://127.0.0.1:8000/api/v1/assets/search?${params.toString()}`,
            {
              method: "GET",
            }
          );

          const data = await res.json();

          setAssets(data.data);
        }}
        defaultValue=""
      />

      <Table className="mt-10">
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>
                <div
                  key={asset.id}
                  className="w-10 h-10 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                >
                  <Image
                    width={40}
                    height={40}
                    src={asset.logo}
                    alt={`${asset.name} Logo`}
                    className="w-full"
                  />
                </div>
              </TableCell>
              <TableCell>{asset.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
