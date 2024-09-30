// pages/api/items/[id].js
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "DELETE") {
    const { id } = req.query;

    const item = await prisma.item.findUnique({ where: { id: Number(id) } });
    if (!item) return res.status(404).end("Item not found");

    if (item.created_by !== session.user.id) {
      return res
        .status(403)
        .end("You do not have permission to delete this item");
    }

    await prisma.item.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
