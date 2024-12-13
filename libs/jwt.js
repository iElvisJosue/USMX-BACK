// IMPORTAMOS JWT
import jwt from "jsonwebtoken";
// IMPORTAMOS LAS AYUDAS
import { ObtenerInformacionDelSistema } from "../helpers/InformacionDelSistema.js";

export async function CrearTokenDeAcceso(idUsuario) {
  const { TokenSistema } = await ObtenerInformacionDelSistema();

  return new Promise((resolve, reject) => {
    jwt.sign(idUsuario, TokenSistema, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}
