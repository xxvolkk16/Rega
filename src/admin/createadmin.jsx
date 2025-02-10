import React, { useState } from "react";
import { database } from "../firebase";  // or import Firestore if using Firestore
import { ref, set, push } from "firebase/database";  // For Realtime Database
// import { collection, addDoc } from "firebase/firestore";  // For Firestore

function WriteAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState(""); // For inputting individual permissions

  const addPermission = () => {
    if (newPermission) {
      setPermissions([...permissions, newPermission]);
      setNewPermission(""); // Clear input after adding
    }
  };

  const saveData = async () => {
    const dbRef = push(ref(database, "admins"));  // For Realtime Database
    set(dbRef, {
      name: name,
      email: email,
      permissions: permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
      .then(() => {
        alert("Admin data saved successfully");
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
        placeholder="Admin Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      
      <h3>Permissions</h3>
      {permissions.map((permission, index) => (
        <div key={index}>{permission}</div>
      ))}
      <input
        type="text"
        value={newPermission}
        onChange={(e) => setNewPermission(e.target.value)}
        placeholder="Add Permission"
      />
      <button onClick={addPermission}>Add Permission</button>

      <br />
      <button onClick={saveData}>Save Admin Data</button>
    </div>
  );
}

export default WriteAdmin;
