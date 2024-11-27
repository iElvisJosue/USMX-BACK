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
  ActualizarProductoAgencia,
  DesasignarProductoAgencia,
  BuscarAgenciasPorFiltroYTipoDeUsuario,
  CrearYDescargarExcelDeAgencias,
  SubirArchivoRemitentes,
  SubirArchivoDestinatarios,
  // DescargarExcelAgencias,
} from "../controllers/agencias.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UNA AGENCIA
router.post("/RegistrarAgencia", ValidarToken, RegistrarAgencia);
// RUTA PARA BUSCAR LAS AGENCIAS POR FILTRO
router.post("/BuscarAgenciasPorFiltro", ValidarToken, BuscarAgenciasPorFiltro);
// RUTA PARA ACTUALIZAR EL ESTADO DE UNA AGENCIA
router.put("/ActualizarEstadoAgencia", ValidarToken, ActualizarEstadoAgencia);
// RUTA PARA ACTUALIZAR LA INFORMACIÓN DE UNA AGENCIA
router.put(
  "/ActualizarInformacionAgencia",
  ValidarToken,
  ActualizarInformacionAgencia
);
// RUTA PARA BUSCAR LOS PRODUCTOS QUE TIENE LA AGENCIA
router.post(
  "/BuscarProductosQueTieneLaAgencia",
  ValidarToken,
  BuscarProductosQueTieneLaAgencia
);
// RUTA PARA BUSCAR LOS PRODUCTOS QUE NO TIENE LA AGENCIA
router.post(
  "/BuscarProductosQueNoTieneLaAgencia",
  ValidarToken,
  BuscarProductosQueNoTieneLaAgencia
);
// RUTA PARA ASIGNAR UN PRODUCTO A UNA AGENCIA
router.post("/AsignarProductoAgencia", ValidarToken, AsignarProductoAgencia);
// RUTA PARA ACTUALIZAR EL PRODUCTO DE UNA AGENCIA
router.put(
  "/ActualizarProductoAgencia",
  ValidarToken,
  ActualizarProductoAgencia
);
// RUTA PARA DESASIGNAR UN PRODUCTO A UNA AGENCIA
router.post(
  "/DesasignarProductoAgencia",
  ValidarToken,
  DesasignarProductoAgencia
);
// RUTA PARA BUSCAR LAS AGENCIAS POR FILTRO Y TIPO DE USUARIO
router.post(
  "/BuscarAgenciasPorFiltroYTipoDeUsuario",
  ValidarToken,
  BuscarAgenciasPorFiltroYTipoDeUsuario
);
// RUTA PARA CREAR UN EXCEL DE AGENCIAS
router.post(
  "/CrearYDescargarExcelDeAgencias",
  ValidarToken,
  CrearYDescargarExcelDeAgencias
);
// RUTA PARA DESCARGAR UN EXCEL DE AGENCIAS
// router.get(
//   "/DescargarExcelAgencias/:NombreExcel/:CookieConToken",
//   DescargarExcelAgencias
// );
// RUTA PARA SUBIR ARCHIVOS DE REMITENTES
router.post("/SubirArchivoRemitentes", ValidarToken, SubirArchivoRemitentes);
// RUTA PARA SUBIR ARCHIVOS DE DESTINATARIOS
router.post(
  "/SubirArchivoDestinatarios",
  ValidarToken,
  SubirArchivoDestinatarios
);

// EXPORTAMOS EL ENRUTADOR
export default router;
