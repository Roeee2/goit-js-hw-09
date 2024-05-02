import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value < 10 ? '0' + value : value;
}

document.addEventListener('DOMContentLoaded', function () {
  const datetimePicker = document.getElementById('datetime-picker');
  const startButton = document.querySelector('[data-start]');
  const daysSpan = document.querySelector('[data-days]');
  const hoursSpan = document.querySelector('[data-hours]');
  const minutesSpan = document.querySelector('[data-minutes]');
  const secondsSpan = document.querySelector('[data-seconds]');

  let countdownInterval;
  let targetDate;

  flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        Notiflix.Notify.failure('Please choose a date in the future');
        startButton.disabled = true;
      } else {
        startButton.disabled = false;
        targetDate = selectedDate;
      }
    },
  });

  startButton.addEventListener('click', function () {
    startButton.disabled = true;

    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  });

  function updateCountdown() {
    const currentDate = new Date();
    const difference = targetDate - currentDate;

    if (difference <= 0) {
      clearInterval(countdownInterval);
      daysSpan.textContent = '00';
      hoursSpan.textContent = '00';
      minutesSpan.textContent = '00';
      secondsSpan.textContent = '00';
      Notiflix.Notify.success('Countdown finished!');
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(difference);
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
  }
});
