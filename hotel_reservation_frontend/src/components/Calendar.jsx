import { useContext } from 'react';
import PropTypes from 'prop-types';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isToday, startOfDay } from 'date-fns';
import '../styles/Calendar.css';
import { DateContext } from '../context/DateContext'; 

const Calendar = ({ currentMonth, setCurrentMonth, disabled }) => {
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } = useContext(DateContext);
  const today = startOfDay(new Date());

  const isPrevMonthDisabled =
    currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() <= today.getMonth();

  const handleDateClick = (date) => {
    if (disabled) return;
    const selectedDate = startOfDay(date);

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(selectedDate);
      setCheckOutDate(null);
    } else if (!checkOutDate && selectedDate > checkInDate) {
      setCheckOutDate(selectedDate);
    } else if (selectedDate <= checkInDate) {
      setCheckInDate(selectedDate);
      setCheckOutDate(null);
    }
  };

  const handlePrevMonth = () => {
    if (!isPrevMonthDisabled) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderCells = () => {
    const rows = [];
    let days = [];
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const firstDayIndex = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < firstDayIndex) || dayCounter > totalDaysInMonth) {
          days.push(<div className="cell empty" key={`${week}-${day}`}></div>);
        } else {
          const currentDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            dayCounter
          );
          const isPast = currentDate < today;
          const isTodayDate = isToday(currentDate);
          const isSelected =
            (checkInDate && currentDate.getTime() === checkInDate.getTime()) ||
            (checkOutDate && currentDate.getTime() === checkOutDate.getTime());
          const isInRange =
            checkInDate && checkOutDate && currentDate > checkInDate && currentDate < checkOutDate;

          days.push(
            <div
              className={`cell 
                ${isPast ? 'past' : ''}
                ${isTodayDate ? 'today' : ''}
                ${isSelected ? 'selected' : ''}
                ${isInRange ? 'in-range' : ''}
              `}
              key={currentDate.getTime()}
              onClick={() => !isPast && handleDateClick(currentDate)}
            >
              <span>{format(currentDate, 'd')}</span>
            </div>
          );

          dayCounter++;
        }
      }

      rows.push(
        <div className="row" key={week}>
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  return (
    <div>
      <div className="calendar">
        <div className="calendar-header">
          <button
            onClick={handlePrevMonth}
            disabled={isPrevMonthDisabled}
            className={isPrevMonthDisabled ? 'disabled' : ''}
          >
            &lt;
          </button>
          <span>{format(currentMonth, 'MMMM yyyy').toUpperCase()}</span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
        <div className="calendar-days">
          <div className="day">Su</div>
          <div className="day">Mo</div>
          <div className="day">Tu</div>
          <div className="day">We</div>
          <div className="day">Th</div>
          <div className="day">Fr</div>
          <div className="day">Sa</div>
        </div>
        <div className="calendar-body">{renderCells()}</div>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  setCurrentMonth: PropTypes.func.isRequired,
  checkInDate: PropTypes.instanceOf(Date),
  setCheckInDate: PropTypes.func.isRequired,
  checkOutDate: PropTypes.instanceOf(Date),
  setCheckOutDate: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Calendar;
