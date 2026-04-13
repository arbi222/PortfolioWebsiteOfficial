import { useRef, useState } from "react";
import "./item.css"
import CloseIcon from '@mui/icons-material/Close';
import { toast } from "react-toastify";
import upload from "../../../firebaseLib/upload";
import deleteFileByURL from "../../../firebaseLib/deleteFile";
import axiosInstance from "../../../axios";

const Item = ({openItem, setOpenItem, authenticated, singleItem, setSingleItem}) => {
    const [seeMoreBtn, setSeeMoreBtn] = useState(false);

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

    const getEmbedUrl = (url) => {
        if (!url) return "";

        try {
            const parsedUrl = new URL(url);

            if (parsedUrl.hostname.includes("youtube.com")) {
                const videoId = parsedUrl.searchParams.get("v");
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
            }

            if (parsedUrl.hostname.includes("youtu.be")) {
                const videoId = parsedUrl.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }

            return url;
        } 
        catch {
            return url;
        }
    };

    const projectName = useRef();
    const bio = useRef();
    const internetLink = useRef();
    const sourceCodeLink = useRef();
    const videoLinkInput = useRef();

    const saveProject = async (e) => {
        e.preventDefault();

        let project = {
            categoryId: openItem._id,
            categoryName: openItem.categoryName,
            projectId: singleItem?._id,
            projectName: projectName.current.value,
            bio: bio.current.value,
            video: videoLinkInput.current.value,
            internetLink: internetLink.current.value,
            sourceCodeLink: sourceCodeLink.current.value
        }
        let imgUploaded = null;

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
                            </div>
                        :
                            singleItem?.video ?
                                <>
                                    <div className="video-wrapper">
                                        <iframe
                                            className="frame"
                                            src={getEmbedUrl(singleItem.video) + "?rel=0"}
                                            title="Project video"
                                            allowFullScreen
                                        />
                                        <div className="iframe-overlay"></div>
                                    </div>
                                </>
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

                                <input type="text" placeholder="Youtube video link" defaultValue={singleItem?.video} ref={videoLinkInput}/>
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
                            
                            <div>
                                <p className="note">
                                    {seeMoreBtn ? singleItem.bio : singleItem.bio.slice(0, 200) + "..."}
                                </p>
                                {singleItem.bio.length > 200 &&
                                    <button className="see-more-less" onClick={() => setSeeMoreBtn(!seeMoreBtn)}>
                                        {seeMoreBtn ? "See less" : "See more"}
                                    </button>
                                }
                            </div>

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