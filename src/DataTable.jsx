import React, { useState, useMemo } from 'react'; 
import './DataTable.css'; 

// Funzione helper per mappare la chiave dati alla classe CSS di larghezza
const getColumnClass = (key) => {
  switch (key) {
    case 'data':
      return 'col-data';
    case 'temperatura_corporea_media':
    case 'rapporto_latte_foraggio':
    case 'capre_in_lattazione': 
      return 'col-wide';
    case 'feedback_spaccio':
    case 'feedback_mercato':
    case 'feedback_partner':
    case 'malattie': 
      return 'col-small';
    // Tutto il resto è medio
    default:
      return 'col-medium';
    }
};

// Componente funzionale DataTable che riceve i dati
const DataTable = ({ data }) => {
  // Stato per la configurazione dell'ordinamento
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!data || data.length === 0) {
    return <p>Nessun dato da visualizzare.</p>;
  }

// Funzione helper per ottenere il valore di una cella, gestendo le chiavi annidate
  const getCellValue = (item, key) => {
	// Funzione interna per estrarre il valore dai dati di vendita
    const getSaleValue = (canaleVendita, field) => {
        // Cerca l'oggetto vendita per il Canale di Vendita
        const sale = item.vendite.find(p => p.canale_vendita === canaleVendita);
        // Se l'oggetto esiste, restituisce il campo specificato come numero, altrimenti 0
        return parseFloat(sale?.[field] || 0);
    };
	
    switch (key) {
      case 'temperatura_esterna':
        return parseFloat(item.condizioni_ambientali.temperatura_esterna);
      case 'umidita':
        return parseFloat(item.condizioni_ambientali.umidita);
      case 'ore_pascolo':
        return parseFloat(item.condizioni_ambientali.ore_pascolo);
      case 'capre_in_lattazione':
        return item.benessere_animale.capre_in_lattazione;
      case 'capre_in_asciutta':
        return item.benessere_animale.capre_in_asciutta;
      case 'temperatura_corporea_media':
        return parseFloat(item.benessere_animale.temperatura_corporea_media);
      case 'malattie':
        // Per il CSV, assicurati che i valori non numerici siano gestiti correttamente
        return item.benessere_animale.malattie; 
      case 'quantita_totale_litri':
        return parseFloat(item.produzione_latte.quantita_totale_litri);
      case 'media_per_capra_litri':
        return parseFloat(item.produzione_latte.media_per_capra_litri);
      case 'formaggio':
        return parseFloat(item.produzione_casearia.find(p => p.tipo_prodotto === 'formaggio')?.quantita_kg || 0);
      case 'yogurt':
        return parseFloat(item.produzione_casearia.find(p => p.tipo_prodotto === 'yogurt')?.quantita_kg || 0);
      case 'ricotta':
        return parseFloat(item.produzione_casearia.find(p => p.tipo_prodotto === 'ricotta')?.quantita_kg || 0);
      case 'quantita_foraggio_kg':
        return parseFloat(item.alimentazione.quantita_foraggio_kg);
      case 'rapporto_latte_foraggio':
        return parseFloat(item.alimentazione.rapporto_latte_foraggio);
		
	  case 'vendite_formaggio_spaccio':
        return getSaleValue('Spaccio Aziendale', 'formaggio');
      case 'vendite_yogurt_spaccio':
        return getSaleValue('Spaccio Aziendale', 'yogurt');
      case 'vendite_ricotta_spaccio':
        return getSaleValue('Spaccio Aziendale', 'ricotta');
      case 'feedback_spaccio':
        return getSaleValue('Spaccio Aziendale', 'feedback'); 

      case 'vendite_formaggio_mercato':
        return getSaleValue('Mercato Locale', 'formaggio');
      case 'vendite_yogurt_mercato':
        return getSaleValue('Mercato Locale', 'yogurt');
      case 'vendite_ricotta_mercato':
        return getSaleValue('Mercato Locale', 'ricotta');
      case 'feedback_mercato':
        return getSaleValue('Mercato Locale', 'feedback'); 

      case 'vendite_formaggio_partner':
        return getSaleValue('Partner di distribuzione', 'formaggio');
      case 'vendite_yogurt_partner':
        return getSaleValue('Partner di distribuzione', 'yogurt');
      case 'vendite_ricotta_partner':
        return getSaleValue('Partner di distribuzione', 'ricotta');
      case 'feedback_partner':
        return getSaleValue('Partner di distribuzione', 'feedback'); 
      default:
        const value = item[key];
        return value === undefined || value === null ? '' : value;
    }
  };

  // Memoizza i dati ordinati 
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aVal = getCellValue(a, sortConfig.key);
        const bVal = getCellValue(b, sortConfig.key);

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Funzioni di ordinamento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  // Funzione per trovare il valore di vendita o feedback 
  const getSaleValueForRender = (item, canaleVendita, field) => {
    const sale = item.vendite.find(p => p.canale_vendita === canaleVendita);
    return sale?.[field] || 'N/A';
  };

  // Funzione per trovare la produzione casearia
  const getCaseariaValueForRender = (item, tipoProdotto) => {
    const produzione = item.produzione_casearia.find(p => p.tipo_prodotto === tipoProdotto);
    const value = produzione?.quantita_kg;
    if (value === undefined || value === null) {
      return 'N/A';
    }
    return value.replace('.', ',');
  };
	
  // Funzione helper per formattare la data nel formato per la visualizzazione Italiana
  const formatItalianDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`; 
  };

  // Definizione delle intestazioni della tabella CON CLASSE CSS
  const headers = [
    { label: 'Data', key: 'data' },
    { label: 'Temp. Esterna (°C)', key: 'temperatura_esterna' },
    { label: 'Umidità (%)', key: 'umidita' },
    { label: 'Ore Pascolo', key: 'ore_pascolo' },
    { label: 'Capre in Lattazione', key: 'capre_in_lattazione' },
    { label: 'Capre in Asciutta', key: 'capre_in_asciutta' },
    { label: 'Temp. Corporea Media (°C)', key: 'temperatura_corporea_media' },
    { label: 'Capre Malate', key: 'malattie' }, 
    { label: 'Prod. Latte (litri)', key: 'quantita_totale_litri' },
    { label: 'Media per Capra (litri)', key: 'media_per_capra_litri' },
    { label: 'Formaggio (kg)', key: 'formaggio' },
    { label: 'Yogurt (kg)', key: 'yogurt' },
    { label: 'Ricotta (kg)', key: 'ricotta' },
    { label: 'Foraggio (kg)', key: 'quantita_foraggio_kg' },
    { label: 'Rapporto Latte/Foraggio', key: 'rapporto_latte_foraggio' },
    { label: 'Vendite Formaggio Spaccio (kg)', key: 'vendite_formaggio_spaccio' },
    { label: 'Vendite Yogurt Spaccio (kg)', key: 'vendite_yogurt_spaccio' },
    { label: 'Vendite Ricotta Spaccio (kg)', key: 'vendite_ricotta_spaccio' },
    { label: 'Feedback Spaccio (1-5)', key: 'feedback_spaccio' },

    { label: 'Vendite Formaggio Mercato (kg)', key: 'vendite_formaggio_mercato' },
    { label: 'Vendite Yogurt Mercato (kg)', key: 'vendite_yogurt_mercato' },
    { label: 'Vendite Ricotta Mercato (kg)', key: 'vendite_ricotta_mercato' },
    { label: 'Feedback Mercato (1-5)', key: 'feedback_mercato' },

    { label: 'Vendite Formaggio Partner (kg)', key: 'vendite_formaggio_partner' },
    { label: 'Vendite Yogurt Partner (kg)', key: 'vendite_yogurt_partner' },
    { label: 'Vendite Ricotta Partner (kg)', key: 'vendite_ricotta_partner' },
    { label: 'Feedback Partner (1-5)', key: 'feedback_partner' },
  ];
  
  // ==========================================================
  // FUNZIONI PER L'ESPORTAZIONE CSV
  // ==========================================================
  const convertToCsv = () => {
    // 1. Riga di intestazione (Headers)
    // Usa le label delle intestazioni della tabella come nomi delle colonne CSV
    // Uso il punto e virgola come delimitatore, appropriato per l'Italia
    const csvHeaders = headers.map(header => `"${header.label.replace(/"/g, '""')}"`).join(';'); 
    
    // 2. Righe dei dati
    const csvRows = sortedData.map(item => {
 
      const values = headers.map(header => {
        let cellValue = getCellValue(item, header.key);
        // Formatta la data per il CSV 
        if (header.key === 'data') {
            cellValue = formatItalianDate(cellValue);
        }
        // Conversione in stringa e gestione di caratteri speciali nel CSV
        let formattedValue = String(cellValue || '').trim();
        // Sostituisce la virgola decimale con il punto per standard CSV 
        formattedValue = formattedValue.replace('.', ',');
        // Se il valore contiene il delimitatore (;) o virgolette (") o un a capo, racchiudilo tra virgolette e raddoppia le virgolette interne.
        if (/[";\n]/.test(formattedValue)) {
            formattedValue = `"${formattedValue.replace(/"/g, '""')}"`;
        }
        return formattedValue;
      });
      return values.join(';');
    });
    
    // Unisce l'intestazione e le righe dei dati
    return [csvHeaders, ...csvRows].join('\n');
  };
  
  /** Avvia il download del file CSV. **/
  const downloadCsv = () => {
    const csvString = convertToCsv();
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Configura il link per il download
    link.href = url;
    // Usa la data odierna nel nome del file
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `dati-dashboard-${today}.csv`); 
    
    // Simula il click per avviare il download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // ==========================================================
  // FINE ESPORTAZIONE CSV
  // ==========================================================

  return (
    <div>
      <div className='table-header-controls'> 
        <h2>Dettaglio Dati Giornalieri</h2>
        <button onClick={downloadCsv} className='download-button'>
          Scarica CSV
        </button>
      </div>
      
      {/* Contenitore della tabella, a cui si applica lo scroll orizzontale e si limita l'altezza verticale */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {/* Mappa le intestazioni per creare le colonne della tabella e applica la classe CSS */}
              {headers.map((header, index) => (
                <th 
                    key={index} 
                    onClick={() => handleSort(header.key)}
                    className={getColumnClass(header.key)} 
                >
                  {header.label} {getSortIndicator(header.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Mappa i dati ordinati per creare le righe della tabella */}
            {sortedData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td className='col-data'>{formatItalianDate(item.data)}</td>
                <td className='col-medium'>{item.condizioni_ambientali.temperatura_esterna}</td>
                <td className='col-medium'>{item.condizioni_ambientali.umidita}</td>
                <td className='col-medium'>{item.condizioni_ambientali.ore_pascolo}</td>
                <td className='col-wide'>{item.benessere_animale.capre_in_lattazione}</td>
                <td className='col-medium'>{item.benessere_animale.capre_in_asciutta}</td>
                <td className='col-wide'>{item.benessere_animale.temperatura_corporea_media}</td>
                <td className='col-small'>{item.benessere_animale.malattie}</td>
                <td className='col-medium'>{item.produzione_latte.quantita_totale_litri}</td>
                <td className='col-medium'>{item.produzione_latte.media_per_capra_litri}</td>
                
                <td className='col-medium'>{getCaseariaValueForRender(item, 'formaggio')}</td>
				<td className='col-medium'>{getCaseariaValueForRender(item, 'yogurt')}</td>
				<td className='col-medium'>{getCaseariaValueForRender(item, 'ricotta')}</td>
                
                <td className='col-medium'>{item.alimentazione.quantita_foraggio_kg}</td>
                <td className='col-wide'>{item.alimentazione.rapporto_latte_foraggio}</td>
                
                <td className='col-medium'>{getSaleValueForRender(item, 'Spaccio Aziendale', 'formaggio')}</td>
                <td className='col-medium'>{getSaleValueForRender(item, 'Spaccio Aziendale', 'yogurt')}</td>
                <td className='col-medium'>{getSaleValueForRender(item, 'Spaccio Aziendale', 'ricotta')}</td>
                <td className='col-small'>{getSaleValueForRender(item, 'Spaccio Aziendale', 'feedback')}</td>

                <td className='col-medium'>{getSaleValueForRender(item, 'Mercato Locale', 'formaggio')}</td>
                <td className='col-medium'>{getSaleValueForRender(item, 'Mercato Locale', 'yogurt')}</td>
                <td className='col-medium'>{getSaleValueForRender(item, 'Mercato Locale', 'ricotta')}</td>
                <td className='col-small'>{getSaleValueForRender(item, 'Mercato Locale', 'feedback')}</td>
                
                <td className='col-medium'>{getSaleValueForRender(item, 'Partner di distribuzione', 'formaggio')}</td>
                <td className='col-medium'>{getSaleValueForRender(item, 'Partner di distribuzione', 'yogurt')}</td>
                <td className='col-medium'>{getSaleValueForRender(item, 'Partner di distribuzione', 'ricotta')}</td>
                <td className='col-small'>{getSaleValueForRender(item, 'Partner di distribuzione', 'feedback')}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; // Esporta il componente DataTable
