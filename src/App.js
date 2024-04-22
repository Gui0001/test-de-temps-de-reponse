import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const defaultUrl = 'https://ping.zenetys.com/api';
  const [url, setUrl] = useState(defaultUrl);
  const [intervalValue, setIntervalValue] = useState(1);
  const [responseData, setResponseData] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const hashUrl = window.location.hash.substr(1);
    if (hashUrl) {
      setUrl(hashUrl);
    }
  }, []);

  const startTest = () => {
    clearInterval(intervalId);
    const id = setInterval(() => {
      const startTime = new Date().getTime();
      axios.get(url, { timeout: intervalValue * 1000 }) 
        .then(response => {
          const endTime = new Date().getTime();
          const responseTime = endTime - startTime;
          setResponseData(prevData => [...prevData, responseTime]);
        })
        .catch(error => {
          console.error('Erreur : Impossible de se connecter au serveur.', error);
        });
    }, intervalValue * 1000);
    setIntervalId(id);
  };

  const stopTest = () => {
    clearInterval(intervalId);
  };

  return (
    <div className="container">
      <h1>Test de temps de réponse</h1>
      <div>
        <label htmlFor="urlInput">URL du site à tester :</label>
        <input type="text" id="urlInput" value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <div>
        <label htmlFor="intervalInput">Intervalle d'interrogation (en secondes) :</label>
        <input type="number" id="intervalInput" value={intervalValue} onChange={(e) => setIntervalValue(e.target.value)} />
      </div>
      <button onClick={startTest}>Démarrer le test</button>
      <button onClick={stopTest}>Arrêter le test</button>
      <div id="result">
        <h2>Résultats du test :</h2>
        {responseData.length > 0 && (
          <ul>
            {responseData.map((time, index) => (
              <li key={index}>Temps de réponse {index + 1}: {time} ms</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

