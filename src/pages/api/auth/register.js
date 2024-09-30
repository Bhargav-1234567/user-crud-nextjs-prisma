import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
