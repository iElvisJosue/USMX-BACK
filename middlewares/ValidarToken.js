import jwt from "jsonwebtoken";
import { TOKEN_SECRETO } from "../initial/config.js";

import { MENSAJE_DE_NO_AUTORIZADO } from "../helpers/Const.js";

export const ValidarToken = (req, res, next) => {
  const CookieConToken = req.body.CookieConToken || req.params.CookieConToken;

  const TokenValido = jwt.verify(CookieConToken, TOKEN_SECRETO, (err) => {
    if (err) return false;
    return true;
  });

  if (TokenValido) {
    next();
  } else {
    return res.status(401).json(MENSAJE_DE_NO_AUTORIZADO);
  }
};
