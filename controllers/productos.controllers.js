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

// EN ESTA FUNCIÓN VAMOS A OBTENER LOS PRODUCTOS POR UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Registrar Productos > Pedido
// Agencias > Asignar Productos
export const ObtenerProductosPorAgencia = async (req, res) => {
  const { idAgencia, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (RespuestaValidacionToken) {
    try {
      const sql = `SELECT 
      p.NombreProducto,
      p.AnchoProducto,
      p.LargoProducto,
      p.AltoProducto,
      p.idProducto,
      uap.PrecioProducto,
      uap.ComisionProducto,
      uap.LibraExtraProducto,
      uap.PesoSinCobroProducto,
      uap.PesoMaximoProducto
      FROM union_agencias_productos uap
      LEFT JOIN productos p ON uap.idProducto = p.idProducto
      WHERE uap.idAgencia = ${idAgencia};`;
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
