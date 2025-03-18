import React, { useRef } from "react";
import "./contact.css";
import {Instagram, GitHub, LinkedIn, ArrowForward} from '@mui/icons-material';
import { toast } from "react-toastify";
import axios from "axios";

const Contact = ({authenticated, userInfo}) => {

    const apiUrl = import.meta.env.VITE_API_KEY;

    const title = useRef();
    const bio = useRef();
    const mobile = useRef();
    const email = useRef();
    const gitHub = useRef();
    const instagram = useRef();
    const linkedIn = useRef();

    const updateUser = async () => {
        const user = {
            userId: userInfo._id,
            title_contact: title.current.value,
            bio_contact: bio.current.value,
            mobileNumber: mobile.current.value,
            username: email.current.value,
            githubLink_contact: gitHub.current.value,
            linkedInLink_contact: linkedIn.current.value,
            instagramLink_contact: instagram.current.value
        }

        try{
            const res = await axios.put(apiUrl + "/api/users/" + userInfo._id, user);
            toast.success(res.data);
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    const name = useRef();
    const mobileNumber = useRef();
    const emailContact = useRef();
    const subject = useRef();
    const message = useRef();

    const contactUser = async (e) => {
        e.preventDefault();

        const contactingMessage = {
            _id: userInfo._id,
            name: name.current.value,
            mobileNumber: mobileNumber.current.value,
            emailContact: emailContact.current.value,
            subject: subject.current.value,
            message: message.current.value
        }

        try{
            const res = await axios.post(apiUrl + "/api/contact/contactOwner", contactingMessage);
            name.current.value = ""
            mobileNumber.current.value = ""
            emailContact.current.value = ""
            subject.current.value = ""
            message.current.value = ""
            toast.success(res.data);
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    return <>

        <section className="contact-section">
            <h1 className="contact-header">Get In Touch</h1>

            <div className="contact-wrapper" style={{alignItems: authenticated ? "center" : ""}}>
                <div className="info-panel">
                    <div className="thumbnail">
                        <img src="./contact.png" />
                    </div>
                    
                    <h2>{userInfo?.firstName + " " + userInfo?.lastName}</h2>
                    {authenticated ? 
                        <div className="input-fields">
                            <input type="text" placeholder="Title" ref={title} defaultValue={userInfo?.title_contact}/>
                            <input type="text" placeholder="Bio" ref={bio} defaultValue={userInfo?.bio_contact}/>
                        </div>
                    :
                        <>
                            <p>{userInfo?.title_contact}</p>
                            <p>{userInfo?.bio_contact}</p>
                        </>
                    }
                    
                    <div className="contact-info first">
                        {userInfo?.mobileNumber ? 
                            <label htmlFor="number">Phone:</label>
                            :
                            authenticated &&
                            <label htmlFor="number">Phone:</label>
                        }
                        {authenticated ?
                            <input type="text" className="mobile-number" placeholder="Mobile number" ref={mobile} defaultValue={userInfo?.mobileNumber}/>
                        :
                            userInfo?.mobileNumber &&
                                <a id="number" href={`tel:${userInfo?.mobileNumber}`}>{userInfo?.mobileNumber}</a>
                        }
                        
                    </div>
                    <div className="contact-info last">
                        <label htmlFor="email">Email:</label>
                        {authenticated ?
                            <input type="email" className="mobile-number" placeholder="Email" defaultValue={userInfo?.username} ref={email}/>
                        :
                            <a id="email" href={`mailto:${userInfo?.username}`}>{userInfo?.username}</a>
                        }
                    </div>

                    <div className="other-contacts">
                        <p>Find Me Also On:</p>
                        {authenticated ?
                            <div className="input-links">
                                <input type="text" placeholder="Add the Github link..." defaultValue={userInfo?.githubLink_contact} ref={gitHub}/>
                                <input type="text" placeholder="Add the LinkedIn link..." defaultValue={userInfo?.linkedInLink_contact} ref={linkedIn}/>
                                <input type="text" placeholder="Add the Instagram link..." defaultValue={userInfo?.instagramLink_contact} ref={instagram}/>
                                <button onClick={updateUser}>Save changes</button>
                            </div>
                        :
                        <div className="btns">
                            {userInfo?.linkedInLink_contact &&
                                <a href={userInfo?.linkedInLink_contact} target="_blank" title="LinkedIn">
                                    <LinkedIn />
                                </a>
                            }
                            {userInfo?.githubLink_contact &&
                                <a href={userInfo?.githubLink_contact} target="_blank" title="GitHub">
                                    <GitHub />
                                </a>
                            }
                            {userInfo?.instagramLink_contact &&
                                <a href={userInfo?.instagramLink_contact} target="_blank" title="Instagram">
                                    <Instagram />
                                </a>
                            }
                        </div>
                        }
                        
                    </div>         
                </div>
                
                <form className="contact-panel" onSubmit={contactUser}>
                    <div className="first-section">
                        <div className="fields">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" ref={name} required/>
                        </div>
                        <div className="fields">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" id="phone" ref={mobileNumber} placeholder="Optional" />
                        </div>
                    </div>
                    
                    <div className="other-section">
                        <label htmlFor="mail">Email</label>
                        <input type="email" id="mail" ref={emailContact} required/>
                    </div>
                    <div className="other-section">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" ref={subject} required/>
                    </div>
                    <div className="message">
                        <label htmlFor="message">Your Message</label>
                        <textarea id="message" ref={message} required></textarea>
                    </div>
                    <button className="submit-btn" type="submit">
                        <span>
                            Send Message 
                        </span>
                        <ArrowForward className="arrow-icon" />
                    </button>
                </form>
            </div>
            
        </section>

    </> 
}

export default Contact;