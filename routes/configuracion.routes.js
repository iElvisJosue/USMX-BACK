// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  ObtenerTiposDeCarga,
  ObtenerTiposDeEnvio,
  ObtenerModoOscuro,
  ActualizarModoOscuro,
} from "../controllers/configuracion.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA BUSCAR LOS TIPOS DE CARGA
router.post("/ObtenerTiposDeCarga", ObtenerTiposDeCarga);
// RUTA PARA BUSCAR LOS TIPOS DE ENVÍO
router.post("/ObtenerTiposDeEnvio", ObtenerTiposDeEnvio);
// RUTA PARA OBTENER EL MODO OSCURO DEL USUARIO
router.get("/ObtenerModoOscuro/:idUsuario", ObtenerModoOscuro);
// RUTA PARA ACTUALIZAR EL MODO OSCURO DEL USUARIO
router.put("/ActualizarModoOscuro", ActualizarModoOscuro);

// EXPORTAMOS EL ENRUTADOR
export default router;
