import { vehiclesController } from '@/modules/vehicles/infra/controllers/vehicles-controller'
import { Router } from 'express'

export const vehiclesRouter = Router()

vehiclesRouter.get('/types', vehiclesController.getVehicleTypes)
vehiclesRouter.get('/check-availability', vehiclesController.checkAvailability)

vehiclesRouter.post('/schedule-test-drive', vehiclesController.scheduleTestDrive)
