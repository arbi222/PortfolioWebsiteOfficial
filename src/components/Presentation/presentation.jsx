import { useState, useEffect } from "react";
import "./presentation.css"
import upload from "../../firebaseLib/upload";
import { toast } from "react-toastify";
import deleteFileByURL from "../../firebaseLib/deleteFile";
import axiosInstance from "../../axios";

const Presentation = ({authenticated, userInfo}) => {

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

    const [textareaValue, setTextareaValue] = useState(userInfo?.bio);
    const [disabledBtn, setDisabledBtn] = useState(true);

    useEffect(() => {
        if (cvFile.file || img.file || textareaValue !== userInfo?.bio){
            setDisabledBtn(false);
        }
        else{
            setDisabledBtn(true);
        }
    }, [cvFile.file, img.file, textareaValue])

    const savePresentation = async () => {
        let updateUserObject = {
            userId: userInfo._id,
            bio: textareaValue,
            updatedAt: new Date(),
        }
        let cvFileUploaded = null;
        let imgFileUploaded = null;

        if (cvFile.file){
            if (userInfo.cv){ // first we delete from the db and firebase the old cv
                await deleteFileByURL(userInfo.cv);
                updateUserObject.cv = "";
            }
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
            await axiosInstance.put("/api/users/" + userInfo._id, updateUserObject);
            setDisabledBtn(true);
            toast.success("Presentation updated successfully!");
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    const downloadCv = () => {
        window.location.href = import.meta.env.VITE_API_KEY + `/api/users/download-cv?url=${encodeURIComponent(userInfo?.cv)}`;
    }

    return <>
        <div className="presentation">

            <div className="container card">
                <div className="info">
                    <h1>Hi, I'm <span>{userInfo?.firstName + " " + userInfo?.lastName}</span></h1>
                    {authenticated ?
                        <textarea className="textarea" 
                                defaultValue={userInfo?.bio} 
                                placeholder="Write something about yourself... " 
                                onChange={(e) => setTextareaValue(e.target.value)}
                        />
                        :
                        <>
                            <p>{userInfo?.bio}</p>
                        </>
                    }
                </div>

                <div className="cv">
                    <p>Get In Touch:</p>
                    {authenticated ?
                        <div className="input-cv">
                            <label htmlFor="cv">Upload Your CV</label>
                            <input type="file" id="cv" onChange={handleCV} accept=".pdf,.doc,.docx"/>
                            <p>
                                {cvFile.url ? cvFile.url :
                                userInfo?.cv ? "1 file exists." :
                                 "No file uploaded."
                                }
                            </p>
                        </div>
                    :   
                        <div>
                            <a href="#" onClick={downloadCv}>Download CV</a>
                            <a href="#contact">Contact Me</a>
                        </div>
                    }
                </div>
            </div>
            
            <div className="img-section card">
                <img src={img.url ? img.url : 
                    userInfo?.avatar ? userInfo.avatar
                    : "./defaultUser.png" } alt="MERN Stack Developer" />
                {authenticated && 
                    <div className="img-uploader">
                        <label htmlFor="img">Upload your picture</label>
                        <input type="file" id="img" onChange={handleImage} accept="image/*"/>
                    </div>
                }
            </div>

            {authenticated &&
                <button className={`save-btn ${disabledBtn ? "disabled-btn" : ""}`} 
                        disabled={disabledBtn} 
                        onClick={savePresentation}>
                    Save Presentation
                </button>
            }
        </div>
    </>
}

export default Presentation;