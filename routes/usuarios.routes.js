// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  RegistrarUsuario,
  BuscarUsuariosParaAdministrarPorFiltro,
  ActualizarEstadoUsuario,
  ActualizarInformacionDeUnUsuario,
  BuscarAgenciasQueTieneElUsuario,
  BuscarAgenciasQueNoTieneElUsuario,
  DesasignarAgenciaAlUsuario,
  AsignarAgenciaAlUsuario,
  ObtenerInformacionDeUnUsuario,
} from "../controllers/usuarios.controllers.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA REGISTRAR UN USUARIO
router.post("/RegistrarUsuario", RegistrarUsuario);
// RUTA PARA BUSCAR LOS USUARIOS A ADMINISTRAR POR FILTRO
router.post(
  "/BuscarUsuariosParaAdministrarPorFiltro",
  BuscarUsuariosParaAdministrarPorFiltro
);
// RUTA PARA ACTUALIZAR EL ESTADO DE UN USUARIO
router.put("/ActualizarEstadoUsuario", ActualizarEstadoUsuario);
// RUTA PARA ACTUALIZAR LA INFORMACIÓN DE UN USUARIO
router.put(
  "/ActualizarInformacionDeUnUsuario",
  ActualizarInformacionDeUnUsuario
);
// RUTA PARA BUSCAR LAS AGENCIAS QUE TIENE EL USUARIO
router.post(
  "/BuscarAgenciasQueTieneElUsuario",
  BuscarAgenciasQueTieneElUsuario
);
// RUTA PARA BUSCAR LAS AGENCIAS QUE NO TIENE EL USUARIO
router.post(
  "/BuscarAgenciasQueNoTieneElUsuario",
  BuscarAgenciasQueNoTieneElUsuario
);
// PETICIÓN PARA ASIGNAR UNA AGENCIA AL USUARIO
router.post("/AsignarAgenciaAlUsuario", AsignarAgenciaAlUsuario);
// PETICIÓN PARA DESASIGNAR UNA AGENCIA AL USUARIO
router.post("/DesasignarAgenciaAlUsuario", DesasignarAgenciaAlUsuario);
// RUTA PARA OBTENER LA INFORMACION DE UN USUARIO
router.post("/ObtenerInformacionDeUnUsuario", ObtenerInformacionDeUnUsuario);

// EXPORTAMOS EL ENRUTADOR
export default router;
