import { get, set } from './indexed-db.js';

// constants
const DEFAULT_DAILY = 8.4;
const DAILY_KEY = 'dailyHours';
const ACCUMULATED_HOURS_KEY = 'accumulatedHours';
const COMING = 0;
const GOING = 1;

// module globals / state

let date = new Date();
let numTimePairs = 0;

// helper functions
const formatDateAsKey = (date) =>
  `${date.getFullYear()}-0${date.getMonth()}-0${date.getDate()}`;

const timeToDecimal = (hours, minutes) =>
  parseInt(hours, 10) + parseInt(minutes, 10) / 60; // hours in 24h format

// time format: hh:mm, 24-hour time
const human2decimalTime = (humanReadableTime) => {
  let time = humanReadableTime;
  if (humanReadableTime === undefined) {
    const now = new Date();
    const _minutes = now.getMinutes();
    const _hours = now.getHours();
    time = `${_hours}:0${_minutes}`;
  }

  const [ok, hours, minutes] = `${time}`.match(/^(\d{1,2}):(\d{2,3})$/);
  if (!ok) {
    return null;
  }

  return timeToDecimal(hours, minutes);
};

// API functions
const getTimePairs = async () => {
  const key = formatDateAsKey(date);
  const timePairs = await get(key);
  numTimePairs = timePairs.length;
  return { timePairs, key };
};

// navigate to next day
const nextDay = (offset = 1) => {
  date = date.setDate(date.getDate() + offset);
  return date;
};

// navigate to previous day
const previousDay = () => nextDay(-1);

const dailyHours = async (hours) => {
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

const yearlyHours = async (deltaHours) => {
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

const append = (offset = 0) => numTimePairs + offset;

const last = () => append(-1);

// add a time event (which = {COMING, GOING}) at a certain time pair (where = index into time pairs)
// Examples:
// - addTimeEvent(COMING, append): append new time pair, fill in coming part
// - addTimeEvent(GOING, last): edit last-appended time pair, fill in going part
// - addTimeEvent(COMING, 3, '08:44'): edit time pair via random access, overwrite coming part
const addTimeEvent = async (which, where, humanReadableTime) => {
  const timeDecimal = human2decimalTime(humanReadableTime);

  const { timePairs, key } = await getTimePairs(); // side-effect: sets numTimePairs

  const _where = typeof where === 'function' ? where() : where;

  timePairs[_where] = timePairs[_where] || [];

  timePairs[_where][which] = timeDecimal;

  await set(key, timePairs);
};

const deleteTimePair = async (where) => {
  // get timePairs
  const { timePairs, key } = await getTimePairs();
  // remove the item under where
  const deleted = timePairs.splice(where, 1);
  // persist updated timePairs
  await set(key, timePairs);
  // return the removed item to the caller
  return deleted[0];
};

// API
export {
  COMING,
  GOING,
  getTimePairs,
  nextDay,
  previousDay,
  dailyHours,
  yearlyHours,
  append,
  last,
  addTimeEvent,
  deleteTimePair,
};
