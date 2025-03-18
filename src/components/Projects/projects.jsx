import React, { useEffect, useState } from "react";
import "./projects.css";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import deleteFileByURL from "../../firebaseLib/deleteFile";


const Projects = ({setOpenItem, authenticated, setSingleItem}) => {
    const apiUrl = import.meta.env.VITE_API_KEY;
    const [categories, setCategories] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [deletedCategory, setDeletedCategory] = useState(false);
    useEffect(() => {
        const getCategorys = async () => {
            const res = await axios.get(apiUrl + "/api/category/getCategorys");
            if (res.data.length > 0){
                setCategories(res.data);
                setActiveButton(res.data[0]);
            }
            else{
                setCategories([]);
                setActiveButton(null);
            }
            setDeletedCategory(false); 
        }
        getCategorys();
    }, [deletedCategory])

    const handleButtonClick = (category) => {
       setActiveButton(category);
    };

    const [newCategory , setNewCategory] = useState("");
    const addCategory = async () => {
        try{
            if (newCategory) {
                const res = await axios.post(apiUrl + "/api/category/createCategory", {categoryName: newCategory.trim()});
                setCategories([...categories, {categoryName: newCategory}]);
                setNewCategory("");
                toast.success(res.data);
            }
        }
        catch(err){
            toast.error(err.response.data);
        }
    };

    const [projects, setProjects] = useState([]);
    useEffect(() => {
        setProjects([]);
        const getProjects = async () => {
            if (activeButton?._id){
                const res = await axios.get(apiUrl + "/api/projectItem/getAllItems/" + activeButton._id);
                setProjects(res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt)
                }));
            }
        }
        getProjects();
    }, [activeButton])

    const deleteCategory = async (categoryName) => {
        try {
            const deleteProjectFiles = projects.map((project) => {
                if (project.image) return deleteFileByURL(project.image);
                if (project.video) return deleteFileByURL(project.video);
            });
            await Promise.all(deleteProjectFiles);
            
            const res = await axios.delete(`${apiUrl}/api/category/deleteCategory/${categoryName}`);
            setCategories(categories.filter((cat) => cat.categoryName !== categoryName));
            setDeletedCategory(true);
            toast.success(res.data);
        } catch (err) {
            toast.error("Failed to delete category");
        }
    };

    const deleteProject = async (project) => {
        try{
            if (project.image){
                await deleteFileByURL(project.image);
            }
            else if (project.video){
                await deleteFileByURL(project.video);
            }
            const res = await axios.delete(apiUrl + "/api/projectItem/deleteProjectItem/" + project._id);
            setProjects((prevProjects) => prevProjects.filter(p => p._id !== project._id));
            toast.success(res.data);
        }
        catch(err){
            toast.error(err.response.data);
        }
    }

    return <>

        <section className="projects-section">
            <h1 className="projects-heading">Projects</h1>

            <div className="projects">
                <div className="left-panel">
                    {categories?.map((category, index) => (
                      <div key={index} className="category-item">
                        <div>
                            <a
                              href="#projects"
                              className={activeButton?.categoryName === category?.categoryName ? "active btn" : "btn"}
                              onClick={() => handleButtonClick(category)}
                            >
                              {category.categoryName}
                            </a>
                        
                            {authenticated && (
                              <button
                                title="Delete Category"
                                className={activeButton.categoryName === category?.categoryName ? "delete-btn" : "delete-btn hide"}
                                onClick={() => deleteCategory(category?.categoryName)}
                              >
                                <Delete style={{fill: "red"}}/>
                              </button>
                            )}
                        </div>
                        
                      </div>
                    ))}
                    {authenticated && (
                      <div className="adding-category">
                        <input
                          type="text"
                          placeholder="Add a new category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button onClick={addCategory} disabled={!newCategory} className={newCategory ? "add-btn" : "add-btn disabled"}>
                          Add
                        </button>
                      </div>
                    )}
                </div>

                <div className="right-panel">
                    {authenticated && categories.length > 0 && activeButton &&
                        <div className="item" style={{cursor: "pointer"}} onClick={() => setOpenItem(activeButton)}>
                            <div className="top-part">
                                <h3>Add Project</h3>
                            </div>
                        </div>
                    }

                    {!authenticated && projects.length === 0 &&
                        <div className="item">
                            <div className="top-part">
                                <h3>No Projects Yet</h3>
                            </div>
                        </div>
                    }
                    
                    {projects?.map((project, index) => (
                        <div className="item" 
                            data-aos="zoom-in"
                            data-aos-delay={index * 200} 
                            data-aos-duration="800" key={project._id}>
                            {authenticated &&
                                <div className="delete-project-div">
                                    <button onClick={() => deleteProject(project)} title="Delete Project"><Delete style={{fill: "red", marginTop: "3px"}}/></button>
                                </div>
                            }
                            <div className="top-part">
                                {project.image ? 
                                    <img src={project.image} onClick={() => {setOpenItem(activeButton); setSingleItem(project)}} />
                                    :
                                    <h3 onClick={() => {setOpenItem(activeButton); setSingleItem(project)}}>Open Project</h3>
                                }
                            </div>
                            <div className="bottom-part">
                                <div className="separator"></div>
                                <h2 onClick={() => {setOpenItem(activeButton); setSingleItem(project)}}>{project.projectName}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </section>

    </>
}

export default Projects;