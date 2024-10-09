// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import { RegistrarOcurre } from "../controllers/ocurre.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LOS DATOS DEL USUARIO
router.post("/RegistrarOcurre", RegistrarOcurre);

// EXPORTAMOS EL ENRUTADOR
export default router;
