// helpers
const formatDateAsKey = date =>
  `${date.getFullYear()}-0${date.getMonth()}-0${date.getDate()}`;
const timeToDecimal = (hours, minutes) =>
  parseInt(hours, 10) + parseInt(minutes, 10) / 60; // hours in 24h format

let inst = null;
// class
export default class Persistence {
  static FROM = 0;
  static TO = 1;
  constructor() {
    this.date = new Date();
  }
  static getInstance() {
    if (!inst) {
      inst = new Persistence();
    }
    return inst;
  }
  getItems() {
    const { date } = this;
    const key = formatDateAsKey(date);
    this.dateKey = key;
    const value = localStorage.getItem(key) || '{"items":[]}';
    this.entry = {};
    try {
      this.entry = JSON.parse(value);
    } catch (e) {}
    const { items = [] } = this.entry;
    return items;
  }
  next(offset = 1) {
    const { date } = this;
    this.date = date.setDate(date.getDate() + offset);
    return this.date;
  }
  previous() {
    return this.next(-1);
  }
  daily(hours) {}
  yearly(hours) {}
  add(time, which) {
    // time format: hh:mm
    const items = this.getItems(); // sets dateKey, entry as side-effect
    const [ok, hours, minutes] = `${time}`.match(/^(\d\d?):(\d\d)$/);
    if (!ok) {
      return false;
    }
    const timeDecimal = timeToDecimal(hours, minutes);
    const { index = 0, rangeIndex = 0, dateKey, entry } = this;
    const newIndex = index + (rangeIndex > 1 ? 1 : 0);
    items[newIndex] = items[newIndex] || [];
    const newRangeIndex = which !== undefined ? which : rangeIndex;
    items[newIndex][newRangeIndex] = timeDecimal;
    const value = JSON.stringify(entry);
    localStorage.setItem(dateKey, value);
    this.rangeIndex = newRangeIndex + 1;
    this.index = newIndex;
    return true;
  }
  edit(index, time, which) {}
  delete(index) {}
}
