import cron from "node-cron";
import { checkDueTasks } from "../services/reminder.service.js";

cron.schedule("0 * * * *", async () => {
    console.log(
        `[CRON] Menjalankan job reminder pada ${new Date().toISOString()}`
    );
    await checkDueTasks();
});
