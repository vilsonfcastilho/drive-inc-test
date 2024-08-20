import { vehiclesRouter } from '@/modules/vehicles/infra/routes/vehicles-router'
import { Router } from 'express'

export const router = Router()

router.use('/v1/vehicles', vehiclesRouter)
