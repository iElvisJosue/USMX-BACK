// LIBRERÍAS PARA EL PDF
import fs from "fs";
import createPdf from "pdfmake";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

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

// IMPORTAMOS LAS AYUDAS
import { LINK_QR, HOST } from "./Const.js";

export const CrearTicketDelPedido = (
  NombreDelTicket,
  remitente,
  destinatario,
  infoPedido,
  GuiaPedido
) => {
  const LinkDelQR = `${LINK_QR}${GuiaPedido}`;

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
      { qr: LinkDelQR, fit: 90, alignment: "center", margin: [0, 10] },
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
};
export const CrearPaqueteDeTickets = (
  NombreDelPaqueteDeTickets,
  remitente,
  destinatario,
  ListaDeGuias,
  pedido
) => {
  const CantidadDePedidos = pedido.length - 1;

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
    content: pedido.map((infoPedido, index) => [
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
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
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
        text: ListaDeGuias[index],
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
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
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
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
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
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
          },
        ],
      },
      {
        qr: `${LINK_QR}${ListaDeGuias[index]}`,
        fit: 90,
        alignment: "center",
        margin: [0, 10],
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
            y2: 0,
            lineWidth: 2,
            lineColor: "black",
            dash: { length: 2 },
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
      index < CantidadDePedidos
        ? {
            text: "",
            pageBreak: "after",
          }
        : null,
    ]),
    defaultStyle: {
      font: "Roboto",
    },
    pageMargins: [10, 10, 10, 10],
  };

  // CREAMOS EL DOCUMENTO PDF
  const pdfDoc = ImpresorDelPDF.createPdfKitDocument(CuerpoDelPDF);

  // Generar el PDF y guardarlo en un archivo
  const RutaDelPDF = path.join(PdfURL, NombreDelPaqueteDeTickets);

  // Guarda el documento PDF en un archivo
  pdfDoc.pipe(fs.createWriteStream(RutaDelPDF));
  pdfDoc.end();
};