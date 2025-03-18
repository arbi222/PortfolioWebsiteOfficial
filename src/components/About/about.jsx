import React, { useEffect, useRef, useState } from "react";
import "./about.css";
import { toast } from "react-toastify";
import axios from "axios";

const About = ({authenticated, userInfo}) => {

    const apiUrl = import.meta.env.VITE_API_KEY;
    const [aboutInfo, setAboutInfo] = useState(null);
    useEffect(() => {
        const getAbout = async () => {
            try{
                if (userInfo._id){
                    const about = await axios.get(apiUrl + "/api/about/getAbout/" + userInfo?._id);
                    setAboutInfo(about.data);
                }
            }
            catch(err){
                console.log(err);   
            }
        }
        getAbout();
    },[userInfo])

    const titleAbout = useRef();
    const textarea_one_About = useRef();
    const textarea_two_About = useRef();
    const shortTextAbout = useRef();

    const saveChanges = async () => {
        const about = {
            userId: userInfo._id,
            title: titleAbout.current.value,
            paragraphOne: textarea_one_About.current.value,
            paragraphTwo: textarea_two_About.current.value,
            paragraphThree: shortTextAbout.current.value
        }

        try{
            const aboutResponse = await axios.post(apiUrl + "/api/about/createOrUpdateAbout", {about});
            if (aboutResponse.data === "updated"){
                toast.success("About section updated successfully!");
            }
            else if (aboutResponse.data === "created"){
                toast.success("About section created successfully!");
            } 
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    return <>   
        <h1 className="about-heading">About Me</h1>

        <div className="about">
            {authenticated ?
                <input type="text" placeholder="Write a title for the about section" ref={titleAbout} defaultValue={aboutInfo?.title}/>
                :
                <h1>{aboutInfo?.title}</h1>
            }
            
            {authenticated ? 
                <div className="inside-about">
                    <textarea placeholder="Paragraph one" ref={textarea_one_About} defaultValue={aboutInfo?.paragraphOne}></textarea>
                    <textarea placeholder="Paragraph two" ref={textarea_two_About} defaultValue={aboutInfo?.paragraphTwo}></textarea>
                    <input type="text" placeholder="Short text" ref={shortTextAbout} defaultValue={aboutInfo?.paragraphThree}/>
                </div>
            :
            <>
                <p>{aboutInfo?.paragraphOne}</p>
                <p>{aboutInfo?.paragraphTwo}</p>
                <p>{aboutInfo?.paragraphThree}</p>
            </>
            }

            {authenticated &&
                <button className="save-btn" onClick={saveChanges}>Save Changes</button>
            }
            
        </div>
    </>
}

export default About;