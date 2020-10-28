Change 1:
wix/react-native-calendars does not have date in its `this.props.renderItem()` function
call in `src/agenda/reservation-list/reservation.js`, so use my version instead:
```
npm install jaycode/react-native-calendars#master --save
```

Change 2:
wix/react-native-calendars calls renderEmptyDate only when the item is an empty array and not null, so we adjust the entries.

In utils/_calendar.js, setDummyData() function, line 22 and 29, change
`{run: ..., bike:..., ...}` into `[{run: ..., bike:..., ...}]` and `: null` to `: []`

Change 3:
In components/History.js, History() function, change
`[timeToString()]: getDailyReminderValue()` to `[timeToString()]: [getDailyReminderValue()]`

Change 4:
In `components/AddEntry.js` (around line 40) change
```
alreadyLogged: ... _state[key].today === 'undefined'
```

to

```
alreadyLogged: ... _state[key][0] === 'undefined'
```

This is because we have changed them to a single value array as required by wix/react-native-calendars

Change 4:
Use SafeAreaView instead of manually set the top safe area, as recommended in the [reactnavigation documentation on handling safe area](https://reactnavigation.org/docs/handling-safe-area/).

Change 5:
In History.js, this code:

```
props.navigation.navigate(
  'EntryDetail',
  { entryId: key }
)
```

Passes `entryId` in `props.route` instead of `props.navigation`. [Reference](https://reactnavigation.org/docs/params).

Change 6:
The header bar of EntryDetail page is changed from the Stack component initialization in function `MainNavigator()` in App.js instead of from the EntryDetail.js component. [Reference](https://reactnavigation.org/docs/headers).

To make it a little bit more organized and more similar to the lesson, store the options function in `components/EntryDetail.js` as `EntryDetailOptions()` function.

Change 7:
Replace `shouldComponentUpdate()` function with `React.memo`. [Reference](https://reactjs.org/docs/react-api.html#reactmemo).
