import React from "react";
import "./AboutPopup.css";
import { getImageURL } from "./utils";

const AboutPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card about-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        <div className="about-content">
          <div className="about-text">
            <h1 className="about-title">Hi, I'm Stephen Tang</h1>
            <p className="about-description">
              I'm currently a second-year Software Engineering student at the
              University of Waterloo. I'm interested in technology and business.
              I'm specifically interested in game development, artificial
              intelligence, and economics.
            </p>
          </div>

          <img
            src={getImageURL("MeCropped.png")}
            alt="Stephen Tang"
            className="about-image"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPopup;
