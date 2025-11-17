// Importa i hook useState e useEffect da React
import { useState, useEffect } from 'react'; 
// Importa il componente Dashboard
import Dashboard from './Dashboard'; 
// Importa il componente DataTable
import DataTable from './DataTable'; 
// Importa il file CSS principale per l'applicazione
import './App.css'; 
// Importa l'immagine del logo 
import logo from './image/logo.png'; 

// Funzione helper per formattare la data nel formato YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Componente principale dell'applicazione
function App() {
  // Stato per memorizzare tutti i dati caricati dal file JSON
  const [dati, setDati] = useState([]);
  // Stato per memorizzare i dati filtrati, che verranno passati a Dashboard o DataTable
  const [datiFiltrati, setDatiFiltrati] = useState([]);
  // Stato controlla se i dati sono ancora in fase di caricamento
  const [isLoading, setIsLoading] = useState(true); 
  // Stato per controllare la visibilità del pannello dei filtri
  const [showFilters, setShowFilters] = useState(false);
  // Stato per controllare la visibilità della tabella (true = mostra tabella, false = mostra dashboard)
  const [showTable, setShowTable] = useState(false);
 
  // Calcola la data di oggi e la data di 30 giorni fa (default di visualizzazione)
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const defaultDataDa = formatDate(thirtyDaysAgo);
  const defaultDataA = formatDate(today);
  
  // Stato per memorizzare i valori dei filtri applicati
  const [filtri, setFiltri] = useState({
	dataDa: defaultDataDa, // Imposta la data iniziale a 30 giorni fa
    dataA: defaultDataA, // Imposta la data finale a oggi
    temperaturaEsternaMin: '', // Filtro temperatura esterna minima
    temperaturaEsternaMax: '', // Filtro temperatura esterna massima
    umiditaMin: '', // Filtro umidità minima
    umiditaMax: '', // Filtro umidità massima
    orePascoloMin: '', // Filtro ore di pascolo minime
    orePascoloMax: '', // Filtro ore di pascolo massime
    produzioneLatteMin: '', // Filtro produzione latte minima
    produzioneLatteMax: '', // Filtro produzione latte massima
    produzioneFormaggioMin: '', // Filtro produzione formaggio minima
    produzioneFormaggioMax: '', // Filtro produzione formaggio massima
    produzioneYogurtMin: '', // Filtro produzione yogurt minima
    produzioneYogurtMax: '', // Filtro produzione yogurt massima
    produzioneRicottaMin: '', // Filtro produzione ricotta minima
    produzioneRicottaMax: '', // Filtro produzione ricotta massima
    capreLattazioneMin: '', // Filtro capre in lattazione minime
    capreLattazioneMax: '', // Filtro capre in lattazione massime
    capreAsciuttaMin: '', // Filtro capre in asciutta minime
    capreAsciuttaMax: '' // Filtro capre in asciutta massime
  });

  // Variabile per verificare se l'intervallo di date è quello di default
  const isDefaultDateRange = filtri.dataDa === defaultDataDa && filtri.dataA === defaultDataA;
  
  // Caricamento dei dati dal file JSON (MODIFICATO)
  useEffect(() => {
    const caricaDati = async () => {
      try {
		// File di input
        const response = await fetch('/dati_azienda_zore.json');
        if (!response.ok) {
          throw new Error('Errore nel caricamento del file JSON.');
        }
        // Parsifica la risposta JSON e aggiorna lo stato 'dati' con i dati caricati
        const datiJson = await response.json();
        setDati(datiJson);
        console.log('Dati caricati con successo:', datiJson);
      } catch (error) {
        // Gestisce eventuali errori durante il caricamento dei dati
        console.error('Errore nel caricamento dei dati:', error);
        } finally {
          // Imposta isLoading a false in ogni caso (successo o fallimento)
          setIsLoading(false); 
          }
    };
    caricaDati(); 
  }, []);

  // Filtra i dati ogni volta che i dati originali o i filtri cambiano
  useEffect(() => {
    let filtered = dati; 

    // Filtra per intervallo di date
    if (filtri.dataDa) {
      filtered = filtered.filter(item => new Date(item.data) >= new Date(filtri.dataDa));
    }
    if (filtri.dataA) {
      filtered = filtered.filter(item => new Date(item.data) <= new Date(filtri.dataA));
    }

    // Filtra per temperatura esterna (min/max)
    if (filtri.temperaturaEsternaMin) {
      filtered = filtered.filter(item => parseFloat(item.condizioni_ambientali.temperatura_esterna) >= parseFloat(filtri.temperaturaEsternaMin));
    }
    if (filtri.temperaturaEsternaMax) {
      filtered = filtered.filter(item => parseFloat(item.condizioni_ambientali.temperatura_esterna) <= parseFloat(filtri.temperaturaEsternaMax));
    }

    // Filtra per umidità (min/max)
    if (filtri.umiditaMin) {
      filtered = filtered.filter(item => parseFloat(item.condizioni_ambientali.umidita) >= parseFloat(filtri.umiditaMin));
    }
    if (filtri.umiditaMax) {
      filtered = filtered.filter(item => parseFloat(item.condizioni_ambientali.umidita) <= parseFloat(filtri.umiditaMax));
    }

    // Filtra per ore di pascolo (min/max)
    if (filtri.orePascoloMin) {
      filtered = filtered.filter(item => parseFloat(item.condizioni_ambientali.ore_pascolo) >= parseFloat(filtri.orePascoloMin));
    }
    if (filtri.orePascoloMax) {
      filtered = filtered.filter(item => parseFloat(item.condizioni_ambientali.ore_pascolo) <= parseFloat(filtri.orePascoloMax));
    }
    
    // Filtra per produzione latte (min/max)
    if (filtri.produzioneLatteMin) {
      filtered = filtered.filter(item => parseFloat(item.produzione_latte.quantita_totale_litri) >= parseFloat(filtri.produzioneLatteMin));
    }
    if (filtri.produzioneLatteMax) {
      filtered = filtered.filter(item => parseFloat(item.produzione_latte.quantita_totale_litri) <= parseFloat(filtri.produzioneLatteMax));
    }

    // Filtra per produzione casearia - Formaggio (min/max)
    if (filtri.produzioneFormaggioMin) {
      filtered = filtered.filter(item => {
        const formaggio = item.produzione_casearia.find(p => p.tipo_prodotto === 'formaggio');
        return formaggio && parseFloat(formaggio.quantita_kg) >= parseFloat(filtri.produzioneFormaggioMin);
      });
    }
    if (filtri.produzioneFormaggioMax) {
      filtered = filtered.filter(item => {
        const formaggio = item.produzione_casearia.find(p => p.tipo_prodotto === 'formaggio');
        return formaggio && parseFloat(formaggio.quantita_kg) <= parseFloat(filtri.produzioneFormaggioMax);
      });
    }

    // Filtra per produzione casearia - Yogurt (min/max)
    if (filtri.produzioneYogurtMin) {
      filtered = filtered.filter(item => {
        const yogurt = item.produzione_casearia.find(p => p.tipo_prodotto === 'yogurt');
        return yogurt && parseFloat(yogurt.quantita_kg) >= parseFloat(filtri.produzioneYogurtMin);
      });
    }
    if (filtri.produzioneYogurtMax) {
      filtered = filtered.filter(item => {
        const yogurt = item.produzione_casearia.find(p => p.tipo_prodotto === 'yogurt');
        return yogurt && parseFloat(yogurt.quantita_kg) <= parseFloat(filtri.produzioneYogurtMax);
      });
    }

    // Filtra per produzione casearia - Ricotta (min/max)
    if (filtri.produzioneRicottaMin) {
      filtered = filtered.filter(item => {
        const ricotta = item.produzione_casearia.find(p => p.tipo_prodotto === 'ricotta');
        return ricotta && parseFloat(ricotta.quantita_kg) >= parseFloat(filtri.produzioneRicottaMin);
      });
    }
    if (filtri.produzioneRicottaMax) {
      filtered = filtered.filter(item => {
        const ricotta = item.produzione_casearia.find(p => p.tipo_prodotto === 'ricotta');
        return ricotta && parseFloat(ricotta.quantita_kg) <= parseFloat(filtri.produzioneRicottaMax);
      });
    }
	
    // Filtra per capre in lattazione (min/max)
    if (filtri.capreLattazioneMin) {
      filtered = filtered.filter(item => item.benessere_animale.capre_in_lattazione >= parseInt(filtri.capreLattazioneMin));
    }
    if (filtri.capreLattazioneMax) {
      filtered = filtered.filter(item => item.benessere_animale.capre_in_lattazione <= parseInt(filtri.capreLattazioneMax));
    }

    // Filtra per capre in asciutta (min/max)
    if (filtri.capreAsciuttaMin) {
      filtered = filtered.filter(item => item.benessere_animale.capre_in_asciutta >= parseInt(filtri.capreAsciuttaMin));
    }
    if (filtri.capreAsciuttaMax) {
      filtered = filtered.filter(item => item.benessere_animale.capre_in_asciutta <= parseInt(filtri.capreAsciuttaMax));
    }
	
    // Aggiorna lo stato dei dati filtrati
    setDatiFiltrati(filtered);
  }, [dati, filtri]); 

  // Gestisce il cambiamento dei valori negli input dei filtri
  const handleFilterChange = (e) => {
    const { name, value } = e.target; 
    setFiltri(prevFiltri => ({
      ...prevFiltri, 
      [name]: value 
    }));
  };

  // Resetta tutti i filtri ai valori iniziali 
  const handleClearFilters = () => {
    setFiltri({
 	  dataDa: defaultDataDa, 
      dataA: defaultDataA,
      temperaturaEsternaMin: '',
      temperaturaEsternaMax: '',
      umiditaMin: '',
      umiditaMax: '',
      orePascoloMin: '',
      orePascoloMax: '',
      produzioneLatteMin: '',
      produzioneLatteMax: '',
      produzioneFormaggioMin: '',
      produzioneFormaggioMax: '',
      produzioneYogurtMin: '',
      produzioneYogurtMax: '',
      produzioneRicottaMin: '',
      produzioneRicottaMax: '',
      capreLattazioneMin: '',
      capreLattazioneMax: '',
      capreAsciuttaMin: '',
      capreAsciuttaMax: ''
    });
  };

  // Se i dati sono ancora in caricamento, mostra un messaggio di attesa, ma mantieni la testata
  if (isLoading) {
    return (
      <div className={`app-container ${showTable ? 'table-background' : 'dashboard-background'}`}>
        <header>
          <img src={logo} alt="Logo Azienda Agricola Zore" className="header-logo" />
        </header>
        <main>
          <h2>Caricamento Dati in corso...</h2>
        </main>
      </div>
    );
  }
  
  return (
    // Contenitore principale dell'applicazione con sfondo dinamico
    <div className={`app-container ${showTable ? 'table-background' : 'dashboard-background'}`}>
      <header>
        {/* Logo dell'azienda agricola */}
        <img src={logo} alt="Logo Azienda Agricola Zore" className="header-logo" />
		
        <p className="data-disclaimer-bottom-right">
          **Attenzione:** I dati mostrati sono **casuali** e non rappresentano operazioni reali.
        </p>
		
      </header>
      <main>
        {/* Controlli per i filtri e la visualizzazione */}
        <div className="filter-controls">
          {/* Pulsante per mostrare/nascondere il pannello dei filtri */}
          <button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Nascondi Filtri' : 'Mostra Filtri'}
          </button>
          {/* Pulsante per rimuovere tutti i filtri */}
          <button onClick={handleClearFilters}>Rimuovi Filtri</button>
		  {/* Pulsante per alternare tra visualizzazione grafici e tabella */}
          <button onClick={() => setShowTable(!showTable)}>
            {showTable ? 'Mostra Grafici' : 'Mostra Tabella'}
          </button>	 
        </div>

        {/* Pannello dei filtri, visibile solo se showFilters è true */}
        {showFilters && (
          <div className="filters-container">
            <h3>Filtra i dati</h3>
            {/* Sezione Filtri per Data */}
            <div className="filter-group">
              <label htmlFor="dataDa">Data da:</label>
              <input type="date" id="dataDa" name="dataDa" value={filtri.dataDa} onChange={handleFilterChange} />
              <label htmlFor="dataA">Data a:</label>
              <input type="date" id="dataA" name="dataA" value={filtri.dataA} onChange={handleFilterChange} />
            </div>

            {/* Sezione Filtri per Condizioni Ambientali */}
            <div className="filter-group">
              <h4>Condizioni Ambientali</h4>
              <label>Temp. Esterna Min:</label>
              <input type="number" name="temperaturaEsternaMin" value={filtri.temperaturaEsternaMin} onChange={handleFilterChange} />
              <label>Temp. Esterna Max:</label>
              <input type="number" name="temperaturaEsternaMax" value={filtri.temperaturaEsternaMax} onChange={handleFilterChange} />

              <label>Umidità Min:</label>
              <input type="number" name="umiditaMin" value={filtri.umiditaMin} onChange={handleFilterChange} />
              <label>Umidità Max:</label>
              <input type="number" name="umiditaMax" value={filtri.umiditaMax} onChange={handleFilterChange} />
              
              <label>Ore Pascolo Min:</label>
              <input type="number" name="orePascoloMin" value={filtri.orePascoloMin} onChange={handleFilterChange} />
              <label>Ore Pascolo Max:</label>
              <input type="number" name="orePascoloMax" value={filtri.orePascoloMax} onChange={handleFilterChange} />
            </div>

            {/* Sezione Filtri per Produzione Latte */}
            <div className="filter-group">
              <h4>Produzione Latte (litri)</h4>
              <label>Min:</label>
              <input type="number" name="produzioneLatteMin" value={filtri.produzioneLatteMin} onChange={handleFilterChange} />
              <label>Max:</label>
              <input type="number" name="produzioneLatteMax" value={filtri.produzioneLatteMax} onChange={handleFilterChange} />
            </div>

            {/* Sezione Filtri per Produzione Casearia */}
            <div className="filter-group">
              <h4>Produzione Casearia (kg)</h4>
              <label>Formaggio Min:</label>
              <input type="number" name="produzioneFormaggioMin" value={filtri.produzioneFormaggioMin} onChange={handleFilterChange} />
              <label>Formaggio Max:</label>
              <input type="number" name="produzioneFormaggioMax" value={filtri.produzioneFormaggioMax} onChange={handleFilterChange} />
              <label>Yogurt Min:</label>
              <input type="number" name="produzioneYogurtMin" value={filtri.produzioneYogurtMin} onChange={handleFilterChange} />
              <label>Yogurt Max:</label>
              <input type="number" name="produzioneYogurtMax" value={filtri.produzioneYogurtMax} onChange={handleFilterChange} />
              <label>Ricotta Min:</label>
              <input type="number" name="produzioneRicottaMin" value={filtri.produzioneRicottaMin} onChange={handleFilterChange} />
              <label>Ricotta Max:</label>
              <input type="number" name="produzioneRicottaMax" value={filtri.produzioneRicottaMax} onChange={handleFilterChange} />
            </div>
	
            {/* Sezione Filtri per Benessere Animale */}	
			<div className="filter-group">
              <h4>Benessere Animale</h4>
              <label>Capre in Lattazione Min:</label>
              <input type="number" name="capreLattazioneMin" value={filtri.capreLattazioneMin} onChange={handleFilterChange} />
              <label>Capre in Lattazione Max:</label>
              <input type="number" name="capreLattazioneMax" value={filtri.capreLattazioneMax} onChange={handleFilterChange} />
            
              <label>Capre in Asciutta Min:</label>
              <input type="number" name="capreAsciuttaMin" value={filtri.capreAsciuttaMin} onChange={handleFilterChange} />
              <label>Capre in Asciutta Max:</label>
              <input type="number" name="capreAsciuttaMax" value={filtri.capreAsciuttaMax} onChange={handleFilterChange} />
            </div>
		
          </div>
        )}

        {/* Rendering condizionale della Dashboard o della DataTable */}
        {datiFiltrati.length > 0 ? (
          showTable ? (
            // Se showTable è true, mostra la tabella con i dati filtrati
            <DataTable data={datiFiltrati} />
          ) : (
            // Altrimenti, mostra la dashboard con i grafici dei dati filtrati
             <Dashboard data={datiFiltrati} isDefaultDateRange={isDefaultDateRange} />
          )
        ) : (
          // Messaggio nessun dato
          <p>Nessun dato corrisponde ai criteri di filtro...</p>
        )}
      </main>
    </div>
  );
}

// Esporta il componente App
export default App; 