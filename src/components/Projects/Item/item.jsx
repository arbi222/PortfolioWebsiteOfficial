import { useRef, useState } from "react";
import "./item.css"
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";
import upload from "../../../firebaseLib/upload";
import deleteFileByURL from "../../../firebaseLib/deleteFile";
import axiosInstance from "../../../axios";

const Item = ({openItem, setOpenItem, authenticated, singleItem, setSingleItem}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handlePlay = () => {
        setIsPlaying(true);
        videoRef.current.play();
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
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

    const [progress, setProgress] = useState(0);
    const [video, setVideo] = useState({
        file: null,
        url: ""
    }); 

    const handleVideo = (e) => {
        if (e.target.files[0]){
            const file = e.target.files[0];

            setVideo({
                file: file,
                url: URL.createObjectURL(file)
            })
        }
    }

    const projectName = useRef();
    const bio = useRef();
    const internetLink = useRef();
    const sourceCodeLink = useRef();

    const saveProject = async (e) => {
        e.preventDefault();

        let project = {
            categoryId: openItem._id,
            categoryName: openItem.categoryName,
            projectId: singleItem?._id,
            projectName: projectName.current.value,
            bio: bio.current.value,
            internetLink: internetLink.current.value,
            sourceCodeLink: sourceCodeLink.current.value
        }
        let imgUploaded = null;
        let videoUploaded = null;

        try{
            if (img.file){
                // lets first delete the old photo from the firebase 
                if (singleItem?.image){
                    await deleteFileByURL(singleItem.image);
                    project.image = "";
                }
                
                imgUploaded = await upload(img.file, (progress) => {
                    // here we can use the progress if we want
                })
                project.image = imgUploaded;
            }

            if (video.file){
                // lets first delete the old video from the firebase 
                if (singleItem?.video){
                    await deleteFileByURL(singleItem.video);
                    project.video = "";
                }
                
                videoUploaded = await upload(img.file, (progress) => {
                    setProgress(progress);
                })
                project.video = videoUploaded;
            }

            const res = await axiosInstance.post("/api/projectItem/createorUpdateProject", project);
            toast.success(res.data);
            window.location.reload();
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    return <>
        <div className="item-container">

            <div className="item-box">
                <button className="close-btn" onClick={() => {setOpenItem(false); setSingleItem(false)}}>
                    <CloseIcon />
                </button>

                <div className="item-inside">
                    <div className={!singleItem?.image && !singleItem?.video && !authenticated ? "left-side no-left-side" : "left-side"}>
                        {authenticated ?
                            <div className="uploading-container">
                                <div className="photo-section">
                                    {img.url ? 
                                        (<img src={img.url} alt="uploaded" />)
                                    : 
                                    singleItem?.image ? 
                                        (<img src={singleItem.image} alt="single item" />)
                                    :
                                    (<label htmlFor="upload-img" title="Upload an image">
                                        <img src="./uploadImg.jpg" className="default-img" alt="upload" />
                                    </label>)
                                    }
                                    <button onClick={() => document.getElementById("upload-img").click()}>
                                        {(singleItem?.image || img.url) ? "Upload another image" : "Upload image"}
                                    </button>
                                    <input type="file" id="upload-img" onChange={handleImage} accept="image/*,image/heif,image/heic"/>
                                </div>
                                    
                                <div className="video-section">
                                    {video.url ? 
                                        (<>
                                            <video src={video.url} controls />
                                            {progress > 0 && progress < 100 &&
                                                <progress value={progress} max="100">{progress}</progress>
                                            }
                                        </>)
                                    :
                                    singleItem?.video ? 
                                        (<div className="video-wrapper">
                                            <img
                                                src="./thumbnail.jpg"
                                                alt="video thumbnail"
                                                style={{ display: !isPlaying ? "" : "none", cursor: "pointer" }}
                                                onClick={handlePlay}
                                            />
                                            <video
                                                ref={videoRef}
                                                src={singleItem.video}
                                                onClick={handlePlay}
                                                style={{ display: isPlaying ? "" : "none" }}
                                                controls
                                                onEnded={handleVideoEnded}
                                            />
                                        </div>)
                                    :
                                    (<label htmlFor="upload-video" title="Upload a video">
                                        <img src="./uploadImg.jpg" className="default-img" alt="upload" />
                                    </label>)
                                    }
                                    <button onClick={() => document.getElementById("upload-video").click()}>
                                        {(singleItem?.video || video.url) ? "Upload another video" : "Upload video"}
                                    </button>
                                    <input type="file" id="upload-video" onChange={handleVideo} accept="video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"/>
                                </div> 
                            </div>
                        :
                            singleItem?.video ?
                                <div className={`${authenticated ? "video-wrapper" : "auth-video-wrapper"}`}>
                                    <img src="./thumbnail.jpg" alt="" style={{display: !isPlaying ? "" : "none"}} onClick={handlePlay} />
                                    <video ref={videoRef} 
                                            src={singleItem.video} 
                                            onClick={handlePlay} 
                                            style={{display: isPlaying ? "" : "none"}} 
                                            controls
                                            onEnded={handleVideoEnded}>   
                                    </video>
                                </div> 
                            :
                            singleItem?.image &&
                                <img className="image" src={singleItem.image} />
                        }
                    </div>

                    <div className="right-side">
                        {authenticated ? 
                            <form onSubmit={saveProject}>
                                <div>
                                    <p className="category">Category: {openItem.categoryName}</p>
                                    <input type="text" placeholder="Title of the project" required defaultValue={singleItem?.projectName} ref={projectName}/>
                                </div>

                                <textarea placeholder="Add a short text about this project..." required defaultValue={singleItem?.bio} ref={bio}></textarea>

                                <input type="text" placeholder="Internet link" defaultValue={singleItem?.internetLink} ref={internetLink}/>
                                <input type="text" placeholder="Srouce code link" required defaultValue={singleItem?.sourceCodeLink} ref={sourceCodeLink}/>

                                <button type="submit">Save Project</button>
                            </form>
                        :
                        <>
                            <div>
                                <p className="category">{openItem.categoryName}</p>
                                <h1>{singleItem.projectName}</h1>
                            </div>
                            
                            <p className="note">
                                {singleItem.bio}
                            </p>

                            <div className="btns-links">
                                {singleItem.internetLink &&
                                    <a target="_blank" href={singleItem.internetLink}>Live on Internet</a>
                                }
                                <a target="_blank" href={singleItem.sourceCodeLink}>Source Code</a>
                            </div>
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}   

export default Item;