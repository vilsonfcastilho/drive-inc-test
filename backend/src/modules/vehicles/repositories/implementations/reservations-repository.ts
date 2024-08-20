import { Reservation } from '@/modules/vehicles/models/reservation';
import { ICreateReservationRequest, IIsAvailableRequest, IReservationsRepository, IVehicle } from '@/modules/vehicles/repositories/i-reservations-repository';

export class ReservationsRepository implements IReservationsRepository {
  constructor(private db: Reservation[]) {}

  async isAvailable({ vehicle, startDateTime, endDateTime }: IIsAvailableRequest): Promise<IVehicle> {
    const foundReservation = this.db.find((reservation) => {
      return (
        reservation.vehicleId === vehicle.id &&
        new Date(reservation.startDateTime) < endDateTime &&
        new Date(reservation.endDateTime) > startDateTime
      )
    })
    if (foundReservation) {
      Object.assign(vehicle, {
        isAvailable: false
      })
    } else {
      Object.assign(vehicle, {
        isAvailable: true
      })
    }

    return vehicle as IVehicle
  }

  async create({
    vehicleId,
    startDateTime,
    duration,
    customerName,
    customerPhone,
    customerEmail
  }: ICreateReservationRequest): Promise<Reservation> {
    const startEndTimeString = startDateTime.toISOString()
    const endDateTimeString = new Date(startDateTime.getTime() + duration * 60000).toISOString()

    const reservation = new Reservation({
      vehicleId,
      startDateTime: startEndTimeString,
      endDateTime: endDateTimeString,
      customerName,
      customerPhone,
      customerEmail,
    })

    await this.db.push(reservation)

    return reservation
  }
}
