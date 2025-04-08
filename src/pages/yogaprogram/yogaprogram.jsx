// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { firestore } from '../../firebase';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import Navbar from '../../Components/navbar';
// import { MoreVertical, Plus, Trash2 } from 'lucide-react';
// import './yogaprogram.css';

// const YogaProgram = () => {
//   const [programs, setPrograms] = useState([]);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [deleteMode, setDeleteMode] = useState(false);
//   const navigate = useNavigate();

//   const getLocalImage = (imageName) => {
//     try {
//       return new URL(`../../img/${imageName}`, import.meta.url).href;
//     } catch (error) {
//       console.error("Error loading image:", imageName, error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const fetchYogaPrograms = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(firestore, "Yoga Program"));
//         const programsList = querySnapshot.docs.map(doc => {
//           const programData = doc.data();
//           return {
//             id: doc.id,
//             ...programData,
//             Picture: getLocalImage(programData.Picture) || programData.Picture
//           };
//         });
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
//     <div className="yoga-program-page">
//       <Navbar />
//       <div className="program-content">
//         <div className="program-header">
//           <h1>YOGA<br />PROGRAM</h1>
          
//           <div className="filter-buttons">
//             {filters.map((filter) => (
//               <button
//                 key={filter.id}
//                 className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
//                 onClick={() => setActiveFilter(filter.id)}
//               >
//                 {filter.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="programs-grid">
//           {filteredPrograms.map((program) => (
//             <div
//               key={program.id}
//               className="program-card"
//               onClick={() => handleProgramClick(program.id)}
//             >
//               <div className="program-image">
//                 <img src={program.Picture} alt={program.Name} />
//                 <div className="program-name">{program.Name}</div>
//                 {deleteMode && (
//                   <div className="delete-icon" onClick={(e) => handleDeleteProgram(program.id, e)}>
//                     <Trash2 size={16} color="white" />
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <button 
//           className="more-options"
//           onClick={() => setShowDropdown(!showDropdown)}
//         >
//           <MoreVertical size={24} />
//         </button>
        
//         {showDropdown && (
//           <div className="dropdown-menu">
//             <button 
//               className="dropdown-item"
//               onClick={handleAddProgram}
//             >
//               <Plus size={18} />
//               <span>Add Program</span>
//             </button>
//             <button 
//               className="dropdown-item"
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
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import './yogaprogram.css';

const YogaProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
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
    if (!deleteMode) {
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
    setShowDropdown(false);
  };

  return (
    <div className="yoga-program-page">
      <Navbar />
      <div className="program-content">
        <div className="program-header">
          <h1>YOGA<br />PROGRAM</h1>
          
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="programs-grid">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="program-card"
              onClick={() => handleProgramClick(program.id)}
            >
              <div className="program-image">
                <img src={program.Picture} alt={program.Name} />
                <div className="program-name">{program.Name}</div>
                {deleteMode && (
                  <div className="delete-icon" onClick={(e) => handleDeleteProgram(program.id, e)}>
                    <Trash2 size={16} color="white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="more-options"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreVertical size={24} />
        </button>
        
        {showDropdown && (
          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={handleAddProgram}
            >
              <Plus size={18} />
              <span>Add Program</span>
            </button>
            <button 
              className="dropdown-item"
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