// src/components/LiveSession/PNGAttivi.jsx

const PNGAttivi = ({ png }) => (
  <div className="widget">
    <h3>🎭 PNG Presenti</h3>
    <ul>
      {png.filter(p => p.presente).map((p, idx) => (
        <li key={idx}><strong>{p.nome}</strong> – {p.ruolo}</li>
      ))}
    </ul>
  </div>
);

export default PNGAttivi;
