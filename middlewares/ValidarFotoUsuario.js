import multer from "multer";
import path from "path";

// Extensiones permitidas para imágenes
const ArchivosPermitidos = /png|jpg|jpeg/;

// Configuración de almacenamiento en memoria
const MulterAlmacenamiento = multer.memoryStorage();

// Configuración de Multer
export const ValidarFotoUsuario = multer({
  MulterAlmacenamiento,
  fileFilter: (req, file, cb) => {
    const mimeType = ArchivosPermitidos.test(file.mimetype); // Valida MIME type
    const extType = ArchivosPermitidos.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimeType && extType) {
      cb(null, true); // Archivo válido
    } else {
      cb(new Error("Tipo de archivo no permitido"));
    }
  },
}).single("Imagen");
