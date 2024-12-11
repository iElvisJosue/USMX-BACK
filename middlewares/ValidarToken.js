import jwt from "jsonwebtoken";
// IMPORTAMOS LAS AYUDAS
import { ObtenerInformacionDelSistema } from "../helpers/InformacionDelSistema.js";
import { MENSAJE_DE_NO_AUTORIZADO } from "../helpers/Const.js";

export const ValidarToken = async (req, res, next) => {
  const CookieConToken = req.body.CookieConToken || req.params.CookieConToken;

  const { TokenSistema } = await ObtenerInformacionDelSistema();

  const TokenValido = jwt.verify(CookieConToken, TokenSistema, (err) => {
    if (err) return false;
    return true;
  });

  if (TokenValido) {
    next();
  } else {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }
};
