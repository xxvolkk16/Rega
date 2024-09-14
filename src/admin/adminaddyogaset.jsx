import React, { useState } from "react";
import { database } from "../firebase";  // or import Firestore if using Firestore
import { ref, set, push } from "firebase/database";  // For Realtime Database
// import { collection, addDoc } from "firebase/firestore";  // For Firestore

function WriteYogaProgram() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("physicalPain"); // Default value
  const [poses, setPoses] = useState([]); // Assuming you input as a list of pose IDs
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

  const saveData = async () => {
    const dbRef = push(ref(database, "yogaPrograms"));  // For Realtime Database
    set(dbRef, {
      name: name,
      description: description,
      category: category,
      poses: poses,
      difficultyLevel: difficultyLevel,
      duration: duration,
      createdBy: createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
      .then(() => {
        alert("Yoga program saved successfully");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Program Name"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="physicalPain">Physical Pain</option>
        <option value="bodyAilments">Body Ailments</option>
      </select>
      <select
        value={difficultyLevel}
        onChange={(e) => setDifficultyLevel(e.target.value)}
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (seconds)"
      />
      <input
        type="text"
        value={createdBy}
        onChange={(e) => setCreatedBy(e.target.value)}
        placeholder="Admin ID"
      />

      <h3>Poses</h3>
      {poses.map((pose, index) => (
        <input
          key={index}
          type="text"
          value={pose}
          onChange={(e) => handlePoseChange(index, e.target.value)}
          placeholder={`Pose ID ${index + 1}`}
        />
      ))}
      <button onClick={addPose}>Add Pose</button>

      <button onClick={saveData}>Save Yoga Program</button>
    </div>
  );
}

export default WriteYogaProgram;
