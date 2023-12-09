// clearOrders.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearOrders() {
  try {
    const deleteResult = await prisma.order.deleteMany({});
    console.log(`Deleted ${deleteResult.count} orders.`);
  } catch (e) {
    console.error("Error clearing orders:", e);
  } finally {
    await prisma.$disconnect();
  }
}

clearOrders();
