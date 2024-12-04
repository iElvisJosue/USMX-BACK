// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";

// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";
import { ObtenerHoraActual } from "../helpers/Func.js";

// SE UTILIZA EN LAS VISTAS:
// Recolecciones > Buscar o Escanear una Guía
export const ObtenerInformacionDeGuia = async (req, res) => {
  const { GuiaPedido } = req.params;

  let MovimientosDeRecoleccion = await ObtenerMovimientosDeRecoleccion();

  if (MovimientosDeRecoleccion.length === 0) {
    MovimientosDeRecoleccion = await CrearMovimientoDeRecoleccion();
  }

  const GuiaYaRecolectada = await BuscarGuiaYaRecolectada(
    MovimientosDeRecoleccion,
    GuiaPedido
  );

  if (GuiaYaRecolectada) {
    return res
      .status(404)
      .json(
        "¡Oops! Parece que la guía ya fue recolectada, por favor intente con otra."
      );
  }

  try {
    const sql = `SELECT
            p.*
        FROM
            detallespedidos dp
        LEFT JOIN
            pedidos p ON dp.idPedido = p.idPedido
        WHERE
            p.GuiaPedido = ?`;
    CONEXION.query(sql, [GuiaPedido], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res
          .status(404)
          .json(
            "¡Oops! Parece que la guía no existe, por favor intente con otra."
          );
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const CrearMovimientoDeRecoleccion = async () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO movimientos (EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, CategoriaMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento) VALUES (?, ?, ?, ?, CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [
        "Recolectado",
        "El paquete ha sido recolectado por el transportista",
        "Transportista",
        "Recoleccion",
      ],
      (error, result) => {
        if (error) return reject(error);
        resolve([{ idMovimiento: result.insertId }]);
      }
    );
  });
};
const BuscarGuiaYaRecolectada = async (
  MovimientosDeRecoleccion,
  GuiaPedido
) => {
  const ListaDeIds = MovimientosDeRecoleccion.map((mov) => mov.idMovimiento);
  return new Promise((resolve, reject) => {
    const sql = `SELECT
      p.*
    FROM
      union_pedidos_movimientos upm
    LEFT JOIN
      pedidos p ON upm.idPedido = p.idPedido
    LEFT JOIN
      movimientos m ON upm.idMovimiento = m.idMovimiento
    WHERE
      upm.idMovimiento IN (?) AND p.GuiaPedido = ?`;
    CONEXION.query(sql, [ListaDeIds, GuiaPedido], (error, result) => {
      if (error) return reject(error);
      if (result.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
// SE UTILIZA EN LAS VISTAS:
// Recolecciones > Buscar o Escanear una Guía > Lista de guías en la recolección
export const CrearRecoleccion = async (req, res) => {
  const { idUsuario, recoleccion } = req.body;

  const CantidadRecoleccion = recoleccion.length;

  try {
    const idMovimientos = await ObtenerMovimientosDeRecoleccion();

    const idRecoleccion = await CrearRecoleccionYObtenerId(CantidadRecoleccion);

    for (const infRecoleccion of recoleccion) {
      await CrearRecoleccionYUnion(
        idMovimientos,
        idUsuario,
        idRecoleccion,
        infRecoleccion
      );
    }

    res.status(200).json("¡La recolección ha sido creada con exito!");
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const ObtenerMovimientosDeRecoleccion = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM movimientos WHERE CategoriaMovimiento = ? AND ActivoMovimiento = ?`;
    CONEXION.query(sql, ["Recoleccion", "Activo"], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
const CrearRecoleccionYObtenerId = async (CantidadRecoleccion) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO recolecciones (CantidadRecoleccion,FechaCreacionRecoleccion, HoraCreacionRecoleccion) VALUES (?, CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(sql, [CantidadRecoleccion], (error, result) => {
      if (error) return reject(error);
      resolve(result.insertId);
    });
  });
};
const CrearRecoleccionYUnion = async (
  idMovimientos,
  idUsuario,
  idRecoleccion,
  infRecoleccion
) => {
  return new Promise(async (resolve, reject) => {
    for (const infMovimiento of idMovimientos) {
      await CrearUnionPedidoMovimientoUsuario(
        infRecoleccion.idPedido,
        infMovimiento.idMovimiento,
        idUsuario
      );
    }
    await CrearUnionDeLaRecoleccion(
      idRecoleccion,
      infRecoleccion.idPedido,
      idUsuario
    );
    resolve(true);
  });
};
const CrearUnionPedidoMovimientoUsuario = async (
  idPedido = 0,
  idMovimiento = 0,
  idUsuario = 0
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_pedidos_movimientos (idPedido, idMovimiento, idUsuario, FechaCreacionUnion, HoraCreacionUnion) VALUES (?,?,?, CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [idPedido, idMovimiento, idUsuario],
      (error, result) => {
        if (error) return reject(error);
        resolve(true);
      }
    );
  });
};
const CrearUnionDeLaRecoleccion = async (
  idRecoleccion,
  idPedido,
  idUsuario
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_recolecciones_pedidos (idRecoleccion, idPedido, idUsuario) VALUES (?,?,?)`;
    CONEXION.query(
      sql,
      [idRecoleccion, idPedido, idUsuario],
      (error, result) => {
        if (error) return reject(error);
        resolve(true);
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS RECOLECCIONES POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Recolecciones > Lista de recolecciones > Lista completa de recolecciones
export const BuscarTodasLasRecoleccionesPorFiltro = async (req, res) => {
  const { filtro } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBTLRPF = [];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          r.idRecoleccion, 
          r.CantidadRecoleccion,
          r.FechaCreacionRecoleccion, 
          r.HoraCreacionRecoleccion, 
          u.Usuario 
      FROM 
          recolecciones r 
      JOIN 
          union_recolecciones_pedidos urp 
      ON 
          r.idRecoleccion = urp.idRecoleccion 
      JOIN 
          usuarios u 
      ON 
          urp.idUsuario = u.idUsuario
      ORDER BY 
          r.idRecoleccion DESC`;
    } else {
      paramsBTLRPF.push(`%${filtro}%`);
      paramsBTLRPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          r.idRecoleccion, 
          r.CantidadRecoleccion,
          r.FechaCreacionRecoleccion, 
          r.HoraCreacionRecoleccion, 
          u.Usuario 
      FROM 
          recolecciones r 
      JOIN 
          union_recolecciones_pedidos urp 
      ON 
          r.idRecoleccion = urp.idRecoleccion 
      JOIN 
          usuarios u 
      ON 
          urp.idUsuario = u.idUsuario
      WHERE 
          r.idRecoleccion LIKE ?
          OR u.Usuario LIKE ?
      ORDER BY 
          r.idRecoleccion DESC`;
    }

    CONEXION.query(sql, paramsBTLRPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS RECOLECCIONES POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Recolecciones > Lista de recolecciones > Lista de recolecciones por fecha
export const BuscarTodasLasRecoleccionesPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha } = req.body;
  try {
    const sql = `SELECT DISTINCT 
        r.idRecoleccion, 
        r.CantidadRecoleccion,
        r.FechaCreacionRecoleccion, 
        r.HoraCreacionRecoleccion, 
        u.Usuario 
    FROM 
        recolecciones r 
    JOIN 
        union_recolecciones_pedidos urp 
    ON 
        r.idRecoleccion = urp.idRecoleccion 
    JOIN 
        usuarios u 
    ON 
        urp.idUsuario = u.idUsuario
    WHERE 
        r.FechaCreacionRecoleccion BETWEEN ? AND ?
    ORDER BY 
        r.idRecoleccion DESC`;
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS RECOLECCIONES DE UN CHOFER POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Recolecciones > Buscar o Escanear una Guía > Lista de recolecciones de un chofer
export const BuscarRecoleccionesDeUnChoferPorFiltro = async (req, res) => {
  const { filtro, idUsuario } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramBRPF = [idUsuario];
    let sql;
    if (filtro === "") {
      sql = `SELECT 
          DISTINCT r.idRecoleccion,
          r.CantidadRecoleccion, 
          r.FechaCreacionRecoleccion, 
          r.HoraCreacionRecoleccion, 
          u.Usuario 
      FROM 
          recolecciones r 
      JOIN 
        union_recolecciones_pedidos urp 
      ON 
        r.idRecoleccion = urp.idRecoleccion 
      JOIN 
        usuarios u 
      ON 
        urp.idUsuario = u.idUsuario 
      WHERE 
        u.idUsuario = ?
      ORDER BY 
        r.idRecoleccion DESC`;
    } else {
      paramBRPF.push(`%${filtro}%`);
      paramBRPF.push(`%${filtro}%`);
      sql = `SELECT 
      DISTINCT r.idRecoleccion, 
        r.CantidadRecoleccion,
        r.FechaCreacionRecoleccion, 
        r.HoraCreacionRecoleccion, 
        u.Usuario 
      FROM 
          recolecciones r 
      JOIN 
        union_recolecciones_pedidos urp 
      ON 
        r.idRecoleccion = urp.idRecoleccion 
      JOIN 
        usuarios u 
      ON 
        urp.idUsuario = u.idUsuario 
      WHERE 
      u.idUsuario = ?
      AND
      r.idRecoleccion LIKE ?
      ORDER BY 
        r.idRecoleccion DESC`;
    }

    CONEXION.query(sql, paramBRPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PEDIDOS POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Pedidos > Lista pedidos por fecha
export const BuscarRecoleccionesDeUnChoferPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha, idUsuario } = req.body;
  try {
    const sql = `SELECT DISTINCT 
        r.idRecoleccion, 
        r.CantidadRecoleccion,
        r.FechaCreacionRecoleccion, 
        r.HoraCreacionRecoleccion, 
        u.Usuario 
    FROM 
        recolecciones r 
    JOIN 
        union_recolecciones_pedidos urp 
    ON 
        r.idRecoleccion = urp.idRecoleccion 
    JOIN 
        usuarios u 
    ON 
        urp.idUsuario = u.idUsuario
    WHERE 
        r.FechaCreacionRecoleccion BETWEEN ? AND ?
        AND u.idUsuario = ?
    ORDER BY
        r.idRecoleccion DESC`;
    CONEXION.query(
      sql,
      [primeraFecha, segundaFecha, idUsuario],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS PEDIDOS DE UNA RECOLECCION
// SE UTILIZA EN LAS VISTAS:
// Recolecciones > LISTA DE RECOLECCIONES > DETALLES DE RECOLECCION
export const ObtenerPedidosDeUnaRecoleccion = async (req, res) => {
  const { idRecoleccion } = req.params;
  try {
    const sql = `SELECT
          p.*
        FROM
          union_recolecciones_pedidos urp
        LEFT JOIN
          pedidos p ON urp.idPedido = p.idPedido
        WHERE
          urp.idRecoleccion = ?`;
    CONEXION.query(sql, [idRecoleccion], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
