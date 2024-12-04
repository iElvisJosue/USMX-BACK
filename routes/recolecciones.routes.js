// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  CrearRecoleccion,
  ObtenerInformacionDeGuia,
  BuscarTodasLasRecoleccionesPorFiltro,
  BuscarTodasLasRecoleccionesPorFecha,
  BuscarRecoleccionesDeUnChoferPorFiltro,
  BuscarRecoleccionesDeUnChoferPorFecha,
  ObtenerPedidosDeUnaRecoleccion,
} from "../controllers/recolecciones.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA CREAR UNA RECOLECCION
router.post("/CrearRecoleccion", ValidarToken, CrearRecoleccion);
// RUTA PARA OBTENER LA INFORMACION DE UNA GUIA
router.get(
  "/ObtenerInformacionDeGuia/:CookieConToken/:GuiaPedido",
  ValidarToken,
  ObtenerInformacionDeGuia
);
// RUTA PARA BUSCAR TODAS LAS RECOLECCIONES POR FILTRO
router.post(
  "/BuscarTodasLasRecoleccionesPorFiltro",
  ValidarToken,
  BuscarTodasLasRecoleccionesPorFiltro
);
// RUTA PARA BUSCAR TODAS LAS RECOLECCIONES POR FECHA
router.post(
  "/BuscarTodasLasRecoleccionesPorFecha",
  ValidarToken,
  BuscarTodasLasRecoleccionesPorFecha
);
// RUTA PARA BUSCAR RECOLECCIONES DE UN CHOFER POR FILTRO
router.post(
  "/BuscarRecoleccionesDeUnChoferPorFiltro",
  ValidarToken,
  BuscarRecoleccionesDeUnChoferPorFiltro
);
// RUTA PARA BUSCAR RECOLECCIONES DE UN CHOFER POR FECHA
router.post(
  "/BuscarRecoleccionesDeUnChoferPorFecha",
  ValidarToken,
  BuscarRecoleccionesDeUnChoferPorFecha
);
// RUTA PARA OBTENER LOS PEDIDOS DE UNA RECOLECCION
router.get(
  "/ObtenerPedidosDeUnaRecoleccion/:CookieConToken/:idRecoleccion",
  ValidarToken,
  ObtenerPedidosDeUnaRecoleccion
);
// EXPORTAMOS EL ENRUTADOR
export default router;
