import { Reservation } from '@/modules/vehicles/models/reservation'
import { IReservationsRepository } from '@/modules/vehicles/repositories/i-reservations-repository'
import { IVehiclesRepository } from '@/modules/vehicles/repositories/i-vehicles-repository'
import { AppError } from '@/shared/errors/app-error'

interface IRequest {
  vehicleId: string
  startDateTime: Date
  duration: number
  customerName: string
  customerPhone: string
  customerEmail: string
}

export class ScheduleTestDriveService {
  constructor(
    private vehiclesRepository: IVehiclesRepository,
    private reservationsRepository: IReservationsRepository
  ) {}

  async handle({
    vehicleId,
    startDateTime,
    duration,
    customerName,
    customerPhone,
    customerEmail
  }: IRequest): Promise<Reservation> {
    if (!vehicleId) throw new AppError('The property "vehicleId" is required.')
    if (!startDateTime) throw new AppError('The property "startDateTime" is required.')
    if (!duration) throw new AppError('The property "duration" is required.')
    if (!customerName) throw new AppError('The property "customerName" is required.')
    if (!customerPhone) throw new AppError('The property "customerPhone" is required.')
    if (!customerEmail) throw new AppError('The property "customerEmail" is required.')

    const foundVehicle = await this.vehiclesRepository.getVehicleById(vehicleId)
    if (!foundVehicle) {
      throw new AppError('Vehicle not found.', 404)
    }
    if (duration < foundVehicle.minimumMinutesBetweenBookings) {
      throw new AppError(`Sorry, the "duration" should have at least ${foundVehicle.minimumMinutesBetweenBookings} minutes.`)
    }

    const reservation = await this.reservationsRepository.create({
      vehicleId,
      startDateTime,
      duration,
      customerName,
      customerPhone,
      customerEmail
    })

    return reservation
  }
}
