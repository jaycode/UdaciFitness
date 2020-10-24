import React from 'react'
import AddEntry from './components/AddEntry'
import { View } from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import History from './components/History'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  // useEffect(() => {
  //   console.log('before')
  //   console.log('after')
  // }, [])
  return (
    <SafeAreaProvider>
      <Provider store={createStore(reducer)}>
        <SafeAreaView style={{flex: 1}}>
          <History />
        </SafeAreaView>
      </Provider>
    </SafeAreaProvider>
  );
}


// export default class App extends React.Component {
//   componentDidMount() {
//     console.log('Before')
//     debugger
//     console.log('After')
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Open up App.js to start working on your app!</Text>
//         <StatusBar style="auto" />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
