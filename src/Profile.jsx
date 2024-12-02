import React, { useRef,useState } from "react";
import NavBar from "./NavBar";
import { useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";


function User(props) {
    const cardRef = useRef();
    const [isDownloading,setIsDownloading] = useState(false);
    const downloadCard = () => {
        setIsDownloading(true);

        setTimeout(()=>{
            if (cardRef.current) {
                toPng(cardRef.current)
                    .then((dataUrl) => {
                        const link = document.createElement("a");
                        link.href = dataUrl;
                        link.download = `${props.name}-profile-card.png`;
                        link.click();
                        setIsDownloading(false);
                    })
                    .catch((err) => {
                        console.error("Failed to download the image", err);
                    });
            }
        },1000);
        
    };

    return (
        <>
            <div className="card-container" ref={cardRef} style={{ backgroundColor: props.pbc, color: props.pfc }}>
                <span className={props.status === "Online" ? "pro online" : "pro offline"}>
                    {props.status}
                </span>
                <img src={props.imageURL} className="img" alt="user" width={150} height={150} />
                <h3 >{props.name}</h3>
                <h3>{props.city}</h3>
                <p>{props.job}</p>
                <div className="buttons">
                    <button className="primary">Message</button>
                    <button className="primary outline">Following</button>
                </div>
                <div className="skills" style={{ backgroundColor: props.sbc }}>
                    <h6 style={{ color: props.sfc }}>Skills</h6>
                    <ul>
                        {props.skillClicked.map((skill, index) => (<li style={{ color: props.sfc, borderColor: props.sfc }} key={index}>{skill}</li>))}
                    </ul>
                </div>
                {!isDownloading && (
                    <FontAwesomeIcon onClick={downloadCard} className="downloadbtn" icon={faCircleArrowDown} style={{ color: "#000000",cursor:"pointer" }} />
                )}
                
            </div>

        </>

    );
}

export const UserCard = () => {
    const location = useLocation();
    const { profileList } = location.state || { profileList: [] };

    return (
        <>
            <NavBar />
            {profileList.map((user, index) => (
                <User key={index} name={user.name} city={user.city} job={user.job} status={user.status} imageURL={user.imageURL} skillClicked={user.skillClicked} pbc={user.pbc} sbc={user.sbc} pfc={user.pfc} sfc={user.sfc} />
            ))}
        </>
    )
}
