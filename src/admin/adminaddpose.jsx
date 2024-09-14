import React, { useState } from "react";
import { database } from "../firebase";  // Firebase database
import { ref, set, push } from "firebase/database";  // For Realtime Database

function WriteYogaProgram() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("physicalPain"); // Default value
  const [poses, setPoses] = useState([]);  // Assuming you input pose IDs
  const [difficultyLevel, setDifficultyLevel] = useState("Beginner"); // Default value
  const [duration, setDuration] = useState(0);
  const [createdBy, setCreatedBy] = useState("");

  const addPose = () => {
    setPoses([...poses, ""]); // Add an empty pose ID for input
  };

  const handlePoseChange = (index, value) => {
    const newPoses = [...poses];
    newPoses[index] = value;
    setPoses(newPoses);
  };

  const saveProgram = async () => {
    const dbRef = push(ref(database, "yogaPrograms"));
    set(dbRef, {
      name: name,
      description: description,
      category: category,
      poses: poses,  // Assuming list of pose IDs
      difficultyLevel: difficultyLevel,
      duration: duration,
      createdBy: createdBy,
    })
      .then(() => {
        alert("Yoga program saved successfully!");
        setName("");  // Reset form
        setDescription("");
        setCategory("physicalPain");
        setPoses([]);
        setDifficultyLevel("Beginner");
        setDuration(0);
        setCreatedBy("");
      })
      .catch((error) => {
        alert("Error saving yoga program: " + error.message);
      });
  };

  return (
    <div>
      <h2>Add a New Yoga Program</h2>
      <form onSubmit={(e) => { e.preventDefault(); saveProgram(); }}>
        <input type="text" placeholder="Program Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="physicalPain">Physical Pain</option>
          <option value="mentalHealth">Mental Health</option>
        </select>
        {poses.map((pose, index) => (
          <input key={index} type="text" placeholder={`Pose ID ${index + 1}`} value={pose} onChange={(e) => handlePoseChange(index, e.target.value)} />
        ))}
        <button type="button" onClick={addPose}>Add Another Pose</button>
        <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <input type="number" placeholder="Duration (in minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        <input type="text" placeholder="Created By" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} />
        <button type="submit">Save Yoga Program</button>
      </form>
    </div>
  );
}

export default WriteYogaProgram;
