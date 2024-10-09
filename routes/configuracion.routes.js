// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  ObtenerTiposDeCarga,
  ObtenerTiposDeEnvio,
  ObtenerModoOscuro,
  ActualizarModoOscuro,
  RegistrarTipoDeCarga,
  EliminarTipoDeCarga,
  RegistrarTipoDeEnvio,
  EliminarTipoDeEnvio,
} from "../controllers/configuracion.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA BUSCAR LOS TIPOS DE CARGA
router.post("/ObtenerTiposDeCarga", ObtenerTiposDeCarga);
// RUTA PARA BUSCAR LOS TIPOS DE ENVÍO
router.post("/ObtenerTiposDeEnvio", ObtenerTiposDeEnvio);
// RUTA PARA OBTENER EL MODO OSCURO DEL USUARIO
router.get("/ObtenerModoOscuro/:idUsuario", ObtenerModoOscuro);
// RUTA PARA ACTUALIZAR EL MODO OSCURO DEL USUARIO
router.put("/ActualizarModoOscuro", ActualizarModoOscuro);
// RUTA PARA REGISTRAR UN NUEVO TIPO DE CARGA
router.post("/RegistrarTipoDeCarga", RegistrarTipoDeCarga);
// RUTA PARA ELIMINAR UN TIPO DE CARGA
router.delete(
  "/EliminarTipoDeCarga/:CookieConToken/:idCarga",
  EliminarTipoDeCarga
);
// RUTA PARA REGISTRAR UN NUEVO TIPO DE ENVIO
router.post("/RegistrarTipoDeEnvio", RegistrarTipoDeEnvio);
// RUTA PARA ELIMINAR UN TIPO DE ENVIO
router.delete(
  "/EliminarTipoDeEnvio/:CookieConToken/:idTipoEnvio",
  EliminarTipoDeEnvio
);

// EXPORTAMOS EL ENRUTADOR
export default router;
