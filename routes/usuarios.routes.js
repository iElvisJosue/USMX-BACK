// IMPORTAMOS EL ENRUTADOR
import { Router } from "express";
// IMPORTAMOS LAS CONSULTAS
import {
  ObtenerInformacionDeUnUsuario,
  RegistrarUsuario,
  BuscarUsuariosParaAdministrarPorFiltro,
  ActualizarEstadoUsuario,
  ActualizarInformacionDeUnUsuario,
  BuscarAgenciasQueTieneElUsuario,
  BuscarAgenciasQueNoTieneElUsuario,
  DesasignarAgenciaAlUsuario,
  AsignarAgenciaAlUsuario,
} from "../controllers/usuarios.controllers.js";
// IMPORTAMOS EL MIDDLEWARE PARA VERIFICAR QUE TENGAS UN TOKEN DE ACCESO
import { ValidarToken } from "../middlewares/ValidarToken.js";

// ALMACENAMOS EL ENRUTADOR
const router = Router();

// RUTA PARA OBTENER LA INFORMACION DE UN USUARIO
router.post(
  "/ObtenerInformacionDeUnUsuario",
  ValidarToken,
  ObtenerInformacionDeUnUsuario
);
// RUTA PARA REGISTRAR UN USUARIO
router.post("/RegistrarUsuario", ValidarToken, RegistrarUsuario);
// RUTA PARA BUSCAR LOS USUARIOS A ADMINISTRAR POR FILTRO
router.post(
  "/BuscarUsuariosParaAdministrarPorFiltro",
  ValidarToken,
  BuscarUsuariosParaAdministrarPorFiltro
);
// RUTA PARA ACTUALIZAR EL ESTADO DE UN USUARIO
router.put("/ActualizarEstadoUsuario", ValidarToken, ActualizarEstadoUsuario);
// RUTA PARA ACTUALIZAR LA INFORMACIÓN DE UN USUARIO
router.put(
  "/ActualizarInformacionDeUnUsuario",
  ValidarToken,
  ActualizarInformacionDeUnUsuario
);
// RUTA PARA BUSCAR LAS AGENCIAS QUE TIENE EL USUARIO
router.post(
  "/BuscarAgenciasQueTieneElUsuario",
  ValidarToken,
  BuscarAgenciasQueTieneElUsuario
);
// RUTA PARA BUSCAR LAS AGENCIAS QUE NO TIENE EL USUARIO
router.post(
  "/BuscarAgenciasQueNoTieneElUsuario",
  ValidarToken,
  BuscarAgenciasQueNoTieneElUsuario
);
// PETICIÓN PARA ASIGNAR UNA AGENCIA AL USUARIO
router.post("/AsignarAgenciaAlUsuario", ValidarToken, AsignarAgenciaAlUsuario);
// PETICIÓN PARA DESASIGNAR UNA AGENCIA AL USUARIO
router.post(
  "/DesasignarAgenciaAlUsuario",
  ValidarToken,
  DesasignarAgenciaAlUsuario
);

// EXPORTAMOS EL ENRUTADOR
export default router;
