import { get, set } from "./indexed-db.js";

// constants
const DEFAULT_DAILY = 8.4;
const DAILY_KEY = "dailyHours";
const ACCUMULATED_HOURS_KEY = "accumulatedHours";

// module globals

let date = new Date();

// helper functions
const formatDateAsKey = (date) =>
  `${date.getFullYear()}-0${date.getMonth()}-0${date.getDate()}`;

const timeToDecimal = (hours, minutes) =>
  parseInt(hours, 10) + parseInt(minutes, 10) / 60; // hours in 24h format

const getItems = async () => {
    const key = formatDateAsKey(date);
    const items = await get(key);
    return {items, key};
};

const next = (offset = 1) => {
    date = date.setDate(date.getDate() + offset);
    return date;
}

const previous = () => next(-1);


const daily = async (hours) => {
    // fetch persisted daily goal (in decimal hours, e.g. 8.4)
    let storedHours = (await get(DAILY_KEY)) || DEFAULT_DAILY;
    // caller just wants to *get* stored hours?
    if (hours === undefined) {
	// yes
      return storedHours;
    }
    // set
    await set(DAILY_KEY, hours);
    return hours;
};

const yearly = async (deltaHours) => {
    const storedAccumulatedHours = (await get(ACCUMULATED_HOURS_KEY)) || 0.0;
    // get
    if (deltaHours === undefined) {
      return storedAccumulatedHours;
    }
    // update
    const newAccumulatedHours = storedAccumulatedHours + deltaHours;
    // set
    await set(ACCUMULATED_HOURS_KEY, newAccumulatedHours);
    return newAccumulatedHours;
};

const add = async (time, which, newIndex, newRangeIndex) {
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
    const {items, key} = await this.getItems();

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
};

const edit = (index, time, which) => add(time, which, index, which);

const delete = async (index) => {
    // get items
    const {items, key} = await getItems();
    // remove the item under index
    const deleted = items.splice(index, 1);
    // persist updated items
    await set(key, items);
    // return the removed item to the caller
    return deleted[0];
};

// API
export {next, previous, daily, yearly, add, edit, delete}; 
