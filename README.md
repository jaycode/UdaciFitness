Change 1:
wix/react-native-calendars does not have date in its `this.props.renderItem()` function
call in `src/agenda/reservation-list/reservation.js`, so use my version instead:
```
npm install jaycode/react-native-calendars#master --save
```

Change 2:
In utils/_calendar.js, setDummyData() function, line 22 and 29, change
`{run: ..., bike:..., ...}` into `[{run: ..., bike:..., ...}]` and `: null` to `: []`

Change 3:
In components/History.js, History() function, change
`[timeToString()]: getDailyReminderValue()` to `[timeToString()]: [getDailyReminderValue()]`
