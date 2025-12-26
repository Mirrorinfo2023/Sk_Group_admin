// utils/withAuth.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

const checkCookies = (context) => {
  const uid = context.req ? Cookies.get('uid', { headers: context.req.headers }) : Cookies.get('uid')
  const role = context.req ? Cookies.get('role', { headers: context.req.headers }) : Cookies.get('role')
  return { uid, role }
}

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter()

    useEffect(() => {

      const { uid, role } = checkCookies({ req: typeof window === 'undefined' ? ctx.req : undefined })
      // Check if cookies are available, and if not, redirect to the login page
      if ((!uid && !router.pathname.includes('/login')) || role !== 'user') {
        router.push('/login')
      }

    }, [])

    return <WrappedComponent {...props} />
  }
}

export default withAuth