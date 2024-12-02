import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import '../node_modules/bootstrap/dist/js/bootstrap';
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const FormProfile = () => {
    const inputFile = useRef(null);
    const inputSkill = useRef(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skillSuggestions, setSkillSuggestions] = useState();
    const [selectSkill, setSelectSkill] = useState();
    const [skillClicked, setskillClicked] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        job: '',
        status: '',
        skillClicked: [],
        pbc: '#000000',
        sbc: '#000000',
        pfc: '#000000',
        sfc: '#000000'
    })
    const [profileList, setProfileList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handlePic = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, imageURL }));
        }
    };

    const skillsAPI = (skills) => `https://api.apilayer.com/skills?q=${skills}&apikey=GlwDn9DM42xnh68WCG3CDYqL2szcHggV`;

    useEffect(
        () => {
            if (skills && skills.length >= 1) {
                fetchSkillsAPI();
            }
        }, [skills]
    )

    const fetchSkillsAPI = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(skillsAPI(skills));
            const resp = await response.data;

            console.log("SkillsAPI----->", resp);

            const skillData = resp.map((data) => {
                return typeof data === "string" ? data : data.skillName;
            });
            setSkillSuggestions(skillData);

        }
        catch (e) {
            console.error("Error fetching skills:", e);
        }
        finally {
            setLoading(false); // End loading
        }

    }

    const handleClickedSkills = async (data) => {
        setSelectSkill(data);
    }

    useEffect(
        () => {
            if (selectSkill && !skillClicked.includes(selectSkill)) {
                const updatedSkills = [...skillClicked, selectSkill];
                setskillClicked(updatedSkills);
                setFormData({ ...formData, skillClicked: updatedSkills });
                setSkillSuggestions([]);

            }
        }, [selectSkill]
    );

    const handleRemoveSkill = (index) => {
        setskillClicked((prev) => prev.filter((_, i) => i !== index));
    }

    const removePicSkill = () => {
        if (inputFile.current && inputSkill.current) {
            inputFile.current.value = "";
            inputFile.current.type = "text";
            inputFile.current.type = "file";
            inputSkill.current.value = ""
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editIndex !== null) {
            const updatedProfiles = profileList.map((profile, id) => id === editIndex ? { ...formData } : profile);
            setProfileList(updatedProfiles);
            setEditIndex(null);
        }
        else {
            const updatedList = [...profileList, { ...formData }];
            setProfileList(updatedList);
            console.log("Current FormData:", formData);

            console.log("Updated Profile List:", updatedList);
        }

        setFormData({
            name: '',
            city: '',
            job: '',
            status: '',
            skillClicked: [],
            pbc: '#000000',
            sbc: '#000000',
            pfc: '#000000',
            sfc: '#000000',
            imageURL: ''
        });
        setskillClicked([]);
        removePicSkill();
    }

    const handleDeletebtn = (index) => {
        setProfileList((prev) => prev.filter((_, i) => i !== index));
    }

    const handleEditbtn = (index) => {
        const editProfile = profileList[index];
        if (editProfile) {
            setFormData({
                name: editProfile.name,
                city: editProfile.city,
                job: editProfile.job,
                status: editProfile.status,
                pbc: editProfile.pbc,
                sbc: editProfile.sbc,
                pfc: editProfile.pfc,
                sfc: editProfile.sfc,
                imageURL: editProfile.imageURL,
                skillClicked: editProfile.skillClicked,
            });
            setskillClicked(editProfile.skillClicked);
            setEditIndex(index);

        }
    }

    const navigate = useNavigate();
    const handleViewCards = () => {
        navigate('/Profile', { state: { profileList } });

    }

    return (
        <>
            <NavBar />
            <div className="container p-2" style={{
                borderRadius: "5px",
                boxShadow: "0px  10px 20px -10px rgba(0,0,0,0.75)", backgroundColor: "#FFF8F0"
            }}>
                <div class="card ">
                    <div class="card-body" style={{ backgroundColor: "#FFF8F0" }}>
                        <div className="row text-center">
                            <h3 className="fw-bold">Profile Form</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div class="col-12 col-md-4 mb-3">
                                    <label for="exampleFormControlInput1" class="form-label fw-bolder">Name</label>
                                    <input type="text" name="name" value={formData.name} class="form-control" id="exampleFormControlInput1" placeholder="John" onChange={handleInputChange} required />
                                </div>
                                <div class="col-12 col-md-4 mb-3">
                                    <label for="exampleFormControlInput1" class="form-label fw-bolder">City</label>
                                    <input type="text" name="city" value={formData.city} class="form-control" id="exampleFormControlInput1" placeholder="New Delhi" onChange={handleInputChange} required />
                                </div>
                                <div class="col-12 col-md-4 mb-3">
                                    <label for="exampleFormControlInput1" class="form-label fw-bolder">Job Title</label>
                                    <input type="text" name="job" value={formData.job} class="form-control" id="exampleFormControlInput1" placeholder="Web Developer" onChange={handleInputChange} required />
                                </div>

                            </div>

                            <div className="row mb-3">
                                <div class="col-12 col-md-4 mb-3">
                                    <label for="exampleFormControlInput1" class="form-label fw-bolder">Status</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="status" id="Online" value="Online" checked={formData.status === "Online"} onChange={handleInputChange} />
                                        <label class="form-check-label" for="Online">
                                            Online
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="status" id="Offline" value="Offline" checked={formData.status === "Offline"} onChange={handleInputChange} />
                                        <label class="form-check-label" for="Offline">
                                            Offline
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 mb-3">
                                    <label class="exampleFormControlInput1 mb-2 fw-bolder" for="inputGroupFile01">Upload Profile Picture</label>
                                    <input type="file" accept="image/*" class="form-control" id="inputGroupFile01" ref={inputFile} onChange={handlePic} />
                                    {formData.imageURL ? <small>{"File Uploaded "}</small> : <small>{""}</small>}
                                </div>

                                <div className="col-12 col-md-4 mb-3">
                                    <label for="exampleFormControlInput1" class="form-label fw-bolder">Skills</label>
                                    <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="React" ref={inputSkill} onChange={(e) => {
                                        setSkills(e.target.value)
                                    }} />
                                    <div>
                                        {loading ? (
                                            <div className="text-center">Loading suggestions...</div>
                                        ) : (
                                            skillSuggestions &&
                                            skillSuggestions.map((data, index) => (
                                                <div
                                                    key={index}
                                                    className="text-center bg-info bg-opacity-10 rounded p-1 border border-info border-opacity-25"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleClickedSkills(data)}
                                                >
                                                    {data}
                                                </div>
                                            ))
                                        )}

                                        {!loading && skillSuggestions && skillSuggestions.length === 0 && (
                                            <div className="text-center text-muted">No suggestions found.</div>
                                        )}
                                    </div>


                                    <div class="card mt-1">
                                        <div class="card-body">
                                            <div className="row">

                                                {skillClicked && skillClicked.map((data, index) => {
                                                    return (
                                                        <>
                                                            <div className="col-6">
                                                                <div key={index} className="text-center bg-info bg-opacity-10 rounded p-1 border border-info border-opacity-25 my-1" >{data}
                                                                    <span style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => { handleRemoveSkill(index, data) }}>&#10005;</span></div>
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>



                                </div>
                            </div>

                            <div className="row mb-3 d-flex justify-content-evenly">
                                <div className="col-12 col-md-2 mb-3 border border-light-subtle rounded ">
                                    <label for="exampleFormControlInput1" class="form-label mb-3 fw-bolder ">Primary Background Color</label>
                                    <input type="color" name="pbc" value={formData.pbc} class="form-control form-control-color mb-3" id="exampleColorInput" title="Choose your color" onChange={handleInputChange} />
                                </div>

                                <div className="col-12 col-md-2 mb-3 border border-light-subtle rounded ">
                                    <label for="exampleFormControlInput1" class="form-label mb-3 fw-bolder">Secondary Background Color</label>
                                    <input type="color" name="sbc" value={formData.sbc} class="form-control form-control-color mb-3" id="exampleColorInput" title="Choose your color" onChange={handleInputChange} />
                                </div>

                                <div className="col-12 col-md-2 mb-3 border border-light-subtle rounded">
                                    <label for="exampleFormControlInput1" class="form-label mb-3 fw-bolder">Primary Font Color</label>
                                    <input type="color" name="pfc" value={formData.pfc} class="form-control form-control-color mb-3" id="exampleColorInput" title="Choose your color" onChange={handleInputChange} />
                                </div>

                                <div className="col-12 col-md-2 mb-3 border border-light-subtle rounded">
                                    <label for="exampleFormControlInput1" class="form-label mb-3 fw-bolder">Secondary Font Color</label>
                                    <input type="color" name="sfc" value={formData.sfc} class="form-control form-control-color mb-3" id="exampleColorInput" title="Choose your color" onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="row mb-3 d-flex justify-content-evenly">
                                <button type="submit" className="btn btn-primary col-6 fw-bold ">{editIndex !== null ? "Update Record" : "Add Record"}</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>



            <div class="container p-2" style={{
                borderRadius: "5px",
                boxShadow: "0px  10px 20px -10px rgba(0,0,0,0.75)", backgroundColor: "#FFF8F0"
            }}>
                <div className="card">
                    <div class="card-body table-responsive" style={{ backgroundColor: "#FFF8F0" }} >
                        <div className="row text-center">
                            <h3 className="fw-bold">Profile Table</h3>
                        </div>
                        <table class="table table-hover table-bordered  align-middle" >
                            <thead>
                                <tr className="table-primary text-center">
                                    <th scope="col">S.No</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">City</th>
                                    <th scope="col">Job Title</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Picture</th>
                                    <th scope="col">Skills</th>
                                    <th scope="col">PB Color</th>
                                    <th scope="col">SB Color</th>
                                    <th scope="col">PF Color</th>
                                    <th scope="col">SF Color</th>
                                    <th scope="col" colspan="2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profileList && profileList.map((data, index) => {
                                    return (
                                        <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td>{data.name}</td>
                                            <td>{data.city}</td>
                                            <td>{data.job}</td>
                                            <td>{data.status}</td>
                                            <td><img src={data.imageURL} alt="Profile pic" height={50} width={50}></img></td>
                                            <td>{data.skillClicked.join(", ")}</td>
                                            <td>{data.pbc}</td>
                                            <td>{data.sbc}</td>
                                            <td>{data.pfc}</td>
                                            <td>{data.sfc}</td>
                                            <td><button type="button" className="btn btn-info" onClick={() => { handleEditbtn(index) }}><FontAwesomeIcon icon={faEdit} style={{ color: "#000000" }} /></button></td>
                                            {editIndex !== null ? <td><button type="button" className="btn btn-danger" disabled onClick={() => { handleDeletebtn(index) }}><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} /></button></td> : <td><button type="button" className="btn btn-danger" onClick={() => { handleDeletebtn(index) }}><FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} /></button></td>}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <div className="container p-2 m-5 ">
                <div className="row d-flex justify-content-evenly">
                    <button type="button" className="btn btn-warning col-12 col-md-6 fw-bold " disabled={profileList.length === 0} onClick={() => handleViewCards()}>View Profile Cards</button>
                    {profileList.length === 0 && <p style={{ color: "red", fontSize: "14px" }}>No Profiles added yet!</p>}
                </div>
            </div>
        </>
    )
}

export default FormProfile;