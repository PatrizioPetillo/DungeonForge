// src/components/LiveSession/LogSessione.jsx

const LogSessione = ({ eventi }) => (
  <div className="widget" style={{ marginTop: '2rem' }}>
    <h3>🗒 Log della Sessione</h3>
    <ul>
      {eventi.map((e, idx) => (
        <li key={idx}><strong>{e.tipo}</strong>: {e.descrizione}</li>
      ))}
    </ul>
  </div>
);

export default LogSessione;
