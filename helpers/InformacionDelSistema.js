// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";

export const ObtenerInformacionDelSistema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "SELECT * FROM sistema";
      CONEXION.query(sql, (error, result) => {
        if (error) return reject(error);
        return resolve(result[0]);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
