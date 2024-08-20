import reservationsTable from '@/data/reservations.json'

interface IReservationProps {
  vehicleId: string
  startDateTime: string
  endDateTime: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

export class Reservation {
  id: number
  vehicleId: string
  startDateTime: string
  endDateTime: string
  customerName: string
  customerEmail: string
  customerPhone: string

  constructor(props: IReservationProps) {
    this.id = Math.floor(Math.random() * 9999)
    this.vehicleId = props.vehicleId
    this.startDateTime = props.startDateTime
    this.endDateTime = props.endDateTime
    this.customerName = props.customerName
    this.customerEmail = props.customerEmail
    this.customerPhone = props.customerPhone
  }
}

export const reservations: Reservation[] = reservationsTable.reservations

