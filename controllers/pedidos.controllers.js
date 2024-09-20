// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
import {
  MENSAJE_DE_ERROR,
  MENSAJE_DE_NO_AUTORIZADO,
} from "../helpers/Const.js";

import {
  ValidarTokenParaPeticion,
  ObtenerHoraActual,
  CrearGuia,
  CrearCódigoDeRastreo,
} from "../helpers/Func.js";

// EN ESTA FUNCIÓN VAMOS GUARDAR TODA LA INFORMACION DEL DESTINATARIO, REMITENTE Y PEDIDO
// SE UTILIZA EN LAS VISTAS: Paquetería > Registrar Productos > Pedido > Finalizar
export const GuardarTodaLaInformacion = async (req, res) => {
  const { CookieConToken, remitente, destinatario, pedido } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (RespuestaValidacionToken) {
    try {
      const CodigoRastreo = CrearCódigoDeRastreo();
      const idRemitente = await EjecutarConsultaGuardarRemitente(remitente);
      const idDestinatario = await EjecutarConsultaGuardarDestinatario(
        destinatario
      );

      // Procesamos cada pedido secuencialmente usando un bucle for
      for (const infoPedido of pedido) {
        await EjecutarConsultaValidarPedido(
          infoPedido,
          idRemitente,
          idDestinatario,
          CodigoRastreo
        );
      }

      res.status(200).json("El pedido ha sido guardado con éxito ✨");
    } catch (error) {
      console.log(error);
      res.status(500).json(MENSAJE_DE_ERROR);
    }
  } else {
    res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  }
};
const EjecutarConsultaGuardarRemitente = (remitente) => {
  const {
    Nombre,
    Apellidos,
    Telefono,
    Celular,
    Correo,
    CodigoPostal,
    Ciudad,
    Estado,
    Direccion,
    Referencia,
  } = remitente;

  const sql = `INSERT INTO remitentes (NombreRemitente, ApellidosRemitente, TelefonoCasaRemitente, CelularRemitente, CorreoRemitente, CodigoPostalRemitente, CiudadRemitente, EstadoRemitente, DireccionRemitente, ReferenciaRemitente, FechaCreacionRemitente, HoraCreacionRemitente) 
    VALUES (
      '${Nombre}', 
      '${Apellidos}', 
      '${Telefono}', 
      '${Celular}', 
      '${Correo}', 
      '${CodigoPostal}', 
      '${Ciudad}', 
      '${Estado}', 
      '${Direccion}',
      '${Referencia ? Referencia : ""}',
      CURDATE(),
      '${ObtenerHoraActual()}')`;

  return new Promise((resolve, reject) => {
    CONEXION.query(sql, (error, result) => {
      if (error) {
        reject(error); // Si hay error, rechaza la promesa
      } else {
        resolve(result.insertId); // Si todo va bien, resuelve con el insertId
      }
    });
  });
};
const EjecutarConsultaGuardarDestinatario = (destinatario) => {
  const {
    Nombre,
    ApellidoPaterno,
    ApellidoMaterno,
    Telefono,
    Celular,
    Correo,
    Colonia,
    MunicipioDelegacion,
    CodigoPostal,
    Ciudad,
    Estado,
    Direccion,
    Referencia,
  } = destinatario;

  const sql = `INSERT INTO destinatarios (NombreDestinatario, ApellidoPaternoDestinatario, ApellidoMaternoDestinatario, TelefonoCasaDestinatario, CelularDestinatario, CorreoDestinatario, ColoniaDestinatario, MunicipioDelegacionDestinatario, CodigoPostalDestinatario, CiudadDestinatario, EstadoDestinatario, DireccionDestinatario, ReferenciaDestinatario, FechaCreacionDestinatario, HoraCreacionDestinatario)
    VALUES (
      '${Nombre}',
      '${ApellidoPaterno}',
      '${ApellidoMaterno}',
      '${Telefono}',
      '${Celular}',
      '${Correo}',
      '${Colonia}',
      '${MunicipioDelegacion ? MunicipioDelegacion : ""}',
      '${CodigoPostal}',
      '${Ciudad}',
      '${Estado}',
      '${Direccion}',
      '${Referencia ? Referencia : ""}',
      CURDATE(),
      '${ObtenerHoraActual()}')`;

  return new Promise((resolve, reject) => {
    CONEXION.query(sql, (error, result) => {
      if (error) {
        reject(error); // Si hay error, rechaza la promesa
      } else {
        resolve(result.insertId); // Si todo va bien, resuelve con el insertId
      }
    });
  });
};
const EjecutarConsultaValidarPedido = async (
  infoPedido,
  idRemitente,
  idDestinatario,
  CodigoRastreo
) => {
  let GuiaDuplicada = true;
  let GuiaPedido;

  // Generar un número de guía único
  while (GuiaDuplicada) {
    GuiaPedido = CrearGuia(); // Genera una nueva guía
    GuiaDuplicada = await VerificarGuiaRepetida(GuiaPedido); // Espera a verificar si está duplicada
    if (GuiaDuplicada) {
      console.log("Guía duplicada, generando una nueva...");
    }
  }

  try {
    const sql = `
        INSERT INTO pedidos (
          GuiaPedido, ProductoPedido, TipoCargaPedido, TipoEnvioPedido, ContenidoPedido, LargoPedido, AnchoPedido, AltoPedido, PieCubicoPedido, PesoPedido, ValorDeclaradoPedido, ValorAseguradoPedido, CostoSeguroPedido, 
          CostoEnvioPedido, CostoSobrePesoPedido, TotalPedido, UsuarioResponsablePedido, FechaCreacionPedido, HoraCreacionPedido) VALUES (
          '${GuiaPedido}',
          '${infoPedido.Producto}',
          '${infoPedido.TipoDeCarga}',
          '${infoPedido.TipoDeEnvio}',
          '${infoPedido.ContenidoDeEnvio}',
          '${infoPedido.Largo}',
          '${infoPedido.Ancho}',
          '${infoPedido.Alto}',
          '${infoPedido.PieCubico}',
          '${infoPedido.Peso}',
          '${Number(infoPedido.ValorDeclarado)}',
          '${Number(infoPedido.ValorAsegurado)}',
          '${infoPedido.CostoSeguro}',
          '${infoPedido.CostoEnvio}',
          '${infoPedido.CostoSobrePeso}',
          '${infoPedido.Total}',
          '${infoPedido.UsuarioResponsable}',
          CURDATE(),
          '${ObtenerHoraActual()}'
        )`;

    await EjecutarConsultaGuardarPedido(
      sql,
      idRemitente,
      idDestinatario,
      infoPedido.idAgencia,
      CodigoRastreo
    );
    console.log("Pedido guardado correctamente");
  } catch (error) {
    console.log("Error al guardar el pedido:", error);
    throw error; // Lanza el error para que sea capturado en el bloque que llama a esta función
  }
};
const VerificarGuiaRepetida = (GuiaPedido) => {
  const sql = `SELECT * FROM pedidos WHERE GuiaPedido = '${GuiaPedido}'`;
  return new Promise((resolve, reject) => {
    CONEXION.query(sql, (error, result) => {
      if (error) return reject(error);
      resolve(result.length > 0); // Devuelve true si la guia está duplicado
    });
  });
};
const EjecutarConsultaGuardarPedido = (
  sql,
  idRemitente,
  idDestinatario,
  idAgencia,
  CodigoRastreo
) => {
  return new Promise((resolve, reject) => {
    CONEXION.query(sql, (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
      CrearUnionRemitenteDestinatarioPedido(
        idRemitente,
        idDestinatario,
        result.insertId,
        idAgencia,
        CodigoRastreo
      );
      resolve(true);
    });
  });
};
const CrearUnionRemitenteDestinatarioPedido = (
  idRemitente,
  idDestinatario,
  idPedido,
  idAgencia,
  CodigoRastreo
) => {
  const sql = `INSERT INTO union_remitentes_destinatarios_pedidos (idRemitente, idDestinatario, idPedido, idAgencia, CodigoRastreo) VALUES ('${idRemitente}', '${idDestinatario}', '${idPedido}', '${idAgencia}', '${CodigoRastreo}')`;
  return new Promise((resolve, reject) => {
    CONEXION.query(sql, (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
      resolve(true);
    });
  });
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PEDIDOS POR FILTROS
// SE UTILIZA EN LAS VISTAS: Paquetería > Detalles de envío
export const BuscarPedidosPorFiltro = async (req, res) => {
  const { filtro, CookieConToken, tipoDeUsuario, idDelUsuario } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);

  if (tipoDeUsuario === "Administrador") {
    try {
      const PedidosParaElAdministrador =
        await BusquedaDePedidosParaElAdministrador(filtro);
      res.send(PedidosParaElAdministrador);
    } catch (error) {
      console.log(error);
      res.status(500).json(MENSAJE_DE_ERROR);
    }
  }
  if (tipoDeUsuario === "Usuario") {
    try {
      const PedidosParaElUsuario = await BusquedaDePedidosParaElUsuario(
        filtro,
        idDelUsuario
      );
      res.send(PedidosParaElUsuario);
    } catch (error) {
      console.log(error);
      res.status(500).send(MENSAJE_DE_ERROR);
    }
  }
};
const BusquedaDePedidosParaElAdministrador = (filtro) => {
  const sql =
    filtro === ""
      ? `SELECT 
            urdp.idRemitente,
            urdp.idDestinatario,
            urdp.idPedido,
            urdp.idAgencia,
            urdp.CodigoRastreo,
            r.*,
            d.*,
            p.*,
            a.*
            FROM 
                union_remitentes_destinatarios_pedidos urdp
            LEFT JOIN 
                remitentes r ON urdp.idRemitente = r.idRemitente
            LEFT JOIN 
                destinatarios d ON urdp.idDestinatario = d.idDestinatario
            LEFT JOIN 
                pedidos p ON urdp.idPedido = p.idPedido
            LEFT JOIN 
                agencias a ON urdp.idAgencia = a.idAgencia
            ORDER BY p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`
      : `SELECT 
            urdp.idRemitente,
            urdp.idDestinatario,
            urdp.idPedido,
            urdp.idAgencia,
            urdp.CodigoRastreo,
            r.*,
            d.*,
            p.*,
            a.*
            FROM 
                union_remitentes_destinatarios_pedidos urdp
            LEFT JOIN 
                remitentes r ON urdp.idRemitente = r.idRemitente
            LEFT JOIN 
                destinatarios d ON urdp.idDestinatario = d.idDestinatario
            LEFT JOIN 
                pedidos p ON urdp.idPedido = p.idPedido
            LEFT JOIN 
                agencias a ON urdp.idAgencia = a.idAgencia
            WHERE 
                p.GuiaPedido LIKE '%${filtro}%'
                OR p.UsuarioResponsablePedido LIKE '%${filtro}%'
                OR r.NombreRemitente LIKE '%${filtro}%'
                OR d.NombreDestinatario LIKE '%${filtro}%'
                OR a.NombreAgencia LIKE '%${filtro}%'
            ORDER BY p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
  return new Promise((resolve, reject) => {
    CONEXION.query(sql, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
const BusquedaDePedidosParaElUsuario = async (filtro, idDelUsuario) => {
  const sqlObtenerAgencias = `SELECT uua.idAgencia FROM union_usuarios_agencias uua LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia WHERE uua.idUsuario = '${idDelUsuario}'`;

  return new Promise((resolve, reject) => {
    CONEXION.query(sqlObtenerAgencias, (error, result) => {
      if (error) return reject(error);

      const promesasDeBusqueda = result.map(({ idAgencia }) => {
        const sql =
          filtro === ""
            ? `SELECT 
                urdp.idRemitente,
                urdp.idDestinatario,
                urdp.idPedido,
                urdp.idAgencia,
                urdp.CodigoRastreo,
                r.*,
                d.*,
                p.*,
                a.*
                FROM 
                    union_remitentes_destinatarios_pedidos urdp
                LEFT JOIN 
                    remitentes r ON urdp.idRemitente = r.idRemitente
                LEFT JOIN 
                    destinatarios d ON urdp.idDestinatario = d.idDestinatario
                LEFT JOIN 
                    pedidos p ON urdp.idPedido = p.idPedido
                LEFT JOIN 
                    agencias a ON urdp.idAgencia = a.idAgencia
                WHERE 
                    urdp.idAgencia = '${idAgencia}'
                ORDER BY 
                    p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`
            : `SELECT 
                urdp.idRemitente,
                urdp.idDestinatario,
                urdp.idPedido,
                urdp.idAgencia,
                urdp.CodigoRastreo,
                r.*,
                d.*,
                p.*,
                a.*
                FROM 
                    union_remitentes_destinatarios_pedidos urdp
                LEFT JOIN 
                    remitentes r ON urdp.idRemitente = r.idRemitente
                LEFT JOIN 
                    destinatarios d ON urdp.idDestinatario = d.idDestinatario
                LEFT JOIN 
                    pedidos p ON urdp.idPedido = p.idPedido
                LEFT JOIN 
                    agencias a ON urdp.idAgencia = a.idAgencia
                WHERE 
                    urdp.idAgencia = '${idAgencia}'
                    AND (
                        p.GuiaPedido LIKE '%${filtro}%'
                        OR p.UsuarioResponsablePedido LIKE '%${filtro}%'
                        OR r.NombreRemitente LIKE '%${filtro}%'
                        OR d.NombreDestinatario LIKE '%${filtro}%'
                        OR a.NombreAgencia LIKE '%${filtro}%'
                    )
                ORDER BY 
                    p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
        return new Promise((resolve, reject) => {
          CONEXION.query(sql, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
        });
      });

      Promise.all(promesasDeBusqueda)
        .then((results) => resolve(results.flat()))
        .catch((error) => reject(error));
    });
  });
};
// EN ESTA FUNCIÓN VAMOS A OBTENER TODOS LOS PEDIDOS QUE SE REALIZARON POR "PAQUETES"
// SE UTILIZA EN LAS VISTAS: Paquetería  > Pedidos > Detalles del pedido
export const BuscarPedidosPorPaquete = async (req, res) => {
  const { CookieConToken, CodigoRastreo, GuiaPedido } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken) res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql = `SELECT 
            r.*,
            d.*,
            p.*,
            a.*
            FROM 
                union_remitentes_destinatarios_pedidos urdp
            LEFT JOIN 
                remitentes r ON urdp.idRemitente = r.idRemitente
            LEFT JOIN 
                destinatarios d ON urdp.idDestinatario = d.idDestinatario
            LEFT JOIN 
                pedidos p ON urdp.idPedido = p.idPedido
            LEFT JOIN 
                agencias a ON urdp.idAgencia = a.idAgencia
            WHERE 
            	urdp.CodigoRastreo = '${CodigoRastreo}'
            ORDER BY p.GuiaPedido = '${GuiaPedido}' DESC`;

    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
