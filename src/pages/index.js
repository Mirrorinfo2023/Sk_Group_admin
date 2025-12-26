import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Login from './login'

function Home() {

  const route = useRouter();

  return (
    <>
      <Login />
    </>
  )
}

export default Home;
