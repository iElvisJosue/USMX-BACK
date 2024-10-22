// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarAgencia,
  BuscarAgenciasPorFiltro,
  ActualizarEstadoAgencia,
  ActualizarInformacionAgencia,
  BuscarProductosQueTieneLaAgencia,
  BuscarProductosQueNoTieneLaAgencia,
  AsignarProductoAgencia,
  DesasignarProductoAgencia,
  BuscarAgenciasPorFiltroYTipoDeUsuario,
} from "../controllers/agencias.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UNA AGENCIA
router.post("/RegistrarAgencia", RegistrarAgencia);
// RUTA PARA BUSCAR LAS AGENCIAS POR FILTRO
router.post("/BuscarAgenciasPorFiltro", BuscarAgenciasPorFiltro);
// RUTA PARA ACTUALIZAR EL ESTADO DE UNA AGENCIA
router.put("/ActualizarEstadoAgencia", ActualizarEstadoAgencia);
// RUTA PARA ACTUALIZAR LA INFORMACIÓN DE UNA AGENCIA
router.put("/ActualizarInformacionAgencia", ActualizarInformacionAgencia);
// RUTA PARA BUSCAR LOS PRODUCTOS QUE TIENE LA AGENCIA
router.post(
  "/BuscarProductosQueTieneLaAgencia",
  BuscarProductosQueTieneLaAgencia
);
// RUTA PARA BUSCAR LOS PRODUCTOS QUE NO TIENE LA AGENCIA
router.post(
  "/BuscarProductosQueNoTieneLaAgencia",
  BuscarProductosQueNoTieneLaAgencia
);
// RUTA PARA ASIGNAR UN PRODUCTO A UNA AGENCIA
router.post("/AsignarProductoAgencia", AsignarProductoAgencia);
// RUTA PARA DESASIGNAR UN PRODUCTO A UNA AGENCIA
router.post("/DesasignarProductoAgencia", DesasignarProductoAgencia);
// RUTA PARA BUSCAR LAS AGENCIAS POR FILTRO Y TIPO DE USUARIO
router.post(
  "/BuscarAgenciasPorFiltroYTipoDeUsuario",
  BuscarAgenciasPorFiltroYTipoDeUsuario
);

// EXPORTAMOS EL ENRUTADOR
export default router;
