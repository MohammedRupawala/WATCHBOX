import { lazy, Suspense } from 'react'
import Loader from './components/loader';
import { Routes,Route, BrowserRouter } from 'react-router-dom';
const Home = lazy(()=>import('./pages/home'))
const Search = lazy(()=>import('./pages/search'))
const SignIn = lazy(()=>import('./pages/signIn'))
const SignUp = lazy(()=>import('./pages/signUp'))
const Channel = lazy(()=>import('./pages/yourChannel'))



function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/search' element={<Search/>}></Route>
        <Route path='/sign-in' element={<SignIn/>}></Route>
        <Route path='/sign-up' element={<SignUp/>}></Route>
        <Route path='/your-channel' element={<Channel/>}></Route>
        
      </Routes>
      
    </Suspense>
    </BrowserRouter>
  );
}

export default App;