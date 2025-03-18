import React, { useRef, useState } from "react";
import "./presentation.css"
import axios from "axios";
import upload from "../../firebaseLib/upload";
import { toast } from "react-toastify";
import deleteFileByURL from "../../firebaseLib/deleteFile";

const Presentation = ({authenticated, userInfo}) => {
    const apiUrl = import.meta.env.VITE_API_KEY;

    const [cvFile, setFile] = useState({
        file: null,
        url: ""
    }); 

    const handleCV = (e) => {
        if (e.target.files[0]){
            const file = e.target.files[0];

            const spliting = file.name.split(".");
            const joining = spliting[0].slice(0, 12) + "(." + spliting[1] + ")"

            setFile({
                file: file,
                url: joining
            })
        }
    }

    const [img, setImg] = useState({
        file: null,
        url: ""
    }); 

    const handleImage = (e) => {
        if (e.target.files[0]){
            const file = e.target.files[0];

            setImg({
                file: file,
                url: URL.createObjectURL(file)
            })
        }
    }

    const textarea = useRef();

    const savePresentation = async () => {
        let updateUserObject = {
            userId: userInfo._id,
            bio: textarea.current.value,
            updatedAt: new Date(),
        }
        let cvFileUploaded = null;
        let imgFileUploaded = null;

        if (cvFile.file){
            cvFileUploaded = await upload(cvFile.file, (progress) => {
                // here we can use the progress if we want
            })
            updateUserObject.cv = cvFileUploaded;
        }

        if (img.file){
            if (userInfo.avatar){ // first we delete from the db and firebase the old photo
                await deleteFileByURL(userInfo.avatar);
                updateUserObject.avatar = "";
            }
            imgFileUploaded = await upload(img.file, (progress) => {
                // here we can use the progress if we want
            })
            updateUserObject.avatar = imgFileUploaded;
        }

        try{
            await axios.put(apiUrl + "/api/users/" + userInfo._id, updateUserObject);
            toast.success("Presentation updated successfully!");
        }
        catch(err){
            toast.error(err.respone.data);
        }
    }

    return <>
        <div className="presentation">

            <div className="container card">
                <div className="info">
                    {userInfo &&
                        <h1>Hi, I'm <span>{userInfo?.firstName + " " + userInfo?.lastName}</span></h1>
                    }
                    {authenticated ?
                        <textarea className="textarea" defaultValue={userInfo?.bio} placeholder="Write something about yourself... " ref={textarea}/>
                        :
                        <p>{userInfo?.bio}</p>
                    }
                </div>

                <div className="cv">
                    <p>Download my curriculum vitae:</p>
                    {authenticated ?
                        <div className="input-cv">
                            <label htmlFor="cv">Upload Your CV</label>
                            <input type="file" id="cv" onChange={handleCV} accept=".pdf,.doc,.docx"/>
                            <p>
                                {cvFile.url ? cvFile.url :
                                 "1 file exists."
                                }
                            </p>
                        </div>
                    :   
                        <div>
                            <a href={userInfo?.cv}>Download CV</a>
                            <a href="#contact">Contact Me</a>
                        </div>
                    }
                </div>
            </div>
            
            <div className="img-section card">
                <img src={img.url ? img.url : 
                    userInfo?.avatar && userInfo.avatar } alt="MERN Stack Developer" />
                {authenticated && 
                    <div className="img-uploader">
                        <label htmlFor="img">Upload your picture</label>
                        <input type="file" id="img" onChange={handleImage} accept="image/*"/>
                    </div>
                }
            </div>

            {authenticated &&
                <button className="save-btn" onClick={savePresentation}>Save Presentation</button>
            }
        </div>
    </>
}

export default Presentation;