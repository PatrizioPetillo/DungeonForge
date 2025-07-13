import React from 'react';
import '../styles/campagnaCard.css';

function CampagnaCard({ titolo, stato = 'Bozza', immagine = '/default-campaign.jpg', onClick }) {
  return (
    <div className="campagna-card" onClick={onClick}>
      <div className="campagna-img" style={{ backgroundImage: `url(${immagine})` }}></div>
      <div className="campagna-info">
        <h3 className="campagna-titolo">{titolo}</h3>
        <span className={`campagna-stato ${stato.toLowerCase()}`}>{stato}</span>
      </div>
    </div>
  );
}

export default CampagnaCard;
