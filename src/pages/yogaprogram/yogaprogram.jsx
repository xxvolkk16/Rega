// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { firestore } from '../../firebase';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { getStorage, ref, getDownloadURL } from 'firebase/storage';
// import Navbar from '../../Components/navbar';
// import { MoreVertical, Plus, Trash2 } from 'lucide-react';
// import './yogaprogram.css';

// const YogaProgram = () => {
//   const [programs, setPrograms] = useState([]);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [deleteMode, setDeleteMode] = useState(false);
//   const navigate = useNavigate();
//   const storage = getStorage();

//   const getFirebaseImage = async (imageName) => {
//     try {
//       // Create reference to the image in Firebase Storage
//       const storageRef = ref(storage, `Yogapose/${imageName}`);
//       // Get the download URL
//       const url = await getDownloadURL(storageRef);
//       return url;
//     } catch (error) {
//       console.error("Error loading image from Firebase Storage:", imageName, error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchYogaPrograms = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(firestore, "Yoga Program"));
//         const programsPromises = querySnapshot.docs.map(async (doc) => {
//           const programData = doc.data();
//           // Get image URL from Firebase Storage
//           const imageUrl = await getFirebaseImage(programData.Picture);
          
//           return {
//             id: doc.id,
//             ...programData,
//             Picture: imageUrl || programData.Picture // Use original URL as fallback
//           };
//         });
        
//         const programsList = await Promise.all(programsPromises);
//         setPrograms(programsList);
//       } catch (error) {
//         console.error("Error fetching yoga programs:", error);
//       }
//     };

//     fetchYogaPrograms();
//   }, []);

//   const handleProgramClick = (programId) => {
//     if (!deleteMode) {
//       navigate(`/yoga-pose/${programId}`);
//     }
//   };

//   const handleDeleteProgram = async (programId, event) => {
//     if (deleteMode) {
//       event.stopPropagation();
//       try {
//         await deleteDoc(doc(firestore, "Yoga Program", programId));
//         setPrograms(programs.filter(program => program.id !== programId));
//       } catch (error) {
//         console.error("Error deleting program:", error);
//       }
//     }
//   };

//   const filters = [
//     { id: 'all', label: 'All' },
//     // { id: 'pain', label: 'Pain' },
//     // { id: 'stress', label: 'Stress' },
//     // { id: 'disease', label: 'Disease' }
//   ];

//   const filteredPrograms = activeFilter === 'all' 
//     ? programs 
//     : programs.filter(program => program.category === activeFilter);

//   const handleAddProgram = () => {
//     navigate('/add-yoga-program');
//     setShowDropdown(false);
//   };

//   const toggleDeleteMode = () => {
//     setDeleteMode(!deleteMode);
//     setShowDropdown(false);
//   };

//   return (
//     <div className="yp-container">
//       <Navbar />
//       <div className="yp-content">
//         <div className="yp-header">
//           <h1>YOGA<br />PROGRAM</h1>
          
//           <div className="yp-filter-wrapper">
//             {filters.map((filter) => (
//               <button
//                 key={filter.id}
//                 className={`yp-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
//                 onClick={() => setActiveFilter(filter.id)}
//               >
//                 {filter.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="yp-grid">
//           {filteredPrograms.map((program) => (
//             <div
//               key={program.id}
//               className="yp-card"
//               onClick={() => handleProgramClick(program.id)}
//             >
//               <div className="yp-image-container">
//                 <img src={program.Picture} alt={program.Name} />
//                 <div className="yp-title">{program.Name}</div>
//                 {deleteMode && (
//                   <div className="yp-delete-icon" onClick={(e) => handleDeleteProgram(program.id, e)}>
//                     <Trash2 size={16} color="white" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <button 
//           className="yp-more-options-btn"
//           onClick={() => setShowDropdown(!showDropdown)}
//         >
//           <MoreVertical size={24} />
//         </button>
        
//         {showDropdown && (
//           <div className="yp-dropdown">
//             <button 
//               className="yp-dropdown-item"
//               onClick={handleAddProgram}
//             >
//               <Plus size={18} />
//               <span>Add Program</span>
//             </button>
//             <button 
//               className="yp-dropdown-item"
//               onClick={toggleDeleteMode}
//             >
//               <Trash2 size={18} />
//               <span>{deleteMode ? 'Cancel Delete' : 'Delete Program'}</span>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default YogaProgram;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Navbar from '../../Components/navbar';
import { MoreVertical, Plus, Trash2, Edit } from 'lucide-react';
import './yogaprogram.css';

const YogaProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const storage = getStorage();

  const getFirebaseImage = async (imageName) => {
    try {
      // Create reference to the image in Firebase Storage
      const storageRef = ref(storage, `Yogapose/${imageName}`);
      // Get the download URL
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error loading image from Firebase Storage:", imageName, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchYogaPrograms = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Yoga Program"));
        const programsPromises = querySnapshot.docs.map(async (doc) => {
          const programData = doc.data();
          // Get image URL from Firebase Storage
          const imageUrl = await getFirebaseImage(programData.Picture);
          
          return {
            id: doc.id,
            ...programData,
            Picture: imageUrl || programData.Picture // Use original URL as fallback
          };
        });
        
        const programsList = await Promise.all(programsPromises);
        setPrograms(programsList);
      } catch (error) {
        console.error("Error fetching yoga programs:", error);
      }
    };

    fetchYogaPrograms();
  }, []);

  const handleProgramClick = (programId) => {
    if (!deleteMode && !editMode) {
      navigate(`/yoga-pose/${programId}`);
    }
  };

  const handleDeleteProgram = async (programId, event) => {
    if (deleteMode) {
      event.stopPropagation();
      try {
        await deleteDoc(doc(firestore, "Yoga Program", programId));
        setPrograms(programs.filter(program => program.id !== programId));
      } catch (error) {
        console.error("Error deleting program:", error);
      }
    }
  };

  const handleEditProgram = (programId, event) => {
    if (editMode) {
      event.stopPropagation();
      navigate(`/edit-yoga-program/${programId}`);
    }
  };

  const filters = [
    { id: 'all', label: 'All' },
    // { id: 'pain', label: 'Pain' },
    // { id: 'stress', label: 'Stress' },
    // { id: 'disease', label: 'Disease' }
  ];

  const filteredPrograms = activeFilter === 'all' 
    ? programs 
    : programs.filter(program => program.category === activeFilter);

  const handleAddProgram = () => {
    navigate('/add-yoga-program');
    setShowDropdown(false);
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setEditMode(false);
    setShowDropdown(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setDeleteMode(false);
    setShowDropdown(false);
  };

  return (
    <div className="yp-container">
      <Navbar />
      <div className="yp-content">
        <div className="yp-header">
          <h1>YOGA<br />PROGRAM</h1>
          
          <div className="yp-filter-wrapper">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`yp-filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="yp-grid">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="yp-card"
              onClick={() => handleProgramClick(program.id)}
            >
              <div className="yp-image-container">
                <img src={program.Picture} alt={program.Name} />
                <div className="yp-title">{program.Name}</div>
                {deleteMode && (
                  <div className="yp-delete-icon" onClick={(e) => handleDeleteProgram(program.id, e)}>
                    <Trash2 size={16} color="white" />
                  </div>
                )}
                {editMode && (
                  <div className="yp-edit-icon" onClick={(e) => handleEditProgram(program.id, e)}>
                    <Edit size={16} color="white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="yp-more-options-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreVertical size={24} />
        </button>
        
        {showDropdown && (
          <div className="yp-dropdown">
            <button 
              className="yp-dropdown-item"
              onClick={handleAddProgram}
            >
              <Plus size={18} />
              <span>Add Program</span>
            </button>
            <button 
              className="yp-dropdown-item"
              onClick={toggleEditMode}
            >
              <Edit size={18} />
              <span>{editMode ? 'Cancel Edit' : 'Edit Program'}</span>
            </button>
            <button 
              className="yp-dropdown-item"
              onClick={toggleDeleteMode}
            >
              <Trash2 size={18} />
              <span>{deleteMode ? 'Cancel Delete' : 'Delete Program'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YogaProgram;