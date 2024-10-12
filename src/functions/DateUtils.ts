import { format, utcToZonedTime } from 'date-fns-tz';

const DateUtils = {
  millis() {
    return new Date().getTime();
  },
  format(date: string, fmt: string) {
    if (!date || date === '') return '';
    return format(utcToZonedTime(date, 'UTC'), fmt, { timeZone: 'UTC' });
  },
  parseTime(time: number) {
    if (time == null || time <= 0) return '00:00:00.000';
    return new Date(time * 1000).toISOString().slice(11, 23);
  },
};

export default DateUtils;
