// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";

// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import {
  ValidarTokenParaPeticion,
  ObtenerHoraActual,
} from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UNA OCURRE
// SE UTILIZA EN LAS VISTAS: Ocurres > Registrar Ocurre
export const RegistrarOcurre = async (req, res) => {
  const {
    CookieConToken,
    NombreOcurre,
    OperadorLogisticoOcurre,
    TelefonoOcurre,
    CorreoOcurre,
    ColoniaOcurre,
    MunicipioDelegacionOcurre,
    CodigoPostalOcurre,
    CiudadOcurre,
    EstadoOcurre,
    DireccionOcurre,
    ReferenciaOcurre,
    ObservacionesOcurre,
  } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sqlVerificar = `SELECT * FROM ocurres WHERE NombreOcurre = '${NombreOcurre}';`;
    CONEXION.query(sqlVerificar, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        return res
          .status(500)
          .json(`La ocurrencia ${NombreOcurre.toUpperCase()} ya existe ❌`);
      } else {
        const sql = `INSERT INTO ocurres (NombreOcurre, OperadorLogisticoOcurre, TelefonoOcurre, CorreoOcurre, ColoniaOcurre, MunicipioDelegacionOcurre, CodigoPostalOcurre, CiudadOcurre, EstadoOcurre, DireccionOcurre, ReferenciaOcurre, ObservacionesOcurre, FechaCreacionOcurre, HoraCreacionOcurre) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, CURDATE(), '${ObtenerHoraActual()}') `;
        CONEXION.query(
          sql,
          [
            NombreOcurre,
            OperadorLogisticoOcurre,
            TelefonoOcurre,
            CorreoOcurre,
            ColoniaOcurre,
            MunicipioDelegacionOcurre,
            CodigoPostalOcurre,
            CiudadOcurre,
            EstadoOcurre,
            DireccionOcurre,
            ReferenciaOcurre,
            ObservacionesOcurre,
          ],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `El ocurre ${NombreOcurre.toUpperCase()} ha sido registrado correctamente ✨`
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
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }
  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM ocurres ORDER BY idOcurre DESC`
        : `SELECT * FROM ocurres WHERE NombreOcurre LIKE '%${filtro}%' OR OperadorLogisticoOcurre LIKE '%${filtro}%' ORDER BY idOcurre DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DE UN OCURRE
// SE UTILIZA EN LAS VISTAS: Ocurres > Administrar Ocurres
export const ActualizarEstadoOcurre = async (req, res) => {
  const { CookieConToken, idOcurre, StatusOcurre } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE ocurres SET StatusOcurre = '${StatusOcurre}' WHERE idOcurre = ${idOcurre}`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(`Ocurre ${StatusOcurre.toUpperCase()} con éxito ✨`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A ACTUALIZAR LA INFORMACIÓN DE UN OCURRE
// SE UTILIZA EN LAS VISTAS: Ocurres > Editar Ocurre
export const ActualizarInformacionOcurre = async (req, res) => {
  const {
    CookieConToken,
    idOcurre,
    NombreOcurre,
    OperadorLogisticoOcurre,
    TelefonoOcurre,
    CorreoOcurre,
    ColoniaOcurre,
    MunicipioDelegacionOcurre,
    CodigoPostalOcurre,
    CiudadOcurre,
    EstadoOcurre,
    DireccionOcurre,
    ReferenciaOcurre,
    ObservacionesOcurre,
  } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sqlValidar = `SELECT * FROM ocurres WHERE NombreOcurre = '${NombreOcurre}' AND idOcurre != ${idOcurre}`;
    CONEXION.query(sqlValidar, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        res
          .status(500)
          .json(`La ocurrencia ${NombreOcurre.toUpperCase()} ya existe ❌`);
      } else {
        const sql = `UPDATE ocurres SET NombreOcurre = ?, OperadorLogisticoOcurre = ?, TelefonoOcurre = ?, CorreoOcurre = ?, ColoniaOcurre = ?, MunicipioDelegacionOcurre = ?, CodigoPostalOcurre = ?, CiudadOcurre = ?, EstadoOcurre = ?, DireccionOcurre = ?, ReferenciaOcurre = ?, ObservacionesOcurre = ? WHERE idOcurre = ?`;
        CONEXION.query(
          sql,
          [
            NombreOcurre,
            OperadorLogisticoOcurre,
            TelefonoOcurre,
            CorreoOcurre,
            ColoniaOcurre,
            MunicipioDelegacionOcurre,
            CodigoPostalOcurre,
            CiudadOcurre,
            EstadoOcurre,
            DireccionOcurre,
            ReferenciaOcurre,
            ObservacionesOcurre,
            idOcurre,
          ],
          (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(
                `El ocurre ${NombreOcurre.toUpperCase()} ha sido actualizado con éxito ✨`
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
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken) {
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }
  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM ocurres WHERE StatusOcurre = 'Activa' ORDER BY idOcurre DESC`
        : `SELECT * FROM ocurres WHERE StatusOcurre = 'Activa' AND NombreOcurre LIKE '%${filtro}%' ORDER BY idOcurre DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
