import React from "react";
import projects from "./projects.json";
import { getImageURL } from "./utils";
import "./ProjectGalleryPopup.css";

const skillColors = {
  "Raspberry Pi": "#D81B60",
  "Netcat": "#00C853",
  "Vosk": "#FF8F00",
  "3D Modelling": "#8E24AA",
  "Bash": "#2E7D32",
  "Unreal Engine": "#2962FF",
  "Unity 6": "#5C6BC0",
  "Steam Advanced Sessions": "#00BCD4",
  "React": "#0096C7",
  "Typescript": "#3178C6",
  "HTML": "#E34F26",
  "CSS": "#2965F1",
  "Python": "#3776AB",
  "C#": "#512BD4",
};

const ProjectGalleryPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-card scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        <h2 className="popup-title">Projects</h2>

        <div className="project-list">
          {projects.map((project, id) => (
            <div key={id} className="project-card">
              <img
                src={getImageURL(project.imageSrc)}
                alt={project.title}
                className="popup-image"
              />
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <ul className="skills">
                {project.skills.map((skill, sid) => (
                  <li
                    key={sid}
                    className="skill"
                    style={{
                      backgroundColor:
                        skillColors[skill] || "var(--color-primary)",
                    }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>

              <div className="links">
                <a
                  href={project.demo}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo
                </a>
                <a
                  href={project.source}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectGalleryPopup;
