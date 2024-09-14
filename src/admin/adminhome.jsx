import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; 
import { ref, get, remove } from 'firebase/database';
import "../css/adminhome.css";

const AdminHome = () => {
  const [yogaPoses, setYogaPoses] = useState([]);
  const [yogaPrograms, setYogaPrograms] = useState([]);

  // ดึงข้อมูล yoga poses จาก Realtime Database
  const fetchYogaPoses = async () => {
    const posesRef = ref(database, 'yogaPoses');
    const snapshot = await get(posesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const yogaPosesList = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      setYogaPoses(yogaPosesList);
    }
  };

  // ดึงข้อมูล yoga programs จาก Realtime Database
  const fetchYogaPrograms = async () => {
    const programsRef = ref(database, 'yogaPrograms');
    const snapshot = await get(programsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const yogaProgramsList = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
      setYogaPrograms(yogaProgramsList);
    }
  };

  // ฟังก์ชันลบ yoga pose
  const deleteYogaPose = async (id) => {
    const poseRef = ref(database, `yogaPoses/${id}`);
    await remove(poseRef);
    fetchYogaPoses();  // อัปเดตข้อมูลหลังลบ
  };

  // ฟังก์ชันลบ yoga program
  const deleteYogaProgram = async (id) => {
    const programRef = ref(database, `yogaPrograms/${id}`);
    await remove(programRef);
    fetchYogaPrograms();  // อัปเดตข้อมูลหลังลบ
  };

  useEffect(() => {
    fetchYogaPoses();
    fetchYogaPrograms();
  }, []);

  return (
    <div className="admin-home">
      <h1>Yoga Poses</h1>
      <ul>
        {yogaPoses.map(pose => (
          <li key={pose.id}>
            <strong>Pose Name:</strong> {pose.name}<br />
            <strong>Description:</strong> {pose.description}<br />
            <strong>GIF URL:</strong> {pose.gifUrl}<br />
            <strong>Keypoints Data:</strong> {JSON.stringify(pose.keypointsData)}<br />
            <strong>Instructions:</strong> {pose.instructions}<br />
            <strong>Duration:</strong> {pose.duration} minutes<br />
            <button onClick={() => deleteYogaPose(pose.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h1>Yoga Programs</h1>
      <ul>
        {yogaPrograms.map(program => (
          <li key={program.id}>
            <strong>Program Name:</strong> {program.name}<br />
            <strong>Description:</strong> {program.description}<br />
            <strong>Category:</strong> {program.category}<br />
            <strong>Poses:</strong> {JSON.stringify(program.poses)}<br />
            <strong>Difficulty Level:</strong> {program.difficultyLevel}<br />
            <strong>Duration:</strong> {program.duration} minutes<br />
            <button onClick={() => deleteYogaProgram(program.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHome;
