import React, { useEffect, useState } from "react";
import "./experience.css";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import upload from "../../firebaseLib/upload";
import deleteFileByURL from "../../firebaseLib/deleteFile";

const Experience = ({ authenticated }) => {
    const apiUrl = import.meta.env.VITE_API_KEY;
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const getExperiences = async () => {
            const res = await axios(apiUrl + "/api/experience/getAllExperiences");
            setExperiences(res.data.sort((ex1, ex2) => {
                return new Date(ex2.createdAt) - new Date(ex1.createdAt);
            }));
        }
        getExperiences();
    }, [])


    const handleImage = (e, index) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const newExperiences = [...experiences];
            newExperiences[index].img = URL.createObjectURL(file);
            newExperiences[index].imgFile = file;
            setExperiences(newExperiences);
        }
    };

    const handleInputChange = (e, index, field) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = e.target.value;
        setExperiences(newExperiences);
    };

    const handleRadioChange = (value, index, field) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = value;
        setExperiences(newExperiences);
    };

    const addJob = () => {
        setExperiences([{
            imgFile: null,
            img: "",
            workingPeriod: "",
            companyName: "",
            jobTitle: "",
            jobType: "",
            workingPlace: "",
            description: "",
            webpageLink: ""
        }, ...experiences]);
    };

    const deleteJob = async (index) => {
        const experiencetobeDeleted = experiences.filter((_, i) => i == index)[0];
        try{
            if (experiencetobeDeleted._id){
                if (experiencetobeDeleted.img){
                    await deleteFileByURL(experiencetobeDeleted.img);
                }
                const res = await axios.delete(apiUrl + "/api/experience/deleteExperience/" + experiencetobeDeleted._id);
                toast.success(res.data);
            }
            
            const newExperiences = experiences.filter((_, i) => i !== index);
            setExperiences(newExperiences);
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    const saveExperience = async (index) => {
        try{
            let imgFileUploaded = null;
            if (experiences[index].imgFile){
                imgFileUploaded = await upload(experiences[index].imgFile, (progress) => {
                    // here we can use the progress if we want
                })
                experiences[index].img = imgFileUploaded;
            }
            const res = await axios.post(apiUrl + "/api/experience/addOrUpdateExperience", experiences[index]);
            toast.success(res.data);
            window.location.reload();
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    return (
        <div className="experience">
            <h1>My Experience</h1>

            {authenticated && (
                <button className="btn" onClick={addJob}>Add Job</button>
            )}

            {experiences.map((exp, index) => (
                <div className="item" key={exp._id || index}>
                    <div className="total-info" style={{paddingTop: authenticated && "25px"}}>
                    {authenticated ?
                        <div className="photo-div">
                            <label htmlFor={`upload-img-${index}`} title="Upload image">
                                <img className="uploaded-img" src={exp.img ? exp.img : "./uploadImg.jpg"} />
                            </label>
                            <input type="file" id={`upload-img-${index}`} accept="image/*" onChange={(e) => handleImage(e, index)} />
                        </div>
                    :   
                        
                        <div className="photo-div">
                            <img src={exp.img || "./defaultJobImg.png"} alt="Company's Logo" /> 
                        </div>
                    }

                        <div className={authenticated ? "item-info authenticated" : "item-info"}>
                            {authenticated ?
                                <input type="text" 
                                    className="working-period" 
                                    placeholder="Working period" 
                                    value={exp.workingPeriod} 
                                    onChange={(e) => handleInputChange(e, index, 'workingPeriod')} 
                                />
                                :
                                <p className="timestamp">{exp?.workingPeriod}</p>
                            }  
                            
                            <div>
                                {authenticated ? 
                                <>
                                    <input type="text" className="working-place" placeholder="Company's name" value={exp.companyName} onChange={(e) => handleInputChange(e, index, 'companyName')} />
                                    
                                    <div className="work-position-upload">
                                        <input type="text" className="job-title" placeholder="Job-title" value={exp.jobTitle} onChange={(e) => handleInputChange(e, index, 'jobTitle')} />

                                        <div className='job-radio-container'>
                                            <p>Job type: </p>
                                            <div className="radio-div">
                                                {['Full-time', 'Part-time'].map((type) => (
                                                    <div className="radio-inside" key={type}>
                                                        <input
                                                            type="radio"
                                                            id={`${type}-${index}`}
                                                            name={`job-type-${index}`}
                                                            checked={exp.jobType === type}
                                                            readOnly
                                                            required
                                                            onClick={() => handleRadioChange(type, index, 'jobType')}
                                                        />
                                                        <label className='radio-gaps' htmlFor={`${type}-${index}`}>{type === 'Full-time' ? 'Full-time' : 'Part-time'}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className='job-radio-container'>
                                            <p>Working location: </p>
                                            <div className="radio-div">
                                                {['Onsite', 'Hybrid', 'Remote'].map((location) => (
                                                    <div className="radio-inside" key={location}>
                                                        <input
                                                            type="radio"
                                                            id={`${location}-${index}`}
                                                            name={`working-location-${index}`}
                                                            checked={exp.workingPlace === location}
                                                            readOnly
                                                            required
                                                            onClick={() => handleRadioChange(location, index, 'workingPlace')}
                                                        />
                                                        <label className='radio-gaps' htmlFor={`${location}-${index}`}>{location.charAt(0).toUpperCase() + location.slice(1)}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <h2>{exp.companyName}</h2>
                                    <div className="work-position">
                                        <h3>{exp.jobTitle}</h3>
                                        <div className="small-info">
                                            <p>{exp.jobType}</p>
                                            <p>{exp.workingPlace}</p>
                                        </div>
                                    </div>
                                </>            
                                }   
                            </div>
                            
                            {authenticated ?
                                <>
                                    <textarea className="description-textarea" required placeholder="Add some info about your role in this company..." value={exp.description} onChange={(e) => handleInputChange(e, index, 'description')} />
                                    <input type="text" className="webpage-link" placeholder="Webpage link of the company" value={exp.webpageLink} onChange={(e) => handleInputChange(e, index, 'webpageLink')} />
                                </>
                            :
                            <p className="description">{exp.description}</p>
                            }
                            
                            {authenticated &&
                                <button className="btn" onClick={() => saveExperience(index)}>Save Changes</button>
                            }
                        </div>
                    </div>
                    
                    {!authenticated ?
                        exp.webpageLink &&
                            <a href={exp.webpageLink} target="_blank">Visit Webpage</a>
                        :
                        <button className="delete-experience" title="Delete experience" onClick={() => deleteJob(index)}><Delete style={{fill: "red"}}/></button>
                    } 
                </div>
            ))}
        </div>
    );
};


export default Experience;