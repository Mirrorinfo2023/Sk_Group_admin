import '@/styles/globals.css'
import { Provider } from 'react-redux'
import store from '../../store'
//import DisableCopyPasteRightClick from "../components/UI/DisableCopyPasteRightClick";




export default function App({ Component, pageProps }) {

  // const arr = [1,3,2,7,4,0,2,8,2,8,6]

  // Input: list1 = [1,2,4], list2 = [1,3,4]Output: [1,1,2,3,4,4]

  // const arr = {
  //   name: 'pankaj',
  //   exp: {
  //     job1: 'test1',
  //     job2: 'test2',
  //     skills: {
  //       skill1: 'java',
  //       skill2: 'node'
  //     }
  //   }
  // }

  // const add = (perameter) => {

  //   console.log(Object.entries(perameter))

  // }

  // add(arr)

  // const arr1 = {
  //   _name: "pankaj",
  //   _exp: {
  //     _job1: "test1",
  //     _job2: "test2",
  //     _skills: {
  //       _skill1: "java",
  //       _skill2: "node"
  //     }
  //   }
  // }



  return (
    <Provider store={store} >
      {/* <DisableCopyPasteRightClick /> */}
      <Component {...pageProps} />
    </Provider>
  )

}
