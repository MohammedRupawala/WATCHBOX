import React, { useState } from 'react'
import { NavBar } from '../components/navBar'
import { VideoCard } from '../components/videoCard'
const categories : string[] = [
    "sports",
    "Movies",
    "tv Shows",
    "Education"
] 

 const Search = () => {
    const [search,setSearch]= useState<string>("")
    const [sort,setSort] = useState<string>('')
    const [subject,setSubject] = useState<string>('')
    const [type,setType]  = useState<string>('video')
  return (
    <div className='search-video'>
    <div>
    <NavBar/>
    </div>
    <section>
    <aside>
        <h2>Filter</h2>
        <div>
            <h4>
                Sort
            </h4>
            <select value={sort} onChange={(e)=>{
                setSort(e.target.value)
            }}>
                <option value="">None</option>
                <option value="asc">Newest First</option>
                <option value="dsc">Oldest First</option>
            </select>
        </div>
        <div>
            <h4>
                Subject
            </h4>
            <select value={subject} onChange={(e)=>{
                setSubject(e.target.value)
            }}>
                <option value="">All Subject</option>
                {
                    categories.map((i)=>(
                        <option key={i} value={i}>{i.toUpperCase()}</option>
                    ))
                }
            </select>
        </div>
        <div>
            <h4>
                Type
            </h4>
            <select value={type.toLowerCase()} onChange={(e)=>{
                setType(e.target.value)
            }}>
                <option value='video'>Video</option>
                <option value='user'>User</option>
            </select>
        </div>
    </aside>
    <main>
        <h1>Videos</h1>
        <input placeholder='Search' type='text' value={search} onChange={(e)=>{
            setSearch(e.target.value)
        }}/>
        <div className='video-list'>
            {
                Array.from({ length: 21 }).map((_, index) => (
                    <VideoCard 
                      key={index}
                      title="Man United vs Man City"
                      thumbnail='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZEKJGsniQn7VB_jMwA836sc1WmXce3WJow&s'
                      img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJTN02kiBd6bxj8_oo2Wn5V0nRgm_kSdBSVw&s'
                      channelName='Pl'
                      createdAt='1/1/2024'
                    />
                  ))
            }

        </div>
    </main>
    </section>
    </div>
  )
}

export default Search
