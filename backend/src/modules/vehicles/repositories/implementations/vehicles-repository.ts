import { Vehicle } from '@/modules/vehicles/models/vehicle';
import { ICheckAvailabilityRequest, IGetVehiclesByTypeAndAvailableDays, IVehiclesRepository } from '@/modules/vehicles/repositories/i-vehicles-repository';

export class VehiclesRepository implements IVehiclesRepository {
  constructor(private db: Vehicle[]) {}

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    const foundVehicle = await this.db.find((vehicle) => vehicle.id === id)

    return foundVehicle
  }

  async getVehicleTypes(): Promise<string[]> {
    const foundVehicleTypes = await this.db.reduce((acc: string[], cur: Vehicle) => {
      if (!acc.includes(cur.type)) {
        acc.push(cur.type);
      }

      return acc;
    }, [])

    return foundVehicleTypes
  }

  async getVehiclesByTypeAndAvailableDays({ type, weekday }: IGetVehiclesByTypeAndAvailableDays): Promise<Vehicle[]> {
    const foundVehicles = await this.db.filter((vehicle) => vehicle.type === type && vehicle.availableDays.includes(weekday))

    return foundVehicles
  }

  async checkVehiclesAvailability({
    location,
    vehicleType,
    weekday,
    startDateTime,
    durationMins,
  }: ICheckAvailabilityRequest): Promise<Vehicle[]> {
    const endDateTime = new Date(startDateTime.getTime() + durationMins * 60000)

    const foundAvailables = await this.db.filter((vehicle) => {
      vehicle.location.includes(location) &&
      vehicle.type === vehicleType &&
      vehicle.availableDays.includes(weekday)
      new Date(vehicle.availableFromTime) < startDateTime &&
      new Date(vehicle.availableToTime) > endDateTime
    })

    return foundAvailables
  }
}
