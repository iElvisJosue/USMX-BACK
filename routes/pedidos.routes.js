// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  GuardarTodaLaInformacion,
  BuscarPedidosPorFiltro,
  BuscarPedidosPorPaquete,
  BuscarRemitentesPorAgencia,
  BuscarDestinatariosPorAgencia,
  BuscarUltimosDiezPedidos,
} from "../controllers/pedidos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA GUARDAR LA INFORMACION DEL DESTINATARIO, REMITENTE Y PEDIDO
router.post("/GuardarTodaLaInformacion", GuardarTodaLaInformacion);
// RUTA PARA BUSCAR TODOS LOS PEDIDOS POR FILTRO
router.post("/BuscarPedidosPorFiltro", BuscarPedidosPorFiltro);
// RUTA PARA BUSCAR LOS PEDIDOS POR PAQUETE
router.post("/BuscarPedidosPorPaquete", BuscarPedidosPorPaquete);
// RUTA PARA BUSCAR LOS REMITENTES POR AGENCIA
router.post("/BuscarRemitentesPorAgencia", BuscarRemitentesPorAgencia);
// RUTA PARA BUSCAR LOS DESTINATARIOS POR AGENCIA
router.post("/BuscarDestinatariosPorAgencia", BuscarDestinatariosPorAgencia);
// RUTA PARA BUSCAR LOS DESTINATARIOS POR AGENCIA
router.get("/BuscarUltimosDiezPedidos", BuscarUltimosDiezPedidos);

// EXPORTAMOS EL ENRUTADOR
export default router;
