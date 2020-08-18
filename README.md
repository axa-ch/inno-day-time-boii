# inno-day-time-boii

## Technical details

### Data structures

This app manipulates dates and times.

**Dates** are serialized in `YYYY-MM-DD` format. This has the advantage of
being human-readable and debug-friendly.

Under a given date, a list of **time pairs** is stored. This is an
array `[timePair0, ..., timePairN]`.

Each **time pair** is another length-2 array
`[checkInTime, checkOutTime]`. Both the check-in and the check-out
time are decimal numbers corresponding of 24-hour time events,
e.g. `8.5` for 8:30 AM. Representing time events as numbers facilitates
simple calculation of work hours via subtraction over a time pair and accumulated
daily or yearly work hours via addition.

