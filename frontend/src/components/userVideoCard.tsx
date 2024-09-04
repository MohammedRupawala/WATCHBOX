import React from 'react';
import { FiEdit } from 'react-icons/fi';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  img: string;
  channelName: string;
  createdAt: string;
  currentUser: string; // The ID or email of the logged-in user
  videoCreator: string; // The ID or email of the user who created the video
}

const UserVideoCard: React.FC<VideoCardProps> = ({
  title,
  thumbnail,
  img,
  channelName,
  createdAt,
  currentUser,
  videoCreator,
}) => {
  return (
    <div className="user-video-card">
      <div className="thumbnail-container">
        <img src={thumbnail} alt={title} />
        {currentUser === videoCreator && (
          <button className="update-button">
             Update
          </button>
        )}
      </div>
      <div className="details-container">
        <div>
          <img src={img} alt={channelName} />
        </div>
        <div>
          <p>{title}</p>
          <p>{channelName}</p>
          <p>{createdAt}</p>
        </div>
      </div>
    </div>
  );
};

export default UserVideoCard;
