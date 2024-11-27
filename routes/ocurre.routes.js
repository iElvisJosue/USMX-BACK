// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarOcurre,
  BuscarOcurresPorFiltro,
  ActualizarEstadoOcurre,
  ActualizarInformacionOcurre,
  BuscarOcurresActivosPorFiltro,
} from "../controllers/ocurre.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LOS DATOS DEL USUARIO
router.post("/RegistrarOcurre", ValidarToken, RegistrarOcurre);
// RUTA PARA BUSCAR UN OCURRE POR FILTRO
router.post("/BuscarOcurresPorFiltro", ValidarToken, BuscarOcurresPorFiltro);
// RUTA PARA ACTUALIZAR EL ESTADO DE UNA OCURRE
router.put("/ActualizarEstadoOcurre", ValidarToken, ActualizarEstadoOcurre);
// RUTA PARA ACTUALIZAR LA INFORMACION DE UNA OCURRE
router.put(
  "/ActualizarInformacionOcurre",
  ValidarToken,
  ActualizarInformacionOcurre
);
// RUTA PARA BUSCAR UNA OCURRE ACTIVA POR FILTRO
router.post(
  "/BuscarOcurresActivosPorFiltro",
  ValidarToken,
  BuscarOcurresActivosPorFiltro
);

// EXPORTAMOS EL ENRUTADOR
export default router;
