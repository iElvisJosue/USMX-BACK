// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  ObtenerMovimientosDeEntrada,
  ObtenerInformacionDeGuiaParaEntradas,
  CrearEntrada,
  BuscarTodasLasEntradasABodegaPorFiltro,
  BuscarTodasLasEntradasABodegaPorFecha,
  BuscarTodasLasEntradasABodegaDeUnBodegueroPorFiltro,
  BuscarTodasLasEntradasABodegaDeUnBodegueroPorFecha,
  ObtenerInformacionDeGuiaParaDevolucion,
  CrearDevolucion,
  BuscarTodasLasDevolucionesPorFiltro,
  BuscarTodasLasDevolucionesPorFecha,
  BuscarDevolucionesDeUnBodegueroPorFiltro,
  BuscarDevolucionesDeUnBodegueroPorFecha,
  ObtenerInformacionDeGuiaParaMovimientoEnBodega,
  CrearMovimientoEnBodega,
  BuscarTodosLosMovimientosEnBodegaPorFiltro,
  BuscarTodosLosMovimientosEnBodegaPorFecha,
  BuscarMovimientosEnBodegaDeUnBodegueroPorFiltro,
  BuscarMovimientosEnBodegaDeUnBodegueroPorFecha,
  ObtenerMovimientosDeSalida,
  ObtenerInformacionDeGuiaParaSalidas,
  CrearSalida,
  BuscarTodasLasSalidasABodegaPorFiltro,
  BuscarTodasLasSalidasABodegaPorFecha,
  BuscarTodasLasSalidasABodegaDeUnBodegueroPorFiltro,
  BuscarTodasLasSalidasABodegaDeUnBodegueroPorFecha,
  ObtenerPedidosDeUnaEntrada,
  ObtenerPedidosDeUnMovimientoEnBodega,
  ObtenerPedidosDeUnaSalida,
  ObtenerPedidosDeUnaDevolucion,
} from "../controllers/bodega.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

//  RUTA PARA OBTENER LOS MOVIMIENTOS DE ENTRADA
router.get(
  "/ObtenerMovimientosDeEntrada/:CookieConToken",
  ValidarToken,
  ObtenerMovimientosDeEntrada
);
// RUTA PARA OBTENER LA INFORMACION DE LA GUIA PARA ENTRADAS
router.get(
  "/ObtenerInformacionDeGuiaParaEntradas/:CookieConToken/:GuiaPedido/:idMovimientoEntrada",
  ValidarToken,
  ObtenerInformacionDeGuiaParaEntradas
);
// RUTA PARA CREAR UNA ENTRADA
router.post("/CrearEntrada", ValidarToken, CrearEntrada);
// RUTA PARA OBTENER LA INFORMACION DE LA GUIA PARA DEVOLUCION
router.get(
  "/ObtenerInformacionDeGuiaParaDevolucion/:CookieConToken/:GuiaPedido",
  ValidarToken,
  ObtenerInformacionDeGuiaParaDevolucion
);
//  RUTA PARA BUSCAR TODAS LAS ENTRADAS A BODEGA POR FILTRO
router.post(
  "/BuscarTodasLasEntradasABodegaPorFiltro",
  ValidarToken,
  BuscarTodasLasEntradasABodegaPorFiltro
);
// RUTA PARA BUSCAR TODAS LAS ENTRADAS A BODEGA POR FECHA
router.post(
  "/BuscarTodasLasEntradasABodegaPorFecha",
  ValidarToken,
  BuscarTodasLasEntradasABodegaPorFecha
);
// RUTA PARA BUSCAR LAS ENTRADAS A BODEGA DE UN BODEGUERO POR FILTRO
router.post(
  "/BuscarTodasLasEntradasABodegaDeUnBodegueroPorFiltro",
  ValidarToken,
  BuscarTodasLasEntradasABodegaDeUnBodegueroPorFiltro
);
// RUTA PARA BUSCAR LAS ENTRADAS A BODEGA DE UN BODEGUERO POR FECHA
router.post(
  "/BuscarTodasLasEntradasABodegaDeUnBodegueroPorFecha",
  ValidarToken,
  BuscarTodasLasEntradasABodegaDeUnBodegueroPorFecha
);
// RUTA PARA CREAR UNA DEVOLUCION
router.post("/CrearDevolucion", ValidarToken, CrearDevolucion);
// RUTA PARA BUSCAR TODAS LAS DEVOLUCIONES POR FILTRO
router.post(
  "/BuscarTodasLasDevolucionesPorFiltro",
  ValidarToken,
  BuscarTodasLasDevolucionesPorFiltro
);
// RUTA PARA BUSCAR TODAS LAS DEVOLUCIONES POR FECHA
router.post(
  "/BuscarTodasLasDevolucionesPorFecha",
  ValidarToken,
  BuscarTodasLasDevolucionesPorFecha
);
// RUTA PARA BUSCAR LAS DEVOLUCIONES DE UN BODEGUERO POR FILTRO
router.post(
  "/BuscarDevolucionesDeUnBodegueroPorFiltro",
  ValidarToken,
  BuscarDevolucionesDeUnBodegueroPorFiltro
);
// RUTA PARA BUSCAR LAS DEVOLUCIONES DE UN BODEGUERO POR FECHA
router.post(
  "/BuscarDevolucionesDeUnBodegueroPorFecha",
  ValidarToken,
  BuscarDevolucionesDeUnBodegueroPorFecha
);
// RUTA PARA CREAR UN MOVIMIENTO EN BODEGA
router.post("/CrearMovimientoEnBodega", ValidarToken, CrearMovimientoEnBodega);
// RUTA PARA OBTENER LA INFORMACION DE LA GUIA PARA MOVIMIENTO EN BODEGA
router.get(
  "/ObtenerInformacionDeGuiaParaMovimientoEnBodega/:CookieConToken/:GuiaPedido",
  ValidarToken,
  ObtenerInformacionDeGuiaParaMovimientoEnBodega
);
// RUTA PARA BUSCAR TODOS LOS MOVIMIENTOS EN BODEGA POR FILTRO
router.post(
  "/BuscarTodosLosMovimientosEnBodegaPorFiltro",
  ValidarToken,
  BuscarTodosLosMovimientosEnBodegaPorFiltro
);
// RUTA PARA BUSCAR TODOS LOS MOVIMIENTOS EN BODEGA POR FECHA
router.post(
  "/BuscarTodosLosMovimientosEnBodegaPorFecha",
  ValidarToken,
  BuscarTodosLosMovimientosEnBodegaPorFecha
);
// RUTA PARA BUSCAR LOS MOVIMIENTOS EN BODEGA DE UN BODEGUERO POR FILTRO
router.post(
  "/BuscarMovimientosEnBodegaDeUnBodegueroPorFiltro",
  ValidarToken,
  BuscarMovimientosEnBodegaDeUnBodegueroPorFiltro
);
// RUTA PARA BUSCAR LOS MOVIMIENTOS EN BODEGA DE UN BODEGUERO POR FECHA
router.post(
  "/BuscarMovimientosEnBodegaDeUnBodegueroPorFecha",
  ValidarToken,
  BuscarMovimientosEnBodegaDeUnBodegueroPorFecha
);
//  RUTA PARA OBTENER LOS MOVIMIENTOS DE SALIDA
router.get(
  "/ObtenerMovimientosDeSalida/:CookieConToken",
  ValidarToken,
  ObtenerMovimientosDeSalida
);
// RUTA PARA OBTENER LA INFORMACION DE LA GUIA PARA SALIDAS
router.get(
  "/ObtenerInformacionDeGuiaParaSalidas/:CookieConToken/:GuiaPedido/:idMovimientoSalida",
  ValidarToken,
  ObtenerInformacionDeGuiaParaSalidas
);
// RUTA PARA CREAR UNA SALIDAS
router.post("/CrearSalida", ValidarToken, CrearSalida);
//  RUTA PARA BUSCAR TODAS LAS SALIDAS A BODEGA POR FILTRO
router.post(
  "/BuscarTodasLasSalidasABodegaPorFiltro",
  ValidarToken,
  BuscarTodasLasSalidasABodegaPorFiltro
);
// RUTA PARA BUSCAR TODAS LAS SALIDAS A BODEGA DE UN BODEGUERO POR FECHA
router.post(
  "/BuscarTodasLasSalidasABodegaPorFecha",
  ValidarToken,
  BuscarTodasLasSalidasABodegaPorFecha
);
// RUTA PARA BUSCAR LAS SALIDAS A BODEGA DE UN BODEGUERO POR FILTRO
router.post(
  "/BuscarTodasLasSalidasABodegaDeUnBodegueroPorFiltro",
  ValidarToken,
  BuscarTodasLasSalidasABodegaDeUnBodegueroPorFiltro
);
// RUTA PARA BUSCAR LAS SALIDAS A BODEGA DE UN BODEGUERO POR FECHA
router.post(
  "/BuscarTodasLasSalidasABodegaDeUnBodegueroPorFecha",
  ValidarToken,
  BuscarTodasLasSalidasABodegaDeUnBodegueroPorFecha
);
// RUTA PARA OBTENER LOS PEDIDOS DE UNA ENTRADA
router.get(
  "/ObtenerPedidosDeUnaEntrada/:CookieConToken/:idEntradaBodega",
  ValidarToken,
  ObtenerPedidosDeUnaEntrada
);
// RUTA PARA OBTENER LOS PEDIDOS DE UN MOVIMIENTO EN BODEGA
router.get(
  "/ObtenerPedidosDeUnMovimientoEnBodega/:CookieConToken/:idMovimientoBodega",
  ValidarToken,
  ObtenerPedidosDeUnMovimientoEnBodega
);
// RUTA PARA OBTENER LOS PEDIDOS DE UNA SALIDA DE BODEGA
router.get(
  "/ObtenerPedidosDeUnaSalida/:CookieConToken/:idSalidaBodega",
  ValidarToken,
  ObtenerPedidosDeUnaSalida
);
// RUTA PARA OBTENER LOS PEDIDOS DE UNA DEVOLUCION
router.get(
  "/ObtenerPedidosDeUnaDevolucion/:CookieConToken/:idDevolucion",
  ValidarToken,
  ObtenerPedidosDeUnaDevolucion
);
// EXPORTAMOS EL ENRUTADOR
export default router;
