export const DiseñoCorreo = (
  Nombre,
  Apellidos,
  Correo,
  Telefono,
  Mensaje,
  NombreSistema
) => {
  return `
        <!DOCTYPE html>
    <html
      lang="en"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:v="urn:schemas-microsoft-com:vml"
    >
      <head>
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900"
          rel="stylesheet"
          type="text/css"
        />
        <style>
          * {
            box-sizing: border-box;
          }
    
          body {
            margin: 0;
            padding: 0;
          }
    
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
          }
    
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }
    
          p {
            line-height: inherit;
          }
    
          .desktop_hide,
          .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
          }
    
          .image_block img + div {
            display: none;
          }
    
          sup,
          sub {
            font-size: 75%;
            line-height: 0;
          }
    
          @media (max-width: 720px) {
            .desktop_hide table.icons-inner {
              display: inline-block !important;
            }
    
            .icons-inner {
              text-align: center;
            }
    
            .icons-inner td {
              margin: 0 auto;
            }
    
            .row-content {
              width: 100% !important;
            }
    
            .stack .column {
              width: 100%;
              display: block;
            }
    
            .desktop_hide,
            .desktop_hide table {
              display: table !important;
              max-height: none !important;
            }
    
            .row-1 .column-1 .block-3.paragraph_block td.pad > div {
              font-size: 14px !important;
            }
          }
        </style>
      </head>
      <body
        class="body"
        style="
          margin: 0;
          background-color: #ffffff;
          padding: 0;
          -webkit-text-size-adjust: none;
          text-size-adjust: none;
        "
      >
        <table style="width: 100%; max-width: 700px; margin: 0 auto;">
          <tbody>
            <tr>
              <td>
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="row row-1"
                  role="presentation"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    background-color: #ffffff;
                  "
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="row-content stack"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            background-color: #ffffff;
                            border-bottom: 1px solid #5e356f;
                            border-left: 1px solid #5e356f;
                            border-radius: 0;
                            border-right: 1px solid #5e356f;
                            border-top: 1px solid #5e356f;
                            color: #000000;
                            width: 700px;
                            margin: 0 auto;
                          "
                          width="700"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column column-1"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  font-weight: 400;
                                  text-align: left;
                                  padding-bottom: 5px;
                                  padding-top: 5px;
                                  vertical-align: top;
                                  border-top: 0px;
                                  border-right: 0px;
                                  border-bottom: 0px;
                                  border-left: 0px;
                                "
                                width="100%"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="image_block block-1"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td
                                      class="pad"
                                      style="
                                        width: 100%;
                                        padding-right: 0px;
                                        padding-left: 0px;
                                      "
                                    >
                                      <div
                                        align="center"
                                        class="alignment"
                                        style="line-height: 10px"
                                      >
                                        <div style="max-width: 140px">
                                         <img
    src="cid:Logo-${NombreSistema}"
    style="width: 100%; max-width: 140px; height: 140px;"
    alt=""
/>

                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table
                                  border="0"
                                  cellpadding="10"
                                  cellspacing="0"
                                  class="divider_block block-2"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td class="pad">
                                      <div align="center" class="alignment">
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          role="presentation"
                                          style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                          "
                                          width="100%"
                                        >
                                          <tr>
                                            <td
                                              class="divider_inner"
                                              style="
                                                font-size: 1px;
                                                line-height: 1px;
                                                border-top: 1px solid #d8d8d8;
                                              "
                                            >
                                              <span style="word-break: break-word"
                                                > </span
                                              >
                                            </td>
                                          </tr>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table
                                  border="0"
                                  cellpadding="10"
                                  cellspacing="0"
                                  class="paragraph_block block-3"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td class="pad">
                                      <div
                                        style="
                                          color: #000000;
                                          direction: ltr;
                                          font-family: 'Montserrat', 'Trebuchet MS',
                                            'Lucida Grande', 'Lucida Sans Unicode',
                                            'Lucida Sans', Tahoma, sans-serif;
                                          font-size: 16px;
                                          font-weight: 400;
                                          letter-spacing: 0px;
                                          line-height: 120%;
                                          text-align: center;
                                          mso-line-height-alt: 19.2px;
                                        "
                                      >
                                        <p style="margin: 0; margin-bottom: 16px">
                                          <span
                                            style="
                                              word-break: break-word;
                                              color: #000000;
                                            "
                                            >Estimados miembros del equipo de </span
                                          ><strong
                                            ><span
                                                style="
                                                  word-break: break-word;
                                                  color: #000000;
                                                "
                                                >${NombreSistema}</span></strong>,
                                        </p>
                                        <p style="margin: 0; margin-bottom: 16px">
                                          Espero que este mensaje los encuentre
                                          bien. Mi nombre es
                                          <span
                                            style="
                                              word-break: break-word;
                                              color: #1800ff;
                                            "
                                            ><strong>${Nombre} ${Apellidos}</strong></span
                                          >, y quisiera ponerme en contacto con
                                          ustedes para tratar un asunto relacionado
                                          con sus servicios/productos.
                                        </p>
                                        <p style="margin: 0; margin-bottom: 16px">
                                          Mis datos de contacto son los siguientes:
                                          correo electrónico
                                          <span
                                            style="
                                              word-break: break-word;
                                              color: #f50000;
                                            "
                                            ><strong>${Correo}</strong> </span
                                          >y teléfono
                                          <span
                                            style="
                                              word-break: break-word;
                                              color: #f50000;
                                            "
                                            ><strong>${Telefono}.</strong></span
                                          >
                                        </p>
                                        <p style="margin: 0; margin-bottom: 16px">
                                          El motivo de mi mensaje es
                                          <span
                                            style="
                                              word-break: break-word;
                                              color: #27943d;
                                            "
                                            ><strong>${Mensaje}.</strong
                                            ></span
                                          >
                                        </p>
                                        <p style="margin: 0; margin-bottom: 16px">
                                          Agradezco de antemano su atención y quedo
                                          en espera de su respuesta para dar
                                          seguimiento. Por favor, no duden en
                                          comunicarse conmigo si requieren
                                          información adicional.
                                        </p>
                                        <p style="margin: 0; margin-bottom: 16px">
                                          Saludos cordiales,
                                        </p>
                                        <p style="margin: 0">
                                          <span
                                            style="
                                              word-break: break-word;
                                              color: #1800ff;
                                            "
                                            ><strong>${Nombre} ${Apellidos}</strong></span
                                          >
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="row row-2"
                  role="presentation"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    background-color: #ffffff;
                  "
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="row-content stack"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            color: #000000;
                            width: 700px;
                            margin: 0 auto;
                          "
                          width="700"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column column-1"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  font-weight: 400;
                                  text-align: left;
                                  padding-bottom: 5px;
                                  padding-top: 5px;
                                  vertical-align: top;
                                  border-top: 0px;
                                  border-right: 0px;
                                  border-bottom: 0px;
                                  border-left: 0px;
                                "
                                width="100%"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="icons_block block-1"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    text-align: center;
                                    line-height: 0;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td
                                      class="pad"
                                      style="
                                        vertical-align: middle;
                                        color: #1e0e4b;
                                        font-family: 'Inter', sans-serif;
                                        font-size: 15px;
                                        padding-bottom: 5px;
                                        padding-top: 5px;
                                        text-align: center;
                                      "
                                    >
                                      <!--[if vml]><table align="center" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                      <!--[if !vml]><!-->
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="icons-inner"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          display: inline-block;
                                          padding-left: 0px;
                                          padding-right: 0px;
                                        "
                                      >
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- End -->
      </body>
    </html>
        `;
};
