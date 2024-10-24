// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import { ValidarTokenParaPeticion } from "../helpers/Func.js";

// EN ESTA FUNCION VAMOS REGISTRAR UN NUEVO TIPO DE CARGA
// SE UTILIZA EN LAS VISTAS: Configuración > Cargas
export const RegistrarTipoDeCarga = async (req, res) => {
  const { CookieConToken, TipoCarga, PorcentajeCarga } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposcarga WHERE TipoCarga = ?`;
    CONEXION.query(sql, [TipoCarga], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        return res
          .status(409)
          .json(
            `¡Oops! Parece que el tipo de carga ${TipoCarga.toUpperCase()} ya existe, por favor elija otro tipo de carga!`
          );
      } else {
        const sql = `INSERT INTO tiposcarga (TipoCarga, PorcentajeCarga) VALUES (?, ?)`;
        CONEXION.query(sql, [TipoCarga, PorcentajeCarga], (error, result) => {
          if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
          res
            .status(200)
            .json(
              `¡La carga ${TipoCarga.toUpperCase()} ha sido registrada correctamente!`
            );
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS TIPOS DE CARGA
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Realizar Pedido > Detalles del pedido
export const ObtenerTiposDeCarga = async (req, res) => {
  const { CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposcarga ORDER BY idCarga DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS ELIMINAR UN TIPO DE CARGA
// SE UTILIZA EN LAS VISTAS: Configuración > Cargas
export const EliminarTipoDeCarga = async (req, res) => {
  const { CookieConToken, idCarga } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM tiposcarga WHERE idCarga = ?`;
    CONEXION.query(sql, [idCarga], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json("¡La carga ha sido eliminada correctamente!");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS REGISTRAR UN NUEVO TIPO DE ENVIO
// SE UTILIZA EN LAS VISTAS: Configuración > Envios
export const RegistrarTipoDeEnvio = async (req, res) => {
  const { CookieConToken, TipoEnvio } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposenvio WHERE TipoEnvio = ?`;
    CONEXION.query(sql, [TipoEnvio], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        return res
          .status(409)
          .json(
            `¡Oops! Parece que el tipo de envío ${TipoEnvio.toUpperCase()} ya existe, por favor elija otro tipo de envío!`
          );
      } else {
        const sql = `INSERT INTO tiposenvio (TipoEnvio) VALUES (?)`;
        CONEXION.query(sql, [TipoEnvio], (error, result) => {
          if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
          res
            .status(200)
            .json(
              `¡El tipo de envio ${TipoEnvio.toUpperCase()} ha sido registrado correctamente!`
            );
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS TIPOS DE ENVIO
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Realizar Pedido > Detalles del pedido
export const ObtenerTiposDeEnvio = async (req, res) => {
  const { CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposenvio ORDER BY idTipoEnvio DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS ELIMINAR UN TIPO DE ENVIO
// SE UTILIZA EN LAS VISTAS: Configuración > Envios
export const EliminarTipoDeEnvio = async (req, res) => {
  const { CookieConToken, idTipoEnvio } = req.params;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM tiposenvio WHERE idTipoEnvio = ?`;
    CONEXION.query(sql, [idTipoEnvio], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json("¡El tipo de envio ha sido eliminado correctamente!");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A OBTENER EL MODO OSCURO DEL USUARIO
// SE UTILIZA EN LAS VISTAS: Apariencia
export const ObtenerModoOscuro = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const sql = `SELECT ModoOscuro FROM usuarios WHERE idUsuario = ?`;
    CONEXION.query(sql, [idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A ACTUALIZAR EL MODO OSCURO DEL USUARIO
// SE UTILIZA EN LAS VISTAS: Apariencia
export const ActualizarModoOscuro = async (req, res) => {
  const { CookieConToken, idUsuario, ModoOscuro } = req.body;

  const TextoRespuesta = ModoOscuro ? "MODO OSCURO" : "MODO CLARO";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE usuarios SET ModoOscuro = ? WHERE idUsuario = ?`;
    CONEXION.query(sql, [ModoOscuro, idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json(`¡El ${TextoRespuesta} ha sido aplicado correctamente!`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PAISES POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Paises > Administrar Paises
export const BuscarPaisesPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  // INICIALIZAMOS LOS PARAMETROS
  let paramsBPPF = ["Activo"];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * FROM paises ORDER BY ActivoPais = ? DESC`;
    } else {
      paramsBPPF.unshift(`%${filtro}%`, `%${filtro}%`);
      sql = `SELECT * FROM paises WHERE NombrePais LIKE ? OR CodigoPais LIKE ? ORDER BY ActivoPais = ? DESC`;
    }
    CONEXION.query(sql, paramsBPPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS ESTADOS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Estados > Administrar Estados
export const BuscarEstadosPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  // INICIALIZAMOS LOS PARAMETROS
  let paramsBEPF = ["Activo"];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * FROM estados ORDER BY ActivoEstado = ? DESC`;
    } else {
      paramsBEPF.unshift(`%${filtro}%`, `%${filtro}%`);
      sql = `SELECT * FROM estados WHERE NombreEstado LIKE ? OR CodigoPais LIKE ? ORDER BY ActivoEstado = ? DESC`;
    }
    CONEXION.query(sql, paramsBEPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS CIUDADES POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Ciudades > Administrar Ciudades
export const BuscarCiudadesPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  // INICIALIZAMOS LOS PARAMETROS
  let paramsBCPF = ["Activa"];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT c.*, e.NombreEstado FROM ciudades c JOIN estados e ON c.idEstado = e.idEstado ORDER BY ActivaCiudad = ? DESC`;
    } else {
      paramsBCPF.unshift(`%${filtro}%`);
      sql = `SELECT c.*, e.NombreEstado FROM ciudades c JOIN estados e ON c.idEstado = e.idEstado WHERE NombreCiudad LIKE ? ORDER BY ActivaCiudad = ? DESC`;
    }
    CONEXION.query(sql, paramsBCPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS COLONIAS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Colonias > Administrar Colonias
export const BuscarColoniasPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  // INICIALIZAMOS LOS PARAMETROS
  let paramsBCPF = ["Activa"];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * FROM colonias ORDER BY ActivaColonia = ? DESC LIMIT 1000`;
    } else {
      paramsBCPF.unshift(`%${filtro}%`, `%${filtro}%`);
      sql = `SELECT * FROM colonias WHERE NombreColonia LIKE ? OR NombreRegionUnoColonia LIKE ? ORDER BY ActivaColonia = ? DESC LIMIT 1000`;
    }
    CONEXION.query(sql, paramsBCPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
