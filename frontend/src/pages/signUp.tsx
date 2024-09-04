import { ChangeEvent, FormEvent, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { NavBar } from '../components/navBar'

const SignUp = () => {
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const submitHandler = (e : FormEvent<HTMLFormElement>)=>{}
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
      };
  return (
    <>
    <NavBar/>
    <div className='signIn'>
        <h2>SignUp</h2>
        <main>
            <form onSubmit={submitHandler}>
                <div>
                    <label>
                        Email
                    </label>
                    <input required type="email" placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className='password-input-wrapper'>
                    <label>
                        Password
                    </label>
                    <input required type={showPassword ? 'text' : 'password'} placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button onClick={togglePasswordVisibility}>
                {showPassword ? <FiEyeOff/> : <FiEye/>}
              </button>
                </div>
                <button type='submit'>SignIn</button>
            </form>
            <div className='relocate'>
                Already Signed UP?  {
                    <Link to='/sign-in'>Sign In</Link>
                }
            </div>
        </main>
        
    </div></>
  )
}

export default SignUp