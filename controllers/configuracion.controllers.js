// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import { ValidarTokenParaPeticion } from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A OBTENER LOS TIPOS DE CARGA
// SE UTILIZA EN LAS VISTAS: Paquetería > Registrar Productos > Pedido
export const ObtenerTiposDeCarga = async (req, res) => {
  const { CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (RespuestaValidacionToken) {
    try {
      const sql = `SELECT * FROM tiposcarga ORDER BY idCarga DESC`;
      CONEXION.query(sql, (error, result) => {
        if (error) throw error;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(MENSAJE_DE_ERROR);
    }
  } else {
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS TIPOS DE ENVIO
// SE UTILIZA EN LAS VISTAS: Paquetería > Registrar Productos > Pedido
export const ObtenerTiposDeEnvio = async (req, res) => {
  const { CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (RespuestaValidacionToken) {
    try {
      const sql = `SELECT * FROM tiposenvio ORDER BY idTipoEnvio DESC`;
      CONEXION.query(sql, (error, result) => {
        if (error) throw error;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(MENSAJE_DE_ERROR);
    }
  } else {
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }
};
// EN ESTA FUNCION VAMOS A OBTENER EL MODO OSCURO DEL USUARIO
// SE UTILIZA EN LAS VISTAS: Configuración > Apariencia
export const ObtenerModoOscuro = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const sql = `SELECT ModoOscuro FROM usuarios WHERE idUsuario = ?`;
    CONEXION.query(sql, [idUsuario], (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A ACTUALIZAR EL MODO OSCURO DEL USUARIO
// SE UTILIZA EN LAS VISTAS: Configuración > Apariencia
export const ActualizarModoOscuro = async (req, res) => {
  const { CookieConToken, idUsuario, ModoOscuro } = req.body;

  const TextoRespuesta = ModoOscuro ? "MODO OSCURO" : "MODO CLARO";

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE usuarios SET ModoOscuro = ? WHERE idUsuario = ?`;
    CONEXION.query(sql, [ModoOscuro, idUsuario], (error, result) => {
      if (error) throw error;
      res
        .status(200)
        .json(`El ${TextoRespuesta} ha sido aplicado correctamente ✨`);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS REGISTRAR UN NUEVO TIPO DE CARGA
// SE UTILIZA EN LAS VISTAS: Configuración > Cargas
export const RegistrarTipoDeCarga = async (req, res) => {
  const { CookieConToken, TipoCarga, PorcentajeCarga } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposcarga WHERE TipoCarga = ?`;
    CONEXION.query(sql, [TipoCarga], (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        return res
          .status(500)
          .json(`El tipo de carga ${TipoCarga.toUpperCase()} ya existe ❌`);
      } else {
        const sql = `INSERT INTO tiposcarga (TipoCarga, PorcentajeCarga) VALUES (?, ?)`;
        CONEXION.query(sql, [TipoCarga, PorcentajeCarga], (error, result) => {
          if (error) throw error;
          res
            .status(200)
            .json(
              `La carga ${TipoCarga.toUpperCase()} ha sido registrada correctamente ✨`
            );
        });
      }
    });
  } catch (error) {
    console.error(error);
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
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM tiposcarga WHERE idCarga = ?`;
    CONEXION.query(sql, [idCarga], (error, result) => {
      if (error) throw error;
      res.status(200).json("La carga ha sido eliminada correctamente ✨");
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
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM tiposenvio WHERE TipoEnvio = ?`;
    CONEXION.query(sql, [TipoEnvio], (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        return res
          .status(500)
          .json(`El tipo de envio ${TipoEnvio.toUpperCase()} ya existe ❌`);
      } else {
        const sql = `INSERT INTO tiposenvio (TipoEnvio) VALUES (?)`;
        CONEXION.query(sql, [TipoEnvio], (error, result) => {
          if (error) throw error;
          res
            .status(200)
            .json(
              `El tipo de envio ${TipoEnvio.toUpperCase()} ha sido registrado correctamente ✨`
            );
        });
      }
    });
  } catch (error) {
    console.error(error);
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
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM tiposenvio WHERE idTipoEnvio = ?`;
    CONEXION.query(sql, [idTipoEnvio], (error, result) => {
      if (error) throw error;
      res
        .status(200)
        .json("El tipo de envio ha sido eliminado correctamente ✨");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
