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
      const sql = `SELECT * FROM tiposcarga`;
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
      const sql = `SELECT * FROM tiposenvio`;
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
// SE UTILIZA EN LAS VISTAS: Configuración
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
// SE UTILIZA EN LAS VISTAS: Configuración
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
