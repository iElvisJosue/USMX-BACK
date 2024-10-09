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
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql = `SELECT * FROM listamovimientos WHERE EstadoMovimiento = ? AND OrigenMovimiento = ? AND DetallesMovimiento = ?`;
    CONEXION.query(
      sql,
      [EstadoMovimiento, OrigenMovimiento, DetallesMovimiento],
      (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
          res
            .status(500)
            .json(
              `Ya existe un movimiento con estos mismos datos, por favor intente con otros datos ❌`
            );
        } else {
          const sql = `INSERT INTO listamovimientos (EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, PorDefectoMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento) VALUES (
                '${EstadoMovimiento}',
                '${DetallesMovimiento}',
                '${OrigenMovimiento}',
                '${PorDefectoMovimiento}',
                CURDATE(),
                '${ObtenerHoraActual()}'
                )`;
          CONEXION.query(sql, (error, result) => {
            if (error) throw error;
            res
              .status(200)
              .json(`El movimiento ha sido registrado correctamente ✨`);
          });
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
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM listamovimientos ORDER BY idListaMovimiento DESC`
        : `SELECT * FROM listamovimientos WHERE DetallesMovimiento LIKE '%${filtro}%' OR EstadoMovimiento LIKE '%${filtro}%' OR OrigenMovimiento LIKE '%${filtro}%' OR ActivoMovimiento LIKE '${filtro}' ORDER BY idListaMovimiento DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
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
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE listamovimientos SET ActivoMovimiento = ? WHERE idListaMovimiento = ?`;
    CONEXION.query(
      sql,
      [ActivoMovimiento, idListaMovimiento],
      (error, result) => {
        if (error) throw error;
        res
          .status(200)
          .json("El STATUS del movimiento ha sido actualizado con éxito ✨");
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
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
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
        if (error) throw error;
        if (result.length > 0) {
          res
            .status(500)
            .json(
              `Ya existe un movimiento con estos mismos datos, por favor intente con otros datos ❌`
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
              if (error) throw error;
              res
                .status(200)
                .json(`El movimiento ha sido editado correctamente ✨`);
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
