import {
  PrismaClient,
  Role,
  OrderStatus,
  OrderPriority,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Upsert de usuário ADMIN
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {}, // nada será atualizado por enquanto
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: "hashedpassword", // hash real em produção!
      role: Role.ADMIN,
    },
  });

  // Upsert de usuário CLIENTE
  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      name: "Cliente Teste",
      email: "client@example.com",
      password: "hashedpassword",
      role: Role.CLIENT,
    },
  });

  // Upsert de um técnico
  const technician = await prisma.user.upsert({
    where: { email: "tech@example.com" },
    update: {},
    create: {
      name: "Tech Support",
      email: "tech@example.com",
      password: "hashedpassword",
      role: Role.TECHNICIAN,
    },
  });

  // Criar uma ordem associada ao cliente e ao técnico
  await prisma.order.upsert({
    where: { id: "seed-order-1" },
    update: {},
    create: {
      id: "seed-order-1",
      title: "Instalar impressora",
      description: "Cliente solicita instalação de impressora",
      priority: OrderPriority.HIGH,
      status: OrderStatus.PENDING,
      createdById: client.id,
      assignedToId: technician.id,
    },
  });
}

main()
  .then(() => {
    console.log("Seed completed.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
