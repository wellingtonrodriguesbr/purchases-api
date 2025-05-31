import { app } from "./app";

import { env } from "@/common/infra/env";
import { dataSource } from "@/common/infra/typeorm";

dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}! 🔥`);
    });
  })
  .catch(err => console.error("Error during Data Source initialization", err));
