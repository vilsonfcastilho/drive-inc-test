import { reservations } from '@/modules/vehicles/models/reservation'
import { vehicles } from '@/modules/vehicles/models/vehicle'
import { ReservationsRepository } from '@/modules/vehicles/repositories/implementations/reservations-repository'
import { VehiclesRepository } from '@/modules/vehicles/repositories/implementations/vehicles-repository'
import { CheckVehiclesAvailabilityService } from '@/modules/vehicles/services/check-vehicles-availability-service'
import { ScheduleTestDriveService } from '@/modules/vehicles/services/schedule-test-drive-service'
import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

class VehiclesController {
  async getVehicleTypes(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const vehiclesRepository = new VehiclesRepository(vehicles)
    const data = await vehiclesRepository.getVehicleTypes()

    return res.status(200).json({
      status: 'success',
      message: 'Vehicle types fetched successfully!',
      data,
    })
  }

  async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const querySchema = z.object({
      location: z.string(),
      vehicleType: z.string(),
      startDateTime: z.string(),
      durationMins: z.string(),
    })

    const { location, vehicleType, startDateTime, durationMins } = querySchema.parse(req.query)

    const vehiclesRepository = new VehiclesRepository(vehicles)
    const reservationRepository = new ReservationsRepository(reservations)
    const checkVehiclesAvailability = new CheckVehiclesAvailabilityService(vehiclesRepository, reservationRepository)
    const data = await checkVehiclesAvailability.handle({
      location,
      vehicleType,
      startDateTime: new Date(startDateTime),
      durationMins: parseInt(durationMins, 10),
    })

    return res.status(200).json({
      status: 'success',
      message: 'Vehicles fetched successfully!',
      data,
    })
  }

  async scheduleTestDrive(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const bodySchema = z.object({
      vehicleId: z.string(),
      startDateTime: z.string(),
      duration: z.number(),
      customerName: z.string(),
      customerPhone: z.string(),
      customerEmail: z.string(),
    })

    const {
      vehicleId,
      startDateTime,
      duration,
      customerName,
      customerPhone,
      customerEmail
    } = bodySchema.parse(req.body)

    const vehiclesRepository = new VehiclesRepository(vehicles)
    const reservationsRepository = new ReservationsRepository(reservations)
    const scheduleTestDrive = new ScheduleTestDriveService(vehiclesRepository, reservationsRepository)
    const data = await scheduleTestDrive.handle({
      vehicleId,
      startDateTime: new Date(startDateTime),
      duration,
      customerName,
      customerPhone,
      customerEmail
    })

    return res.status(201).json({
      status: 'success',
      message: 'Test Drive scheduled successfully!',
      data,
    })
  }
}

export const vehiclesController = new VehiclesController()
