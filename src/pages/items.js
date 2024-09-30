// pages/items.js
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ItemsCRUD from "@/components/ItemsCRUD";

export default function Items() {
  return (
    <div>
      <ItemsCRUD />
    </div>
  );
}
