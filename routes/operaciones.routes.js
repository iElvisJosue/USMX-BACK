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
// RUTA PARA OBTENER LOS PAISES ACTIVOS
router.get(
  "/ObtenerPaisesActivos/:CookieConToken",
  ValidarToken,
  ObtenerPaisesActivos
);
// RUTA PARA OBTENER LOS ESTADOS POR CODIGO DEL PAIS
router.post(
  "/ObtenerEstadosPorCodigoDelPais",
  ValidarToken,
  ObtenerEstadosPorCodigoDelPais
);
// RUTA PARA OBTENER LAS CIUDADES POR ESTADO
router.post(
  "/ObtenerCiudadesPorEstado",
  ValidarToken,
  ObtenerCiudadesPorEstado
);
// RUTA PARA OBTENER LAS COLONIAS POR CODIGO POSTAL
router.post(
  "/ObtenerColoniasPorCodigoPostal",
  ValidarToken,
  ObtenerColoniasPorCodigoPostal
);

// EXPORTAMOS EL ENRUTADOR
export default router;
