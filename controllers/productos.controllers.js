// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";
import {
  ObtenerHoraActual,
  ValidarTokenParaPeticion,
} from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UN PRODUCTO
// SE UTILIZA EN LAS VISTAS:
// Productos > Registrar Productos
export const RegistrarProducto = async (req, res) => {
  const {
    NombreProducto,
    AnchoProducto,
    LargoProducto,
    AltoProducto,
    PrecioProducto,
    CostoLibraExtraProducto,
    PesoSinCobroProducto,
    PesoMaximoProducto,
    ComisionProducto,
    CookieConToken,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  const sql = `SELECT * FROM productos WHERE NombreProducto = '${NombreProducto}'`;
  CONEXION.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      res
        .status(500)
        .json(
          `El producto ${NombreProducto.toUpperCase()} ya existe, por favor intente con otro nombre de usuario ❌`
        );
    } else {
      const sql = `INSERT INTO productos (NombreProducto, AnchoProducto, LargoProducto, AltoProducto, PrecioProducto, LibraExtraProducto, 
      PesoSinCobroProducto, PesoMaximoProducto, ComisionProducto, FechaCreacionProducto, HoraCreacionProducto) VALUES (
              '${NombreProducto}',
              '${AnchoProducto}',
              '${LargoProducto}',
              '${AltoProducto}',
              '${PrecioProducto}',
              '${CostoLibraExtraProducto}',
              '${PesoSinCobroProducto}',
              '${PesoMaximoProducto}',
              '${ComisionProducto}',
              CURDATE(),
              '${ObtenerHoraActual()}'
              )`;
      CONEXION.query(sql, (error, result) => {
        if (error) throw error;
        res
          .status(200)
          .json(
            `El producto ${NombreProducto.toUpperCase()} ha sido registrado correctamente ✨`
          );
      });
    }
  });
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

// EN ESTA FUNCIÓN VAMOS A OBTENER LOS PRODUCTOS POR UNA AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Agencias > Asignar Productos
export const ObtenerProductosPorAgencia = async (req, res) => {
  const { idAgencia, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (RespuestaValidacionToken) {
    try {
      const sql = `SELECT 
      p.NombreProducto,
      p.AnchoProducto,
      p.LargoProducto,
      p.AltoProducto,
      p.idProducto,
      uap.PrecioProducto,
      uap.ComisionProducto,
      uap.LibraExtraProducto,
      uap.PesoSinCobroProducto,
      uap.PesoMaximoProducto
      FROM union_agencias_productos uap
      LEFT JOIN productos p ON uap.idProducto = p.idProducto
      WHERE uap.idAgencia = ${idAgencia};`;
      CONEXION.query(sql, (error, result) => {
        if (error) throw error;
        res.send(result);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(MENSAJE_DE_ERROR);
    }
  } else {
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }
};

// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PRODUCTOS POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Productos > Administrar Productos
export const BuscarProductosPorFiltro = async (req, res) => {
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
        ? `SELECT * FROM productos ORDER BY idProducto DESC`
        : `SELECT * FROM productos WHERE NombreProducto LIKE '%${filtro}%' ORDER BY NombreProducto DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS: Productos > Administrar Productos
export const BuscarAgenciasQueTieneUnProducto = async (req, res) => {
  const { CookieConToken, idProducto } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    // const sql = `SELECT * FROM union_agencias_productos uap LEFT JOIN agencias a ON uap.idAgencia = a.idAgencia WHERE uap.idUsuario = ${idUsuario} AND a.StatusAgencia = 'Activa' ORDER BY a.idAgencia DESC`;
    const sql = `SELECT * FROM union_agencias_productos uap LEFT JOIN agencias a ON uap.idAgencia = a.idAgencia WHERE uap.idProducto = ${idProducto} AND a.StatusAgencia = 'Activa' ORDER BY a.idAgencia DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS QUE NO TIENE EL USUARIO
// SE UTILIZA EN LAS VISTAS: Productos > Administrar Productos
export const BuscarAgenciasQueNoTieneUnProducto = async (req, res) => {
  const { CookieConToken, filtro, idProducto } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT *
          FROM agencias
          WHERE StatusAgencia = 'Activa' AND idAgencia NOT IN (SELECT idAgencia FROM union_agencias_productos WHERE idProducto = ${idProducto})
          ORDER BY idAgencia DESC`
        : `SELECT *
          FROM agencias
          WHERE NombreAgencia LIKE '%${filtro}%'
          AND StatusAgencia = 'Activa'
          AND idAgencia NOT IN (SELECT idAgencia FROM union_agencias_productos WHERE idProducto = ${idProducto})
          ORDER BY idAgencia DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ASIGNAR UN PRODUCTO A UNA AGENCIA
// SE UTILIZA EN LAS VISTAS: Productos > Administrar Productos > Asignar Productos
export const AsignarAgenciaAlProducto = async (req, res) => {
  const {
    CookieConToken,
    idAgencia,
    idProducto,
    PrecioProducto,
    ComisionProducto,
    LibraExtraProducto,
    PesoMaximoProducto,
    PesoSinCobroProducto,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `INSERT INTO union_agencias_productos (idAgencia, idProducto, PrecioProducto, ComisionProducto, LibraExtraProducto, PesoMaximoProducto, PesoSinCobroProducto) VALUES (${idAgencia}, ${idProducto}, '${PrecioProducto}', '${ComisionProducto}', '${LibraExtraProducto}', '${PesoMaximoProducto}', '${PesoSinCobroProducto}')`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json("La agencia ha sido asignada con éxito ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A DESASIGNAR UN PRODUCTO A UNA AGENCIA
// SE UTILIZA EN LAS VISTAS: Productos > Administrar Productos > Asignar Productos
export const DesasignarAgenciaAlProducto = async (req, res) => {
  const { CookieConToken, idUnionAgenciasProductos } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `DELETE FROM union_agencias_productos WHERE idUnionAgenciasProductos = ${idUnionAgenciasProductos}`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json("La agencia ha sido desasignada con éxito ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCION VAMOS A ACTUALIZAR LA INFORMACION DE UN PRODUCTO
// SE UTILIZA EN LAS VISTAS: Productos > Administrar Productos > Editar Producto
export const ActualizarInformacionDeUnProducto = async (req, res) => {
  const {
    CookieConToken,
    idProducto,
    NombreProducto,
    AnchoProducto,
    LargoProducto,
    AltoProducto,
    PrecioProducto,
    CostoLibraExtraProducto,
    PesoSinCobroProducto,
    PesoMaximoProducto,
    ComisionProducto,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE productos SET NombreProducto = '${NombreProducto}', AnchoProducto = '${AnchoProducto}', LargoProducto = '${LargoProducto}', AltoProducto = '${AltoProducto}', PrecioProducto = '${PrecioProducto}', LibraExtraProducto = ${CostoLibraExtraProducto}, PesoSinCobroProducto = '${PesoSinCobroProducto}', PesoMaximoProducto = '${PesoMaximoProducto}', ComisionProducto = '${ComisionProducto}' WHERE idProducto = ${idProducto}`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json("El producto ha sido actualizado correctamente ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
