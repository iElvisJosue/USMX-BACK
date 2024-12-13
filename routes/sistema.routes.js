// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  VerificarToken,
  ActualizarModoOscuro,
  ActualizarIdioma,
  InformacionDelSistema,
  EnviarCorreo,
  ActualizarLogoSistema,
  ActualizarInformacionDelSistema,
  ObtenerResumenDiario,
  CerrarSesion,
} from "../controllers/sistema.controllers.js";
// IMPORTAMOS EL MIDDLEWARE
import { ValidarToken } from "../middlewares/ValidarToken.js";
import { ValidarFotoUnica } from "../middlewares/ValidarFotoUnica.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA VERIFICAR EL TOKEN DE ACCESO DE UN USUARIO
router.post("/VerificarToken", VerificarToken);
// RUTA PARA ACTUALIZAR EL MODO OSCURO DEL USUARIO
router.put("/ActualizarModoOscuro", ValidarToken, ActualizarModoOscuro);
// RUTA PARA ACTUALIZAR EL IDIOMA DEL USUARIO
router.put("/ActualizarIdioma", ValidarToken, ActualizarIdioma);
// RUTA PARA OBTENER LA INFORMACION DEL SISTEMA
router.get("/InformacionDelSistema", InformacionDelSistema);
// RUTA PARA ENVIAR UN CORREO
router.post("/EnviarCorreo", EnviarCorreo);
// RUTA PARA ACTUALIZAR LA FOTO DE UN AGENTE
router.put("/ActualizarLogoSistema", ValidarFotoUnica, ActualizarLogoSistema);
// RUTA PARA ACTUALIZAR LA INFORMACION DEL SISTEMA
router.put(
  "/ActualizarInformacionDelSistema",
  ValidarToken,
  ActualizarInformacionDelSistema
);
// RUTA PARA OBTENER EL RESUMEN DIARIO
router.get("/ObtenerResumenDiario/:FechaDeHoy", ObtenerResumenDiario);
// RUTA PARA CERRAR SESION
router.post("/CerrarSesion", CerrarSesion);
// EXPORTAMOS EL ENRUTADOR
export default router;
