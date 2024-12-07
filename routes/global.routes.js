// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
// import { authRequired } from "../middlewares/validateToken.js";
// IMPORTAMOS LAS CONSULTAS
import {
  IniciarSesion,
  VerificarToken,
  CerrarSesion,
  ObtenerResumenDiario,
  EnviarCorreo,
} from "../controllers/global.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LOS DATOS DEL USUARIO
router.post("/IniciarSesion", IniciarSesion);
// RUTA PARA VERIFICAR EL TOKEN DE ACCESO
router.post("/VerificarToken", VerificarToken);
// RUTA PARA CERRAR SESION
router.post("/CerrarSesion", CerrarSesion);
// RUTA PARA OBTENER EL RESUMEN DIARIO
router.get("/ObtenerResumenDiario/:FechaDeHoy", ObtenerResumenDiario);
// RUTA PARA ENVIAR UN CORREO
router.post("/EnviarCorreo", EnviarCorreo);

// EXPORTAMOS EL ENRUTADOR
export default router;
