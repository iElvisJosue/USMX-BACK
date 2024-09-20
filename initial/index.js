// import fs from "fs";
// import https from "https";

import app from "./app.js";
// IMPORTAMOS CONFIGURACIÓN DE BD
import { CONECTAR_DB } from "./db.js";
// IMPORTAMOS EL KEY Y CERTIFICADO DEL SERVER
// import { serverKey, serverCert } from "./config.js";

// NOS CONECTAMOS A LA DB
CONECTAR_DB();

/*
https
  .createServer(
    {
      //https://carmonachavez.com:2083/cpsess7359182703/frontend/jupiter/ssl/install.html?id=_wildcard__cetis90_edu_mx_c0614_0c703_1720371787_3a104c6f950d132ccaed41efaa2cff41
      key: fs.readFileSync(serverKey),
      cert: fs.readFileSync(serverCert),
    },
    app
  )
  .listen(4100, function () {
    console.log("My HTTPS server listening on port 4100...");
  });
*/
app.listen(4000, () => {
  console.log("Server is running on port", 4000);
});
