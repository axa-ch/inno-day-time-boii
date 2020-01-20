export default class Persistence {
  static FROM = "from";
  static TO = "to";

  constructor() {
    this.date = new Date();
  }

  get() {}
  next() {}
  previous() {}
  daily(hours) {}
  yearly(hours) {}
  add(time, which) {}
  edit(index, time, which) {}
  delete(index) {}
}
