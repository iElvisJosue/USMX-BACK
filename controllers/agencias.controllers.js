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

// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Agencias > Asignar Producto
// Usuarios > Administrar Usuarios
export const BuscarAgenciasPorFiltroYTipoDeUsuario = async (req, res) => {
  const { CookieConToken, filtro, tipoDeUsuario, idDelUsuario } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken) {
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }

  try {
    if (tipoDeUsuario === "Administrador") {
      const sql =
        filtro === ""
          ? `SELECT * FROM agencias WHERE StatusAgencia = 'Activa' ORDER BY idAgencia DESC`
          : `SELECT * FROM agencias WHERE NombreAgencia LIKE '%${filtro}%' AND StatusAgencia = 'Activa' ORDER BY idAgencia DESC`;
      CONEXION.query(sql, (error, result) => {
        if (error) throw error;
        res.send(result);
      });
    } else {
      const sql = `SELECT * FROM union_usuarios_agencias uua LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia WHERE uua.idUsuario = ${idDelUsuario} AND a.StatusAgencia = 'Activa' ORDER BY a.idAgencia DESC`;
      CONEXION.query(sql, (error, result) => {
        if (error) throw error;
        res.send(result);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

// EN ESTA FUNCIÓN VAMOS A REGISTRAR UNA NUEVA AGENCIA
// SE UTILIZA EN LAS VISTAS: Agencias > Registrar Agencia
export const RegistrarAgencia = async (req, res) => {
  const {
    Agencia,
    Contacto,
    Telefono,
    Correo,
    Estado,
    Ciudad,
    CP,
    Direccion,
    PrecioPublico,
    LibraExtra,
    PesoSinCobro,
    PesoMaximo,
    CookieConToken,
  } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (RespuestaValidacionToken) {
    try {
      const sql = `INSERT INTO agencias (NombreAgencia, NombreContactoAgencia, TelefonoContactoAgencia, CorreoContactoAgencia, EstadoAgencia, CiudadAgencia, CodigoPostalAgencia, DireccionAgencia, PrecioPublicoAgencia, LibraExtraAgencia, PesoSinCobroAgencia, PesoMaximoAgencia, FechaCreacionAgencia, HoraCreacionAgencia) VALUES (
      '${Agencia}', 
      '${Contacto}', 
      '${Telefono}', 
      '${Correo}', 
      '${Estado}', 
      '${Ciudad}', 
      '${CP}', 
      '${Direccion}', 
      '${PrecioPublico}', 
      '${LibraExtra}',
      '${PesoSinCobro}', 
      '${PesoMaximo}',
      CURDATE(),
      '${ObtenerHoraActual()}'
      )`;
      CONEXION.query(sql, (error, result) => {
        if (error) throw error;
        res
          .status(200)
          .json(
            `La agencia ${Agencia.toUpperCase()} ha sido registrada correctamente ✨`
          );
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(MENSAJE_DE_ERROR);
    }
  } else {
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PRODUCTOS QUE TIENE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS: Agencias > Asignar Productos
export const BuscarProductosQueTieneLaAgencia = async (req, res) => {
  const { CookieConToken, idAgencia } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT 
    p.NombreProducto,
    p.AnchoProducto,
    p.AltoProducto,
    p.LargoProducto,
    uap.idUnionAgenciasProductos,
    uap.PrecioProducto,
    uap.ComisionProducto,
    uap.LibraExtraProducto,
    uap.PesoSinCobroProducto,
    uap.PesoMaximoProducto
    FROM union_agencias_productos uap 
    LEFT JOIN productos p ON uap.idProducto = p.idProducto 
    WHERE uap.idAgencia = ${idAgencia} AND p.StatusProducto = 'Activo'`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PRODUCTOS QUE NO TIENE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS: Agencias > Asignar Productos
export const BuscarProductosQueNoTieneLaAgencia = async (req, res) => {
  const { CookieConToken, filtro, idAgencia } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql =
      filtro === ""
        ? `SELECT * FROM productos WHERE idProducto NOT IN (SELECT idProducto FROM union_agencias_productos WHERE idAgencia = ${idAgencia}) AND StatusProducto = 'Activo'`
        : `SELECT * FROM productos WHERE NombreProducto LIKE '%${filtro}%' AND StatusProducto = 'Activo' AND idProducto NOT IN (SELECT idProducto FROM union_agencias_productos WHERE idAgencia = ${idAgencia})`;
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
// SE UTILIZA EN LAS VISTAS: Agencias > Asignar Productos
export const AsignarProductoAgencia = async (req, res) => {
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
      res.status(200).json("El producto ha sido asignada con éxito ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A DESASIGNAR UN PRODUCTO A UNA AGENCIA
// SE UTILIZA EN LAS VISTAS: Agencias > Asignar Productos
export const DesasignarProductoAgencia = async (req, res) => {
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
      res.status(200).json("El producto ha sido desasignado con éxito ✨");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR EL ESTADO DE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS: Agencias > Administrar Agencias
export const ActualizarEstadoAgencia = async (req, res) => {
  const { idAgencia, StatusAgencia, CookieConToken } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE agencias SET StatusAgencia = '${StatusAgencia}' WHERE idAgencia = ${idAgencia}`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res
        .status(200)
        .json(`Agencia ${StatusAgencia.toUpperCase()} con éxito ✨`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A ACTUALIZAR LA INFORMACIoN DE UNA AGENCIA
// SE UTILIZA EN LAS VISTAS: Agencias > Administrar Agencias
export const ActualizarInformacionAgencia = async (req, res) => {
  const {
    CookieConToken,
    idAgencia,
    Agencia,
    Contacto,
    Telefono,
    Correo,
    Estado,
    Ciudad,
    CP,
    Direccion,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `UPDATE agencias SET NombreAgencia = '${Agencia}', NombreContactoAgencia = '${Contacto}', TelefonoContactoAgencia = '${Telefono}', CorreoContactoAgencia = '${Correo}', EstadoAgencia = '${Estado}', CiudadAgencia = '${Ciudad}', CodigoPostalAgencia = '${CP}', DireccionAgencia = '${Direccion}' WHERE idAgencia = '${idAgencia}'`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res
        .status(200)
        .json(
          `La agencia ${Agencia.toUpperCase()} ha sido actualizada con éxito ✨`
        );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LAS AGENCIAS POR UN FILTRO DETERMINADO
// SE UTILIZA EN LAS VISTAS:
// Agencias > Administrar Agencias
export const BuscarAgenciasPorFiltro = async (req, res) => {
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
        ? `SELECT * FROM agencias  ORDER BY idAgencia DESC`
        : `SELECT * FROM agencias WHERE NombreAgencia LIKE '%${filtro}%' ORDER BY idAgencia DESC`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
