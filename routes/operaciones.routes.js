// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarMovimiento,
  ObtenerTodosLosMovimientos,
  ActualizarEstadoDeUnMovimiento,
  EditarMovimiento,
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

// EXPORTAMOS EL ENRUTADOR
export default router;
