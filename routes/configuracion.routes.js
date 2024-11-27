// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarTipoDeCarga,
  ObtenerTiposDeCarga,
  EliminarTipoDeCarga,
  RegistrarTipoDeEnvio,
  ObtenerTiposDeEnvio,
  EliminarTipoDeEnvio,
  ObtenerModoOscuro,
  ActualizarModoOscuro,
  ObtenerIdioma,
  ActualizarIdioma,
  ObtenerApiGoogleMapsAutoCompletado,
  BuscarPaisesPorFiltro,
  BuscarEstadosPorFiltro,
  BuscarCiudadesPorFiltro,
  BuscarColoniasPorFiltro,
} from "../controllers/configuracion.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN NUEVO TIPO DE CARGA
router.post("/RegistrarTipoDeCarga", ValidarToken, RegistrarTipoDeCarga);
// RUTA PARA BUSCAR LOS TIPOS DE CARGA
router.post("/ObtenerTiposDeCarga", ValidarToken, ObtenerTiposDeCarga);
// RUTA PARA ELIMINAR UN TIPO DE CARGA
router.delete(
  "/EliminarTipoDeCarga/:CookieConToken/:idCarga",
  ValidarToken,
  EliminarTipoDeCarga
);
// RUTA PARA REGISTRAR UN NUEVO TIPO DE ENVIO
router.post("/RegistrarTipoDeEnvio", ValidarToken, RegistrarTipoDeEnvio);
// RUTA PARA BUSCAR LOS TIPOS DE ENVÍO
router.post("/ObtenerTiposDeEnvio", ValidarToken, ObtenerTiposDeEnvio);
// RUTA PARA ELIMINAR UN TIPO DE ENVIO
router.delete(
  "/EliminarTipoDeEnvio/:CookieConToken/:idTipoEnvio",
  ValidarToken,
  EliminarTipoDeEnvio
);
// RUTA PARA OBTENER EL MODO OSCURO DEL USUARIO
router.get("/ObtenerModoOscuro/:idUsuario", ObtenerModoOscuro);
// RUTA PARA ACTUALIZAR EL MODO OSCURO DEL USUARIO
router.put("/ActualizarModoOscuro", ValidarToken, ActualizarModoOscuro);
// RUTA PARA OBTENER EL IDIOMA DEL USUARIO
router.get("/ObtenerIdioma/:idUsuario", ObtenerIdioma);
// RUTA PARA ACTUALIZAR EL IDIOMA DEL USUARIO
router.put("/ActualizarIdioma", ValidarToken, ActualizarIdioma);
// RUTA PARA OBTENER LA API DE GOOGLE MAPS AUTO COMPLETADO
router.get(
  "/ObtenerApiGoogleMapsAutoCompletado/:CookieConToken",
  ValidarToken,
  ObtenerApiGoogleMapsAutoCompletado
);
// RUTA PARA BUSCAR LOS PAISES POR FILTRO
router.post("/BuscarPaisesPorFiltro", ValidarToken, BuscarPaisesPorFiltro);
// RUTA PARA BUSCAR LOS ESTADOS POR FILTRO
router.post("/BuscarEstadosPorFiltro", ValidarToken, BuscarEstadosPorFiltro);
// RUTA PARA BUSCAR LAS CIUDADES POR FILTRO
router.post("/BuscarCiudadesPorFiltro", ValidarToken, BuscarCiudadesPorFiltro);
// RUTA PARA BUSCAR LAS COLONIAS POR FILTRO
router.post("/BuscarColoniasPorFiltro", ValidarToken, BuscarColoniasPorFiltro);

// EXPORTAMOS EL ENRUTADOR
export default router;
