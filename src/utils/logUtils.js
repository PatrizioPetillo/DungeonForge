// src/utils/logUtils.js
export const logEvento = (messaggio, setEventiLog) => {
  if (!setEventiLog) return;
  
  const evento = {
    id: Date.now(),
    messaggio,
    timestamp: new Date().toISOString(),
  };

  setEventiLog((prev) => [evento, ...prev]);
  console.log("📜 Log evento:", evento.messaggio);
};
