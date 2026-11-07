import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import "./LoadingScreen.css";

// Covers the page while the 3D model downloads, then fades out.
// The model is one large file, so progress only goes 0 -> 100; the bar animates in between.
const LoadingScreen = () => {
  const { active, progress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const done = !active && progress === 100;

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setHidden(true), 600);
    return () => clearTimeout(timer);
  }, [done]);

  if (hidden) return null;

  return (
    <div className={`loading-screen${done ? " loading-screen--done" : ""}`}>
      <h1 className="loading-title">Stephen Tang</h1>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
      <p className="loading-text">{done ? "Ready" : "Loading world…"}</p>
    </div>
  );
};

export default LoadingScreen;
