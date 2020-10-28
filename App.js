import React from 'react'
import AddEntry from './components/AddEntry'
import { View, Platform, StatusBar } from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import History from './components/History'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { purple, white } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import EntryDetail, { EntryDetailOptions } from './components/EntryDetail'

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  )
}

const Tabs =
  Platform.OS === 'ios'
    ? createBottomTabNavigator()
    : createMaterialTopTabNavigator()

const TabNav = () => (
    <Tabs.Navigator
        initialRouteName="AddEntry"
        screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
                let icon;
                if (route.name === "Add Entry") {
                    icon = (
                        <FontAwesome name="plus-square" size={size} color={color}/>
                    );
                } else if (route.name === "History") {
                    icon = (
                        <Ionicons name="ios-bookmarks" size={size} color={color}/>
                    );
                }
                return icon;
            }
        })}
        tabBarOptions={{
            header: null,
            activeTintColor: Platform.OS === "ios" ? purple : white,
            showIcon: true,
            style: {
                height: 80,
                backgroundColor: Platform.OS === "ios" ? white : purple,
                shadowColor: "rgba(0, 0, 0, 0.24)",
                shadowOffset: {
                    width: 0,
                    height: 3
                },
                shadowRadius: 6,
                shadowOpacity: 1
            }
        }}
    >
        <Tabs.Screen name="Add Entry" component={AddEntry} />
        <Tabs.Screen name="History" component={History}/>
    </Tabs.Navigator>
);

const Stack = createStackNavigator()
const MainNavigator = () => (
    <Stack.Navigator headerMode="screen">
        <Stack.Screen
          name="Home"
          component={TabNav}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EntryDetail"
          component={EntryDetail}
          options={EntryDetailOptions}
        />
    </Stack.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={createStore(reducer)}>
        <SafeAreaView style={{flex: 1}}>
          <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </SafeAreaProvider>
  );
}
