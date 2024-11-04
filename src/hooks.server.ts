import d from "dotenv";
import { db } from "$lib/db";
d.config();
try {
if (!(await db.serverSettings.findFirst())) {
throw new Error()
}
} catch {
  await db.serverSettings.create({
    data: {
      signups: true,
      runners: {
        create: []
      }
    }
})
}