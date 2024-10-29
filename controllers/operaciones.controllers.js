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

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UN MOVIMIENTO
// SE UTILIZA EN LAS VISTAS: Movimientos
export const RegistrarMovimiento = async (req, res) => {
  const {
    CookieConToken,
    EstadoMovimiento,
    OrigenMovimiento,
    DetallesMovimiento,
    PorDefectoMovimiento,
  } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listamovimientos WHERE EstadoMovimiento = ? AND OrigenMovimiento = ? AND DetallesMovimiento = ?`;
    CONEXION.query(
      sql,
      [EstadoMovimiento, OrigenMovimiento, DetallesMovimiento],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        if (result.length > 0) {
          res
            .status(409)
            .json(
              `¡Oops! Parece que ya existe un movimiento con los mismos datos, por favor intente de nuevo con otros datos.`
            );
        } else {
          const sql = `INSERT INTO listamovimientos (EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, PorDefectoMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento) VALUES (?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
          CONEXION.query(
            sql,
            [
              EstadoMovimiento || "",
              DetallesMovimiento || "",
              OrigenMovimiento || "",
              PorDefectoMovimiento || "No",
            ],
            (error, result) => {
              if (error)
                return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
              res
                .status(200)
                .json(`¡El movimiento ha sido registrado correctamente!`);
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS OBTENER TODOS LOS MOVIMIENTOS
// SE UTILIZA EN LAS VISTAS: Movimientos
export const ObtenerTodosLosMovimientos = async (req, res) => {
  const { CookieConToken, filtro } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM listamovimientos ORDER BY idListaMovimiento DESC`
        : `SELECT * FROM listamovimientos WHERE DetallesMovimiento LIKE ? OR EstadoMovimiento LIKE ? OR OrigenMovimiento LIKE ? OR ActivoMovimiento LIKE ? ORDER BY idListaMovimiento DESC`;
    CONEXION.query(
      sql,
      [`%${filtro}%`, `%${filtro}%`, `%${filtro}%`, `%${filtro}%`],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DE UN MOVIMIENTO
// SE UTILIZA EN LAS VISTAS: Movimientos
export const ActualizarEstadoDeUnMovimiento = async (req, res) => {
  const { CookieConToken, idListaMovimiento, ActivoMovimiento } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  const TEXTO_ESTADO =
    ActivoMovimiento === "Activo" ? "ACTIVADO" : "DESACTIVADO";

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE listamovimientos SET ActivoMovimiento = ? WHERE idListaMovimiento = ?`;
    CONEXION.query(
      sql,
      [ActivoMovimiento, idListaMovimiento],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res
          .status(200)
          .json(`¡El estado del movimiento ha sido ${TEXTO_ESTADO} con éxito!`);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A EDITAR UN MOVIMIENTO
// SE UTILIZA EN LAS VISTAS: Movimientos > Editar Movimiento
export const EditarMovimiento = async (req, res) => {
  const {
    CookieConToken,
    idListaMovimiento,
    EstadoMovimiento,
    OrigenMovimiento,
    DetallesMovimiento,
    PorDefectoMovimiento,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM listamovimientos WHERE EstadoMovimiento = ? AND OrigenMovimiento = ? AND DetallesMovimiento = ? AND idListaMovimiento != ?`;
    CONEXION.query(
      sql,
      [
        EstadoMovimiento,
        OrigenMovimiento,
        DetallesMovimiento,
        idListaMovimiento,
      ],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        if (result.length > 0) {
          res
            .status(409)
            .json(
              `¡Oops! Parece que ya existe un movimiento con los mismos datos, por favor intente de nuevo con otros datos.`
            );
        } else {
          const sql = `UPDATE listamovimientos SET EstadoMovimiento = ?, OrigenMovimiento = ?, DetallesMovimiento = ?, PorDefectoMovimiento = ? WHERE idListaMovimiento = ?`;
          CONEXION.query(
            sql,
            [
              EstadoMovimiento,
              OrigenMovimiento,
              DetallesMovimiento,
              PorDefectoMovimiento,
              idListaMovimiento,
            ],
            (error, result) => {
              if (error)
                return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
              res
                .status(200)
                .json(`¡El movimiento ha sido actualizado con éxito!`);
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS PAÍSES ACTIVOS
// SE UTILIZA EN LAS VISTAS: Agencias > Registrar Agencia
// SE UTILIZA EN LAS VISTAS: Agencias > Administrar Agencias > Editar Agencia
export const ObtenerPaisesActivos = async (req, res) => {
  const { CookieConToken } = req.params;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM paises WHERE ActivoPais = ?`;
    CONEXION.query(sql, ["Activo"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS ESTADOS POR CÓDIGO DEL PAÍS
// SE UTILIZA EN LAS VISTAS: Agencias > Registrar Agencia
// SE UTILIZA EN LAS VISTAS: Agencias > Administrar Agencias > Editar Agencia
export const ObtenerEstadosPorCodigoDelPais = async (req, res) => {
  const { CookieConToken, CodigoPais } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM estados WHERE CodigoPais = ? AND ActivoEstado = ? ORDER BY NombreEstado ASC`;
    CONEXION.query(sql, [CodigoPais, "Activo"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LAS CIUDADES POR ESTADO SELECCIONADO
// SE UTILIZA EN LAS VISTAS: Agencias > Registrar Agencia
// SE UTILIZA EN LAS VISTAS: Agencias > Administrar Agencias > Editar Agencia
export const ObtenerCiudadesPorEstado = async (req, res) => {
  const { CookieConToken, idEstado } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM ciudades WHERE idEstado = ? AND ActivaCiudad = ? ORDER BY NombreCiudad ASC`;
    CONEXION.query(sql, [idEstado, "Activa"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LAS COLONIAS POR CODIGO POSTAL
// SE UTILIZA EN LAS VISTAS: Agencias > Registrar Agencia
// SE UTILIZA EN LAS VISTAS: Agencias > Administrar Agencias > Editar Agencia
export const ObtenerColoniasPorCodigoPostal = async (req, res) => {
  const { CookieConToken, CodigoPostal, Pais } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM colonias WHERE CodigoPostalColonia = ? AND PaisColonia = ? AND ActivaColonia = ? ORDER BY NombreColonia ASC`;
    CONEXION.query(sql, [CodigoPostal, Pais, "Activa"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
