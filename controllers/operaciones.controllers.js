// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";

// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";
import { ObtenerHoraActual } from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UN MOVIMIENTO
// SE UTILIZA EN LAS VISTAS: Movimientos
export const RegistrarMovimiento = async (req, res) => {
  const {
    EstadoMovimiento,
    OrigenMovimiento,
    DetallesMovimiento,
    CategoriaMovimiento,
  } = req.body;

  try {
    const sql = `SELECT * FROM movimientos WHERE EstadoMovimiento = ? AND OrigenMovimiento = ? AND DetallesMovimiento = ?`;
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
          const sql = `INSERT INTO movimientos (EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, CategoriaMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento) VALUES (?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
          CONEXION.query(
            sql,
            [
              EstadoMovimiento || "",
              DetallesMovimiento || "",
              OrigenMovimiento || "",
              CategoriaMovimiento || "No",
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
  const { filtro } = req.body;
  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM movimientos ORDER BY idMovimiento DESC`
        : `SELECT * FROM movimientos WHERE DetallesMovimiento LIKE ? OR EstadoMovimiento LIKE ? OR OrigenMovimiento LIKE ? OR ActivoMovimiento LIKE ? ORDER BY idMovimiento DESC`;
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
  const { idMovimiento, ActivoMovimiento } = req.body;

  const TEXTO_ESTADO =
    ActivoMovimiento === "Activo" ? "ACTIVADO" : "DESACTIVADO";

  try {
    const sql = `UPDATE movimientos SET ActivoMovimiento = ? WHERE idMovimiento = ?`;
    CONEXION.query(sql, [ActivoMovimiento, idMovimiento], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res
        .status(200)
        .json(`¡El estado del movimiento ha sido ${TEXTO_ESTADO} con éxito!`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A EDITAR UN MOVIMIENTO
// SE UTILIZA EN LAS VISTAS: Movimientos > Editar Movimiento
export const EditarMovimiento = async (req, res) => {
  const {
    idMovimiento,
    EstadoMovimiento,
    OrigenMovimiento,
    DetallesMovimiento,
    CategoriaMovimiento,
  } = req.body;

  try {
    const sql = `SELECT * FROM movimientos WHERE EstadoMovimiento = ? AND OrigenMovimiento = ? AND DetallesMovimiento = ? AND idMovimiento != ?`;
    CONEXION.query(
      sql,
      [EstadoMovimiento, OrigenMovimiento, DetallesMovimiento, idMovimiento],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        if (result.length > 0) {
          res
            .status(409)
            .json(
              `¡Oops! Parece que ya existe un movimiento con los mismos datos, por favor intente de nuevo con otros datos.`
            );
        } else {
          const sql = `UPDATE movimientos SET EstadoMovimiento = ?, OrigenMovimiento = ?, DetallesMovimiento = ?, CategoriaMovimiento = ? WHERE idMovimiento = ?`;
          CONEXION.query(
            sql,
            [
              EstadoMovimiento,
              OrigenMovimiento,
              DetallesMovimiento,
              CategoriaMovimiento,
              idMovimiento,
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
  const { CodigoPais } = req.body;
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
  const { idEstado } = req.body;
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
  const { CodigoPostal, Pais } = req.body;
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
