// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarProducto,
  ObtenerProductosPorAgencia,
  BuscarProductosPorFiltro,
  BuscarAgenciasQueTieneUnProducto,
  BuscarAgenciasQueNoTieneUnProducto,
  AsignarAgenciaAlProducto,
  DesasignarAgenciaAlProducto,
  ActualizarInformacionDeUnProducto,
} from "../controllers/productos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN PRODUCTO
router.post("/RegistrarProducto", RegistrarProducto);
// RUTA PARA OBTENER LOS PRODUCTOS DE UNA AGENCIA
router.post("/ObtenerProductosPorAgencia", ObtenerProductosPorAgencia);
// RUTA PARA BUSCAR LOS PRODUCTOS POR FILTRO
router.post("/BuscarProductosPorFiltro", BuscarProductosPorFiltro);
// RUTA PARA BUSCAR LAS AGENCIAS QUE TIENE UN PRODUCTO
router.post(
  "/BuscarAgenciasQueTieneUnProducto",
  BuscarAgenciasQueTieneUnProducto
);
// RUTA PARA BUSCAR LAS AGENCIAS QUE NO TIENE UN PRODUCTO
router.post(
  "/BuscarAgenciasQueNoTieneUnProducto",
  BuscarAgenciasQueNoTieneUnProducto
);
// RUTA PARA ASIGNAR UNA AGENCIA AL PRODUCTO
router.post("/AsignarAgenciaAlProducto", AsignarAgenciaAlProducto);
// RUTA PARA DESASIGNAR UNA AGENCIA AL PRODUCTO
router.post("/DesasignarAgenciaAlProducto", DesasignarAgenciaAlProducto);
// RUTA PARA ACTUALIZAR LA INFORMACION DE UN PRODUCTO
router.put(
  "/ActualizarInformacionDeUnProducto",
  ActualizarInformacionDeUnProducto
);

// EXPORTAMOS EL ENRUTADOR
export default router;
