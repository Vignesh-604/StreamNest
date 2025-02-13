import Navbar from './components/AppComponents/Navbar'

import Cookies from "js-cookie"
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './components/AppComponents/Sidebar'

function App() {
  const navigate = useNavigate()

  const user = Cookies.get("user") ? true : false
  // console.log(user)

  useEffect(() => {
    if (!user) navigate("/")
  }, [])

  if (!user) return <Outlet />

  return (
    <div className=''>
      <Sidebar />
      {/* <div className='mt-36'>
        <Outlet context={JSON.parse(Cookies.get("user"))} />
      </div> */}
    </div>
  )
}

export default App
