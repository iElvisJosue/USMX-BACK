// LIBRERIAS PARA EL EXCEL
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { ObtenerFechaActual, ObtenerHoraActual } from "./Func.js";

// RUTAS PARA EL EXCEL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const excelURL = path.join(__dirname, "../public/Excel");

export const CrearUnExcelDeLasAgencias = async (Agencias) => {
  const FechaActual = ObtenerFechaActual().replace(/-/g, "");
  const HoraActual = ObtenerHoraActual().replace(/:/g, "");
  const NombreDelExcel = `Agencias${Agencias.length}_Fecha${FechaActual}_Hora${HoraActual}.xlsx`;
  const RutaDelExcel = path.join(excelURL, NombreDelExcel);

  const AjustarAnchoDeColumnas = (hoja) => {
    hoja.eachRow((fila) => {
      fila.eachCell({ includeEmpty: true }, (celda, colNum) => {
        const columna = hoja.getColumn(colNum);
        const longitudCelda = celda.value ? celda.value.toString().length : 10;
        if (columna.width < longitudCelda) {
          columna.width = longitudCelda + 2; // Añade un pequeño margen
        }
        celda.alignment = { vertical: "middle", horizontal: "center" };
      });
    });
  };

  // 1. Crea un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();

  // 2. Agrega una hoja al libro de trabajo
  const sheet = workbook.addWorksheet("ListaDeAgencias");

  // 3. Crear columnas de encabezados basados en los campos del objeto
  let COLUMNAS_EXCEL = [];
  const KEYS_AGENCIAS = Object.keys(Agencias[0]);

  // 3.1 Creamos los encabezados basándonos en las keys
  // del objeto
  KEYS_AGENCIAS.forEach((TituloKey) => {
    COLUMNAS_EXCEL.push({
      header: `${TituloKey || "N/A"}`,
      key: `${TituloKey || "N/A"}`,
    });
  });

  // 4. Agregamos los encabezados
  sheet.columns = COLUMNAS_EXCEL;

  // Estiliza los encabezados
  sheet.getRow(1).eachCell((cell) => {
    cell.font = {
      color: { argb: "FFFFFF" },
      bold: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4d82bc" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // 5. Agrega filas de datos
  Agencias.forEach((Agencia) => {
    const fila = {};
    KEYS_AGENCIAS.forEach((key) => {
      fila[key] = Agencia[key]; // Usando la notación de corchetes
    });
    sheet.addRow(fila);
  });

  AjustarAnchoDeColumnas(sheet);

  // 6. Guarda el archivo
  await workbook.xlsx.writeFile(RutaDelExcel);
  console.log(`${NombreDelExcel} creado con éxito.`);

  return RutaDelExcel;
};
