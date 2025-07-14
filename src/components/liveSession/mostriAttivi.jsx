// src/components/LiveSession/MostriAttivi.jsx

const MostriAttivi = ({ mostri }) => (
  <div className="widget">
    <h3>👹 Mostri Attivi</h3>
    <ul>
      {mostri.map((m, idx) => (
        <li key={idx}>
          <strong>{m.nome}</strong> – PF: {m.PF}, CA: {m.CA}, Stato: {m.stato}
        </li>
      ))}
    </ul>
  </div>
);

export default MostriAttivi;
