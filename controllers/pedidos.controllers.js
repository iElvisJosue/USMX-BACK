// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";

// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_ERROR_CONSULTA_SQL,
} from "../helpers/Const.js";
import {
  ObtenerHoraActual,
  CrearGuia,
  CrearCódigoDeRastreo,
} from "../helpers/Func.js";
import {
  CrearTicketDelPedido,
  CrearEtiquetaDelPedido,
  CrearPaqueteDeTickets,
} from "../helpers/PDFs.js";

// EN ESTA FUNCIÓN VAMOS GUARDAR TODA LA INFORMACION DEL DESTINATARIO, REMITENTE Y PEDIDO
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Realizar pedido > Detalles del pedido > Finalizar
export const GuardarTodaLaInformacion = async (req, res) => {
  const {
    remitente,
    destinatario,
    idUsuario,
    NombreUsuario,
    idAgencia,
    NombreAgencia,
    pedido,
  } = req.body;

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
      await CrearUnionRemitenteAgencia(idRemitente, idAgencia);
    if (destinatario.idDestinatario === false)
      await CrearUnionDestinatarioAgencia(idDestinatario, idAgencia);
    // Procesamos cada pedido secuencialmente usando un bucle for
    for (const infoPedido of pedido) {
      await EjecutarConsultaValidarPedido(
        remitente,
        destinatario,
        idUsuario,
        NombreUsuario,
        idAgencia,
        NombreAgencia,
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
};
const EjecutarConsultaGuardarRemitente = (remitente) => {
  const {
    NombreRemitente,
    ApellidosRemitente,
    TelefonoUnoRemitente,
    TelefonoDosRemitente,
    CorreoRemitente,
    PaisRemitente,
    CodigoPaisRemitente,
    EstadoRemitente,
    CodigoEstadoRemitente,
    CiudadRemitente,
    CodigoPostalRemitente,
    DireccionRemitente,
    ReferenciaRemitente,
  } = remitente;

  const sql = `INSERT INTO remitentes (NombreRemitente, ApellidosRemitente, TelefonoUnoRemitente, TelefonoDosRemitente, CorreoRemitente, PaisRemitente, CodigoPaisRemitente, EstadoRemitente, CodigoEstadoRemitente, CiudadRemitente, CodigoPostalRemitente, DireccionRemitente, ReferenciaRemitente, FechaCreacionRemitente, HoraCreacionRemitente) 
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, CURDATE(),'${ObtenerHoraActual()}')`;

  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        NombreRemitente || "",
        ApellidosRemitente || "",
        TelefonoUnoRemitente || "",
        TelefonoDosRemitente || "",
        CorreoRemitente || "",
        PaisRemitente || "",
        CodigoPaisRemitente || "",
        EstadoRemitente || "",
        CodigoEstadoRemitente || "",
        CiudadRemitente || "",
        CodigoPostalRemitente || "",
        DireccionRemitente || "",
        ReferenciaRemitente || "",
      ],
      (error, result) => {
        if (error) {
          reject(error); // Si hay error, rechaza la promesa
        } else {
          resolve(result.insertId); // Si todo va bien, resuelve con el insertId
        }
      }
    );
  });
};
const EjecutarConsultaGuardarDestinatario = (destinatario) => {
  const {
    NombreDestinatario,
    ApellidosDestinatario,
    TelefonoUnoDestinatario,
    TelefonoDosDestinatario,
    CorreoDestinatario,
    PaisDestinatario,
    CodigoPaisDestinatario,
    EstadoDestinatario,
    CodigoEstadoDestinatario,
    CiudadDestinatario,
    CodigoPostalDestinatario,
    DireccionDestinatario,
    ReferenciaDestinatario,
  } = destinatario;

  const sql = `INSERT INTO destinatarios (NombreDestinatario, ApellidosDestinatario, TelefonoUnoDestinatario, TelefonoDosDestinatario, CorreoDestinatario, PaisDestinatario, CodigoPaisDestinatario, EstadoDestinatario, CodigoEstadoDestinatario, CiudadDestinatario, CodigoPostalDestinatario, DireccionDestinatario, ReferenciaDestinatario, FechaCreacionDestinatario, HoraCreacionDestinatario) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, CURDATE(),'${ObtenerHoraActual()}')`;

  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        NombreDestinatario || "",
        ApellidosDestinatario || "",
        TelefonoUnoDestinatario || "",
        TelefonoDosDestinatario || "",
        CorreoDestinatario || "",
        PaisDestinatario || "",
        CodigoPaisDestinatario || "",
        EstadoDestinatario || "",
        CodigoEstadoDestinatario || "",
        CiudadDestinatario || "",
        CodigoPostalDestinatario || "",
        DireccionDestinatario || "",
        ReferenciaDestinatario || "",
      ],
      (error, result) => {
        if (error) {
          reject(error); // Si hay error, rechaza la promesa
        } else {
          resolve(result.insertId); // Si todo va bien, resuelve con el insertId
        }
      }
    );
  });
};
const CrearUnionRemitenteAgencia = (idRemitente = 0, idAgencia = 0) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_remitentes_agencias (idRemitente, idAgencia) VALUES (?,?)`;
    CONEXION.query(sql, [idRemitente, idAgencia], (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
      resolve(true);
    });
  });
};
const CrearUnionDestinatarioAgencia = (idDestinatario = 0, idAgencia = 0) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO union_destinatarios_agencias (idDestinatario, idAgencia) VALUES (?,?)`;
    CONEXION.query(sql, [idDestinatario, idAgencia], (error, result) => {
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
  idUsuario = 0,
  NombreUsuario,
  idAgencia = 0,
  NombreAgencia,
  infoPedido,
  idRemitente = 0,
  idDestinatario = 0,
  CodigoRastreo = "",
  pedido,
  ListaDeGuias
) => {
  // let GuiaDuplicada = true;
  // let GuiaPedido;

  // Generar un número de guía único
  // while (GuiaDuplicada) {
  //   GuiaPedido = CrearGuia(); // Genera una nueva guía
  //   GuiaDuplicada = await VerificarGuiaRepetida(GuiaPedido); // Espera a verificar si está duplicada
  //   if (GuiaDuplicada) {
  //     console.log("Guía duplicada, generando una nueva...");
  //   }
  // }
  // CREAMOS EL NOMBRE DEL PAQUETE DE TICKETS
  const NombreDelPaqueteDeTickets = `Ticket_Paquete_${CodigoRastreo}.pdf`;
  // OBTENEMOS EL ID ESPECIAL DE LA AGENCIA
  const idEspecialAgencia = await ObtenerIdEspecialAgencia(idAgencia);
  // OBTENEMOS EL ID DEL ULTIMO PEDIDO
  const idUltimoPedido = await ObtenerIdUltimoPedido();
  // CREAMOS EL NÚMERO SU NÚMERO DE GUIA
  const GuiaPedido = `${idEspecialAgencia}-${idUltimoPedido}`;

  // GUARDAMOS TODAS LAS GUIAS EN UNA LISTA
  ListaDeGuias.push(GuiaPedido);

  // SOLO CREAREMOS UN PDF CON VARIOS TICKETS SI SON MÁS DE 1 PEDIDO
  // Y CUANDO LA CANTIDAD DE GUIAS SEA IGUAL A LA CANTIDAD DE PEDIDOS
  if (ListaDeGuias.length > 1 && ListaDeGuias.length === pedido.length) {
    CrearPaqueteDeTickets(
      NombreDelPaqueteDeTickets,
      remitente,
      destinatario,
      NombreUsuario,
      NombreAgencia,
      ListaDeGuias,
      pedido
    );
  }

  try {
    await EjecutarConsultaGuardarPedido(
      remitente,
      destinatario,
      idUsuario,
      NombreUsuario,
      idAgencia,
      NombreAgencia,
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
const ObtenerIdEspecialAgencia = (idAgencia = 0) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT idEspecial FROM agencias WHERE idAgencia = ?`;
    CONEXION.query(sql, [idAgencia], (error, result) => {
      if (error) return reject(error);
      resolve(result[0].idEspecial);
    });
  });
};
const ObtenerIdUltimoPedido = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT idPedido FROM pedidos ORDER BY idPedido DESC LIMIT 1`;
    CONEXION.query(sql, (error, result) => {
      if (error) return reject(error);
      const SiguienteID = result.length > 0 ? result[0].idPedido + 1 : 3000;
      resolve(SiguienteID);
    });
  });
};
// const VerificarGuiaRepetida = (GuiaPedido = "") => {
//   const sql = `SELECT * FROM pedidos WHERE GuiaPedido = ?`;
//   return new Promise((resolve, reject) => {
//     CONEXION.query(sql, [GuiaPedido], (error, result) => {
//       if (error) return reject(error);
//       resolve(result.length > 0); // Devuelve true si la guia está duplicado
//     });
//   });
// };
const EjecutarConsultaGuardarPedido = (
  remitente,
  destinatario,
  idUsuario,
  NombreUsuario,
  idAgencia,
  NombreAgencia,
  infoPedido,
  idRemitente = 0,
  idDestinatario = 0,
  CodigoRastreo = "",
  GuiaPedido = "",
  NombreDelPaqueteDeTickets = ""
) => {
  // CREAMOS EL NOMBRE DEL PDF
  const NombreDelTicket = `Ticket_Pedido_${GuiaPedido}.pdf`;
  const NombreDeLaEtiqueta = `Etiqueta_Pedido_${GuiaPedido}.pdf`;

  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO pedidos (
      GuiaPedido, ProductoPedido, TipoCargaPedido, TipoEnvioPedido, ContenidoPedido, LargoPedido, AnchoPedido, AltoPedido, PieCubicoPedido, PesoPedido, ValorDeclaradoPedido, ValorAseguradoPedido, CostoSeguroPedido, 
      CostoEnvioPedido, CostoSobrePesoPedido, TotalPedido, TicketPedido, EtiquetaPedido, PaqueteTicketsPedido, FechaCreacionPedido, HoraCreacionPedido) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
    CONEXION.query(
      sql,
      [
        GuiaPedido,
        infoPedido.Producto || "",
        infoPedido.TipoDeCarga || "",
        infoPedido.TipoDeEnvio || "",
        infoPedido.ContenidoDeEnvio || "",
        infoPedido.Largo || "",
        infoPedido.Ancho || "",
        infoPedido.Alto || "",
        infoPedido.PieCubico || "",
        infoPedido.Peso || "",
        Number(infoPedido.ValorDeclarado) || 0,
        Number(infoPedido.ValorAsegurado) || 0,
        infoPedido.CostoSeguro || 0,
        infoPedido.CostoEnvio || 0,
        infoPedido.CostoSobrePeso || 0,
        infoPedido.Total || 0,
        NombreDelTicket,
        NombreDeLaEtiqueta,
        NombreDelPaqueteDeTickets,
      ],
      async (error, result) => {
        if (error) {
          return reject(error); // Rechaza la promesa si hay un error
        }
        await CrearMovimientosPorDefecto(result.insertId, idUsuario);
        CrearTicketDelPedido(
          NombreDelTicket,
          remitente,
          destinatario,
          NombreUsuario,
          NombreAgencia,
          infoPedido,
          GuiaPedido
        );
        CrearEtiquetaDelPedido(
          NombreDeLaEtiqueta,
          remitente,
          destinatario,
          infoPedido,
          GuiaPedido
        );
        CrearDetallesDelPedido(
          idRemitente,
          idDestinatario,
          result.insertId,
          idAgencia,
          idUsuario,
          CodigoRastreo
        );
        resolve(true);
      }
    );
  });
};
const CrearMovimientosPorDefecto = (idPedido = 0, idUsuario = 0) => {
  const sqlMovimientos = `SELECT * FROM movimientos WHERE CategoriaMovimiento = ? AND ActivoMovimiento = ? ORDER BY EstadoMovimiento = ? DESC`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sqlMovimientos,
      ["Inicial", "Activo", "Creado"],
      async (error, movimientos) => {
        if (error) {
          return reject(error); // Rechaza la promesa si hay un error
        }
        if (movimientos.length === 0) {
          movimientos = await CrearMovimientoPorDefecto();
        }
        for (const infMovimiento of movimientos) {
          await CrearUnionPedidoMovimientoUsuario(
            idPedido,
            infMovimiento.idMovimiento,
            idUsuario
          );
        }
        resolve(true);
      }
    );
  });
};
const CrearMovimientoPorDefecto = () => {
  const sql = `INSERT INTO movimientos (EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, CategoriaMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento) VALUES (?,?,?,?, CURDATE(), '${ObtenerHoraActual()}')`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        "Creado",
        "El pedido ha sido creado en el sistema",
        "Sistema USMX",
        "Inicial",
      ],
      (error, result) => {
        if (error) {
          return reject(error); // Rechaza la promesa si hay un error
        }
        resolve([{ idMovimiento: result.insertId }]);
      }
    );
  });
};
const CrearUnionPedidoMovimientoUsuario = (
  idPedido = 0,
  idMovimiento = 0,
  idUsuario = 0
) => {
  const sql = `INSERT INTO union_pedidos_movimientos (idPedido, idMovimiento, idUsuario, FechaCreacionUnion, HoraCreacionUnion) VALUES (?,?,?, CURDATE(), '${ObtenerHoraActual()}')`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [idPedido, idMovimiento, idUsuario],
      (error, result) => {
        if (error) {
          return reject(error); // Rechaza la promesa si hay un error
        }
        resolve(true);
      }
    );
  });
};
const CrearDetallesDelPedido = (
  idRemitente = 0,
  idDestinatario = 0,
  idPedido = 0,
  idAgencia = 0,
  idUsuario = 0,
  CodigoRastreo = ""
) => {
  const sql = `INSERT INTO detallespedidos (idRemitente, idDestinatario, idPedido, idAgencia, idUsuario, CodigoRastreo) VALUES (?,?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        idRemitente,
        idDestinatario,
        idPedido,
        idAgencia,
        idUsuario,
        CodigoRastreo,
      ],
      (error, result) => {
        if (error) {
          return reject(error); // Rechaza la promesa si hay un error
        }
        resolve(true);
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS ULTIMOS 10 PEDIDOS GENERALES
// SE UTILIZA EN LAS VISTAS: Bienvenida
export const BuscarUltimosDiezPedidosGenerales = async (req, res) => {
  try {
    const sql = `SELECT 
      p.GuiaPedido, 
      p.FechaCreacionPedido,
      p.HoraCreacionPedido,
      a.NombreAgencia, 
      dp.CodigoRastreo  
      FROM 
          detallespedidos dp
      LEFT JOIN 
          pedidos p ON dp.idPedido = p.idPedido
      LEFT JOIN 
          agencias a ON dp.idAgencia = a.idAgencia
      WHERE a.StatusAgencia = ?
      ORDER BY 
          p.FechaCreacionPedido DESC, 
          p.HoraCreacionPedido DESC,
          p.idPedido DESC 
      LIMIT 10`;
    CONEXION.query(sql, ["Activa"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS ULTIMOS 10 PEDIDOS REALIZADOS DE UN USUARIO
// SE UTILIZA EN LAS VISTAS: Bienvenida
export const BuscarUltimosDiezPedidosDeUnUsuario = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const sql = `SELECT 
      p.GuiaPedido, 
      p.FechaCreacionPedido,
      p.HoraCreacionPedido,
      a.NombreAgencia, 
      dp.CodigoRastreo  
      FROM 
          detallespedidos dp
      LEFT JOIN 
          pedidos p ON dp.idPedido = p.idPedido
      LEFT JOIN 
          agencias a ON dp.idAgencia = a.idAgencia
      LEFT JOIN
          usuarios u ON dp.idUsuario = u.idUsuario
      WHERE a.StatusAgencia = ? AND dp.idUsuario = ?
      ORDER BY 
          p.FechaCreacionPedido DESC, 
          p.HoraCreacionPedido DESC,
          p.idPedido DESC 
      LIMIT 10`;
    CONEXION.query(sql, ["Activa", idUsuario], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODOS LOS PEDIDOS POR FILTRO
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Pedidos > Lista completa de pedidos
export const BuscarTodosLosPedidosPorFiltro = async (req, res) => {
  const { filtro } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBDPPEU = [];
    let sql;
    if (filtro === "") {
      sql = `SELECT 
      r.*,
      d.*,
      p.*,
      a.*,
      u.Usuario,
      dp.CodigoRastreo
      FROM 
          detallespedidos dp
      LEFT JOIN 
          remitentes r ON dp.idRemitente = r.idRemitente
      LEFT JOIN 
          destinatarios d ON dp.idDestinatario = d.idDestinatario
      LEFT JOIN 
          pedidos p ON dp.idPedido = p.idPedido
      LEFT JOIN 
          agencias a ON dp.idAgencia = a.idAgencia
      LEFT JOIN 
          usuarios u ON dp.idUsuario = u.idUsuario
      ORDER BY 
          p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
    } else {
      paramsBDPPEU.push(
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`
      );
      sql = `SELECT 
      r.*,
      d.*,
      p.*,
      a.*,
      u.Usuario,
      dp.CodigoRastreo
      FROM 
          detallespedidos dp
      LEFT JOIN 
          remitentes r ON dp.idRemitente = r.idRemitente
      LEFT JOIN 
          destinatarios d ON dp.idDestinatario = d.idDestinatario
      LEFT JOIN 
          pedidos p ON dp.idPedido = p.idPedido
      LEFT JOIN 
          agencias a ON dp.idAgencia = a.idAgencia
      LEFT JOIN 
          usuarios u ON dp.idUsuario = u.idUsuario
      WHERE 
          p.GuiaPedido LIKE ?
          OR u.Usuario LIKE ?
          OR r.NombreRemitente LIKE ?
          OR d.NombreDestinatario LIKE ?
          OR a.NombreAgencia LIKE ?
      ORDER BY 
          p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
    }

    CONEXION.query(sql, paramsBDPPEU, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR TODOS LOS PEDIDOS POR FECHAS
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Pedidos > Lista de pedidos por fechas
export const BuscarTodosLosPedidosPorFecha = async (req, res) => {
  const { primeraFecha, segundaFecha } = req.body;
  try {
    const sql = `SELECT
    r.*, 
    d.*, 
    p.*, 
    a.*,
    u.Usuario,
    u.idUsuario,
    dp.CodigoRastreo
    FROM
      detallespedidos dp
    INNER JOIN
      remitentes r ON dp.idRemitente = r.idRemitente
    INNER JOIN
      destinatarios d ON dp.idDestinatario = d.idDestinatario
    INNER JOIN
      pedidos p ON dp.idPedido = p.idPedido
    INNER JOIN
      agencias a ON dp.idAgencia = a.idAgencia
    INNER JOIN
      usuarios u ON dp.idUsuario = u.idUsuario
    WHERE
      p.FechaCreacionPedido BETWEEN ? AND ?
    ORDER BY p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PEDIDOS DE UN USUARIO POR FILTROS
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Pedidos > Lista completa de pedidos
export const BuscarPedidosDeUnUsuarioPorFiltro = async (req, res) => {
  const { filtro, idUsuario } = req.body;
  try {
    // DEFINIMOS EL ARRAY DE FILTROS
    let paramsBDPPEU = [idUsuario];
    let sql;
    if (filtro === "") {
      sql = `SELECT 
      r.*,
      d.*,
      p.*,
      a.*,
      u.Usuario,
      dp.CodigoRastreo
      FROM 
          detallespedidos dp
      LEFT JOIN 
          remitentes r ON dp.idRemitente = r.idRemitente
      LEFT JOIN 
          destinatarios d ON dp.idDestinatario = d.idDestinatario
      LEFT JOIN 
          pedidos p ON dp.idPedido = p.idPedido
      LEFT JOIN 
          agencias a ON dp.idAgencia = a.idAgencia
      LEFT JOIN 
          usuarios u ON dp.idUsuario = u.idUsuario
      WHERE 
          dp.idUsuario = ?
      ORDER BY 
          p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
    } else {
      paramsBDPPEU.push(
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`
      );
      sql = `SELECT 
      r.*,
      d.*,
      p.*,
      a.*,
      u.Usuario,
      dp.CodigoRastreo
      FROM 
          detallespedidos dp
      LEFT JOIN 
          remitentes r ON dp.idRemitente = r.idRemitente
      LEFT JOIN 
          destinatarios d ON dp.idDestinatario = d.idDestinatario
      LEFT JOIN 
          pedidos p ON dp.idPedido = p.idPedido
      LEFT JOIN 
          agencias a ON dp.idAgencia = a.idAgencia
      LEFT JOIN 
          usuarios u ON dp.idUsuario = u.idUsuario
      WHERE 
          dp.idUsuario = ?
          AND (
              p.GuiaPedido LIKE ?
              OR u.Usuario LIKE ?
              OR r.NombreRemitente LIKE ?
              OR d.NombreDestinatario LIKE ?
              OR a.NombreAgencia LIKE ?
          )
      ORDER BY 
          p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
    }

    CONEXION.query(sql, paramsBDPPEU, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PEDIDOS POR FILTROS
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Pedidos > Lista de pedidos por fechas
export const BuscarPedidosDeUnUsuarioPorFecha = async (req, res) => {
  const { idUsuario, primeraFecha, segundaFecha } = req.body;
  try {
    const sql = `SELECT
    r.*, 
    d.*, 
    p.*, 
    a.*,
    u.Usuario,
    u.idUsuario,
    dp.CodigoRastreo
    FROM
      detallespedidos dp
    INNER JOIN
      remitentes r ON dp.idRemitente = r.idRemitente
    INNER JOIN
      destinatarios d ON dp.idDestinatario = d.idDestinatario
    INNER JOIN
      pedidos p ON dp.idPedido = p.idPedido
    INNER JOIN
      agencias a ON dp.idAgencia = a.idAgencia
    INNER JOIN
      usuarios u ON dp.idUsuario = u.idUsuario
    WHERE
      dp.idUsuario = ?
      AND p.FechaCreacionPedido BETWEEN ? AND ?
    ORDER BY p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
    CONEXION.query(
      sql,
      [idUsuario, primeraFecha, segundaFecha, "Activa"],
      (error, result) => {
        if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER TODOS LOS PEDIDOS QUE SE REALIZARON POR "PAQUETES"
// SE UTILIZA EN LAS VISTAS:
// Paquetería  > Realizar pedido > Detalles del pedido > Finalizar
// Paquetería  > Pedidos > Detalles del pedido
export const BuscarPedidosPorPaquete = async (req, res) => {
  const { CodigoRastreo, GuiaPedido } = req.body;
  try {
    const sql = `
    SELECT 
    r.*,
    d.*,
    p.*,
    a.*,
    u.Usuario
    FROM 
        detallespedidos dp
    LEFT JOIN 
        remitentes r ON dp.idRemitente = r.idRemitente
    LEFT JOIN 
        destinatarios d ON dp.idDestinatario = d.idDestinatario
    LEFT JOIN 
        pedidos p ON dp.idPedido = p.idPedido
    LEFT JOIN 
        agencias a ON dp.idAgencia = a.idAgencia
    LEFT JOIN 
        usuarios u ON dp.idUsuario = u.idUsuario
    WHERE 
      dp.CodigoRastreo = ?
    ORDER BY p.GuiaPedido = ? DESC`;

    CONEXION.query(sql, [CodigoRastreo, GuiaPedido], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS REMITENTES POR AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Paquetería  > Realizar pedido > Seleccionar Remitente
export const BuscarRemitentesPorAgencia = async (req, res) => {
  const { filtro, idAgencia } = req.body;

  // INICIA CON EL ID AGENCIA PORQUE ESE SÍ O SÍ VENDRÁ EN LA PETICIÓN
  let paramsBRPA = [idAgencia];

  try {
    let sql;
    if (filtro === "") {
      sql = `SELECT r.* FROM union_remitentes_agencias ura LEFT JOIN remitentes r ON ura.idRemitente = r.idRemitente WHERE ura.idAgencia = ?`;
    } else {
      paramsBRPA.push(`%${filtro}%`);
      sql = `SELECT r.* FROM union_remitentes_agencias ura LEFT JOIN remitentes r ON ura.idRemitente = r.idRemitente WHERE ura.idAgencia = ? AND r.NombreRemitente LIKE ?`;
    }
    CONEXION.query(sql, paramsBRPA, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result); // Devuelve un array con los remitentes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS DESTINATARIOS POR AGENCIA
// SE UTILIZA EN LAS VISTAS:
// Paquetería  > Realizar pedido > Seleccionar Destinatario
export const BuscarDestinatariosPorAgencia = async (req, res) => {
  const { filtro, idAgencia } = req.body;

  // INICIA CON EL ID AGENCIA PORQUE ESE SÍ O SÍ VENDRÁ EN LA PETICIÓN
  let paramsBDPA = [idAgencia];

  try {
    let sql;

    if (filtro === "") {
      sql = `SELECT d.* FROM union_destinatarios_agencias uda LEFT JOIN destinatarios d ON uda.idDestinatario = d.idDestinatario WHERE uda.idAgencia = ?`;
    } else {
      paramsBDPA.push(`%${filtro}%`);
      sql = `SELECT d.* FROM union_destinatarios_agencias uda LEFT JOIN destinatarios d ON uda.idDestinatario = d.idDestinatario WHERE uda.idAgencia = ? AND d.NombreDestinatario LIKE ?`;
    }
    CONEXION.query(sql, paramsBDPA, (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result); // Devuelve un array con los destinatarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS MOVIMIENTOS DE UN PEDIDO
// SE UTILIZA EN LAS VISTAS: Paquetería  > Pedidos > Detalles del pedido
// SE UTILIZA EN LAS VISTAS: Paquetería  > Realizar pedido > Detalles del pedido > Finalizar
export const BuscarMovimientosDeUnPedido = async (req, res) => {
  const { GuiaPedido } = req.body;
  try {
    const sql = `SELECT 
                  upm.FechaCreacionUnion,
                  upm.HoraCreacionUnion,
                  m.* 
                FROM 
                  union_pedidos_movimientos upm
                LEFT JOIN 
                  movimientos m ON upm.idMovimiento = m.idMovimiento
                LEFT JOIN
                  pedidos p ON upm.idPedido = p.idPedido
                WHERE 
                  p.GuiaPedido = ? ORDER BY upm.idUnionPedidosMovimientos DESC`;
    CONEXION.query(sql, [GuiaPedido], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LA INFORMACIÓN DE UN PEDIDO
// SE UTILIZA EN LAS VISTAS: Numero de Guía
export const BuscarPedidoPorNumeroDeGuia = async (req, res) => {
  const { GuiaPedido } = req.params;
  try {
    const sql = `SELECT 
    r.*, 
    d.*, 
    p.*, 
    m.*,
    upm.FechaCreacionUnion,
    upm.HoraCreacionUnion
    FROM 
      detallespedidos dp
    JOIN
      union_pedidos_movimientos upm ON dp.idPedido = upm.idPedido
    LEFT JOIN 
      remitentes r ON dp.idRemitente = r.idRemitente 
    LEFT JOIN 
      destinatarios d ON dp.idDestinatario = d.idDestinatario 
    LEFT JOIN 
      pedidos p ON dp.idPedido = p.idPedido 
    LEFT JOIN 
      movimientos m ON upm.idMovimiento = m.idMovimiento 
    WHERE 
      p.GuiaPedido = ?
    ORDER BY 
      upm.idUnionPedidosMovimientos DESC`;
    CONEXION.query(sql, [GuiaPedido], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
