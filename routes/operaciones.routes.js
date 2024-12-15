// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarMovimiento,
  ObtenerTodosLosMovimientos,
  ActualizarEstadoDeUnMovimiento,
  EditarMovimiento,
  RegistrarTipoDeCarga,
  ObtenerTiposDeCarga,
  EliminarTipoDeCarga,
  RegistrarTipoDeEnvio,
  ObtenerTiposDeEnvio,
  EliminarTipoDeEnvio,
} from "../controllers/operaciones.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN NUEVO MOVIMIENTO
router.post("/RegistrarMovimiento", ValidarToken, RegistrarMovimiento);
// RUTA PARA OBTENER TODOS LOS MOVIMIENTOS
router.post(
  "/ObtenerTodosLosMovimientos",
  ValidarToken,
  ObtenerTodosLosMovimientos
);
// RUTA PARA ACTUALIZAR EL ESTADO DE UN MOVIMIENTO
router.put(
  "/ActualizarEstadoDeUnMovimiento",
  ValidarToken,
  ActualizarEstadoDeUnMovimiento
);
// RUTA PARA EDITAR UN MOVIMIENTO
router.put("/EditarMovimiento", ValidarToken, EditarMovimiento);
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

// EXPORTAMOS EL ENRUTADOR
export default router;
