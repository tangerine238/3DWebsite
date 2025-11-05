import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./Website";
import ProjectPopup from "./ProjectCard";
import ProjectGalleryPopup from "./ProjectGalleryPopup";


const Scene = ({ onSelectProject, onShowProjects }) => {
  return (
    <>
      <Suspense fallback={null}>
        <Model
          onSelectProject={onSelectProject}
          onShowProjects={onShowProjects}
        />
      </Suspense>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
    </>
  );
};

const App = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjects, setShowProjects] = useState(false);

  return (
    <>
      <Canvas>
        <OrbitControls minDistance={100} maxDistance={300}/>
        <Scene
          onSelectProject={setSelectedProject}
          onShowProjects={() => setShowProjects(true)}
        />
      </Canvas>

      {selectedProject && (
        <ProjectPopup
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {showProjects && (
        <ProjectGalleryPopup onClose={() => setShowProjects(false)} />
      )}
    </>
  );
};

export default App;
