import React from "react";
import { getImageURL } from "./utils";
import "./ProjectCard.css";

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

const ProjectCard = ({ project, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        <img
          src={getImageURL(project.imageSrc)}
          alt={project.title}
          className="popup-image"
        />

        <h2>{project.title}</h2>
        <p>{project.description}</p>

        <ul className="skills">
          {project.skills.map((skill, id) => (
            <li
              key={id}
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
    </div>
  );
};

export default ProjectCard;
