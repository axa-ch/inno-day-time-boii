import { get, set } from './indexed-db.js';

// helpers
const DEFAULT_DAILY = 8.4;
const DAILY_KEY = 'dailyHours';
const ACCUMULATED_HOURS_KEY = 'accumulatedHours';

const formatDateAsKey = (date) =>
  `${date.getFullYear()}-0${date.getMonth()}-0${date.getDate()}`;

const timeToDecimal = (hours, minutes) =>
  parseInt(hours, 10) + parseInt(minutes, 10) / 60; // hours in 24h format

let inst = null; // singleton instance

// class
export default class Persistence {
  static get FROM() {
    return 0;
  }
  static get TO() {
    return 1;
  }

  constructor() {
    this.date = new Date();
  }

  static getInstance() {
    if (!inst) {
      inst = new Persistence();
    }
    return inst;
  }

  async getItems() {
    const { date } = this;
    const key = formatDateAsKey(date);
    this.dateKey = key;
    const items = await get(key);
    return items;
  }

  async getItemsFrom(date) {
    const key = formatDateAsKey(date);
    this.dateKey = key;
    const items = await get(key);
    return items;
  }

  async getTimeFromAllDays() {
    const startOfLastYear = new Date(new Date().getFullYear() - 1, 0, 1);
    const today = new Date();

    const timeFromLastYearToNow = {
      [new Date().getFullYear() - 1]: {},
      [new Date().getFullYear()]: {},
    };

    let lastDate = startOfLastYear;
    while (lastDate <= today) {
      const itemsFromDay = await this.getItemsFrom(lastDate);
      if (itemsFromDay) {
        const totalWorkTimeForDay = itemsFromDay
          .map(([start, end]) => end - start)
          .reduce((timeRange1, timeRange2) => timeRange1 + timeRange2, 0);

        if (!timeFromLastYearToNow[lastDate.getFullYear()])
          timeFromLastYearToNow[lastDate.getFullYear()] = {};
        if (!timeFromLastYearToNow[lastDate.getFullYear()][lastDate.getMonth()])
          timeFromLastYearToNow[lastDate.getFullYear()][
            lastDate.getMonth()
          ] = {};

        timeFromLastYearToNow[lastDate.getFullYear()][lastDate.getMonth()][
          lastDate.getDate()
        ] = totalWorkTimeForDay;
      }
      lastDate = this.nextFrom(lastDate);
    }
    return timeFromLastYearToNow;
  }

  next(offset = 1) {
    const { date } = this;
    this.date = date.setDate(date.getDate() + offset);
    return this.date;
  }

  nextFrom(date, offset = 1) {
    return new Date(date.setDate(date.getDate() + offset));
  }

  previous() {
    return this.next(-1);
  }

  async daily(hours) {
    let _hours = (await get(DAILY_KEY)) || DEFAULT_DAILY;
    if (hours === undefined) {
      return _hours;
    }
    await set(DAILY_KEY, hours);
    return hours;
  }

  async yearly(deltaHours) {
    const accumulatedHours = (await get(ACCUMULATED_HOURS_KEY)) || 0.0;
    if (deltaHours === undefined) {
      return accumulatedHours;
    }
    const newAccumulatedHours = accumulatedHours + deltaHours;
    await set(ACCUMULATED_HOURS_KEY, newAccumulatedHours);
    return newAccumulatedHours;
  }

  async add(time, which, newIndex, newRangeIndex) {
    let decimalTimeOnly = false;
    if (time === undefined) {
      const now = new Date();
      const _minutes = now.getMinutes();
      const _hours = now.getHours();
      time = `${_hours}:0${_minutes}`;
      decimalTimeOnly = which === undefined;
    }

    const [ok, hours, minutes] = `${time}`.match(/^(\d{1,2}):(\d{2,3})$/);
    if (!ok) {
      return false;
    }

    const timeDecimal = timeToDecimal(hours, minutes);

    if (decimalTimeOnly) {
      return timeDecimal;
    }

    // time format: hh:mm
    const items = await this.getItems(); // sets dateKey, entry as side-effect

    const { index = 0, rangeIndex = 0, dateKey } = this;
    const nextRange = rangeIndex > 1;
    let isEdit = false;

    if (newIndex === undefined) {
      newIndex = index + (nextRange ? 1 : 0);
    } else {
      isEdit = true;
    }

    items[newIndex] = items[newIndex] || [];

    if (newRangeIndex === undefined) {
      newRangeIndex = which !== undefined ? which : nextRange ? -1 : rangeIndex;
    }

    items[newIndex][newRangeIndex] = timeDecimal;

    await set(dateKey, items);

    if (!isEdit) {
      this.rangeIndex = newRangeIndex + 1;
      this.index = newIndex;
    }

    return true;
  }

  edit(index, time, which) {
    return this.add(time, which, index, which);
  }

  async delete(index) {
    const items = await this.getItems(); // sets dateKey as side-effect
    const { dateKey } = this;
    const deleted = items.splice(index, 1);
    await set(dateKey, items);
    return deleted[0];
  }
}
