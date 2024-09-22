// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// LIBRERÍAS PARA EL PDF
import fs from "fs";
import createPdf from "pdfmake";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import QRCode from "qrcode";

// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_DE_ERROR,
  MENSAJE_DE_NO_AUTORIZADO,
  LINK_QR,
  HOST,
} from "../helpers/Const.js";
import {
  ValidarTokenParaPeticion,
  ObtenerHoraActual,
  CrearGuia,
  CrearCódigoDeRastreo,
} from "../helpers/Func.js";
// RUTAS PARA EL PDF
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FuenteURL = path.join(__dirname, "../public/Fuentes");
const PdfURL = path.join(__dirname, "../public/PDF");
const imgURL = path.join(__dirname, "../public");

// DEFINIMOS PARÁMETROS DEL TICKET
const TamañoTextoTitulo = 16;
const TamañoTextoNormal = 13;
const TamañoTextoPequeño = 10;
const TamañoDelTicket = 80 * 2.83465;
const TamañoDeLaLinea = 80 * 2.54965;

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
          CodigoRastreo
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
    await EjecutarConsultaGuardarPedido(
      remitente,
      destinatario,
      infoPedido,
      idRemitente,
      idDestinatario,
      CodigoRastreo,
      GuiaPedido
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
  GuiaPedido
) => {
  // CREAMOS EL NOMBRE DEL PDF
  const NombreDelTicket = `Ticket_Pedido_${GuiaPedido}.pdf`;

  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO pedidos (
      GuiaPedido, ProductoPedido, TipoCargaPedido, TipoEnvioPedido, ContenidoPedido, LargoPedido, AnchoPedido, AltoPedido, PieCubicoPedido, PesoPedido, ValorDeclaradoPedido, ValorAseguradoPedido, CostoSeguroPedido, 
      CostoEnvioPedido, CostoSobrePesoPedido, TotalPedido, UsuarioResponsablePedido, TicketPedido, FechaCreacionPedido, HoraCreacionPedido) VALUES (
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
      CURDATE(),
      '${ObtenerHoraActual()}'
    )`;
    CONEXION.query(sql, (error, result) => {
      if (error) {
        return reject(error); // Rechaza la promesa si hay un error
      }
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
const CrearTicketDelPedido = (
  NombreDelTicket,
  remitente,
  destinatario,
  infoPedido,
  GuiaPedido
) => {
  const LinkDelQR = `${LINK_QR}${GuiaPedido}`;
  QRCode.toDataURL(LinkDelQR, (err, imgQR) => {
    if (err) {
      console.error(err);
    } else {
      const Hoy = new Date();
      const Opciones = {
        timeZone: "America/Mexico_City", // Zona horaria de México (Guerrero)
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Formato de 24 horas
      };
      const FechaConHora = Hoy.toLocaleString("es-MX", Opciones);
      // ASIGNAMOS LA FUENTE AL PDF
      const Fuente = {
        Roboto: {
          normal: path.join(FuenteURL, "Ticketing.ttf"),
        },
      };
      var ImpresorDelPDF = new createPdf(Fuente);
      // DEFINIMOS EL TAMAÑO DE LA PAGINA
      const TamañoDePagina = {
        width: TamañoDelTicket,
        height: "auto", // Altura automática
      };
      // IMAGEN DEL LOGO
      const ImagenDelPDF = path.join(imgURL, "ImagenTicket.png");
      // DEFINIMOS EL DOCUMENTO PDF
      const CuerpoDelPDF = {
        pageSize: TamañoDePagina,
        content: [
          {
            image: ImagenDelPDF,
            width: 50,
            height: 50,
            alignment: "center",
            marginBottom: 2.5,
          },
          {
            text: "USMX XPRESS",
            alignment: "center",
            fontSize: TamañoTextoTitulo,
            margin: [0, 1.5],
          },
          {
            text: "Ciudad, Estado",
            alignment: "center",
            fontSize: TamañoTextoPequeño,
            margin: [0, 1.5],
          },
          {
            text: "Dirección del local",
            alignment: "center",
            fontSize: TamañoTextoPequeño,
            margin: [0, 1.5],
          },
          {
            text: `Fecha y hora ${FechaConHora}`,
            alignment: "center",
            fontSize: TamañoTextoPequeño,
            margin: [0, 1.5],
          },
          {
            margin: [0, 10],
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: TamañoDeLaLinea,
                y2: 0, // Ajusta la longitud del separador según el ancho del PDF
                lineWidth: 2, // Ancho del separador
                lineColor: "black", // Color del separador
                dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
              },
            ],
          },
          {
            text: "Número de guía",
            alignment: "center",
            fontSize: TamañoTextoPequeño,
            margin: [0, 1.5],
          },
          {
            text: GuiaPedido,
            alignment: "center",
            fontSize: TamañoTextoTitulo,
            margin: [0, 1.5],
          },
          {
            margin: [0, 10],
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: TamañoDeLaLinea,
                y2: 0, // Ajusta la longitud del separador según el ancho del PDF
                lineWidth: 2, // Ancho del separador
                lineColor: "black", // Color del separador
                dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
              },
            ],
          },
          {
            text: "REMITENTE",
            alignment: "left",
            fontSize: TamañoTextoNormal,
            margin: [0, 1.5],
          },
          {
            text: `${remitente.NombreRemitente} ${remitente.ApellidosRemitente}`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
            marginBottom: 7.5,
          },
          {
            text: "DESTINATARIO",
            alignment: "left",
            fontSize: TamañoTextoNormal,
            margin: [0, 1.5],
          },
          {
            text: `${destinatario.NombreDestinatario} ${destinatario.ApellidoPaternoDestinatario} ${destinatario.ApellidoMaternoDestinatario}`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: `${destinatario.DireccionDestinatario}, Col. ${destinatario.ColoniaDestinatario}, CP. ${destinatario.CodigoPostalDestinatario}`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: `Telefono(s): ${destinatario.TelefonoCasaDestinatario} - ${destinatario.CelularDestinatario}`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: `${
              destinatario.MunicipioDelegacionDestinatario
                ? destinatario.MunicipioDelegacionDestinatario + " / "
                : ""
            }${destinatario.CiudadDestinatario} / ${
              destinatario.EstadoDestinatario
            }`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
          destinatario.ReferenciaDestinatario && {
            text: `Ref. ${destinatario.ReferenciaDestinatario}`,
            alignment: "left",
            fontSize: TamañoTextoPequeño,
          },
          {
            margin: [0, 10],
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: TamañoDeLaLinea,
                y2: 0, // Ajusta la longitud del separador según el ancho del PDF
                lineWidth: 2, // Ancho del separador
                lineColor: "black", // Color del separador
                dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
              },
            ],
          },
          {
            text: infoPedido.Producto,
            alignment: "center",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: `Ancho: ${infoPedido.Ancho} - Largo: ${infoPedido.Largo} - Alto: ${infoPedido.Alto}`,
            alignment: "center",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: `Peso: ${infoPedido.Peso} lb(s)`,
            alignment: "center",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: `Costo envío ${infoPedido.CostoEnvio.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })} | TCF: $0.00 | Costo seguro ${infoPedido.CostoSeguro.toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              }
            )} | Costo sobre peso ${infoPedido.CostoSobrePeso.toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              }
            )}`,
            alignment: "center",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: `TOTAL: ${infoPedido.Total.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}`,
            alignment: "center",
            fontSize: TamañoTextoNormal,
            margin: [0, 5, 0, 2.5],
          },
          {
            margin: [0, 7.5, 0, 2.5],
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: TamañoDeLaLinea,
                y2: 0, // Ajusta la longitud del separador según el ancho del PDF
                lineWidth: 2, // Ancho del separador
                lineColor: "black", // Color del separador
                dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
              },
            ],
          },
          {
            image: imgQR,
            width: 100,
            height: 100,
            alignment: "center",
          },
          {
            text: HOST,
            alignment: "center",
            fontSize: TamañoTextoPequeño,
          },
          {
            margin: [0, 7.5, 0, 2.5],
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: TamañoDeLaLinea,
                y2: 0, // Ajusta la longitud del separador según el ancho del PDF
                lineWidth: 2, // Ancho del separador
                lineColor: "black", // Color del separador
                dash: { length: 2 }, // Establece la longitud de los trazos discontinuos
              },
            ],
          },
          {
            text: "Agencia:",
            alignment: "center",
            fontSize: TamañoTextoPequeño,
            marginTop: 7.5,
          },
          {
            text: infoPedido.NombreAgencia.toUpperCase(),
            alignment: "center",
            fontSize: TamañoTextoPequeño,
            marginBottom: 7.5,
          },
          {
            text: "Usuario:",
            alignment: "center",
            fontSize: TamañoTextoPequeño,
          },
          {
            text: infoPedido.UsuarioResponsable.toUpperCase(),
            alignment: "center",
            fontSize: TamañoTextoPequeño,
          },
        ],

        defaultStyle: {
          font: "Roboto", // Establece la fuente predeterminada para todo el documento
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        },
        pageMargins: [10, 10, 10, 10],
      };
      // CREAMOS EL DOCUMENTO PDF
      const pdfDoc = ImpresorDelPDF.createPdfKitDocument(CuerpoDelPDF);
      // Generar el PDF y guardarlo en un archivo
      const RutaDelPDF = path.join(PdfURL, NombreDelTicket);
      // Guarda el documento PDF en un archivo
      pdfDoc.pipe(fs.createWriteStream(RutaDelPDF));
      pdfDoc.end();
    }
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
