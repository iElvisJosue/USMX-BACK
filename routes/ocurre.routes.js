// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarOcurre,
  BuscarOcurresPorFiltro,
  ActualizarEstadoOcurre,
  ActualizarInformacionOcurre,
} from "../controllers/ocurre.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LOS DATOS DEL USUARIO
router.post("/RegistrarOcurre", RegistrarOcurre);
// RUTA PARA BUSCAR UN OCURRE POR FILTRO
router.post("/BuscarOcurresPorFiltro", BuscarOcurresPorFiltro);
// RUTA PARA ACTUALIZAR EL ESTADO DE UNA OCURRE
router.put("/ActualizarEstadoOcurre", ActualizarEstadoOcurre);
// RUTA PARA ACTUALIZAR LA INFORMACION DE UNA OCURRE
router.put("/ActualizarInformacionOcurre", ActualizarInformacionOcurre);

// EXPORTAMOS EL ENRUTADOR
export default router;
