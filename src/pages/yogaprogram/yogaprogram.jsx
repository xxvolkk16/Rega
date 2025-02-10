// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { firestore } from '../../firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import Navbar from '../../Components/navbar';
// import { MoreVertical, Plus, Trash2 } from 'lucide-react';
// import './YogaProgram.css';

// const YogaProgram = () => {
//   const [programs, setPrograms] = useState([]);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [showDropdown, setShowDropdown] = useState(false);
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

//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.more-options-container')) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   const handleProgramClick = (programId) => {
//     navigate(`/yoga-pose/${programId}`);
//   };

//   const filters = [
//     { id: 'all', label: 'All' },
//     { id: 'pain', label: 'Pain' },
//     { id: 'stress', label: 'Stress' },
//     { id: 'disease', label: 'Disease' }
//   ];

//   const filteredPrograms = activeFilter === 'all' 
//     ? programs 
//     : programs.filter(program => program.category === activeFilter);

//   const handleAddProgram = () => {
//     navigate('/add-yoga-program');
//     setShowDropdown(false);
//   };

//   const handleDeleteProgram = () => {
//     // Add your logic for deleting a program
//     console.log('Delete program clicked');
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
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="more-options-container">
//           <button 
//             className="more-options"
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowDropdown(!showDropdown);
//             }}
//           >
//             <MoreVertical size={24} />
//           </button>
          
//           {showDropdown && (
//             <div className="dropdown-menu">
//               <button className="dropdown-item" onClick={handleAddProgram}>
//                 <Plus size={18} />
//                 <span>Add Program</span>
//               </button>
//               <button className="dropdown-item" onClick={handleDeleteProgram}>
//                 <Trash2 size={18} />
//                 <span>Delete Program</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YogaProgram;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { firestore } from '../../firebase';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import Navbar from '../../Components/navbar';
// import { MoreVertical, Plus, Trash2 } from 'lucide-react';
// import './YogaProgram.css';

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

//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.more-options-container')) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
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
//     { id: 'pain', label: 'Pain' },
//     { id: 'stress', label: 'Stress' },
//     { id: 'disease', label: 'Disease' }
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
//                   <button
//                     className="delete-button"
//                     onClick={(e) => handleDeleteProgram(program.id, e)}
//                     style={{
//                       position: 'absolute',
//                       top: '8px',
//                       right: '8px',
//                       padding: '8px',
//                       borderRadius: '50%',
//                       background: 'rgba(220, 38, 38, 0.8)',
//                       border: 'none',
//                       color: 'white',
//                       cursor: 'pointer',
//                       transition: 'background-color 0.3s ease',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       zIndex: 10
//                     }}
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="more-options-container" style={{ position: 'relative' }}>
//           <button 
//             className="more-options"
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowDropdown(!showDropdown);
//             }}
//           >
//             <MoreVertical size={24} />
//           </button>
          
//           {showDropdown && (
//             <div className="dropdown-menu" style={{
//               position: 'absolute',
//               bottom: '100%',
//               right: '0',
//               marginBottom: '8px',
//               background: 'rgba(255, 255, 255, 0.1)',
//               backdropFilter: 'blur(8px)',
//               borderRadius: '8px',
//               overflow: 'hidden',
//               minWidth: '160px'
//             }}>
//               <button 
//                 className="dropdown-item" 
//                 onClick={handleAddProgram}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   background: 'transparent',
//                   border: 'none',
//                   color: 'white',
//                   cursor: 'pointer',
//                   transition: 'background-color 0.3s ease'
//                 }}
//               >
//                 <Plus size={18} />
//                 <span>Add Program</span>
//               </button>
//               <button 
//                 className="dropdown-item"
//                 onClick={toggleDeleteMode}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   background: 'transparent',
//                   border: 'none',
//                   color: 'white',
//                   cursor: 'pointer',
//                   transition: 'background-color 0.3s ease'
//                 }}
//               >
//                 <Trash2 size={18} />
//                 <span>{deleteMode ? 'Cancel Delete' : 'Delete Program'}</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YogaProgram;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Navbar from '../../Components/navbar';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import './yogaprogram.css';

const YogaProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const navigate = useNavigate();

  const getLocalImage = (imageName) => {
    try {
      return new URL(`../../img/${imageName}`, import.meta.url).href;
    } catch (error) {
      console.error("Error loading image:", imageName, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchYogaPrograms = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Yoga Program"));
        const programsList = querySnapshot.docs.map(doc => {
          const programData = doc.data();
          return {
            id: doc.id,
            ...programData,
            Picture: getLocalImage(programData.Picture) || programData.Picture
          };
        });
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
    { id: 'pain', label: 'Pain' },
    { id: 'stress', label: 'Stress' },
    { id: 'disease', label: 'Disease' }
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