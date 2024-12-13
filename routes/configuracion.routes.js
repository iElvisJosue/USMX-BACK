// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarTipoDeCarga,
  ObtenerTiposDeCarga,
  EliminarTipoDeCarga,
  RegistrarTipoDeEnvio,
  ObtenerTiposDeEnvio,
  EliminarTipoDeEnvio,
  ObtenerApiGoogleMapsAutoCompletado,
} from "../controllers/configuracion.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN NUEVO TIPO DE CARGA
router.post("/RegistrarTipoDeCarga", ValidarToken, RegistrarTipoDeCarga);
// RUTA PARA BUSCAR LOS TIPOS DE CARGA
router.post("/ObtenerTiposDeCarga", ValidarToken, ObtenerTiposDeCarga);
// RUTA PARA ELIMINAR UN TIPO DE CARGA
router.delete(
  "/EliminarTipoDeCarga/:CookieConToken/:idCarga",
  ValidarToken,
  EliminarTipoDeCarga
);
// RUTA PARA REGISTRAR UN NUEVO TIPO DE ENVIO
router.post("/RegistrarTipoDeEnvio", ValidarToken, RegistrarTipoDeEnvio);
// RUTA PARA BUSCAR LOS TIPOS DE ENVÍO
router.post("/ObtenerTiposDeEnvio", ValidarToken, ObtenerTiposDeEnvio);
// RUTA PARA ELIMINAR UN TIPO DE ENVIO
router.delete(
  "/EliminarTipoDeEnvio/:CookieConToken/:idTipoEnvio",
  ValidarToken,
  EliminarTipoDeEnvio
);
// RUTA PARA OBTENER LA API DE GOOGLE MAPS AUTO COMPLETADO
router.get(
  "/ObtenerApiGoogleMapsAutoCompletado/:CookieConToken",
  ValidarToken,
  ObtenerApiGoogleMapsAutoCompletado
);

// EXPORTAMOS EL ENRUTADOR
export default router;
