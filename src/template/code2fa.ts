
export const gethtml = (code: string, title: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="es-MX">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                    .header {
                        color: aliceblue;
                        background-color: #1a2530;
                        margin: 10vh 3vw 0vh;
                        padding: 0.3vh 5vw;
                        text-align: center;
                    }
                    .card {
                        border: 1px solid #1a2530;
                        color: #1a2530;
                        background-color: aliceblue;
                        margin: 0vh 3vw 5vh;
                        padding: 2vh 5vw;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h3>${title}</h3>
                </div>
                <div class="card">
                    <strong><h1>Código de verificación</h1></strong>
                    <strong><h2>Usted ha recibido un código de verificación.</h2></strong>
                    <strong><h1>Su código es: ${code}</h1></strong>
                </div>
            </body>
        </html>
    `;
}

