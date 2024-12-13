// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS JWT
import jwt from "jsonwebtoken";
// IMPORTAMOS LA CONFIGURACIÓN PARA RUTAS
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const RutaDeLasImagenes = path.join(__dirname, "../public/Imagenes");
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";
import { ObtenerInformacionDelSistema } from "../helpers/InformacionDelSistema.js";
import { TransportadorCorreo } from "../helpers/Correo.js";
import { DiseñoCorreo } from "../helpers/DiseñoCorreo.js";

// EN ESTA FUNCIÓN VAMOS A VERIFICAR EL TOKEN DE UN USUARIO
// SE UTILIZA EN LAS VISTAS: Todas
export const VerificarToken = async (req, res) => {
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
      const { idUsuario } = InformacionDelToken;
      const InformacionSistema = await ObtenerInformacionDelSistema();
      const InformacionUsuario = await ObtenerInformacionDelUsuario(idUsuario);
      const Informacion = { InformacionSistema, InformacionUsuario };
      return res.status(200).json(Informacion);
    }
  );
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
const ObtenerInformacionDelUsuario = async (idUsuario) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM usuarios WHERE idUsuario = ?`;
    CONEXION.query(sql, [idUsuario], (error, result) => {
      if (error) return reject(error);
      return resolve(result[0]);
    });
  });
};
// EN TODAS LAS VISTAS
export const InformacionDelSistema = async (req, res) => {
  try {
    const { LogoSistema, NombreSistema } = await ObtenerInformacionDelSistema();
    return res.status(200).json({
      LogoSistema,
      NombreSistema,
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
          cid: `LogoSistema`,
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
// SE UTILIZA EN LA VISTA:
// SISTEMA > AJUSTES > ACTUALIZAR LOGO
export const ActualizarLogoSistema = async (req, res) => {
  const { LogoActual } = req.body;
  const ExtensionImagen = path.extname(req.file.originalname).toLowerCase();
  const NuevoNombreLogoSistema = GenerarNuevoNombreDeLogo(ExtensionImagen);

  const Destino = path.join(RutaDeLasImagenes, NuevoNombreLogoSistema);

  await EliminarAntiguoLogo(LogoActual, RutaDeLasImagenes);

  fs.access(Destino, fs.constants.F_OK, function (existe) {
    if (!existe) {
      res
        .status(400)
        .json(
          "¡Vaya! Parece que ya existe una imagen con ese nombre, por favor intente con otra imagen o cambiando el nombre de la imagen."
        );
    } else {
      fs.writeFile(Destino, req.file.buffer, async function (err) {
        if (err) {
          res.status(500).json(MENSAJE_DE_ERROR);
        } else {
          const resImagen = await GuardarEnBDElLogoDelSistema(
            NuevoNombreLogoSistema
          );
          if (resImagen) {
            res
              .status(200)
              .json("¡El logo del sistema se ha actualizado correctamente!");
          } else {
            res.status(500).json(MENSAJE_DE_ERROR);
          }
        }
      });
    }
  });
};
// SE UTILIZA EN LA VISTA:
// SISTEMA > AJUSTES > ACTUALIZAR INFORMACIÓN DEL SISTEMA
export const ActualizarInformacionDelSistema = async (req, res) => {
  const { NombreSistema, CorreoSistema, ContrasenaCorreoSistema } = req.body;
  try {
    const sql = `UPDATE sistema SET NombreSistema = ?, CorreoSistema = ?, ContrasenaCorreoSistema = ?`;
    CONEXION.query(
      sql,
      [NombreSistema, CorreoSistema, ContrasenaCorreoSistema],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res
          .status(200)
          .json("¡La información del sistema se ha actualizado correctamente!");
      }
    );
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const GenerarNuevoNombreDeLogo = (ExtensionImagen) => {
  let Codigo = "";
  for (let i = 0; i < 10; i++) {
    Codigo += Math.floor(Math.random() * 10);
  }
  return `LogoSistema${Codigo}${ExtensionImagen}`;
};
const EliminarAntiguoLogo = (LogoActual, RutaDeLasImagenes) => {
  const RutaLogoActual = path.join(RutaDeLasImagenes, LogoActual);
  return new Promise((resolve, reject) => {
    fs.unlink(RutaLogoActual, (error) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
};
const GuardarEnBDElLogoDelSistema = (NuevoNombreLogoSistema) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE sistema SET LogoSistema = ?`;
    CONEXION.query(sql, [NuevoNombreLogoSistema], async (error, result) => {
      if (error) return reject(error);
      resolve(true);
    });
  });
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
// EN ESTA FUNCIÓN VAMOS A CERRAR SESION
// SE UTILIZA EN LAS VISTAS: Todas
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
