import jwt from "jsonwebtoken";
// IMPORTAMOS EL TOKEN CREADO
import { CrearTokenDeAcceso } from "../libs/jwt.js";
import { TOKEN_SECRETO } from "../initial/config.js";
// IMPORTAMOS LA CONEXIÓN A LA DB
import { CONEXION } from "../initial/db.js";
// IMPORTAMOS LAS AYUDAS
import {
  MENSAJE_ERROR_CONSULTA_SQL,
  MENSAJE_DE_ERROR,
} from "../helpers/Const.js";

export const IniciarSesion = (req, res) => {
  try {
    const { Usuario, Contraseña } = req.body;
    const sql = `SELECT * FROM usuarios WHERE Usuario = ? AND Contraseña = ? AND EstadoUsuario = 'Activo'`;
    CONEXION.query(sql, [Usuario, Contraseña], async (error, result) => {
      if (error) return res.status(400).json(MENSAJE_ERROR_CONSULTA_SQL);
      if (result.length > 0) {
        // CREAMOS EL ID EN UN TOKEN
        const TOKEN_DE_ACCESO_USMX = await CrearTokenDeAcceso({
          idUsuario: result[0].idUsuario,
          Usuario: result[0].Usuario,
          Permisos: result[0].Permisos,
          ModoOscuro: result[0].ModoOscuro,
        });
        // ALMACENAMOS EL TOKEN EN UN COOKIE
        // res.cookie("TOKEN_DE_ACCESO_USMX", TOKEN_DE_ACCESO_USMX);
        res.cookie("TOKEN_DE_ACCESO_USMX", TOKEN_DE_ACCESO_USMX, {
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        });
        const InformacionDelUsuario = {
          idUsuario: result[0].idUsuario,
          Usuario: result[0].Usuario,
          Permisos: result[0].Permisos,
          ModoOscuro: result[0].ModoOscuro,
          TOKEN_DE_ACCESO_USMX,
        };
        // ENVIAMOS EL TOKEN AL CLIENTE
        res.status(200).json(InformacionDelUsuario);
      } else {
        res
          .status(401)
          .json(
            "¡Oops! Parece que el usuario y/o contraseña son incorrectos, por favor verifique e intente de nuevo."
          );
      }
    });
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};

export const VerificarToken = async (req, res) => {
  const { TOKEN_DE_ACCESO_USMX } = req.body;

  jwt.verify(
    TOKEN_DE_ACCESO_USMX,
    TOKEN_SECRETO,
    async (err, InformacionDelToken) => {
      if (err) {
        return res
          .status(400)
          .json("¡Oops! Parece que tú TOKEN DE ACCESO no es válido.");
      }
      return res.status(200).json(InformacionDelToken);
    }
  );
};
export const CerrarSesion = async (req, res) => {
  try {
    res.cookie("TOKEN_DE_ACCESO_USMX", "", {
      expires: new Date(0),
    });
    res.status(200).json("¡Tu sesión se ha sido finalizada correctamente!");
  } catch (error) {
    res.status(500).json(MENSAJE_DE_ERROR);
  }
};
