import React from "react";
import "./home.css"
import Navbar from "../../Components/navbar.jsx";
import mybackground from '../../picture/officesyndrome.png';
import Picset from '../../Components/picset/picset.jsx'; // ปรับเส้นทางให้ถูกต้อง


const Home = () => {
    return (
      <div className="home-container">
        <Navbar />
        <div className="content-container">
          {/* เพิ่ม Picset ด้านซ้าย */}
          <div className="picset-container">
            <Picset />
          </div>
          {/* เนื้อหาส่วนอื่น */}
          <div className="text-content">
                     <div className="background">
                 <img src={mybackground} alt="" className="banner-img"/>
         </div>
            <div className="titlepain">
              <h1 className="headpain">OFFICE SYNDROME</h1>
              <p>
                ทำกิจวัตรที่ช่วยยืดเหยียดกล้ามเนื้อเพื่อลดอาการปวดจากการใช้
                เวลานานๆ ในการนั่งทำงาน
              </p>
              <button className="detail-button">อ่านรายละเอียดเพิ่มเติม</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;