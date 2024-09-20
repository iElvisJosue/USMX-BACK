// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import { ObtenerProductosPorAgencia } from "../controllers/productos.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LOS PRODUCTOS DE UNA AGENCIA
router.post("/ObtenerProductosPorAgencia", ObtenerProductosPorAgencia);

// EXPORTAMOS EL ENRUTADOR
export default router;
