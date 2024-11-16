// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  ObtenerTiposDeCarga,
  ObtenerTiposDeEnvio,
  ObtenerModoOscuro,
  ActualizarModoOscuro,
  ObtenerIdioma,
  ActualizarIdioma,
  RegistrarTipoDeCarga,
  EliminarTipoDeCarga,
  RegistrarTipoDeEnvio,
  EliminarTipoDeEnvio,
  BuscarPaisesPorFiltro,
  BuscarEstadosPorFiltro,
  BuscarCiudadesPorFiltro,
  BuscarColoniasPorFiltro,
  ObtenerApiGoogleMapsAutoCompletado,
} from "../controllers/configuracion.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER EL MODO OSCURO DEL USUARIO
router.get("/ObtenerModoOscuro/:idUsuario", ObtenerModoOscuro);
// RUTA PARA ACTUALIZAR EL MODO OSCURO DEL USUARIO
router.put("/ActualizarModoOscuro", ActualizarModoOscuro);
// RUTA PARA OBTENER EL IDIOMA DEL USUARIO
router.get("/ObtenerIdioma/:idUsuario", ObtenerIdioma);
// RUTA PARA ACTUALIZAR EL IDIOMA DEL USUARIO
router.put("/ActualizarIdioma", ActualizarIdioma);
// RUTA PARA BUSCAR LOS TIPOS DE CARGA
router.post("/ObtenerTiposDeCarga", ObtenerTiposDeCarga);
// RUTA PARA BUSCAR LOS TIPOS DE ENVÍO
router.post("/ObtenerTiposDeEnvio", ObtenerTiposDeEnvio);
// RUTA PARA REGISTRAR UN NUEVO TIPO DE CARGA
router.post("/RegistrarTipoDeCarga", RegistrarTipoDeCarga);
// RUTA PARA ELIMINAR UN TIPO DE CARGA
router.delete(
  "/EliminarTipoDeCarga/:CookieConToken/:idCarga",
  EliminarTipoDeCarga
);
// RUTA PARA REGISTRAR UN NUEVO TIPO DE ENVIO
router.post("/RegistrarTipoDeEnvio", RegistrarTipoDeEnvio);
// RUTA PARA ELIMINAR UN TIPO DE ENVIO
router.delete(
  "/EliminarTipoDeEnvio/:CookieConToken/:idTipoEnvio",
  EliminarTipoDeEnvio
);
// RUTA PARA BUSCAR LOS PAISES POR FILTRO
router.post("/BuscarPaisesPorFiltro", BuscarPaisesPorFiltro);
// RUTA PARA BUSCAR LOS ESTADOS POR FILTRO
router.post("/BuscarEstadosPorFiltro", BuscarEstadosPorFiltro);
// RUTA PARA BUSCAR LAS CIUDADES POR FILTRO
router.post("/BuscarCiudadesPorFiltro", BuscarCiudadesPorFiltro);
// RUTA PARA BUSCAR LAS COLONIAS POR FILTRO
router.post("/BuscarColoniasPorFiltro", BuscarColoniasPorFiltro);
// RUTA PARA OBTENER LA API DE GOOGLE MAPS AUTO COMPLETADO
router.get(
  "/ObtenerApiGoogleMapsAutoCompletado/:CookieConToken",
  ObtenerApiGoogleMapsAutoCompletado
);

// EXPORTAMOS EL ENRUTADOR
export default router;
