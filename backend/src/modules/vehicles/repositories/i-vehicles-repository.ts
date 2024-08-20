import { Vehicle } from '@/modules/vehicles/models/vehicle'

export interface IGetVehiclesByTypeAndAvailableDays {
  type: string
  weekday: string
}

export interface ICheckAvailabilityRequest {
  location: string
  vehicleType: string
  weekday: string
  startDateTime: Date
  durationMins: number
}

export interface IVehiclesRepository {
  getVehicleById: (id: string) => Promise<Vehicle | undefined>
  getVehicleTypes: () => Promise<string[]>
  getVehiclesByTypeAndAvailableDays: ({ type, weekday }: IGetVehiclesByTypeAndAvailableDays) => Promise<Vehicle[]>
  checkVehiclesAvailability: ({ location, vehicleType, weekday, startDateTime, durationMins }: ICheckAvailabilityRequest) => Promise<Vehicle[]>
}
