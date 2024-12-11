// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  InformacionDelSistema,
  EnviarCorreo,
  ObtenerResumenDiario,
} from "../controllers/sistema.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LA INFORMACION DEL SISTEMA
router.get("/InformacionDelSistema", InformacionDelSistema);
// RUTA PARA ENVIAR UN CORREO
router.post("/EnviarCorreo", EnviarCorreo);
// RUTA PARA OBTENER EL RESUMEN DIARIO
router.get("/ObtenerResumenDiario/:FechaDeHoy", ObtenerResumenDiario);

// EXPORTAMOS EL ENRUTADOR
export default router;
