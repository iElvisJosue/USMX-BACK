// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarProducto,
  BuscarProductosPorFiltro,
  ActualizarEstadoProducto,
  ObtenerProductosPorAgencia,
  BuscarAgenciasQueTieneUnProducto,
  BuscarAgenciasQueNoTieneUnProducto,
  AsignarAgenciaAlProducto,
  DesasignarAgenciaAlProducto,
  ActualizarInformacionDeUnProducto,
} from "../controllers/productos.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN PRODUCTO
router.post("/RegistrarProducto", ValidarToken, RegistrarProducto);
// RUTA PARA BUSCAR LOS PRODUCTOS POR FILTRO
router.post(
  "/BuscarProductosPorFiltro",
  ValidarToken,
  BuscarProductosPorFiltro
);
// RUTA PARA ACTUALIZAR EL ESTADO DE UN PRODUCTO
router.put("/ActualizarEstadoProducto", ValidarToken, ActualizarEstadoProducto);
// RUTA PARA OBTENER LOS PRODUCTOS DE UNA AGENCIA
router.post(
  "/ObtenerProductosPorAgencia",
  ValidarToken,
  ObtenerProductosPorAgencia
);
// RUTA PARA BUSCAR LAS AGENCIAS QUE TIENE UN PRODUCTO
router.post(
  "/BuscarAgenciasQueTieneUnProducto",
  ValidarToken,
  BuscarAgenciasQueTieneUnProducto
);
// RUTA PARA BUSCAR LAS AGENCIAS QUE NO TIENE UN PRODUCTO
router.post(
  "/BuscarAgenciasQueNoTieneUnProducto",
  ValidarToken,
  BuscarAgenciasQueNoTieneUnProducto
);
// RUTA PARA ASIGNAR UNA AGENCIA AL PRODUCTO
router.post(
  "/AsignarAgenciaAlProducto",
  ValidarToken,
  AsignarAgenciaAlProducto
);
// RUTA PARA DESASIGNAR UNA AGENCIA AL PRODUCTO
router.post(
  "/DesasignarAgenciaAlProducto",
  ValidarToken,
  DesasignarAgenciaAlProducto
);
// RUTA PARA ACTUALIZAR LA INFORMACION DE UN PRODUCTO
router.put(
  "/ActualizarInformacionDeUnProducto",
  ValidarToken,
  ActualizarInformacionDeUnProducto
);

// EXPORTAMOS EL ENRUTADOR
export default router;
