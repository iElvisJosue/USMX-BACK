// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS JWT
import jwt from "jsonwebtoken";
import { CrearTokenDeAcceso } from "../libs/jwt.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";
import { ObtenerHoraActual } from "../helpers/Func.js";
import { ObtenerInformacionDelSistema } from "../helpers/InformacionDelSistema.js";

// EN ESTA FUNCIÓN VAMOS A VERIFICAR EL TOKEN DE UN USUARIO
// SE UTILIZA EN LAS VISTAS: Todas
export const VerificarTokenUsuario = async (req, res) => {
  const { TOKEN_DE_ACCESO_USMX } = req.body;

  const { TokenSistema } = await ObtenerInformacionDelSistema();

  jwt.verify(
    TOKEN_DE_ACCESO_USMX,
    TokenSistema,
    async (err, InformacionDelToken) => {
      if (err) {
        return res
          .status(400)
          .json("¡Oops! Parece que tú TOKEN DE ACCESO no es válido.");
      }
      return res.status(200).json(InformacionDelToken);
    }
  );
};
// EN ESTA FUNCIÓN VAMOS A INICIAR SESIÓN DE UN USUARIO
// SE UTILIZA EN LAS VISTAS: Iniciar Sesión
export const IniciarSesionUsuario = (req, res) => {
  try {
    const { Usuario, Contraseña } = req.body;
    const sql = `SELECT * FROM usuarios WHERE Usuario = ? AND Contraseña = ? AND EstadoUsuario = 'Activo'`;
    CONEXION.query(sql, [Usuario, Contraseña], async (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        const INFO_USUARIO = {
          idUsuario: result[0].idUsuario,
          Usuario: result[0].Usuario,
          Correo: result[0].Correo,
          Foto: result[0].Foto,
          Telefono: result[0].Telefono,
          Permisos: result[0].Permisos,
          ModoOscuro: result[0].ModoOscuro,
          FechaCreacionUsuario: result[0].FechaCreacionUsuario,
          HoraCreacionUsuario: result[0].HoraCreacionUsuario,
        };
        // CREAMOS EL ID EN UN TOKEN
        const TOKEN_DE_ACCESO_USMX = await CrearTokenDeAcceso(INFO_USUARIO);
        // ALMACENAMOS EL TOKEN EN UN COOKIE
        // res.cookie("TOKEN_DE_ACCESO_USMX", TOKEN_DE_ACCESO_USMX);
        res.cookie("TOKEN_DE_ACCESO_USMX", TOKEN_DE_ACCESO_USMX, {
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        });
        INFO_USUARIO.TOKEN_DE_ACCESO_USMX = TOKEN_DE_ACCESO_USMX;
        // ENVIAMOS EL TOKEN AL CLIENTE
        res.status(200).json(INFO_USUARIO);
      } else {
        res
          .status(401)
          .json(
            "¡Oops! Parece que el usuario y/o contraseña son incorrectos, por favor verifique e intente de nuevo."
          );
      }
    });
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LA INFORMACION DE UN USUARIO
// SE UTILIZA EN LAS VISTAS: Perfil
export const ObtenerInformacionDeUnUsuario = async (req, res) => {
  const { idUsuario } = req.body;
  try {
    const sql = "SELECT * FROM usuarios WHERE idUsuario = ?";
    CONEXION.query(sql, [idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A REGISTRAR UN USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Registrar Usuario
export const RegistrarUsuario = async (req, res) => {
  const { Usuario, Permisos, Contraseña } = req.body;
  try {
    const sql = `SELECT * FROM usuarios WHERE Usuario = ?`;
    CONEXION.query(sql, [Usuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el usuario ${Usuario.toUpperCase()} ya existe, por favor intente con otro nombre de usuario.`
          );
      } else {
        const sql = `INSERT INTO usuarios (Usuario, Contraseña, Permisos, FechaCreacionUsuario, HoraCreacionUsuario) VALUES (?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
        CONEXION.query(
          sql,
          [Usuario, Contraseña, Permisos],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `¡El usuario ${Usuario.toUpperCase()} ha sido registrado con éxito!`
              );
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS USUARIOS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios
export const BuscarUsuariosParaAdministrarPorFiltro = async (req, res) => {
  const { filtro, idUsuario } = req.body;

  // INICIALIZAMOS LOS PARAMETROS
  let paramBUPAPF = [idUsuario];

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * FROM usuarios WHERE idUsuario != ? ORDER BY idUsuario DESC`;
    } else {
      paramBUPAPF.push(`%${filtro}%`);
      sql = `SELECT * FROM usuarios WHERE idUsuario != ? AND Usuario LIKE ? ORDER BY idUsuario DESC`;
    }
    CONEXION.query(sql, paramBUPAPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DEL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios
export const ActualizarEstadoUsuario = async (req, res) => {
  const { idUsuario, EstadoUsuario } = req.body;

  const TEXTO_ESTADO = EstadoUsuario === "Activo" ? "ACTIVADO" : "DESACTIVADO";

  try {
    const sql = `UPDATE usuarios SET EstadoUsuario = ? WHERE idUsuario = ?`;
    CONEXION.query(sql, [EstadoUsuario, idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(`¡El usuario ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR INFORMACION DE UN USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Editar Usuario
export const ActualizarInformacionDeUnUsuario = async (req, res) => {
  const { idUsuario, Usuario, Permisos, Contraseña } = req.body;
  try {
    const sql = `SELECT * FROM usuarios WHERE Usuario = ? AND idUsuario != ?`;
    CONEXION.query(sql, [Usuario, idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que el usuario ${Usuario.toUpperCase()} ya existe, por favor intente con otro nombre de usuario.`
          );
      } else {
        const sql = `UPDATE usuarios SET Usuario = ?, Permisos = ?, Contraseña = ? WHERE idUsuario = ?`;
        CONEXION.query(
          sql,
          [Usuario, Permisos, Contraseña, idUsuario],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res.status(200).json(`¡El usuario ha sido actualizado con éxito!`);
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const BuscarAgenciasQueTieneElUsuario = async (req, res) => {
  const { idUsuario } = req.body;
  try {
    const sql = `SELECT * FROM union_usuarios_agencias uua LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia WHERE uua.idUsuario = ? AND a.StatusAgencia = ? ORDER BY a.NombreAgencia = "USMX Express" DESC, a.idAgencia DESC`;
    CONEXION.query(sql, [idUsuario, "Activa"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE NO TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const BuscarAgenciasQueNoTieneElUsuario = async (req, res) => {
  const { filtro, idUsuario } = req.body;

  // INICIALIZAMOS PARAMETROS
  let paramBAQNTEU = ["Activa", idUsuario];

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * 
          FROM agencias 
          WHERE StatusAgencia = ? AND idAgencia NOT IN (SELECT idAgencia FROM union_usuarios_agencias WHERE idUsuario = ?) 
          ORDER BY NombreAgencia = "USMX Express" DESC, idAgencia DESC`;
    } else {
      paramBAQNTEU.unshift(`%${filtro}%`);
      sql = `SELECT * 
          FROM agencias 
          WHERE NombreAgencia LIKE ?  
          AND StatusAgencia = ?
          AND idAgencia NOT IN (SELECT idAgencia FROM union_usuarios_agencias WHERE idUsuario = ?) 
          ORDER BY idAgencia ASC`;
    }
    CONEXION.query(sql, paramBAQNTEU, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ASIGNAR UNA AGENCIA AL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const AsignarAgenciaAlUsuario = async (req, res) => {
  const { idUsuario, idAgencia } = req.body;
  try {
    const sql = `INSERT INTO union_usuarios_agencias (idUsuario, idAgencia) VALUES (?,?)`;
    CONEXION.query(sql, [idUsuario, idAgencia], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json("¡La agencia ha sido asignada con éxito al usuario!");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A DESASIGNAR UNA AGENCIA AL USUARIO
// SE UTILIZA EN LAS VISTAS:
// Usuarios > Administrar Usuarios > Administrar Agencias
export const DesasignarAgenciaAlUsuario = async (req, res) => {
  const { idUnionAgencia } = req.body;
  try {
    const sql = `DELETE FROM union_usuarios_agencias WHERE idUnionUsuariosAgencias = ?`;
    CONEXION.query(sql, [idUnionAgencia], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json("¡La agencia ha sido desasignada con éxito del usuario!");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A CERRAR SESION
// SE UTILIZA EN LAS VISTAS: Todas
export const CerrarSesionUsuario = async (req, res) => {
  try {
    res.cookie("TOKEN_DE_ACCESO_USMX", "", {
      expires: new Date(0),
    });
    res.status(200).json("¡Tu sesión se ha sido finalizada correctamente!");
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
