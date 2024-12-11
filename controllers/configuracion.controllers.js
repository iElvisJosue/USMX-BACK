// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";

// EN ESTA FUNCION VAMOS REGISTRAR UN NUEVO TIPO DE CARGA
// SE UTILIZA EN LAS VISTAS: Configuración > Cargas
export const RegistrarTipoDeCarga = async (req, res) => {
  const { TipoCarga, PorcentajeCarga } = req.body;
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
  const { idCarga } = req.params;
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
  const { TipoEnvio } = req.body;
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
  const { idTipoEnvio } = req.params;
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
  const { idUsuario, ModoOscuro } = req.body;

  const TextoRespuesta = ModoOscuro ? "MODO OSCURO" : "MODO CLARO";

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
// EN ESTA FUNCION VAMOS A OBTENER EL IDIOMA DEL USUARIO
// SE UTILIZA EN LAS VISTAS: Apariencia
export const ObtenerIdioma = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const sql = `SELECT Idioma FROM usuarios WHERE idUsuario = ?`;
    CONEXION.query(sql, [idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A ACTUALIZAR EL IDIOMA DEL USUARIO
// SE UTILIZA EN LAS VISTAS: Apariencia
export const ActualizarIdioma = async (req, res) => {
  const { idUsuario, Idioma } = req.body;

  const TextoRespuesta = Idioma === "es" ? "Español" : "Inglés";

  try {
    const sql = `UPDATE usuarios SET Idioma = ? WHERE idUsuario = ?`;
    CONEXION.query(sql, [Idioma, idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json(
          `¡El idioma ${TextoRespuesta.toUpperCase()} ha sido aplicado correctamente!`
        );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A OBTENER EL MODO OSCURO DEL USUARIO
// SE UTILIZA EN LAS VISTAS: Realizar Pedido > Remitente
export const ObtenerApiGoogleMapsAutoCompletado = async (req, res) => {
  try {
    const sql = `SELECT LlaveApi FROM apis WHERE NombreApi = ?`;
    CONEXION.query(sql, ["Google Maps Autocompletado"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
