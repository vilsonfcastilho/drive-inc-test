'use client'

import PickupDateForm from '@/components/PickupDateForm'
import { api } from '@/data/api'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Vehicle {
  id: string
  type: string
  location: string
  availableFromTime: string
  availableToTime: string
  availableDays: string[]
  minimumMinutesBetweenBookings: number
}

interface IToastRequest {
  status: string
  message: string
}

interface IGetAvailabilityRequest {
  location: string
  vehicleType: string
  pickupDate: string
  pickupTime: string
  duration: number
}

interface IScheduleTestDriveRequest {
  vehicleId: string
  startDateTime: string
  duration: number
  customerName: string
  customerPhone: string
  customerEmail: string
}

async function getVehicleTypes() {
  try {
    const response = await api(`/v1/vehicles/types`)

    const data = await response.json()

    return data
  } catch (err) {
    console.error('Error:', err)
  }
}

async function getAvailability({ location, vehicleType, pickupDate, pickupTime, duration }: IGetAvailabilityRequest): Promise<any> {
  try {
    const response = await api(`/v1/vehicles/check-availability?location=${location}&vehicleType=${vehicleType}&startDateTime=${pickupDate + ' ' + pickupTime}&durationMins=${duration}`)

    const data = await response.json()

    return data
  } catch (err) {
    console.error('Error:', err)
  }
}

async function scheduleTestDrive({ vehicleId, startDateTime, duration, customerName, customerPhone, customerEmail }: IScheduleTestDriveRequest): Promise<any> {
  try {
    const response = await api('/v1/vehicles/schedule-test-drive', {
      method: 'POST',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        vehicleId,
        startDateTime,
        duration,
        customerName,
        customerPhone,
        customerEmail,
      })
    })

    const data = await response.json()

    return data
  } catch (err) {
    console.error('Error:', err)
  }
}

export default function Home() {
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [location, setLocation] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [pickupDate, setPickupDate] = useState<Date | null>(null)
  const [pickupHour, setPickupHour] = useState('')
  const [pickupMinutes, setPickupMinutes] = useState('')
  const [duration, setDuration] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [vehiclesData, setVehiclesData] = useState([]) as any[]

  useEffect(() => {
    async function fetchVehicleTypes() {
      const typesResponse = await getVehicleTypes()
      setVehicleTypes(typesResponse.data)
    }

    fetchVehicleTypes()
  }, [])

  function notify({status, message}: IToastRequest) {
    if (status === 'success') {
      toast.success(message)
    } else {
      toast.warn(message)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const adjustedDate = new Date(pickupDate
      ? pickupDate.getTime() - (pickupDate?.getTimezoneOffset() * 60000)
      : new Date()
    ).toISOString().split('T')[0]

    const formData = {
      location,
      vehicleType,
      pickupDate: adjustedDate,
      pickupTime: `${pickupHour}:${pickupMinutes}:00`,
      duration: parseInt(duration, 10),
    }

    const availableVehiclesResponse = await getAvailability(formData)
    notify({
      status: availableVehiclesResponse.status,
      message: availableVehiclesResponse.message,
    })
    setVehicles(
      availableVehiclesResponse.status === 'success'
      ? availableVehiclesResponse.data
      : []
    )
    setVehiclesData(
      availableVehiclesResponse.status === 'success'
      ? availableVehiclesResponse.data.map((vehicle: Vehicle) => ({
        vehicleId: vehicle.id,
        customerName: '',
        customerPhone: '',
        customerEmail: ''
      }))
      : []
    )
  }

  function updateVehicleData(index: number, field: string, value: string) {
    setVehiclesData((prev: any) => {
      const updatedVehicles = [...prev]
      updatedVehicles[index] = {
        ...updatedVehicles[index],
        [field]: value
      }
      return updatedVehicles
    })
  }

  async function handleTestDriveSubmit(e: React.FormEvent<HTMLFormElement>, index: number) {
    e.preventDefault()

    const vehicleData = vehiclesData[index]
    const adjustedDate = new Date(pickupDate
      ? pickupDate.getTime() - (pickupDate?.getTimezoneOffset() * 60000)
      : new Date()
    ).toISOString().split('T')[0] + ' ' + `${pickupHour}:${pickupMinutes}:00`

    const testDriveFormData = {
      vehicleId: String(vehicleData.vehicleId),
      startDateTime: String(adjustedDate),
      duration: parseInt(duration, 10),
      customerName: String(vehicleData.customerName),
      customerPhone: String(vehicleData.customerPhone),
      customerEmail: String(vehicleData.customerEmail),
    }

    const testDriveResponse = await scheduleTestDrive(testDriveFormData)
    notify({
      status: testDriveResponse.status,
      message: testDriveResponse.message,
    })
    setVehicles([])
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="mx-auto w-full max-w-md rounded-lg border bg-background p-6 shadow-lg sm:p-8">
        <div>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Request vehicle availability</h1>
            <p className="text-muted-foreground">
              Enter the details to check vehicle availability.
            </p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="flex-col">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Dublin"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="flex-col">
              <label htmlFor="vehicleType">Vehicle Type</label>
              <select
                id="vehicleType"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                defaultValue={"DEFAULT"}
                onChange={(e) => setVehicleType(e.target.value)}
                required
              >
                <option value="DEFAULT" disabled>
                  Select vehicle type
                </option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-col">
                <label htmlFor="pickupDate">Date</label>
                <PickupDateForm pickupDate={pickupDate} setPickupDate={setPickupDate} />
              </div>
              <div className="flex-col">
                <label htmlFor="pickupTime">Time</label>
                <div className="flex gap-2 w-full">
                  <select
                    id="pickupHour"
                    className="w-full h-10 border border-zinc-300 rounded-md px-2"
                    defaultValue={"DEFAULT"}
                    onChange={(e) => setPickupHour(e.target.value)}
                    required
                  >
                    <option value="DEFAULT" disabled>
                      Hour
                    </option>
                    {[...Array(24).keys()].map((hour) => (
                      <option key={hour} value={hour.toString().padStart(2, '0')}>
                        {hour.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    id="pickupMinutes"
                    className="w-full h-10 border border-zinc-300 rounded-md px-2"
                    defaultValue={"DEFAULT"}
                    onChange={(e) => setPickupMinutes(e.target.value)}
                    required
                  >
                    <option value="DEFAULT" disabled>
                      Minutes
                    </option>
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                      <option key={minute} value={minute.toString().padStart(2, '0')}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex-col">
              <label htmlFor="duration">Duration</label>
              <input
                id="duration"
                type="number"
                placeholder="15"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white h-10 rounded-md"
            >
              Request
            </button>
          </form>
        </div>
      </div>
      {vehicles.length > 0 ? vehicles.map((vehicle: Vehicle, index: number) => (
        <div key={vehicle.id} className="mx-auto w-full max-w-md rounded-lg border bg-background p-6 shadow-lg sm:p-8">
          <div>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Vehicle</h1>
              <p className="text-muted-foreground">
                This vehicle is available for the day and time selectec.
              </p>
            </div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={(e) => handleTestDriveSubmit(e, index)}>
            <div className="flex-col">
              <label htmlFor={`vehicleId-${index}`}>Vehicle ID</label>
              <input
                id={`vehicleId-${index}`}
                type="text"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                defaultValue={vehiclesData[index]?.vehicleId}
                disabled
                required
              />
            </div>
            <div className="flex-col">
              <label htmlFor="location">Date</label>
              <input
                id="location"
                type="text"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                defaultValue={new Date(pickupDate
                  ? pickupDate.getTime() - (pickupDate?.getTimezoneOffset() * 60000)
                  : new Date()
                ).toISOString().split('T')[0] + ' ' + `${pickupHour}:${pickupMinutes}:00`}
                disabled
                required
              />
            </div>
            <div className="flex-col">
              <label htmlFor="vehicleType">Duration</label>
              <input
                id="vehicleType"
                type="text"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                defaultValue={parseInt(duration, 10)}
                disabled
                required
              />
            </div>
            <div className="flex-col">
              <label htmlFor={`customerName-${index}`}>Customer name</label>
              <input
                id={`customerName-${index}`}
                type="text"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                value={vehiclesData[index]?.customerName}
                onChange={(e) => updateVehicleData(index, 'customerName', e.target.value)}
                required
              />
            </div>
            <div className="flex-col">
              <label htmlFor={`customerPhone-${index}`}>Customer phone</label>
              <input
                id={`customerPhone-${index}`}
                type="text"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                value={vehiclesData[index]?.customerPhone}
                onChange={(e) => updateVehicleData(index, 'customerPhone', e.target.value)}
                required
              />
            </div>
            <div className="flex-col">
              <label htmlFor={`customerEmail-${index}`}>Customer e-mail</label>
              <input
                id={`customerEmail-${index}`}
                type="text"
                className="w-full h-10 border border-zinc-300 rounded-md px-2"
                value={vehiclesData[index]?.customerEmail}
                onChange={(e) => updateVehicleData(index, 'customerEmail', e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white h-10 rounded-md"
            >
              Schedule Test Drive
            </button>
          </form>
        </div>
      )) : <div />}
      <ToastContainer />
    </div>
  )
}
