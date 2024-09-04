import { Link } from "react-router-dom";
import { NavBar } from "../components/navBar";
import UserVideoCard from "../components/userVideoCard";

type UserProps = {
    name: string;
    email: string;
    profile: string;
};

const userData: UserProps = {
    name: "Mohammed Rupawala",
    email: "mohammedrupawala@gmail.com",
    profile: "https://yt3.googleusercontent.com/ytc/AIdro_kexSU46w6cYLAw7n2skj-kjy6uv4tRLz7Q3K1rsh5kWb6z0DWyfRdUElppkPxsBgt36Q=s120-c-k-c0x00ffffff-no-rj"
};
const  currentUser = "mohammed@gmail.com"
const videoUser = "mohammed@gmail.com"
const YourChannel = () => {
    return (
        <>
            <NavBar />
            <div className="channel">
                <section className="profile">
                    <div>
                        <img src={userData.profile} alt={`${userData.name}'s profile`} />
                    </div>
                    <div>
                        <h2>{userData.name}</h2>
                        <h5>{userData.email}</h5>
                    </div>
                </section>
                <main className="videos">
                    <aside>
                        <h3>Your Videos</h3>
                    </aside>
                    <article>
                        {
                            Array.from({ length: 10 }).map((_, index) => (
                                <UserVideoCard
                                    key={index}
                                    currentUser={currentUser}
                                    videoCreator={videoUser}
                                    title="Man United vs Man City"
                                    thumbnail='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZEKJGsniQn7VB_jMwA836sc1WmXce3WJow&s'
                                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJTN02kiBd6bxj8_oo2Wn5V0nRgm_kSdBSVw&s'
                                    channelName='Pl'
                                    createdAt='1/1/2024'
                                />
                            ))
                        }
                    </article>
                </main>
            </div>
        </>
    );
};

export default YourChannel;
