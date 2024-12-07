import jwt from "jsonwebtoken";
// IMPORTAMOS EL TRANSPORTER DEL NODEMAILER
import TRANSPORTADOR from "../helpers/Correo.js";
// IMPORTAMOS EL TOKEN CREADO
import { CrearTokenDeAcceso } from "../libs/jwt.js";
import { TOKEN_SECRETO } from "../initial/config.js";
// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_ERROR,
} from "../helpers/Const.js";
// IMPORTAMOS EL DISEÑO DEL CORREO
import { DiseñoCorreo } from "../helpers/DiseñoCorreo.js";
import { CORREO_PARA_EMAILS } from "../initial/config.js";

export const IniciarSesion = (req, res) => {
  try {
    const { Usuario, Contraseña } = req.body;
    const sql = `SELECT * FROM usuarios WHERE Usuario = ? AND Contraseña = ? AND EstadoUsuario = 'Activo'`;
    CONEXION.query(sql, [Usuario, Contraseña], async (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        // CREAMOS EL ID EN UN TOKEN
        const TOKEN_DE_ACCESO_USMX = await CrearTokenDeAcceso({
          idUsuario: result[0].idUsuario,
          Usuario: result[0].Usuario,
          Permisos: result[0].Permisos,
          ModoOscuro: result[0].ModoOscuro,
        });
        // ALMACENAMOS EL TOKEN EN UN COOKIE
        // res.cookie("TOKEN_DE_ACCESO_USMX", TOKEN_DE_ACCESO_USMX);
        res.cookie("TOKEN_DE_ACCESO_USMX", TOKEN_DE_ACCESO_USMX, {
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        });
        const InformacionDelUsuario = {
          idUsuario: result[0].idUsuario,
          Usuario: result[0].Usuario,
          Permisos: result[0].Permisos,
          ModoOscuro: result[0].ModoOscuro,
          TOKEN_DE_ACCESO_USMX,
        };
        // ENVIAMOS EL TOKEN AL CLIENTE
        res.status(200).json(InformacionDelUsuario);
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
export const VerificarToken = async (req, res) => {
  const { TOKEN_DE_ACCESO_USMX } = req.body;

  jwt.verify(
    TOKEN_DE_ACCESO_USMX,
    TOKEN_SECRETO,
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
export const CerrarSesion = async (req, res) => {
  try {
    res.cookie("TOKEN_DE_ACCESO_USMX", "", {
      expires: new Date(0),
    });
    res.status(200).json("¡Tu sesión se ha sido finalizada correctamente!");
  } catch (error) {
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

// SE UTILIZA EN EL SITIO WEB DE USMX
export const EnviarCorreo = async (req, res) => {
  const { NOMBRE, APELLIDOS, CORREO, TELEFONO, MENSAJE } = req.body;
  try {
    await TRANSPORTADOR.sendMail({
      from: `"${NOMBRE} ${APELLIDOS}" <${CORREO}>`,
      to: CORREO_PARA_EMAILS,
      subject: "¡Nuevo mensaje desde el sitio web de USMX! 🦅",
      html: DiseñoCorreo(NOMBRE, APELLIDOS, CORREO, TELEFONO, MENSAJE),
      attachments: [
        {
          filename: "Logo-USMX.png",
          path: "./public/Logo-USMX.png",
          cid: "Logo-USMX",
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
