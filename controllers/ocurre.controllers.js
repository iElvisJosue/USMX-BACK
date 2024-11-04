// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";

// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import {
  ValidarTokenParaPeticion,
  ObtenerHoraActual,
} from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UNA OCURRE
// SE UTILIZA EN LAS VISTAS:
// Ocurres > Registrar Ocurre
export const RegistrarOcurre = async (req, res) => {
  const {
    CookieConToken,
    NombreOcurre,
    OperadorLogisticoOcurre,
    TelefonoUnoOcurre,
    TelefonoDosOcurre,
    CorreoOcurre,
    PaisOcurre,
    CodigoPaisOcurre,
    EstadoOcurre,
    CodigoEstadoOcurre,
    CiudadOcurre,
    CodigoPostalOcurre,
    DireccionOcurre,
    ReferenciaOcurre,
    ObservacionesOcurre,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sqlVerificar = `SELECT * FROM ocurres WHERE NombreOcurre = ?;`;
    CONEXION.query(sqlVerificar, [NombreOcurre], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        return res
          .status(409)
          .json(
            `¡Oops! Parece que la ocurrencia ${NombreOcurre.toUpperCase()} ya existe, por favor intente con otro nombre de ocurrencia.`
          );
      } else {
        const sql = `INSERT INTO ocurres (NombreOcurre, OperadorLogisticoOcurre, TelefonoUnoOcurre, TelefonoDosOcurre, CorreoOcurre, PaisOcurre, CodigoPaisOcurre, EstadoOcurre, CodigoEstadoOcurre, CiudadOcurre, CodigoPostalOcurre, DireccionOcurre, ReferenciaOcurre, ObservacionesOcurre, FechaCreacionOcurre, HoraCreacionOcurre) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURDATE(), '${ObtenerHoraActual()}') `;
        CONEXION.query(
          sql,
          [
            NombreOcurre || "",
            OperadorLogisticoOcurre || "",
            TelefonoUnoOcurre || "",
            TelefonoDosOcurre || "",
            CorreoOcurre || "",
            PaisOcurre || "",
            CodigoPaisOcurre || "",
            EstadoOcurre || "",
            CodigoEstadoOcurre || "",
            CiudadOcurre || "",
            CodigoPostalOcurre || "",
            DireccionOcurre || "",
            ReferenciaOcurre || "",
            ObservacionesOcurre || "",
          ],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res
              .status(200)
              .json(
                `¡La ocurrencia ${NombreOcurre.toUpperCase()} ha sido registrado correctamente!`
              );
          }
        );
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS OCURRE POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Ocurres > Administrar Ocurres
export const BuscarOcurresPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM ocurres ORDER BY idOcurre DESC`
        : `SELECT * FROM ocurres WHERE NombreOcurre LIKE ? OR OperadorLogisticoOcurre LIKE ? ORDER BY idOcurre DESC`;
    CONEXION.query(sql, [`%${filtro}%`, `%${filtro}%`], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DE UN OCURRE
// SE UTILIZA EN LAS VISTAS:
// Ocurres > Administrar Ocurres
export const ActualizarEstadoOcurre = async (req, res) => {
  const { CookieConToken, idOcurre, StatusOcurre } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  const TEXTO_ESTADO = StatusOcurre === "Activa" ? "ACTIVADA" : "DESACTIVADA";

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE ocurres SET StatusOcurre = ? WHERE idOcurre = ?`;
    CONEXION.query(sql, [StatusOcurre, idOcurre], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(`¡La ocurrencia ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A ACTUALIZAR LA INFORMACIÓN DE UN OCURRE
// SE UTILIZA EN LAS VISTAS:
// Ocurres > Administrar Ocurres > Editar Ocurre
export const ActualizarInformacionOcurre = async (req, res) => {
  const {
    CookieConToken,
    idOcurre,
    NombreOcurre,
    OperadorLogisticoOcurre,
    TelefonoUnoOcurre,
    TelefonoDosOcurre,
    CorreoOcurre,
    PaisOcurre,
    CodigoPaisOcurre,
    EstadoOcurre,
    CodigoEstadoOcurre,
    CiudadOcurre,
    CodigoPostalOcurre,
    DireccionOcurre,
    ReferenciaOcurre,
    ObservacionesOcurre,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sqlValidar = `SELECT * FROM ocurres WHERE NombreOcurre = ? AND idOcurre != ?`;
    CONEXION.query(sqlValidar, [NombreOcurre, idOcurre], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res
          .status(409)
          .json(
            `¡Oops! Parece que la ocurrencia ${NombreOcurre.toUpperCase()} ya existe, por favor intente con otro nombre de ocurrencia.`
          );
      } else {
        const sql = `UPDATE ocurres SET NombreOcurre = ?, OperadorLogisticoOcurre = ?, TelefonoUnoOcurre = ?, TelefonoDosOcurre = ?, CorreoOcurre = ?, PaisOcurre = ?, CodigoPaisOcurre = ?, EstadoOcurre = ?, CodigoEstadoOcurre = ?, CiudadOcurre = ?, CodigoPostalOcurre = ?, DireccionOcurre = ?, ReferenciaOcurre = ?, ObservacionesOcurre = ? WHERE idOcurre = ?`;
        CONEXION.query(
          sql,
          [
            NombreOcurre || "",
            OperadorLogisticoOcurre || "",
            TelefonoUnoOcurre || "",
            TelefonoDosOcurre || "",
            CorreoOcurre || "",
            PaisOcurre || "",
            CodigoPaisOcurre || "",
            EstadoOcurre || "",
            CodigoEstadoOcurre || "",
            CiudadOcurre || "",
            CodigoPostalOcurre || "",
            DireccionOcurre || "",
            ReferenciaOcurre || "",
            ObservacionesOcurre || "",
            idOcurre,
          ],
          (error, result) => {
            if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
            res
              .status(200)
              .json(
                `¡La ocurrencia ${NombreOcurre.toUpperCase()} ha sido actualizada con éxito!`
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
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS OCURRE POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Realizar Pedido > Destinatario > Seleccionar Ocurre
export const BuscarOcurresActivosPorFiltro = async (req, res) => {
  const { CookieConToken, filtro } = req.body;

  // INICIALIZAMOS LOS PARAMETROS
  let paramsBOAPF = ["Activa"];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken) {
    res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }
  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT * FROM ocurres WHERE StatusOcurre = ? ORDER BY idOcurre DESC`;
    } else {
      paramsBOAPF.push(`%${filtro}%`);
      sql = `SELECT * FROM ocurres WHERE StatusOcurre = ? AND NombreOcurre LIKE ? ORDER BY idOcurre DESC`;
    }
    CONEXION.query(sql, paramsBOAPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
