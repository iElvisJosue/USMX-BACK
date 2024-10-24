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
  const { CookieConToken, remitente, destinatario, pedido } = req.body;
  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

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
      await CrearUnionDestinatarioAgencia(idDestinatario, pedido[0].idAgencia);
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
};
const EjecutarConsultaGuardarRemitente = (remitente) => {
  const {
    NombreRemitente,
    ApellidosRemitente,
    TelefonoCasaRemitente,
    CelularRemitente,
    CorreoRemitente,
    PaisRemitente,
    CodigoPaisRemitente,
    EstadoRemitente,
    CiudadRemitente,
    CodigoPostalRemitente,
    DireccionRemitente,
    ReferenciaRemitente,
  } = remitente;

  const sql = `INSERT INTO remitentes (NombreRemitente, ApellidosRemitente, TelefonoCasaRemitente, CelularRemitente, CorreoRemitente, PaisRemitente, CodigoPaisRemitente, EstadoRemitente, CiudadRemitente, CodigoPostalRemitente, DireccionRemitente, ReferenciaRemitente, FechaCreacionRemitente, HoraCreacionRemitente) 
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;

  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        NombreRemitente || "",
        ApellidosRemitente || "",
        TelefonoCasaRemitente || "",
        CelularRemitente || "",
        CorreoRemitente || "",
        PaisRemitente || "",
        CodigoPaisRemitente || "",
        EstadoRemitente || "",
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
    ApellidoPaternoDestinatario,
    ApellidoMaternoDestinatario,
    TelefonoCasaDestinatario,
    CelularDestinatario,
    CorreoDestinatario,
    PaisDestinatario,
    CodigoPaisDestinatario,
    EstadoDestinatario,
    CiudadDestinatario,
    CodigoPostalDestinatario,
    DireccionDestinatario,
    MunicipioDelegacionDestinatario,
    ReferenciaDestinatario,
  } = destinatario;

  const sql = `INSERT INTO destinatarios (NombreDestinatario, ApellidoPaternoDestinatario, ApellidoMaternoDestinatario, TelefonoCasaDestinatario, CelularDestinatario, CorreoDestinatario, PaisDestinatario, CodigoPaisDestinatario, EstadoDestinatario, CiudadDestinatario, CodigoPostalDestinatario, DireccionDestinatario, MunicipioDelegacionDestinatario, ReferenciaDestinatario, FechaCreacionDestinatario, HoraCreacionDestinatario) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;

  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        NombreDestinatario || "",
        ApellidoPaternoDestinatario || "",
        ApellidoMaternoDestinatario || "",
        TelefonoCasaDestinatario || "",
        CelularDestinatario || "",
        CorreoDestinatario || "",
        PaisDestinatario || "",
        CodigoPaisDestinatario || "",
        EstadoDestinatario || "",
        CiudadDestinatario || "",
        CodigoPostalDestinatario || "",
        DireccionDestinatario || "",
        MunicipioDelegacionDestinatario || "",
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
  infoPedido,
  idRemitente = 0,
  idDestinatario = 0,
  CodigoRastreo = "",
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
const VerificarGuiaRepetida = (GuiaPedido = "") => {
  const sql = `SELECT * FROM pedidos WHERE GuiaPedido = ?`;
  return new Promise((resolve, reject) => {
    CONEXION.query(sql, [GuiaPedido], (error, result) => {
      if (error) return reject(error);
      resolve(result.length > 0); // Devuelve true si la guia está duplicado
    });
  });
};
const EjecutarConsultaGuardarPedido = (
  remitente,
  destinatario,
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
      CostoEnvioPedido, CostoSobrePesoPedido, TotalPedido, UsuarioResponsablePedido, TicketPedido, EtiquetaPedido, PaqueteTicketsPedido, FechaCreacionPedido, HoraCreacionPedido) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURDATE(),'${ObtenerHoraActual()}')`;
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
        infoPedido.UsuarioResponsable || "No definido",
        NombreDelTicket,
        NombreDeLaEtiqueta,
        NombreDelPaqueteDeTickets,
      ],
      (error, result) => {
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
        CrearEtiquetaDelPedido(
          NombreDeLaEtiqueta,
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
      }
    );
  });
};
const CrearMovimientosPorDefecto = (
  GuiaPedido = "",
  UsuarioResponsable = "No definido"
) => {
  let valores = [];

  const sqlMovimientos = `SELECT * FROM listamovimientos WHERE PorDefectoMovimiento = ? AND ActivoMovimiento = ? ORDER BY EstadoMovimiento = ? DESC`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sqlMovimientos,
      ["Si", "Activo", "Creado"],
      (error, movimientos) => {
        if (error) {
          return reject(error); // Rechaza la promesa si hay un error
        }
        if (movimientos.length === 0) {
          return reject("No hay movimientos por defecto");
        }
        movimientos.forEach((movimiento, index) => {
          const { EstadoMovimiento, DetallesMovimiento, OrigenMovimiento } =
            movimiento;
          valores.push(
            `('${GuiaPedido}', '${EstadoMovimiento}', '${DetallesMovimiento}', '${OrigenMovimiento}', '${UsuarioResponsable}', CURDATE(), '${ObtenerHoraActual()}')`
          );
        });
        // HACEMOS LA INSERCIÓN
        const sql = `INSERT INTO movimientos (GuiaPedido, EstadoMovimiento, DetallesMovimiento, OrigenMovimiento, UsuarioResponsableMovimiento, FechaCreacionMovimiento, HoraCreacionMovimiento)
      VALUES ${valores.join(",\n")};`;
        // Ejecutamos la consulta de inserción
        CONEXION.query(sql, (error, result) => {
          if (error) {
            return reject(error); // Rechaza la promesa si hay un error en la inserción
          }
          resolve(true); // Resuelve la promesa si todo sale bien
        });
      }
    );
  });
};
const CrearUnionRemitenteDestinatarioPedido = (
  idRemitente = 0,
  idDestinatario = 0,
  idPedido = 0,
  idAgencia = 0,
  CodigoRastreo = ""
) => {
  const sql = `INSERT INTO union_remitentes_destinatarios_pedidos (idRemitente, idDestinatario, idPedido, idAgencia, CodigoRastreo) VALUES (?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [idRemitente, idDestinatario, idPedido, idAgencia, CodigoRastreo],
      (error, result) => {
        if (error) {
          return reject(error); // Rechaza la promesa si hay un error
        }
        resolve(true);
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A BUSCAR LOS PEDIDOS POR FILTROS
// SE UTILIZA EN LAS VISTAS:
// Paquetería > Pedidos > Lista completa de pedidos
export const BuscarPedidosPorFiltro = async (req, res) => {
  const { filtro, CookieConToken, tipoDeUsuario, idDelUsuario } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  if (tipoDeUsuario === "Administrador") {
    try {
      const PedidosParaElAdministrador =
        await BusquedaDePedidosParaElAdministrador(filtro);
      res.send(PedidosParaElAdministrador);
    } catch (error) {
      console.log(error);
      res.status(500).json(MENSAJE_DE_ERROR);
    }
  } else {
    try {
      const PedidosParaElUsuario = await BusquedaDePedidosParaElUsuario(
        filtro,
        idDelUsuario
      );
      const pedidosOrdenadosPorFecha = (a, b) => {
        if (a.FechaCreacionPedido > b.FechaCreacionPedido) {
          return -1;
        }
        if (a.FechaCreacionPedido < b.FechaCreacionPedido) {
          return 1;
        }
        return 0;
      };
      res.send(PedidosParaElUsuario.sort(pedidosOrdenadosPorFecha));
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
                p.GuiaPedido LIKE ?
                OR p.UsuarioResponsablePedido LIKE ?
                OR r.NombreRemitente LIKE ?
                OR d.NombreDestinatario LIKE ?
                OR a.NombreAgencia LIKE ?
            ORDER BY p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
  return new Promise((resolve, reject) => {
    CONEXION.query(
      sql,
      [
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`,
        `%${filtro}%`,
      ],
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};
const BusquedaDePedidosParaElUsuario = async (filtro, idDelUsuario) => {
  const sqlObtenerAgencias = `SELECT uua.idAgencia FROM union_usuarios_agencias uua LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia WHERE uua.idUsuario = ? AND a.StatusAgencia = ? ORDER BY a.idAgencia DESC`;

  return new Promise((resolve, reject) => {
    CONEXION.query(
      sqlObtenerAgencias,
      [idDelUsuario, "Activa"],
      (error, result) => {
        if (error) return reject(error);

        const promesasDeBusqueda = result.map(({ idAgencia }) => {
          let paramsBDPPEU = [idAgencia];
          let sql;
          if (filtro === "") {
            sql = `SELECT 
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
                    urdp.idAgencia = ?
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
                    urdp.idAgencia = ?
                    AND (
                        p.GuiaPedido LIKE ?
                        OR p.UsuarioResponsablePedido LIKE ?
                        OR r.NombreRemitente LIKE ?
                        OR d.NombreDestinatario LIKE ?
                        OR a.NombreAgencia LIKE ?
                    )
                ORDER BY 
                    p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
          }
          return new Promise((resolve, reject) => {
            CONEXION.query(sql, paramsBDPPEU, (error, result) => {
              if (error) return reject(error);
              resolve(result);
            });
          });
        });

        Promise.all(promesasDeBusqueda)
          .then((results) => resolve(results.flat()))
          .catch((error) => reject(error));
      }
    );
  });
};
// EN ESTA FUNCIÓN VAMOS A OBTENER TODOS LOS PEDIDOS QUE SE REALIZARON POR "PAQUETES"
// SE UTILIZA EN LAS VISTAS:
// Paquetería  > Realizar pedido > Detalles del pedido > Finalizar
// Paquetería  > Pedidos > Detalles del pedido
export const BuscarPedidosPorPaquete = async (req, res) => {
  const { CookieConToken, CodigoRastreo, GuiaPedido } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

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
            	urdp.CodigoRastreo = ?
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
  const { CookieConToken, filtro, idAgencia } = req.body;

  // INICIA CON EL ID AGENCIA PORQUE ESE SÍ O SÍ VENDRÁ EN LA PETICIÓN
  let paramsBRPA = [idAgencia];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

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
  const { CookieConToken, filtro, idAgencia } = req.body;

  // INICIA CON EL ID AGENCIA PORQUE ESE SÍ O SÍ VENDRÁ EN LA PETICIÓN
  let paramsBDPA = [idAgencia];

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

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
      WHERE a.StatusAgencia = ?
      ORDER BY 
          p.FechaCreacionPedido DESC, 
          p.HoraCreacionPedido DESC,
          p.idPedido DESC 
      LIMIT 10;
      `;
    CONEXION.query(sql, ["Activa"], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
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
  const { CookieConToken, GuiaPedido } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const sql = `SELECT * FROM movimientos WHERE GuiaPedido = ? ORDER BY idMovimiento DESC;`;
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
    const sql = `SELECT r.*, d.*, p.*, m.* 
    FROM union_remitentes_destinatarios_pedidos urdp 
    LEFT JOIN remitentes r ON urdp.idRemitente = r.idRemitente 
    LEFT JOIN destinatarios d ON urdp.idDestinatario = d.idDestinatario 
    LEFT JOIN pedidos p ON urdp.idPedido = p.idPedido 
    LEFT JOIN movimientos m ON p.GuiaPedido = m.GuiaPedido 
    WHERE p.GuiaPedido = ?
    ORDER BY m.idMovimiento DESC`;
    CONEXION.query(sql, [GuiaPedido], (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
// EN ESTA FUNCIÓN VAMOS A OBTENER LOS PEDIDOS POR FECHA
// SE UTILIZA EN LAS VISTAS: Paquetería  > Pedidos > Pedidos por fecha
export const BuscarPedidosPorFecha = async (req, res) => {
  const {
    CookieConToken,
    primeraFecha,
    segundaFecha,
    idDelUsuario,
    permisosUsuario,
  } = req.body;

  const RespuestaValidacionToken = await ValidarTokenParaPeticion(
    CookieConToken
  );

  if (!RespuestaValidacionToken)
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);

  try {
    const pedidosPorFecha =
      permisosUsuario === "Administrador"
        ? await BuscarPedidosPorFechaParaElAdministrador(
            primeraFecha,
            segundaFecha
          )
        : await BuscarPedidosPorFechaParaLosEmpleados(
            primeraFecha,
            segundaFecha,
            idDelUsuario
          );

    res.status(200).json(pedidosPorFecha);
  } catch (error) {
    console.error(error);
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
const BuscarPedidosPorFechaParaElAdministrador = (
  primeraFecha,
  segundaFecha
) => {
  const sql = `SELECT
                urdp.idRemitente,
                urdp.idDestinatario,
                urdp.idPedido,
                urdp.idAgencia,
                urdp.CodigoRastreo,
                r.*, d.*, p.*, a.*
              FROM
                union_remitentes_destinatarios_pedidos urdp
              INNER JOIN
                remitentes r ON urdp.idRemitente = r.idRemitente
              INNER JOIN
                destinatarios d ON urdp.idDestinatario = d.idDestinatario
              INNER JOIN
                pedidos p ON urdp.idPedido = p.idPedido
              INNER JOIN
                agencias a ON urdp.idAgencia = a.idAgencia
              WHERE
                p.FechaCreacionPedido BETWEEN ? AND ?
              ORDER BY p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC`;
  return new Promise((resolve, reject) => {
    CONEXION.query(sql, [primeraFecha, segundaFecha], (error, result) => {
      if (error) {
        reject(error); // Si hay error, rechaza la promesa
      } else {
        resolve(result.flat()); // Si todo va bien, resuelve con el insertId
      }
    });
  });
};
const BuscarPedidosPorFechaParaLosEmpleados = async (
  primeraFecha,
  segundaFecha,
  idDelUsuario
) => {
  const sqlObtenerAgencias = `SELECT uua.idAgencia
            FROM union_usuarios_agencias uua
            LEFT JOIN agencias a ON uua.idAgencia = a.idAgencia
            WHERE uua.idUsuario = ?
            AND a.StatusAgencia = ?
            ORDER BY a.idAgencia DESC`;
  try {
    // Obtener agencias activas del usuario
    const agenciasResult = await new Promise((resolve, reject) => {
      CONEXION.query(
        sqlObtenerAgencias,
        [idDelUsuario, "Activa"],
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
    // Mapear las agencias para obtener los pedidos
    const promesasDeBusqueda = agenciasResult.map(({ idAgencia }) => {
      const sql = `SELECT
                    urdp.idRemitente,
                    urdp.idDestinatario,
                    urdp.idPedido,
                    urdp.idAgencia,
                    urdp.CodigoRastreo, 
                    r.*, d.*, p.*, a.*
                  FROM
                    union_remitentes_destinatarios_pedidos urdp
                  INNER JOIN
                    remitentes r ON urdp.idRemitente = r.idRemitente
                  INNER JOIN
                    destinatarios d ON urdp.idDestinatario = d.idDestinatario
                  INNER JOIN
                    pedidos p ON urdp.idPedido = p.idPedido
                  INNER JOIN
                    agencias a ON urdp.idAgencia = a.idAgencia
                  WHERE
                    urdp.idAgencia = ?
                    AND p.FechaCreacionPedido BETWEEN ? AND ?
                    AND a.StatusAgencia = ?
                  ORDER BY p.FechaCreacionPedido DESC, p.HoraCreacionPedido DESC;
  `;
      return new Promise((resolve, reject) => {
        CONEXION.query(
          sql,
          [idAgencia, primeraFecha, segundaFecha, "Activa"],
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
      });
    });
    // Esperar a que todas las promesas de búsqueda se resuelvan
    const resultadosPedidos = await Promise.all(promesasDeBusqueda);

    const pedidosOrdenadosPorFecha = (a, b) => {
      if (a.FechaCreacionPedido > b.FechaCreacionPedido) {
        return -1;
      }
      if (a.FechaCreacionPedido < b.FechaCreacionPedido) {
        return 1;
      }
      return 0;
    };
    return resultadosPedidos.flat().sort(pedidosOrdenadosPorFecha);
  } catch (error) {
    // Manejar errores
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
