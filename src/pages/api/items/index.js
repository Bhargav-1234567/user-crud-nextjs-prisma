// pages/api/items.js

import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const items = await prisma.item.findMany();
        res.status(200).json(items);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
      }
      break;

    case "POST":
      try {
        const { title, description, createdById } = req.body;
        const newItem = await prisma.item.create({
          data: {
            title,
            description,
            createdById,
          },
        });
        res.status(201).json(newItem);
      } catch (error) {
        res.status(500).json({ error: "Failed to add item" });
      }
      break;

    case "PUT":
      try {
        const { id, title, description } = req.body;
        const updatedItem = await prisma.item.update({
          where: { id: parseInt(id) },
          data: { title, description },
        });
        res.status(200).json(updatedItem);
      } catch (error) {
        res.status(500).json({ error: "Failed to update item" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        await prisma.item.delete({
          where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Item deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete item" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
