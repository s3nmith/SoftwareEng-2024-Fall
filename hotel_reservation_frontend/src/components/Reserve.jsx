import { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isToday as checkIfToday,
} from 'date-fns';
import '../styles/Reserve.css';
import NavbarMinimal from './NavbarMinimal';

const Reserve = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = addDays(endOfMonth(currentMonth), 6 - endOfMonth(currentMonth).getDay());

  const handleDateClick = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(formattedDate);
      setCheckOutDate(null);
    } else if (!checkOutDate && formattedDate > checkInDate) {
      setCheckOutDate(formattedDate);
    } else if (formattedDate <= checkInDate) {
      setCheckInDate(formattedDate);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const isPast = day < today && !checkIfToday(day);
        const isToday = checkIfToday(day);

        days.push(
          <div
            className={`cell ${!isSameMonth(day, currentMonth) ? 'disabled' : ''}
			  ${isPast ? 'past' : ''} ${isToday ? 'today' : ''} ${
              formattedDate === checkInDate || formattedDate === checkOutDate ? 'selected' : ''
            }`}
            key={day}
            onClick={() =>
              !isPast && isSameMonth(day, currentMonth) && handleDateClick(day)
            }
          >
            <span>{format(day, 'd')}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  return (
    <div>
      <NavbarMinimal />
      <div className="reserve">
        <div className="form-header">
          <div>
            <label>Number of Guests</label>
            <input type="number" min="1" defaultValue="2" />
          </div>
		  <div>
            <label>Room Type</label>
            <input type="number" min="1" defaultValue="2" />
          </div>
		  <div>
            <label>Room Type</label>
            <input type="number" min="1" defaultValue="2" />
          </div>
          <div className="date-info">
            <p>
              <strong>Check-in Date:</strong> {checkInDate || 'Not selected'}
            </p>
            <p>
              <strong>Check-out Date:</strong> {checkOutDate || 'Not selected'}
            </p>
          </div>
        </div>
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>&lt;</button>
            <span>{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="calendar-days">
            <div className="day">Mo</div>
            <div className="day">Tu</div>
            <div className="day">We</div>
            <div className="day">Th</div>
            <div className="day">Fr</div>
            <div className="day">Sa</div>
            <div className="day">Su</div>
          </div>
          <div className="calendar-body">{renderCells()}</div>
        </div>
        <button className="book-button">Book</button>
      </div>
    </div>
  );
};

export default Reserve;
