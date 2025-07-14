// src/components/LiveSession/SidebarSessione.jsx

const SidebarSessione = ({ campagna }) => (
  <div className="sidebar-session">
    <h2>{campagna.titolo}</h2>
    <p><strong>Tipo:</strong> {campagna.tipo}</p>
    <p><strong>Capitolo:</strong> {campagna.capitoloCorrente}</p>
  </div>
);

export default SidebarSessione;
