import React from 'react'
import { FaHome, FaSearch, FaSignInAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export const NavBar = () => {
    let user = false;
  return (
    <div className='nav-bar'>
    <section>
    <div>
    <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2QCwVoGPf2CnWwDwYkQdPrb7n7OTK_ZtZEQ&s'}/>
    </div>
    <div><label>WatchBox</label></div>
    </section>
    <section>
        <Link to='/home'><FaHome/></Link>
        <Link to='/search'><FaSearch/></Link>
        {
            !user?<Link to='/sign-in'><FaSignInAlt/></Link>:<>User</>
        }
    </section>
    </div>
  )
}
