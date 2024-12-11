import nodemailer from "nodemailer";
// IMPORTAMOS LAS AYUDAS
import { ObtenerInformacionDelSistema } from "./InformacionDelSistema.js";

export const TransportadorCorreo = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { CorreoSistema, ContrasenaCorreoSistema } =
        await ObtenerInformacionDelSistema();
      const TRANSPORTADOR = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: CorreoSistema,
          pass: ContrasenaCorreoSistema,
        },
      });
      resolve(TRANSPORTADOR);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
