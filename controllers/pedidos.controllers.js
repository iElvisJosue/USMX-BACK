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
  CrearGuia,
  CrearCódigoDeRastreo,
} from "../helpers/Func.js";
import {
  CrearTicketDelPedido,
  CrearPaqueteDeTickets,
} from "../helpers/PDFs.js";

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
      let ListaDeGuias = [];

      // SI EL REMITENTE NO EXISTE, GUARDAMOS UNO NUEVO
      // DE LO CONTRARIO, NO LO ALMACENAMOS
      const idRemitente = remitente.idRemitente
        ? remitente.idRemitente
        : await EjecutarConsultaGuardarRemitente(remitente);
      // SI EL DESTINATARIO NO EXISTE, GUARDAMOS UNO NUEVO
      // DE LO CONTRARIO, NO LO ALMACENAMOS
      const idDestinatario = destinatario.idDestinatario
        ? destinatario.idDestinatario
        : await EjecutarConsultaGuardarDestinatario(destinatario);

      if (remitente.idRemitente === false)
        await CrearUnionRemitenteAgencia(idRemitente, pedido[0].idAgencia);
      if (destinatario.idDestinatario === false)
        await CrearUnionDestinatarioAgencia(
          idDestinatario,
          pedido[0].idAgencia
        );
      // Procesamos cada pedido secuencialmente usando un bucle for
      for (const infoPedido of pedido) {
        await EjecutarConsultaValidarPedido(
          remitente,
          destinatario,
          infoPedido,
          idRemitente,
          idDestinatario,
          CodigoRastreo,
          pedido,
          ListaDeGuias
        );
      }

      res.status(200).json({ CodigoRastreo });
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
    NombreRemitente,
    ApellidosRemitente,
    TelefonoCasaRemitente,
    CelularRemitente,
    CorreoRemitente,
    CodigoPostalRemitente,
    CiudadRemitente,
    EstadoRemitente,
    DireccionRemitente,
    ReferenciaRemitente,
  } = remitente;

  const sql = `INSERT INTO remitentes (NombreRemitente, ApellidosRemitente, TelefonoCasaRemitente, CelularRemitente, CorreoRemitente, CodigoPostalRemitente, CiudadRemitente, EstadoRemitente, DireccionRemitente, ReferenciaRemitente, FechaCreacionRemitente, HoraCreacionRemitente) 
    VALUES (
      '${NombreRemitente}', 
      '${ApellidosRemitente}', 
      '${TelefonoCasaRemitente}', 
      '${CelularRemitente}', 
      '${CorreoRemitente}', 
      '${CodigoPostalRemitente}', 
      '${CiudadRemitente}', 
      '${EstadoRemitente}', 
      '${DireccionRemitente}',
      '${ReferenciaRemitente ? ReferenciaRemitente : ""}',
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
    NombreDestinatario,
    ApellidoPaternoDestinatario,
    ApellidoMaternoDestinatario,
    TelefonoCasaDestinatario,
    CelularDestinatario,
    CorreoDestinatario,
    ColoniaDestinatario,
    MunicipioDelegacionDestinatario,
    CodigoPostalDestinatario,
    CiudadDestinatario,
    EstadoDestinatario,
    DireccionDestinatario,
    ReferenciaDestinatario,
  } = destinatario;

  const sql = `INSERT INTO destinatarios (NombreDestinatario, ApellidoPaternoDestinatario, ApellidoMaternoDestinatario, TelefonoCasaDestinatario, CelularDestinatario, CorreoDestinatario, ColoniaDestinatario, MunicipioDelegacionDestinatario, CodigoPostalDestinatario, CiudadDestinatario, EstadoDestinatario, DireccionDestinatario, ReferenciaDestinatario, FechaCreacionDestinatario, HoraCreacionDestinatario)
    VALUES (
      '${NombreDestinatario}',
      '${ApellidoPaternoDestinatario}',
      '${ApellidoMaternoDestinatario}',
      '${TelefonoCasaDestinatario}',
      '${CelularDestinatario}',
      '${CorreoDestinatario}',
      '${ColoniaDestinatario}',
      '${
        MunicipioDelegacionDestinatario ? MunicipioDelegacionDestinatario : ""
      }',
      '${CodigoPostalDestinatario}',
      '${CiudadDestinatario}',
      '${EstadoDestinatario}',
      '${DireccionDestinatario}',
      '${ReferenciaDestinatario ? ReferenciaDestinatario : ""}',
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
const CrearUnionRemitenteAgencia = (idRemitente, idAgencia) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_remitentes_agencias (idRemitente, idAgencia) VALUES ('${idRemitente}', '${idAgencia}')`;
    CONEXION.query(sql, (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
      resolve(true);
    });
  });
};
const CrearUnionDestinatarioAgencia = (idDestinatario, idAgencia) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_destinatarios_agencias (idDestinatario, idAgencia) VALUES ('${idDestinatario}', '${idAgencia}')`;
    CONEXION.query(sql, (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
      resolve(true);
    });
  });
};
const EjecutarConsultaValidarPedido = async (
  remitente,
  destinatario,
  infoPedido,
  idRemitente,
  idDestinatario,
  CodigoRastreo,
  pedido,
  ListaDeGuias
) => {
  // CREAMOS EL NOMBRE DEL PAQUETE DE TICKETS
  const NombreDelPaqueteDeTickets = `Ticket_Paquete_${CodigoRastreo}.pdf`;
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

  // GUARDAMOS TODAS LAS GUIAS EN UNA LISTA
  ListaDeGuias.push(GuiaPedido);

  // SOLO CREAREMOS UN PDF CON VARIOS TICKETS SI SON MÁS DE 1 PEDIDO
  // Y CUANDO LA CANTIDAD DE GUIAS SEA IGUAL A LA CANTIDAD DE PEDIDOS
  if (ListaDeGuias.length > 1 && ListaDeGuias.length === pedido.length) {
    CrearPaqueteDeTickets(
      NombreDelPaqueteDeTickets,
      remitente,
      destinatario,
      ListaDeGuias,
      pedido
    );
  }

  try {
    await EjecutarConsultaGuardarPedido(
      remitente,
      destinatario,
      infoPedido,
      idRemitente,
      idDestinatario,
      CodigoRastreo,
      GuiaPedido,
      NombreDelPaqueteDeTickets
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
  remitente,
  destinatario,
  infoPedido,
  idRemitente,
  idDestinatario,
  CodigoRastreo,
  GuiaPedido,
  NombreDelPaqueteDeTickets
) => {
  // CREAMOS EL NOMBRE DEL PDF
  const NombreDelTicket = `Ticket_Pedido_${GuiaPedido}.pdf`;

  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO pedidos (
      GuiaPedido, ProductoPedido, TipoCargaPedido, TipoEnvioPedido, ContenidoPedido, LargoPedido, AnchoPedido, AltoPedido, PieCubicoPedido, PesoPedido, ValorDeclaradoPedido, ValorAseguradoPedido, CostoSeguroPedido, 
      CostoEnvioPedido, CostoSobrePesoPedido, TotalPedido, UsuarioResponsablePedido, TicketPedido, PaqueteTicketsPedido, FechaCreacionPedido, HoraCreacionPedido) VALUES (
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
      '${NombreDelTicket}',
      '${NombreDelPaqueteDeTickets}',
      CURDATE(),
      '${ObtenerHoraActual()}'
    )`;
    CONEXION.query(sql, (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
      CrearMovimientosPorDefecto(GuiaPedido, infoPedido.UsuarioResponsable);
      CrearTicketDelPedido(
        NombreDelTicket,
        remitente,
        destinatario,
        infoPedido,
        GuiaPedido
      );
      CrearUnionRemitenteDestinatarioPedido(
        idRemitente,
        idDestinatario,
        result.insertId,
        infoPedido.idAgencia,
        CodigoRastreo
      );
      resolve(true);
    });
  });
};
const CrearMovimientosPorDefecto = (GuiaPedido, UsuarioResponsable) => {
  const sql = `INSERT INTO movimientos (GuiaPedido, EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, UsuarioResponsableMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento)
  VALUES
    ('${GuiaPedido}', 'Creado', 'El pedido ha sido creado en el sistema.', 'Sistema USMX', '${
    UsuarioResponsable ?? "No definido"
  }', CURDATE(), '${ObtenerHoraActual()}'),
    ('${GuiaPedido}', 'Pendiente', 'El pago no ha sido confirmado.', 'Sistema USMX', '${
    UsuarioResponsable ?? "No definido"
  }', CURDATE(), '${ObtenerHoraActual()}')`;
  return new Promise((resolve, reject) => {
    CONEXION.query(sql, (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
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
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS REMITENTES POR AGENCIA
// SE UTILIZA EN LAS VISTAS: Paquetería  > Realizar pedido > Remitente
export const BuscarRemitentesPorAgencia = async (req, res) => {
  const { CookieConToken, filtro, idAgencia } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken) res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql =
      filtro === ""
        ? `SELECT r.* FROM union_remitentes_agencias ura LEFT JOIN remitentes r ON ura.idRemitente = r.idRemitente WHERE ura.idAgencia = '${idAgencia}'`
        : `SELECT r.* FROM union_remitentes_agencias ura LEFT JOIN remitentes r ON ura.idRemitente = r.idRemitente WHERE ura.idAgencia = '${idAgencia}' AND r.NombreRemitente LIKE '%${filtro}%'`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result); // Devuelve un array con los remitentes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS DESTINATARIOS POR AGENCIA
// SE UTILIZA EN LAS VISTAS: Paquetería  > Realizar pedido > Remitente
export const BuscarDestinatariosPorAgencia = async (req, res) => {
  const { CookieConToken, filtro, idAgencia } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken) res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql =
      filtro === ""
        ? `SELECT d.* FROM union_destinatarios_agencias uda LEFT JOIN destinatarios d ON uda.idDestinatario = d.idDestinatario WHERE uda.idAgencia = '${idAgencia}'`
        : `SELECT d.* FROM union_destinatarios_agencias uda LEFT JOIN destinatarios d ON uda.idDestinatario = d.idDestinatario WHERE uda.idAgencia = '${idAgencia}' AND d.NombreDestinatario LIKE '%${filtro}%'`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result); // Devuelve un array con los destinatarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS ULTIMOS 10 PEDIDOS REALIZADOS
// SE UTILIZA EN LAS VISTAS: Bienvenida
export const BuscarUltimosDiezPedidos = async (req, res) => {
  try {
    const sql = `SELECT 
      p.GuiaPedido, 
      p.FechaCreacionPedido,
      p.HoraCreacionPedido,
      a.NombreAgencia, 
      urdp.CodigoRastreo  
      FROM 
          union_remitentes_destinatarios_pedidos urdp
      LEFT JOIN 
          pedidos p ON urdp.idPedido = p.idPedido
      LEFT JOIN 
          agencias a ON urdp.idAgencia = a.idAgencia
      ORDER BY 
          p.FechaCreacionPedido DESC, 
          p.HoraCreacionPedido DESC,
          p.idPedido DESC 
      LIMIT 10;
      `;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS MOVIMIENTOS DE UN PEDIDO
// SE UTILIZA EN LAS VISTAS: Paquetería  > Pedidos > Detalles del pedido
// SE UTILIZA EN LAS VISTAS: Paquetería  > Realizar pedido > Detalles del pedido
export const BuscarMovimientosDeUnPedido = async (req, res) => {
  const { CookieConToken, GuiaPedido } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );
  if (!RespuestaValidacionToken) res.status(500).json(MENSAJE_DE_NO_AUTORIZADO);
  try {
    const sql = `SELECT * FROM movimientos WHERE GuiaPedido = '${GuiaPedido}' ORDER BY idMovimiento DESC;`;
    CONEXION.query(sql, (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
