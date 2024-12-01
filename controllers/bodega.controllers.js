// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";

// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";
import { ObtenerHoraActual } from "../helpers/Func.js";

// SE UTILIZA EN LAS VISTAS:
// Bodega > Entradas > Formulario
export const ObtenerMovimientosDeEntrada = async (req, res) => {
  try {
    const sql = `SELECT * FROM movimientos WHERE CategoriaMovimiento = ? AND ActivoMovimiento = ?`;
    CONEXION.query(sql, ["Entrada Bodega", "Activo"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LAS VISTAS:
// Bodega > Devoluciones > Buscar o Escanear una Guía
export const ObtenerInformacionDeGuiaParaEntradas = async (req, res) => {
  const { GuiaPedido, idMovimientoEntrada } = req.params;

  const GuiaYaEntrada = await BuscarGuiaYaEntrada(
    idMovimientoEntrada,
    GuiaPedido
  );

  if (GuiaYaEntrada) {
    return res
      .status(404)
      .json(
        "¡Oops! Parece que la guía ya entro a la bodega, por favor intente con otra."
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
const BuscarGuiaYaEntrada = async (idMovimientoEntrada, GuiaPedido) => {
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
        upm.idMovimiento = ? AND p.GuiaPedido = ?`;
    CONEXION.query(sql, [idMovimientoEntrada, GuiaPedido], (error, result) => {
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
// Bodega > Devoluciones > Buscar o Escanear una Guía
export const CrearEntrada = async (req, res) => {
  const { idUsuario, infEntrada, entrada } = req.body;

  const CantidadEntradas = entrada.length;

  try {
    const idEntradaBodega = await CrearEntradaYObtenerId(
      CantidadEntradas,
      infEntrada
    );

    for (const informacionEntrada of entrada) {
      await CrearEntradaYUnion(
        infEntrada.idMovimientoEntrada,
        idUsuario,
        idEntradaBodega,
        informacionEntrada
      );
    }
    res.status(200).json("¡La entrada a bodega ha sido creada con exito!");
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const CrearEntradaYObtenerId = async (CantidadEntradas, infEntrada) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO entradasbodega (CantidadEntradas, NombreTransportista, Remolque, Tracto, Candado, HoraEntrada, FechaCreacionEntrada, HoraCreacionEntrada) VALUES (?,?,?,?,?,?,CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [
        CantidadEntradas || 0,
        infEntrada.NombreTransportista || "N/A",
        infEntrada.Remolque || "N/A",
        infEntrada.Tracto || "N/A",
        infEntrada.Candado || "N/A",
        infEntrada.HoraDeEntrada || "00:00:00",
      ],
      (error, result) => {
        if (error) return reject(error);
        resolve(result.insertId);
      }
    );
  });
};
const CrearEntradaYUnion = async (
  idMovimientoEntrada,
  idUsuario,
  idEntradaBodega,
  informacionEntrada
) => {
  return new Promise(async (resolve, reject) => {
    await CrearUnionPedidoMovimientoUsuario(
      informacionEntrada.idPedido,
      idMovimientoEntrada,
      idUsuario
    );
    await CrearUnionDeLaEntrada(
      idEntradaBodega,
      informacionEntrada.idPedido,
      idUsuario
    );
    resolve(true);
  });
};
const CrearUnionDeLaEntrada = async (idEntradaBodega, idPedido, idUsuario) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_entradas_pedidos (idEntradaBodega, idPedido, idUsuario) VALUES (?,?,?)`;
    CONEXION.query(
      sql,
      [idEntradaBodega, idPedido, idUsuario],
      (error, result) => {
        if (error) return reject(error);
        resolve(true);
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS ENTRADAS A BODEGA POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Bodega > Entradas > Lista de Entradas
export const BuscarTodasLasEntradasABodegaPorFiltro = async (req, res) => {
  const { filtro } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBTLEABPF = [];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          eb.idEntradaBodega, 
          eb.CantidadEntradas,
          eb.FechaCreacionEntrada, 
          eb.HoraCreacionEntrada, 
          u.Usuario 
      FROM 
          entradasbodega eb 
      JOIN 
          union_entradas_pedidos uep 
      ON 
          eb.idEntradaBodega = uep.idEntradaBodega 
      JOIN 
          usuarios u 
      ON 
          uep.idUsuario = u.idUsuario
      ORDER BY 
          eb.idEntradaBodega DESC`;
    } else {
      paramsBTLEABPF.push(`%${filtro}%`);
      paramsBTLEABPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          eb.idEntradaBodega, 
          eb.CantidadEntradas,
          eb.FechaCreacionEntrada, 
          eb.HoraCreacionEntrada, 
          u.Usuario 
      FROM 
          entradasbodega eb 
      JOIN 
          union_entradas_pedidos uep 
      ON 
          eb.idEntradaBodega = uep.idEntradaBodega 
      JOIN 
          usuarios u 
      ON 
          uep.idUsuario = u.idUsuario
      WHERE 
          eb.idEntradaBodega LIKE ?
          OR u.Usuario LIKE ?
      ORDER BY 
          eb.idEntradaBodega DESC`;
    }

    CONEXION.query(sql, paramsBTLEABPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS ENTRADAS A BODEGA POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Bodega > Entradas > Lista de Entradas por fecha
export const BuscarTodasLasEntradasABodegaPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          eb.idEntradaBodega, 
          eb.CantidadEntradas,
          eb.FechaCreacionEntrada, 
          eb.HoraCreacionEntrada, 
          u.Usuario 
    FROM 
        entradasbodega eb
    JOIN 
        union_entradas_pedidos uep 
    ON 
        eb.idEntradaBodega = uep.idEntradaBodega 
    JOIN 
        usuarios u 
    ON 
        uep.idUsuario = u.idUsuario
    WHERE 
        eb.FechaCreacionEntrada BETWEEN ? AND ?
    ORDER BY 
        eb.idEntradaBodega DESC`;
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS ENTRADAS A BODEGA POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Bodega > Entradas > Lista de Entradas
export const BuscarTodasLasEntradasABodegaDeUnBodegueroPorFiltro = async (
  req,
  res
) => {
  const { filtro, idUsuario } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBTLEABDUBPF = [idUsuario];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          eb.idEntradaBodega, 
          eb.CantidadEntradas,
          eb.FechaCreacionEntrada, 
          eb.HoraCreacionEntrada, 
          u.Usuario 
      FROM 
          entradasbodega eb 
      JOIN 
          union_entradas_pedidos uep 
      ON 
          eb.idEntradaBodega = uep.idEntradaBodega 
      JOIN 
          usuarios u 
      ON 
          uep.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      ORDER BY 
          eb.idEntradaBodega DESC`;
    } else {
      paramsBTLEABDUBPF.push(`%${filtro}%`);
      paramsBTLEABDUBPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          eb.idEntradaBodega, 
          eb.CantidadEntradas,
          eb.FechaCreacionEntrada, 
          eb.HoraCreacionEntrada, 
          u.Usuario 
      FROM 
          entradasbodega eb 
      JOIN 
          union_entradas_pedidos uep 
      ON 
          eb.idEntradaBodega = uep.idEntradaBodega 
      JOIN 
          usuarios u 
      ON 
          uep.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      AND
          eb.idEntradaBodega LIKE ?
      ORDER BY 
          eb.idEntradaBodega DESC`;
    }

    CONEXION.query(sql, paramsBTLEABDUBPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS ENTRADAS A BODEGA POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Bodega > Entradas > Lista de Entradas por fecha
export const BuscarTodasLasEntradasABodegaDeUnBodegueroPorFecha = async (
  req,
  res
) => {
  const { primeraFecha, segundaFecha, idUsuario } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          eb.idEntradaBodega, 
          eb.CantidadEntradas,
          eb.FechaCreacionEntrada, 
          eb.HoraCreacionEntrada, 
          u.Usuario 
    FROM 
        entradasbodega eb
    JOIN 
        union_entradas_pedidos uep 
    ON 
        eb.idEntradaBodega = uep.idEntradaBodega 
    JOIN 
        usuarios u 
    ON 
        uep.idUsuario = u.idUsuario
    WHERE 
        eb.FechaCreacionEntrada BETWEEN ? AND ?
    AND 
        u.idUsuario = ?
    ORDER BY 
        eb.idEntradaBodega DESC`;
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
// SE UTILIZA EN LAS VISTAS:
// Bodega > Devoluciones > Buscar o Escanear una Guía
export const ObtenerInformacionDeGuiaParaDevolucion = async (req, res) => {
  const { GuiaPedido } = req.params;

  let MovimientosDeDevolucion = await ObtenerMovimientosDeDevolucion();

  if (MovimientosDeDevolucion.length === 0) {
    MovimientosDeDevolucion = await CrearMovimientoDeDevolucion();
  }

  const GuiaYaDevuelta = await BuscarGuiaYaDevuelta(
    MovimientosDeDevolucion,
    GuiaPedido
  );

  if (GuiaYaDevuelta) {
    return res
      .status(404)
      .json(
        "¡Oops! Parece que la guía ya fue devuelta, por favor intente con otra."
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
const CrearMovimientoDeDevolucion = async () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO movimientos (EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, CategoriaMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento) VALUES (?,?,?,?, CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [
        "Devuelto",
        "Entrada a bodega para su devolución",
        "Bodega",
        "Devolucion",
      ],
      (error, result) => {
        if (error) return reject(error);
        resolve([{ idMovimiento: result.insertId }]);
      }
    );
  });
};
const BuscarGuiaYaDevuelta = async (MovimientosDeDevolucion, GuiaPedido) => {
  const ListaDeIds = MovimientosDeDevolucion.map((mov) => mov.idMovimiento);
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
// Bodega > Devoluciones > Buscar o Escanear una Guía
export const CrearDevolucion = async (req, res) => {
  const { idUsuario, devolucion } = req.body;

  const CantidadDevoluciones = devolucion.length;

  try {
    const idMovimientos = await ObtenerMovimientosDeDevolucion();

    const idDevolucion = await CrearDevolucionYObtenerId(CantidadDevoluciones);

    for (const infDevolucion of devolucion) {
      await CrearDevolucionYUnion(
        idMovimientos,
        idUsuario,
        idDevolucion,
        infDevolucion
      );
    }

    res.status(200).json("¡La devolución ha sido creada con exito!");
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const ObtenerMovimientosDeDevolucion = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM movimientos WHERE CategoriaMovimiento = ? AND ActivoMovimiento = ?`;
    CONEXION.query(sql, ["Devolucion", "Activo"], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
const CrearDevolucionYObtenerId = async (CantidadDevoluciones) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO devoluciones (CantidadDevoluciones, FechaCreacionDevolucion, HoraCreacionDevolucion) VALUES (?, CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(sql, [CantidadDevoluciones], (error, result) => {
      if (error) return reject(error);
      resolve(result.insertId);
    });
  });
};
const CrearDevolucionYUnion = async (
  idMovimientos,
  idUsuario,
  idDevolucion,
  infDevolucion
) => {
  return new Promise(async (resolve, reject) => {
    for (const infMovimiento of idMovimientos) {
      await CrearUnionPedidoMovimientoUsuario(
        infDevolucion.idPedido,
        infMovimiento.idMovimiento,
        idUsuario
      );
    }
    await CrearUnionDeLaDevolucion(
      idDevolucion,
      infDevolucion.idPedido,
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
const CrearUnionDeLaDevolucion = async (idDevolucion, idPedido, idUsuario) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_devoluciones_pedidos (idDevolucion, idPedido, idUsuario) VALUES (?,?,?)`;
    CONEXION.query(
      sql,
      [idDevolucion, idPedido, idUsuario],
      (error, result) => {
        if (error) return reject(error);
        resolve(true);
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS DEVOLUCIONES POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Devoluciones > Lista de devoluciones > Lista completa de devoluciones
export const BuscarTodasLasDevolucionesPorFiltro = async (req, res) => {
  const { filtro } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBTLDPF = [];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          d.idDevolucion, 
          d.CantidadDevoluciones,
          d.FechaCreacionDevolucion, 
          d.HoraCreacionDevolucion, 
          u.Usuario 
      FROM 
          devoluciones d 
      JOIN 
          union_devoluciones_pedidos udp 
      ON 
          d.idDevolucion = udp.idDevolucion 
      JOIN 
          usuarios u 
      ON 
          udp.idUsuario = u.idUsuario
      ORDER BY 
          d.idDevolucion DESC`;
    } else {
      paramsBTLDPF.push(`%${filtro}%`);
      paramsBTLDPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          d.idDevolucion, 
          d.CantidadDevoluciones,
          d.FechaCreacionDevolucion, 
          d.HoraCreacionDevolucion, 
          u.Usuario 
      FROM 
          devoluciones d
      JOIN 
          union_devoluciones_pedidos udp 
      ON 
          d.idDevolucion = udp.idDevolucion 
      JOIN 
          usuarios u 
      ON 
          udp.idUsuario = u.idUsuario
      WHERE 
          d.idDevolucion LIKE ?
          OR u.Usuario LIKE ?
      ORDER BY 
          d.idDevolucion DESC`;
    }

    CONEXION.query(sql, paramsBTLDPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS DEVOLUCIONES POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Devoluciones > Lista de devoluciones > Lista de devoluciones por fecha
export const BuscarTodasLasDevolucionesPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          d.idDevolucion, 
          d.CantidadDevoluciones,
          d.FechaCreacionDevolucion, 
          d.HoraCreacionDevolucion, 
          u.Usuario
    FROM 
        devoluciones d
    JOIN 
        union_devoluciones_pedidos udp 
    ON 
        d.idDevolucion = udp.idDevolucion 
    JOIN 
        usuarios u 
    ON 
        udp.idUsuario = u.idUsuario
    WHERE 
        d.FechaCreacionDevolucion BETWEEN ? AND ?
    ORDER BY 
        d.idDevolucion DESC`;
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS DEVOLUCIONES POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Devoluciones > Lista de devoluciones > Lista completa de devoluciones
export const BuscarDevolucionesDeUnBodegueroPorFiltro = async (req, res) => {
  const { filtro, idUsuario } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramBDDUBPF = [idUsuario];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          d.idDevolucion, 
          d.CantidadDevoluciones,
          d.FechaCreacionDevolucion, 
          d.HoraCreacionDevolucion, 
          u.Usuario 
      FROM 
          devoluciones d 
      JOIN 
          union_devoluciones_pedidos udp 
      ON 
          d.idDevolucion = udp.idDevolucion 
      JOIN 
          usuarios u 
      ON 
          udp.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      ORDER BY 
          d.idDevolucion DESC`;
    } else {
      paramBDDUBPF.push(`%${filtro}%`);
      paramBDDUBPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          d.idDevolucion, 
          d.CantidadDevoluciones,
          d.FechaCreacionDevolucion, 
          d.HoraCreacionDevolucion, 
          u.Usuario 
      FROM 
          devoluciones d 
      JOIN 
          union_devoluciones_pedidos udp 
      ON 
          d.idDevolucion = udp.idDevolucion 
      JOIN 
          usuarios u 
      ON 
          udp.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      AND 
          d.idDevolucion LIKE ?
      ORDER BY 
          d.idDevolucion DESC`;
    }

    CONEXION.query(sql, paramBDDUBPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS DEVOLUCIONES DE UN BODEGUERO POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Devoluciones > Lista de devoluciones > Lista de devoluciones por fecha
export const BuscarDevolucionesDeUnBodegueroPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha, idUsuario } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          d.idDevolucion, 
          d.CantidadDevoluciones,
          d.FechaCreacionDevolucion, 
          d.HoraCreacionDevolucion, 
          u.Usuario
    FROM 
        devoluciones d
    JOIN 
        union_devoluciones_pedidos udp 
    ON 
        d.idDevolucion = udp.idDevolucion 
    JOIN 
        usuarios u 
    ON 
        udp.idUsuario = u.idUsuario
    WHERE 
        d.FechaCreacionDevolucion BETWEEN ? AND ?
    AND 
        u.idUsuario = ?
    ORDER BY 
        d.idDevolucion DESC`;
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
// SE UTILIZA EN LAS VISTAS:
// Bodega > Movimientos bodega > Buscar o Escanear una Guía
export const ObtenerInformacionDeGuiaParaMovimientoEnBodega = async (
  req,
  res
) => {
  const { GuiaPedido } = req.params;

  let MovimientosDeBodega = await ObtenerMovimientosDeMovimientoEnBodega();

  if (MovimientosDeBodega.length === 0) {
    MovimientosDeBodega = await CrearMovimientosEnBodegaMovimientos();
  }

  const GuiaYaConMovimiento = await BuscarGuiaYaConMovimiento(
    MovimientosDeBodega,
    GuiaPedido
  );

  if (GuiaYaConMovimiento) {
    return res
      .status(404)
      .json(
        "¡Oops! Parece que la guía ya fue movida, por favor intente con otra."
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
const CrearMovimientosEnBodegaMovimientos = async () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO movimientos (EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, CategoriaMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento) VALUES (?,?,?,?, CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [
        "Movimiento en bodega",
        "Movimiento en bodega",
        "Bodega",
        "Movimiento Bodega",
      ],
      (error, result) => {
        if (error) return reject(error);
        resolve([{ idMovimiento: result.insertId }]);
      }
    );
  });
};
const BuscarGuiaYaConMovimiento = async (MovimientosDeBodega, GuiaPedido) => {
  const ListaDeIds = MovimientosDeBodega.map((mov) => mov.idMovimiento);
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
// Bodega > Movimiento en bodega > Buscar o Escanear una Guía
export const CrearMovimientoEnBodega = async (req, res) => {
  const { idUsuario, movimientobodega } = req.body;

  const CantidadMovimientosEnBodega = movimientobodega.length;

  try {
    const idMovimientos = await ObtenerMovimientosDeMovimientoEnBodega();

    const idMovimientoBodega = await CrearMovimientoEnBodegaYObtenerId(
      CantidadMovimientosEnBodega
    );

    for (const infMovBodega of movimientobodega) {
      await CrearMovimientoEnBodegaYUnion(
        idMovimientos,
        idUsuario,
        idMovimientoBodega,
        infMovBodega
      );
    }

    res.status(200).json("¡El movimiento en bodega ha sido creado con exito!");
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const ObtenerMovimientosDeMovimientoEnBodega = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM movimientos WHERE CategoriaMovimiento = ? AND ActivoMovimiento = ?`;
    CONEXION.query(sql, ["Movimiento Bodega", "Activo"], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
const CrearMovimientoEnBodegaYObtenerId = async (
  CantidadMovimientosEnBodega
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO movimientosbodega (CantidadMovimientosEnBodega,FechaCreacionMovimientoBodega, HoraCreacionMovimientoBodega) VALUES (?,CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(sql, [CantidadMovimientosEnBodega], (error, result) => {
      if (error) return reject(error);
      resolve(result.insertId);
    });
  });
};
const CrearMovimientoEnBodegaYUnion = async (
  idMovimientos,
  idUsuario,
  idMovimientoBodega,
  infMovBodega
) => {
  return new Promise(async (resolve, reject) => {
    for (const infMovimiento of idMovimientos) {
      await CrearUnionPedidoMovimientoUsuario(
        infMovBodega.idPedido,
        infMovimiento.idMovimiento,
        idUsuario
      );
    }
    await CrearUnionDelMovimientoEnBodega(
      idMovimientoBodega,
      infMovBodega.idPedido,
      idUsuario
    );
    resolve(true);
  });
};
const CrearUnionDelMovimientoEnBodega = async (
  idMovimientoBodega,
  idPedido,
  idUsuario
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_movimientosbodega_pedidos (idMovimientoBodega, idPedido, idUsuario) VALUES (?,?,?)`;
    CONEXION.query(
      sql,
      [idMovimientoBodega, idPedido, idUsuario],
      (error, result) => {
        if (error) return reject(error);
        resolve(true);
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS MOVIMIENTOS POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Movimientos en bodega > Lista de movimientos > Lista completa de movimientos
export const BuscarTodosLosMovimientosEnBodegaPorFiltro = async (req, res) => {
  const { filtro } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBTLMEBPF = [];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          mb.idMovimientoBodega, 
          mb.CantidadMovimientosEnBodega,
          mb.FechaCreacionMovimientoBodega, 
          mb.HoraCreacionMovimientoBodega, 
          u.Usuario 
      FROM 
          movimientosbodega mb 
      JOIN 
          union_movimientosbodega_pedidos umbp 
      ON 
          mb.idMovimientoBodega = umbp.idMovimientoBodega 
      JOIN 
          usuarios u 
      ON 
          umbp.idUsuario = u.idUsuario
      ORDER BY 
          mb.idMovimientoBodega DESC`;
    } else {
      paramsBTLMEBPF.push(`%${filtro}%`);
      paramsBTLMEBPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          mb.idMovimientoBodega, 
          mb.CantidadMovimientosEnBodega,
          mb.FechaCreacionMovimientoBodega, 
          mb.HoraCreacionMovimientoBodega, 
          u.Usuario 
      FROM 
          movimientosbodega mb 
      JOIN 
          union_movimientosbodega_pedidos umbp 
      ON 
          mb.idMovimientoBodega = umbp.idMovimientoBodega 
      JOIN 
          usuarios u 
      ON 
          umbp.idUsuario = u.idUsuario
      WHERE 
          mb.idMovimientoBodega LIKE ?
          OR u.Usuario LIKE ?
      ORDER BY 
          mb.idMovimientoBodega DESC`;
    }

    CONEXION.query(sql, paramsBTLMEBPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS MOVIMIENTOS POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Movimientos en bodega > Lista de movimientos > Lista completa de movimientos por fecha
export const BuscarTodosLosMovimientosEnBodegaPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          mb.idMovimientoBodega, 
          mb.CantidadMovimientosEnBodega,
          mb.FechaCreacionMovimientoBodega, 
          mb.HoraCreacionMovimientoBodega, 
          u.Usuario
    FROM 
        movimientosbodega mb
    JOIN 
        union_movimientosbodega_pedidos umbp 
    ON 
        mb.idMovimientoBodega = umbp.idMovimientoBodega 
    JOIN 
        usuarios u 
    ON 
        umbp.idUsuario = u.idUsuario
    WHERE 
        mb.FechaCreacionMovimientoBodega BETWEEN ? AND ?
    ORDER BY 
        mb.idMovimientoBodega DESC`;
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS MOVIMIENTOS DE UN BODEGUERO POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Movimientos en bodega > Lista de movimientos > Lista completa de movimientos
export const BuscarMovimientosEnBodegaDeUnBodegueroPorFiltro = async (
  req,
  res
) => {
  const { filtro, idUsuario } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBMEBPF = [idUsuario];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          mb.idMovimientoBodega, 
          mb.CantidadMovimientosEnBodega,
          mb.FechaCreacionMovimientoBodega, 
          mb.HoraCreacionMovimientoBodega, 
          u.Usuario 
      FROM 
          movimientosbodega mb 
      JOIN 
          union_movimientosbodega_pedidos umbp 
      ON 
          mb.idMovimientoBodega = umbp.idMovimientoBodega 
      JOIN 
          usuarios u 
      ON 
          umbp.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      ORDER BY 
          mb.idMovimientoBodega DESC`;
    } else {
      paramsBMEBPF.push(`%${filtro}%`);
      paramsBMEBPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          mb.idMovimientoBodega, 
          mb.FechaCreacionMovimientoBodega, 
          mb.HoraCreacionMovimientoBodega, 
          u.Usuario 
      FROM 
          movimientosbodega mb
      JOIN 
          union_movimientosbodega_pedidos umbp 
      ON 
          mb.idMovimientoBodega = umbp.idMovimientoBodega 
      JOIN 
          usuarios u 
      ON 
          umbp.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      AND 
          mb.idMovimientoBodega LIKE ?
      ORDER BY 
          mb.idMovimientoBodega DESC`;
    }

    CONEXION.query(sql, paramsBMEBPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS MOVIMIENTOS DE UN BODEGUERO POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Movimientos en bodega > Lista de movimientos > Lista completa de movimientos
export const BuscarMovimientosEnBodegaDeUnBodegueroPorFecha = async (
  req,
  res
) => {
  const { primeraFecha, segundaFecha, idUsuario } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          mb.idMovimientoBodega, 
          mb.CantidadMovimientosEnBodega,
          mb.FechaCreacionMovimientoBodega, 
          mb.HoraCreacionMovimientoBodega, 
          u.Usuario
    FROM 
        movimientosbodega mb
    JOIN 
        union_movimientosbodega_pedidos umbp 
    ON 
        mb.idMovimientoBodega = umbp.idMovimientoBodega 
    JOIN 
        usuarios u 
    ON 
        umbp.idUsuario = u.idUsuario
    WHERE 
        mb.FechaCreacionMovimientoBodega BETWEEN ? AND ?
        AND u.idUsuario = ?
    ORDER BY 
        mb.idMovimientoBodega DESC`;
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
// SE UTILIZA EN LAS VISTAS:
// Bodega > SALIDAS > Formulario
export const ObtenerMovimientosDeSalida = async (req, res) => {
  try {
    const sql = `SELECT * FROM movimientos WHERE CategoriaMovimiento = ? AND ActivoMovimiento = ?`;
    CONEXION.query(sql, ["Salida Bodega", "Activo"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// SE UTILIZA EN LAS VISTAS:
// Bodega > Salidas > Buscar o Escanear una Guía
export const ObtenerInformacionDeGuiaParaSalidas = async (req, res) => {
  const { GuiaPedido, idMovimientoSalida } = req.params;

  const GuiaYaSalida = await BuscarGuiaYaSalida(idMovimientoSalida, GuiaPedido);

  if (GuiaYaSalida) {
    return res
      .status(404)
      .json(
        "¡Oops! Parece que la guía ya salio de la bodega, por favor intente con otra."
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
const BuscarGuiaYaSalida = async (idMovimientoSalida, GuiaPedido) => {
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
        upm.idMovimiento = ? AND p.GuiaPedido = ?`;
    CONEXION.query(sql, [idMovimientoSalida, GuiaPedido], (error, result) => {
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
// Bodega > Salidas > Crear salida
export const CrearSalida = async (req, res) => {
  const { idUsuario, infSalida, salida } = req.body;

  const CantidadSalidas = salida.length;

  try {
    const idSalidaBodega = await CrearSalidaYObtenerId(
      CantidadSalidas,
      infSalida
    );

    for (const informacionSalida of salida) {
      await CrearSalidaYUnion(
        infSalida.idMovimientoSalida,
        idUsuario,
        idSalidaBodega,
        informacionSalida
      );
    }
    res.status(200).json("¡La salida a bodega ha sido creada con exito!");
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const CrearSalidaYObtenerId = async (CantidadSalidas, infSalida) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO salidasbodega (CantidadSalidas, NombreTransportista, Remolque, Tracto, Candado, HoraSalida, FechaCreacionSalida, HoraCreacionSalida) VALUES (?,?,?,?,?,?,CURDATE(), '${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [
        CantidadSalidas || 0,
        infSalida.NombreTransportista || "N/A",
        infSalida.Remolque || "N/A",
        infSalida.Tracto || "N/A",
        infSalida.Candado || "N/A",
        infSalida.HoraSalida || "00:00:00",
      ],
      (error, result) => {
        if (error) return reject(error);
        resolve(result.insertId);
      }
    );
  });
};
const CrearSalidaYUnion = async (
  idMovimientoSalida,
  idUsuario,
  idSalidaBodega,
  informacionSalida
) => {
  return new Promise(async (resolve, reject) => {
    await CrearUnionPedidoMovimientoUsuario(
      informacionSalida.idPedido,
      idMovimientoSalida,
      idUsuario
    );
    await CrearUnionDeLaSalida(
      idSalidaBodega,
      informacionSalida.idPedido,
      idUsuario
    );
    resolve(true);
  });
};
const CrearUnionDeLaSalida = async (idSalidaBodega, idPedido, idUsuario) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_salidas_pedidos (idSalidaBodega, idPedido, idUsuario) VALUES (?,?,?)`;
    CONEXION.query(
      sql,
      [idSalidaBodega, idPedido, idUsuario],
      (error, result) => {
        if (error) return reject(error);
        resolve(true);
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS SALIDAS A BODEGA POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Bodega > Salidas > Lista de Salidas
export const BuscarTodasLasSalidasABodegaPorFiltro = async (req, res) => {
  const { filtro } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBTLSABPF = [];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          sb.idSalidaBodega, 
          sb.CantidadSalidas,
          sb.FechaCreacionSalida, 
          sb.HoraCreacionSalida, 
          u.Usuario 
      FROM 
          salidasbodega sb 
      JOIN 
          union_salidas_pedidos usp 
      ON 
          sb.idSalidaBodega = usp.idSalidaBodega 
      JOIN 
          usuarios u 
      ON 
          usp.idUsuario = u.idUsuario
      ORDER BY 
          sb.idSalidaBodega DESC`;
    } else {
      paramsBTLSABPF.push(`%${filtro}%`);
      paramsBTLSABPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          sb.idSalidaBodega, 
          sb.CantidadSalidas,
          sb.FechaCreacionSalida, 
          sb.HoraCreacionSalida, 
          u.Usuario 
      FROM 
          salidasbodega sb 
      JOIN 
          union_salidas_pedidos usp 
      ON 
          sb.idSalidaBodega = usp.idSalidaBodega 
      JOIN 
          usuarios u 
      ON 
          usp.idUsuario = u.idUsuario
      WHERE 
          sb.idSalidaBodega LIKE ?
          OR u.Usuario LIKE ?
      ORDER BY 
          sb.idSalidaBodega DESC`;
    }

    CONEXION.query(sql, paramsBTLSABPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS SALIDAS A BODEGA POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Bodega > Salidas > Lista de Salidas por fecha
export const BuscarTodasLasSalidasABodegaPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          sb.idSalidaBodega, 
          sb.CantidadSalidas,
          sb.FechaCreacionSalida, 
          sb.HoraCreacionSalida, 
          u.Usuario 
    FROM 
        salidasbodega sb
    JOIN 
        union_salidas_pedidos usp 
    ON 
        sb.idSalidaBodega = usp.idSalidaBodega 
    JOIN 
        usuarios u 
    ON 
        usp.idUsuario = u.idUsuario
    WHERE 
        sb.FechaCreacionSalida BETWEEN ? AND ?
    ORDER BY 
        sb.idSalidaBodega DESC`;
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS SALIDAS A BODEGA  DE UN BODEGUERO POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Bodega > Salidas > Lista de Salidas
export const BuscarTodasLasSalidasABodegaDeUnBodegueroPorFiltro = async (
  req,
  res
) => {
  const { filtro, idUsuario } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramBTLSABPUBPF = [idUsuario];
    let sql;
    if (filtro === "") {
      sql = `SELECT DISTINCT 
          sb.idSalidaBodega, 
          sb.CantidadSalidas,
          sb.FechaCreacionSalida, 
          sb.HoraCreacionSalida, 
          u.Usuario 
      FROM 
          salidasbodega sb 
      JOIN 
          union_salidas_pedidos usp 
      ON 
          sb.idSalidaBodega = usp.idSalidaBodega 
      JOIN 
          usuarios u 
      ON 
          usp.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      ORDER BY 
          sb.idSalidaBodega DESC`;
    } else {
      paramBTLSABPUBPF.push(`%${filtro}%`);
      sql = `SELECT DISTINCT 
          sb.idSalidaBodega, 
          sb.CantidadSalidas,
          sb.FechaCreacionSalida, 
          sb.HoraCreacionSalida, 
          u.Usuario 
      FROM 
          salidasbodega sb 
      JOIN 
          union_salidas_pedidos usp 
      ON 
          sb.idSalidaBodega = usp.idSalidaBodega 
      JOIN 
          usuarios u 
      ON 
          usp.idUsuario = u.idUsuario
      WHERE 
          u.idUsuario = ?
      AND
          sb.idSalidaBodega LIKE ?
      ORDER BY 
          sb.idSalidaBodega DESC`;
    }

    CONEXION.query(sql, paramBTLSABPUBPF, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODAS LAS SALIDAS A BODEGA POR FECHA
// SE UTILIZA EN LAS VISTAS:
// Bodega > Salidas > Lista de salidas por fecha
export const BuscarTodasLasSalidasABodegaDeUnBodegueroPorFecha = async (
  req,
  res
) => {
  const { primeraFecha, segundaFecha, idUsuario } = req.body;
  try {
    const sql = `SELECT DISTINCT 
          sb.idSalidaBodega, 
          sb.CantidadSalidas,
          sb.FechaCreacionSalida, 
          sb.HoraCreacionSalida, 
          u.Usuario 
    FROM 
        salidasbodega sb
    JOIN 
        union_salidas_pedidos usp 
    ON 
        sb.idSalidaBodega = usp.idSalidaBodega 
    JOIN 
        usuarios u 
    ON 
        usp.idUsuario = u.idUsuario
    WHERE 
        sb.FechaCreacionSalida BETWEEN ? AND ?
    AND 
        u.idUsuario = ?
    ORDER BY 
        sb.idSalidaBodega DESC`;
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
