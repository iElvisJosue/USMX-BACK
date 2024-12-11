// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";
import { ObtenerInformacionDelSistema } from "../helpers/InformacionDelSistema.js";
import { TransportadorCorreo } from "../helpers/Correo.js";
import { DiseñoCorreo } from "../helpers/DiseñoCorreo.js";

// EN TODAS LAS VISTAS
export const InformacionDelSistema = async (req, res) => {
  try {
    const {
      LogoSistema,
      NombreSistema,
      CorreoSistema,
      ContrasenaCorreoSistema,
    } = await ObtenerInformacionDelSistema();
    return res.status(200).json({
      LogoSistema,
      NombreSistema,
      CorreoSistema,
      ContrasenaCorreoSistema,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// SE UTILIZA EN EL SITIO WEB DE USMX
export const EnviarCorreo = async (req, res) => {
  const { NOMBRE, APELLIDOS, CORREO, TELEFONO, MENSAJE } = req.body;
  const { LogoSistema, NombreSistema, CorreoSistema } =
    await ObtenerInformacionDelSistema();
  const TRANSPORTADOR = await TransportadorCorreo();
  try {
    await TRANSPORTADOR.sendMail({
      from: `"${NOMBRE} ${APELLIDOS}" <${CORREO}>`,
      to: CorreoSistema,
      subject: `¡Nuevo mensaje desde el sitio web de ${NombreSistema}!`,
      html: DiseñoCorreo(
        NOMBRE,
        APELLIDOS,
        CORREO,
        TELEFONO,
        MENSAJE,
        NombreSistema
      ),
      attachments: [
        {
          filename: LogoSistema,
          path: `../public/Imagenes/${LogoSistema}`,
          cid: `Logo-${NombreSistema}`,
        },
      ],
    });
    console.log("¡El correo se ha enviado correctamente!");
    res.status(200).json("¡El correo se ha enviado correctamente!");
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LAS VISTAS:
// BIENVEDIDA
export const ObtenerResumenDiario = async (req, res) => {
  const { FechaDeHoy } = req.params;
  try {
    const PedidosDeHoy = await PedidosHechosHoy(FechaDeHoy);
    const RecoleccionesDeHoy = await RecoleccionesHechasHoy(FechaDeHoy);
    const EntradasDeHoy = await EntradasHechasHoy(FechaDeHoy);
    const MovimientosDeHoy = await MovimientosHechosHoy(FechaDeHoy);
    const SalidasDeHoy = await SalidasHechasHoy(FechaDeHoy);
    const DevolucionesDeHoy = await DevolucionesHechasHoy(FechaDeHoy);
    res.status(200).json({
      PedidosDeHoy,
      RecoleccionesDeHoy,
      EntradasDeHoy,
      MovimientosDeHoy,
      SalidasDeHoy,
      DevolucionesDeHoy,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const PedidosHechosHoy = async (FechaDeHoy) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM pedidos WHERE FechaCreacionPedido BETWEEN ? AND ?`;
      CONEXION.query(sql, [FechaDeHoy, FechaDeHoy], (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        resolve(result.length);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const RecoleccionesHechasHoy = async (FechaDeHoy) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM recolecciones WHERE FechaCreacionRecoleccion BETWEEN ? AND ?`;
      CONEXION.query(sql, [FechaDeHoy, FechaDeHoy], (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        resolve(result.length);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const EntradasHechasHoy = async (FechaDeHoy) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM entradasbodega WHERE FechaCreacionEntrada BETWEEN ? AND ?`;
      CONEXION.query(sql, [FechaDeHoy, FechaDeHoy], (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        resolve(result.length);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const MovimientosHechosHoy = async (FechaDeHoy) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM movimientosbodega WHERE FechaCreacionMovimientoBodega BETWEEN ? AND ?`;
      CONEXION.query(sql, [FechaDeHoy, FechaDeHoy], (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        resolve(result.length);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const SalidasHechasHoy = async (FechaDeHoy) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM salidasbodega WHERE FechaCreacionSalida BETWEEN ? AND ?`;
      CONEXION.query(sql, [FechaDeHoy, FechaDeHoy], (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        resolve(result.length);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const DevolucionesHechasHoy = async (FechaDeHoy) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM devoluciones WHERE FechaCreacionDevolucion BETWEEN ? AND ?`;
      CONEXION.query(sql, [FechaDeHoy, FechaDeHoy], (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        resolve(result.length);
      });
    } catch (error) {
      reject(error);
    }
  });
};
