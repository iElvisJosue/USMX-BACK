// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarMovimiento,
  ObtenerTodosLosMovimientos,
  ActualizarEstadoDeUnMovimiento,
  EditarMovimiento,
  ObtenerPaisesActivos,
  ObtenerEstadosPorCodigoDelPais,
  ObtenerCiudadesPorEstado,
  ObtenerColoniasPorCodigoPostal,
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
// RUTA PARA OBTENER LOS PAISES ACTIVOS
router.get("/ObtenerPaisesActivos/:CookieConToken", ObtenerPaisesActivos);
// RUTA PARA OBTENER LOS ESTADOS POR CODIGO DEL PAIS
router.post("/ObtenerEstadosPorCodigoDelPais", ObtenerEstadosPorCodigoDelPais);
// RUTA PARA OBTENER LAS CIUDADES POR ESTADO
router.post("/ObtenerCiudadesPorEstado", ObtenerCiudadesPorEstado);
// RUTA PARA OBTENER LAS COLONIAS POR CODIGO POSTAL
router.post("/ObtenerColoniasPorCodigoPostal", ObtenerColoniasPorCodigoPostal);

// EXPORTAMOS EL ENRUTADOR
export default router;
