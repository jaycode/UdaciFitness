import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import { Agenda } from 'react-native-calendars'
import DateHeader from './DateHeader'
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { AppLoading } from 'expo'

export default function History (props) {
  const [state, setState] = useState({
    entries: [],
    ready: false
  })

  const entries = useSelector(_state => {
    return _state
  })

  const dispatch = useDispatch()
  useEffect(() => {
    fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          dispatch(addEntry({
            [timeToString()]: [getDailyReminderValue()]
          }))
        }
      })
      .then(() => setState(() => ({...state, ready: true})))
  }, [])

  const onDayPress = (day) => {
    setState({
      ...state
    })
  };

  const renderItem = ({ today, ...metrics }, firstItemInDay, date) => {
    const formattedDate = date !== undefined ? date.toString("MMMM d, yyyy") : null
    const key = date.toString("yyyy-MM-dd")
    return (
      <View style={styles.item}>
        {today
          ? <View>
              <DateHeader date={formattedDate} />
              <Text style={styles.noDataText}>
                {today}
              </Text>
            </View>
          : <TouchableOpacity onPress={() =>
              props.navigation.navigate(
                'EntryDetail',
                { entryId: key }
              )}>
              <MetricCard metrics={metrics} date={formattedDate} />
            </TouchableOpacity>
        }
      </View>
    )
  }

  const renderEmptyDate = (date) => {
    const formattedDate = date.toString("MMMM d, yyyy")
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>
          You didn't log any data on this day.
        </Text>
      </View>
    )
  }

  const { ready } = state

  if (ready === false) {
    return <AppLoading />
  }
  console.log("entries")
  console.log(entries)
  return (
    <Agenda
      items={entries}
      onDayPress={onDayPress}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
    />
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0,0,0,0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    }
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  }
})
