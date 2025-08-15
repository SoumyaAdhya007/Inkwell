import http from "http";
import app from "./app/app";
import env from "./config/env.config";
import connectDB from "./config/db.config";

function main() {
  const server = http.createServer(app());

  const PORT: number = Number(env.PORT ?? 8080);
  connectDB()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
      });
    })
    .catch((error: unknown) => {
      console.error(`Mongo db connect error:${error}`);
    });
}

main();
