// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import {
  ObtenerHoraActual,
  ValidarTokenParaPeticion,
} from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UN USUARIO
// SE UTILIZA EN LAS VISTAS: Usuarios > Registrar Usuario
export const RegistrarUsuario = async (req, res) => {
  const { Usuario, Permisos, Contraseña, CookieConToken } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql = `SELECT * FROM usuarios WHERE Usuario = '${Usuario}'`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        res
          .status(500)
          .json(
            `El usuario ${Usuario.toUpperCase()} ya existe, por favor intente con otro nombre de usuario ❌`
          );
      } else {
        const sql = `INSERT INTO usuarios (Usuario, Contraseña, Permisos, FechaCreacionUsuario, HoraCreacionUsuario) VALUES (
                '${Usuario}',
                '${Contraseña}',
                '${Permisos}',
                CURDATE(),
                '${ObtenerHoraActual()}'
                )`;
        CONEXION.query(sql, (error, result) => {
          if (error) throw error;
          res
            .status(200)
            .json(
              `El usuario ${Usuario.toUpperCase()} ha sido registrado correctamente ✨`
            );
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS USUARIO POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS: Usuarios > Asignar Agencia
export const BuscarUsuariosPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM usuarios WHERE Permisos != 'Administrador' ORDER BY idUsuario DESC`
        : `SELECT * FROM usuarios WHERE Usuario LIKE '%${filtro}%' AND Permisos != 'Administrador' ORDER BY idUsuario DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS: Usuarios > Asignar Agencia
export const BuscarAgenciasQueTieneElUsuario = async (req, res) => {
  const { CookieConToken, idUsuario } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM union_usuarios_agencias uua LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia WHERE uua.idUsuario = ${idUsuario}`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE NO TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS: Usuarios > Asignar Agencia
export const BuscarAgenciasQueNoTieneElUsuario = async (req, res) => {
  const { CookieConToken, filtro, idUsuario } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * 
          FROM agencias 
          WHERE idAgencia NOT IN (SELECT idAgencia FROM union_usuarios_agencias WHERE idUsuario = ${idUsuario})`
        : `SELECT * 
          FROM agencias 
          WHERE NombreAgencia LIKE '%${filtro}%' 
          AND idAgencia NOT IN (SELECT idAgencia FROM union_usuarios_agencias WHERE idUsuario = ${idUsuario})`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ASIGNAR UNA AGENCIA AL USUARIO
// SE UTILIZA EN LAS VISTAS: Usuarios > Asignar Agencia
export const AsignarAgenciaAlUsuario = async (req, res) => {
  const { CookieConToken, idUsuario, idAgencia } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `INSERT INTO union_usuarios_agencias (idUsuario, idAgencia) VALUES (${idUsuario}, ${idAgencia})`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json("La agencia ha sido asignada con éxito ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A DESASIGNAR UNA AGENCIA AL USUARIO
// SE UTILIZA EN LAS VISTAS: Usuarios > Asignar Agencia
export const DesasignarAgenciaAlUsuario = async (req, res) => {
  const { CookieConToken, idUnionAgencia } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM union_usuarios_agencias WHERE idUnionUsuariosAgencias  = ${idUnionAgencia}`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json("La agencia ha sido desasignada con éxito ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
