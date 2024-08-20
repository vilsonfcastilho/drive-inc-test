import { Vehicle } from '@/modules/vehicles/models/vehicle'
import { IReservationsRepository } from '@/modules/vehicles/repositories/i-reservations-repository'
import { IVehiclesRepository } from '@/modules/vehicles/repositories/i-vehicles-repository'
import { AppError } from '@/shared/errors/app-error'
import { getTimeString } from '@/shared/utils/get-time-string'
import { getWeekday } from '@/shared/utils/get-weekday'

interface IRequest {
  location: string
  vehicleType: string
  startDateTime: Date
  durationMins: number
}

export class CheckVehiclesAvailabilityService {
  constructor(
    private vehiclesRepository: IVehiclesRepository,
    private reservationRepository: IReservationsRepository
  ) {}

  async handle({location, vehicleType, startDateTime, durationMins}: IRequest): Promise<Vehicle[]> {
    if (!location) throw new AppError('The property "location" is required.')
    if (!vehicleType) throw new AppError('The property "vehicleType" is required.')
    if (!startDateTime) throw new AppError('The property "startDateTime" is required.')
    if (!durationMins) throw new AppError('The property "durationMins" is required.')

    const weekday = getWeekday(startDateTime)
    const startTime = getTimeString(startDateTime)
    const endDateTime = new Date(startDateTime.getTime() + durationMins * 60000)
    const endTime = getTimeString(endDateTime)

    const foundVehicles = await this.vehiclesRepository.getVehiclesByTypeAndAvailableDays({
      type: vehicleType,
      weekday,
    })
    if (foundVehicles.length <= 0) {
      throw new AppError(`Sorry, there is no vehicle available for this vehicle model "${vehicleType}" and day.`)
    } else if (startTime < foundVehicles[0].availableFromTime || endTime > foundVehicles[0].availableToTime) {
      throw new AppError(`Sorry, for the vehicle model "${vehicleType}" our schedule is from "${foundVehicles[0].availableFromTime}" to "${foundVehicles[0].availableToTime}".`)
    } else if (durationMins < foundVehicles[0].minimumMinutesBetweenBookings) {
      throw new AppError(`Sorry, the "duration" should have at least ${foundVehicles[0].minimumMinutesBetweenBookings} minutes.`)
    }

    const isAvailablePromises: Promise<any>[] = []
    for (const vehicle of foundVehicles) {
      const isAvailablePromise = this.reservationRepository.isAvailable({
        vehicle,
        startDateTime,
        endDateTime,
      })
      isAvailablePromises.push(isAvailablePromise)
    }
    const response = await Promise.all(isAvailablePromises)

    const vehiclesAvailableToScheduleTestDrive = response.filter((vehicle) => vehicle.isAvailable)

    return vehiclesAvailableToScheduleTestDrive
  }
}
