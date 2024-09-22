// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  GuardarTodaLaInformacion,
  BuscarPedidosPorFiltro,
  BuscarPedidosPorPaquete,
  BuscarRemitentesPorAgencia,
  BuscarDestinatariosPorAgencia,
} from "../controllers/pedidos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA GUARDAR LA INFORMACION DEL DESTINATARIO, REMITENTE Y PEDIDO
router.post("/GuardarTodaLaInformacion", GuardarTodaLaInformacion);
// RUTA PARA OBTENER TODOS LOS PEDIDOS POR FILTRO
router.post("/BuscarPedidosPorFiltro", BuscarPedidosPorFiltro);
// RUTA PARA OBTENER LOS PEDIDOS POR PAQUETE
router.post("/BuscarPedidosPorPaquete", BuscarPedidosPorPaquete);
// RUTA PARA OBTENER LOS REMITENTES POR AGENCIA
router.post("/BuscarRemitentesPorAgencia", BuscarRemitentesPorAgencia);
// RUTA PARA OBTENER LOS DESTINATARIOS POR AGENCIA
router.post("/BuscarDestinatariosPorAgencia", BuscarDestinatariosPorAgencia);

// EXPORTAMOS EL ENRUTADOR
export default router;
