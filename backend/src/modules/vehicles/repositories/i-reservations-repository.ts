import { Reservation } from '@/modules/vehicles/models/reservation'
import { Vehicle } from '@/modules/vehicles/models/vehicle'

export interface IVehicle extends Vehicle {
  isAvailable: boolean
}

export interface IIsAvailableRequest {
  vehicle: Vehicle
  startDateTime: Date
  endDateTime: Date
}

export interface ICreateReservationRequest {
  vehicleId: string
  startDateTime: Date
  duration: number
  customerName: string
  customerPhone: string
  customerEmail: string
}

export interface IReservationsRepository {
  isAvailable: ({ vehicle, startDateTime, endDateTime }: IIsAvailableRequest) => Promise<IVehicle>
  create: ({ vehicleId, startDateTime, duration, customerName, customerPhone, customerEmail }: ICreateReservationRequest) => Promise<Reservation>
}
