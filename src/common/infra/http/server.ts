import { app } from "./app";
import { env } from "@/common/infra/env";

app.listen(env.PORT, () => {
  console.log("Server is running on port 3333! 🚀");
});
