// src/components/LiveSession/SceneViewer.jsx

const SceneViewer = ({ scena }) => (
  <div className="scene-viewer">
    <h2>{scena.titolo}</h2>
    <p><strong>Durata stimata:</strong> {scena.durataStimata}</p>
    <p>{scena.testo}</p>
    <blockquote>{scena.dialogoSuggerito}</blockquote>
  </div>
);

export default SceneViewer;
