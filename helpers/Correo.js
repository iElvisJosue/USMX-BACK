import nodemailer from "nodemailer";
import {
  CORREO_PARA_EMAILS,
  CONTRASENA_PARA_EMAILS,
} from "../initial/config.js";

const TRANSPORTADOR = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: CORREO_PARA_EMAILS,
    pass: CONTRASENA_PARA_EMAILS,
  },
});

export default TRANSPORTADOR;
