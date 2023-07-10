import { db } from "@/lib/kysely";

export default teardown = async () => await db.destroy();
