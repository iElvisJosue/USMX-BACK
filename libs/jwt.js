// IMPORTAMOS JWT
import jwt from "jsonwebtoken";
// IMPORTAMOS LAS AYUDAS
import { ObtenerInformacionDelSistema } from "../helpers/InformacionDelSistema.js";

export async function CrearTokenDeAcceso(payload) {
  const { TokenSistema } = await ObtenerInformacionDelSistema();

  return new Promise((resolve, reject) => {
    jwt.sign(payload, TokenSistema, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}
