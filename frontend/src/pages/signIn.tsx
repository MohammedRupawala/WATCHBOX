import { ChangeEvent, FormEvent, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { NavBar } from '../components/navBar'

const SignIn = () => {
    const [name,setName] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [userPic,setUserPic] = useState<File>()
    const submitHandler = (e : FormEvent<HTMLFormElement>)=>{}
    const changeImage = (e : ChangeEvent<HTMLInputElement>)=>{
        const file:File | undefined = e.target.files?.[0];
        setUserPic(file)
    }
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
      };
  return (
    <>
    <NavBar/>
    <div className='signIn'>
        <h2>SignIn</h2>
        <main>
            <form onSubmit={submitHandler}>
                <div>
                    <label>
                        Name
                    </label>
                    <input required type="text" placeholder='Enter Name' value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
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
                
                <div>
                    <label>
                        Profile Picture
                    </label>
                    <input required type="file" onChange={changeImage}/>
                </div>
                {
                    userPic && <img src={userPic.toString()} alt={'newImage'}/>
                }
                <button type='submit'>SignIn</button>
            </form>
            <div className='relocate'>
                Don't Have Account Create One  {
                    <Link to='/sign-up'>Sign Up</Link>
                }
            </div>
        </main>
        
    </div>
    </>
  )
}

export default SignIn