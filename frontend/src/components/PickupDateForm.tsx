import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PickupDateFormProps {
  pickupDate: Date | null;
  setPickupDate: (date: Date | null) => void;
}

const PickupDateForm: React.FC<PickupDateFormProps> = ({ pickupDate, setPickupDate }) => {
  const handleDateChange = (date: Date | null) => {
    setPickupDate(date);
  };

  return (
    <DatePicker
      id="pickup-date"
      selected={pickupDate}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select a date"
      className="w-full h-10 border border-zinc-300 rounded-md px-2"
      required
    />
  );
};

export default PickupDateForm;
