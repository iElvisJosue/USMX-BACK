// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarMovimiento,
  ObtenerTodosLosMovimientos,
  ActualizarEstadoDeUnMovimiento,
  EditarMovimiento,
} from "../controllers/operaciones.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN NUEVO MOVIMIENTO
router.post("/RegistrarMovimiento", RegistrarMovimiento);
// RUTA PARA OBTENER TODOS LOS MOVIMIENTOS
router.post("/ObtenerTodosLosMovimientos", ObtenerTodosLosMovimientos);
// RUTA PARA ACTUALIZAR EL ESTADO DE UN MOVIMIENTO
router.put("/ActualizarEstadoDeUnMovimiento", ActualizarEstadoDeUnMovimiento);
// RUTA PARA EDITAR UN MOVIMIENTO
router.put("/EditarMovimiento", EditarMovimiento);

// EXPORTAMOS EL ENRUTADOR
export default router;
