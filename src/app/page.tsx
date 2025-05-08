import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
  const user = await prisma.user.findFirst({
    where: {
      email: "admin@example.com",
    },
  });

  return (
    <div>
      <h1>HOME</h1>
      <p>Hello, {user?.name}</p>
    </div>
  );
}
