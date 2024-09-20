import mysql from "mysql";

// PARA PRODUCCIÓN
// export const CONEXION = mysql.createConnection({
//   port: 3306,
//   host: "embeautyroom.shop",
//   user: "embeautyroom_backone",
//   password: "Ac8293gA#",
//   database: "embeautyroom_backone",
// });

export const CONEXION = mysql.createConnection({
  port: 3307,
  host: "localhost",
  user: "elvis",
  password: "",
  database: "paqueteria",
});

export const CONECTAR_DB = () => {
  CONEXION.connect((error) => {
    if (error) {
      console.log("ERROR AL CONECTARSE: " + error);
      return;
    }
    console.log("CONEXIÓN EXITOSA A LA BASE DE DATOS");
  });
};
