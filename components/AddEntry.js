import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import { Ionicons as Icon } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors'
import { CommonActions } from '@react-navigation/native'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

export default function AddEntry (props) {
  const [state, setState] = useState({
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  })
  const dispatch = useDispatch()
  let curState = useSelector(_state => {
    const key = timeToString()
    console.log(`_state[${key}]`)
    console.log(_state[key])
    return {
      alreadyLogged: _state[key] && typeof _state[key][0] === 'undefined'
    }
  })

  const increment = (metric) => {
    const {max, step} = getMetricMetaInfo(metric)
    setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })

  }

  const decrement = (metric) => {
    setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })

  }

  const slide = (metric, value) => {
    setState((state) => ({
      ...state,
      [metric]: value
    }))
  }

  const submit = () => {
    const key = timeToString()
    const entry = state

    dispatch(addEntry({
      [key]: entry
    }))

    setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }))

    toHome()

    submitEntry({ key, entry })

    // Clear local notification
  }

  const reset = () => {
    const key = timeToString()

    dispatch(addEntry({
      [key]: [getDailyReminderValue()]
    }))

    toHome()

    removeEntry(key)
  }

  const toHome = () => {
    props.navigation.dispatch({
      ...CommonActions.goBack(),
      source: 'AddEntry'
    })
  }

  const metaInfo = getMetricMetaInfo()

  if (curState.alreadyLogged) {
    return (
      <View style={styles.center}>
        <Icon
          name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
          size={100}
        />
        <Text>You already logged your information for today</Text>
        <TextButton style={{padding: 10}} onPress={reset}>
          Reset
        </TextButton>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <DateHeader date={(new Date()).toLocaleDateString()} />
      {Object.keys(metaInfo).map((key) => {
        const { getIcon, type, ...rest } = metaInfo[key]
        const value = state[key]

        return (
          <View key={key} style={styles.row}>
            {getIcon()}
            {type === 'slider'
              ? <UdaciSlider
                  value={value}
                  onChange={(value) => slide(key, value)}
                  {...rest}
                />
              : <UdaciSteppers
                  value={value}
                  onIncrement={() => increment(key)}
                  onDecrement={() => decrement(key)}
                  {...rest}
                />}
          </View>
        )
      })}
      <SubmitBtn onPress={submit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
  }
})
