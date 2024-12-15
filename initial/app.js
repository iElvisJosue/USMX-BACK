// IMPORTAMOS CONFIGURACIÓN DE VARIABLES DE ENTORNO
import "dotenv/config";
// IMPORTAMOS EXPRESS
import express from "express";
// IMPORTAMOS POLÍTICAS DE CORS
import cors from "cors";
// IMPORTAMOS COOKIE PARSER
import cookieParser from "cookie-parser";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE SISTEMA
import sistemaRoutes from "../routes/sistema.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE PEDIDOS
import pedidosRoutes from "../routes/pedidos.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE AGENCIAS
import agenciasRoutes from "../routes/agencias.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE BODEGA
import bodegaRoutes from "../routes/bodega.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE RECOLECCIONES
import recoleccionesRoutes from "../routes/recolecciones.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE PRODUCTOS
import productosRoutes from "../routes/productos.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE USUARIOS
import usuariosRoutes from "../routes/usuarios.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE OPERACIONES
import operacionesRoutes from "../routes/operaciones.routes.js";
// IMPORTAMOS LAS RUTAS PARA PROCESOS DE OCURRENCIAS
import ocurreRoutes from "../routes/ocurre.routes.js";

// CONFIGURAMOS EL PATH
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = [
  "https://usmxxpress.com",
  "https://www.usmxxpress.net",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
];

// APLICAMOS CORS
app.use(cors({ origin: allowedOrigins, credentials: true }));

// DEFINIMOS LA RUTA DE NUESTRAS IMÁGENES
app.set("public", path.join(__dirname, "public"));
// DEFINIMOS LA RUTA PARA SER ACCESIBLE DESDE EL NAVEGADOR
app.use(express.static(path.join(__dirname, "../public")));

// Middleware para analizar solicitudes con cuerpo JSON
app.use(express.json());

// APLICAMOS EL VISUALIZADO DE COOKIES
app.use(cookieParser());

app.use("/api/sistema", sistemaRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/agencias", agenciasRoutes);
app.use("/api/bodega", bodegaRoutes);
app.use("/api/recolecciones", recoleccionesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/operaciones", operacionesRoutes);
app.use("/api/ocurre", ocurreRoutes);

export default app;
