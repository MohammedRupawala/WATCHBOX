import { NavBar } from '../components/navBar'
import { VideoCard } from '../components/videoCard'

const Home = () => {
  return (
    <div>
      <div>
        <NavBar/>
      </div>
       <div className='video-grid'>
       {Array.from({ length: 1 }).map((_, index) => (
          <VideoCard 
            key={index}
            title="Man United vs Man City"
            thumbnail='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZEKJGsniQn7VB_jMwA836sc1WmXce3WJow&s'
            img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJTN02kiBd6bxj8_oo2Wn5V0nRgm_kSdBSVw&s'
            channelName='Pl'
            createdAt='1/1/2024'
          />
        ))}
       </div>
    </div>
  )
}

export default Home