import vehiclesTable from '@/data/vehicles.json'

interface IVehicleProps {
  type: string
  location: string
  availableFromTime: string
  availableToTime: string
  availableDays: string[]
  minimumMinutesBetweenBookings: number
}

export class Vehicle {
  id: string
  type: string
  location: string
  availableFromTime: string
  availableToTime: string
  availableDays: string[]
  minimumMinutesBetweenBookings: number

  constructor(props: IVehicleProps) {
    this.id = `${props.type.split('_')[0]}_${Math.floor(Math.random() * 9999)}`
    this.type = props.type
    this.location = props.location
    this.availableFromTime = props.availableFromTime
    this.availableToTime = props.availableToTime
    this.availableDays = props.availableDays
    this.minimumMinutesBetweenBookings = props.minimumMinutesBetweenBookings
  }
}

export const vehicles: Vehicle[] = vehiclesTable.vehicles

