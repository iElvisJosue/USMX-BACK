// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  GuardarTodaLaInformacion,
  BuscarUltimosDiezPedidosGenerales,
  BuscarUltimosDiezPedidosDeUnUsuario,
  BuscarTodosLosPedidosPorFiltro,
  BuscarTodosLosPedidosPorFecha,
  BuscarPedidosDeUnUsuarioPorFiltro,
  BuscarPedidosDeUnUsuarioPorFecha,
  BuscarPedidosPorPaquete,
  BuscarRemitentesPorAgencia,
  BuscarDestinatariosPorAgencia,
  BuscarMovimientosDeUnPedido,
  BuscarPedidoPorNumeroDeGuia,
} from "../controllers/pedidos.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA GUARDAR LA INFORMACION DEL DESTINATARIO, REMITENTE Y PEDIDO
router.post(
  "/GuardarTodaLaInformacion",
  ValidarToken,
  GuardarTodaLaInformacion
);
// RUTA PARA BUSCAR LOS ULTIMOS DIEZ PEDIDOS GENERALES
router.get(
  "/BuscarUltimosDiezPedidosGenerales",
  BuscarUltimosDiezPedidosGenerales
);
// RUTA PARA BUSCAR LOS ULTIMOS DIEZ PEDIDOS DE UN USUARIO
router.get(
  "/BuscarUltimosDiezPedidosDeUnUsuario/:idUsuario",
  BuscarUltimosDiezPedidosDeUnUsuario
);
// RUTA PARA BUSCAR TODOS LOS PEDIDOS POR FILTRO
router.post(
  "/BuscarTodosLosPedidosPorFiltro",
  ValidarToken,
  BuscarTodosLosPedidosPorFiltro
);
// RUTA PARA BUSCAR TODOS LOS PEDIDOS POR FECHA
router.post(
  "/BuscarTodosLosPedidosPorFecha",
  ValidarToken,
  BuscarTodosLosPedidosPorFecha
);
// RUTA PARA BUSCAR LOS PEDIDOS DE UN USUARIO POR FILTRO
router.post(
  "/BuscarPedidosDeUnUsuarioPorFiltro",
  ValidarToken,
  BuscarPedidosDeUnUsuarioPorFiltro
);
// RUTA PARA BUSCAR LOS PEDIDOS DE UN USUARIO POR FECHA
router.post(
  "/BuscarPedidosDeUnUsuarioPorFecha",
  ValidarToken,
  BuscarPedidosDeUnUsuarioPorFecha
);
// RUTA PARA BUSCAR LOS PEDIDOS POR PAQUETE
router.post("/BuscarPedidosPorPaquete", ValidarToken, BuscarPedidosPorPaquete);
// RUTA PARA BUSCAR LOS REMITENTES POR AGENCIA
router.post(
  "/BuscarRemitentesPorAgencia",
  ValidarToken,
  BuscarRemitentesPorAgencia
);
// RUTA PARA BUSCAR LOS DESTINATARIOS POR AGENCIA
router.post(
  "/BuscarDestinatariosPorAgencia",
  ValidarToken,
  BuscarDestinatariosPorAgencia
);
// RUTA PARA BUSCAR LOS MOVIMIENTOS DE UN PEDIDO
router.post(
  "/BuscarMovimientosDeUnPedido",
  ValidarToken,
  BuscarMovimientosDeUnPedido
);
// RUTA PARA BUSCAR BUSCAR UN PEDIDO POR NUMERO DE GUIA
router.get(
  "/BuscarPedidoPorNumeroDeGuia/:GuiaPedido",
  BuscarPedidoPorNumeroDeGuia
);

// EXPORTAMOS EL ENRUTADOR
export default router;
