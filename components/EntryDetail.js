import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { purple, white } from '../utils/colors'
// Use connect rather than useSelector here since we want to compare
// states rather than props. With connect, states can be
// passed into props to be compared via React.memo.
import { connect } from 'react-redux'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import TextButton from './TextButton'

function EntryDetail (props) {
  const entryId = props.route.params.entryId
  const metrics = props.metrics[0]

  const reset = () => {
    const { remove, goBack, entryId } = props
    remove()
    goBack()
    removeEntry(entryId)
  }

  return (
    <View style={styles.container}>
      <MetricCard metrics={metrics} />
      <TextButton onPress={reset} style={{margin: 20}}>
        RESET
      </TextButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  }
})

function shouldComponentUpdate (nextProps) {
  return nextProps.metrics !== null && !nextProps.metrics.today
}

function mapStateToProps(state, { route }) {
  const { entryId } = route.params
  return {
    entryId,
    metrics: state[entryId]
  }
}

function mapDispatchToProps (dispatch, { route, navigation }) {
  const { entryId } = route.params

  return {
    remove: () => dispatch(addEntry({
      [entryId]: timeToString() === entryId
        ? getDailyReminderValue()
        : null
    })),
    goBack: () => navigation.goBack()
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(EntryDetail, shouldComponentUpdate))


export function EntryDetailOptions({ route }) {
  const { entryId } = route.params
  const year = entryId.slice(0, 4)
  const month = entryId.slice(5, 7)
  const day = entryId.slice(8)
  return {
    headerTintColor: white,
    headerStyle: {
      backgroundColor: purple,
    },
    title: `${month}/${day}/${year}`
  }
}
