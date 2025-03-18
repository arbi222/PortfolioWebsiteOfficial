import React, { useEffect, useState } from "react";
import "./skills.css";
import { Close } from '@mui/icons-material';
import axios from "axios";
import { toast } from "react-toastify";

const Skills = ({ authenticated, userInfo }) => {
    const apiUrl = import.meta.env.VITE_API_KEY;
    const [skills, setSkills] = useState([]);
    useEffect(() => {
        setSkills(userInfo?.skills);
    }, [userInfo])

    const [newSkill, setNewSkill] = useState("");

    const handleAddSkill = () => {
        if (newSkill.trim() !== "") {
            setSkills([...skills, newSkill]);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    const skillsChanged = JSON.stringify(skills) !== JSON.stringify(userInfo?.skills);

    const saveSkills = async () => {
        try{
            if (skillsChanged){
                const res = await axios.put(apiUrl + "/api/users/addSkill", {skills: skills, userId: userInfo._id});
                toast.success(res.data);
            }
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    return (
        <section className="skills-section">
            <h1 className="skills-heading">Tech Stack</h1>

            {authenticated && (
                <div className="add-skill-form">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Enter a new skill"
                        className="skill-input"
                    />
                    <button onClick={handleAddSkill} disabled={!newSkill} className={newSkill ? "add-skill-btn" : "add-skill-btn disabled"}>
                        Add Skill
                    </button>
                </div>
            )}

            <div className="skills-container">
                {skills?.map((skill, index) => (
                    <div className="skill-card" 
                        data-aos={!authenticated && "zoom-in"}
                        data-aos-delay={!authenticated && index * 100} 
                        data-aos-duration={!authenticated && "800"} key={index}>
                        {skill}
                        {authenticated && (
                            <button 
                                title="Remove Skill"
                                className="remove-skill-btn" 
                                onClick={() => handleRemoveSkill(index)}
                            >
                                <Close style={{fill: "red"}}/>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {authenticated && (
                <button className={skillsChanged ? "save-skills-btn" : "save-skills-btn disabled"} disabled={!skillsChanged} onClick={saveSkills}>Save Changes</button>
            )}
        </section>
    );
};

export default Skills;