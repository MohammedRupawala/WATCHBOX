type videoCard = {
    title : string,
    createdAt : string,
    img : string,
    thumbnail : string;
    channelName : string
}
export const VideoCard = ({title,thumbnail,channelName,createdAt,img} : videoCard) => {
  return (
   <>
   <div className="video-card">
      <div className="thumbnail-container">
        <img src={thumbnail} alt="Thumbnail" />
      </div>
      <div className="details-container">
        <div>
        <img src={img}/>
        </div>
       <div>
       <p>{title}</p>
       <p>{channelName}</p>
       <p>{createdAt}</p>
       </div>
      </div>
    </div>
   </>
  )
}
