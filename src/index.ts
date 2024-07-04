import express from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerDocument from './docs/swagger.json'

//routes
import ApiRoutes from './routes'
import { code } from './utils/HttpCodes'

const PORT_API = process?.env?.PORT_API || "4000";
const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//use routes
app.use('/_v/api', ApiRoutes )
app.use("/_v/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/_v/api', (req, res) => {
    res.json({ 
        message:"API v1.0.0",
        documentation:  `${req.protocol}://${req.get('host')}/_v/api/docs`
    })
})
app.use((req,res, next)=>{
    res.status(code.NOT_FOUND).json({
        message: "Endpoint no encontrado",
        documentation:  `${req.protocol}://${req.get('host')}/_v/api/docs`,
        code : code.NOT_FOUND
    })
})


app.listen(PORT_API, () => console.log(`server on port http://localhost:${PORT_API}/_v/api`))