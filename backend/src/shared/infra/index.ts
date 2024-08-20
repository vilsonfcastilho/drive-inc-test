import 'express-async-errors'
import 'reflect-metadata'

import { globalExceptionHandler } from '@/shared/infra/middlewares/global-exception-handler'
import { router } from '@/shared/infra/routes/index'
import cors from 'cors'
import express from 'express'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(globalExceptionHandler)

const port = 3333

app.listen(port, () => {
  console.log(`Server started on port ${port} 🚀`)
})
