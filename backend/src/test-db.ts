import prisma from "./prisma"

async function main() {
    try {
        await prisma.$connect()
        console.log("Connected successfully")
    } catch (e) {
        console.error("Connection failed", e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
