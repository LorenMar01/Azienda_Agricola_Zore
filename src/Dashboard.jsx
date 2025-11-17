// Importa i componenti necessari da Recharts
import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'; 

// Componente funzionale Dashboard che riceve i dati e la prop per il range di date
const Dashboard = ({ data, isDefaultDateRange }) => {
  
  // Funzione di formattazione della data
  const formatItalianDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };
  
  // Funzione per trovare il dato di un Canale di Vendita specifico
  const findSale = (item, canaleVendita, prodotto) => {
    const sale = item.vendite.find(p => p.canale_vendita === canaleVendita);
    return parseFloat(sale?.[prodotto] || 0);
  };
  
  // Funzione per trovare il feedback di un Canale di Vendita specifico
  const findFeedback = (item, canaleVendita) => {
    const sale = item.vendite.find(p => p.canale_vendita === canaleVendita);
    return sale?.feedback || 0;
  };
  
  // Formatta i dati nel formato più adatto per i grafici.
  const formattedData = data.map(item => ({
	data: formatItalianDate(item.data),

    temperaturaEsterna: parseFloat(item.condizioni_ambientali.temperatura_esterna),
    umidita: parseFloat(item.condizioni_ambientali.umidita),
    orePascolo: parseFloat(item.condizioni_ambientali.ore_pascolo),

    capreLattazione: item.benessere_animale.capre_in_lattazione,
    capreAsciutta: item.benessere_animale.capre_in_asciutta,
    temperaturaCorporeaMedia: parseFloat(item.benessere_animale.temperatura_corporea_media),
    malattie: parseFloat(item.benessere_animale.malattie), 

    produzioneLatte: parseFloat(item.produzione_latte.quantita_totale_litri),
    produzioneMediaLatte: parseFloat(item.produzione_latte.media_per_capra_litri),
    produzioneFormaggio: parseFloat(item.produzione_casearia.find(p => p.tipo_prodotto === 'formaggio')?.quantita_kg || 0),
    produzioneYogurt: parseFloat(item.produzione_casearia.find(p => p.tipo_prodotto === 'yogurt')?.quantita_kg || 0),
    produzioneRicotta: parseFloat(item.produzione_casearia.find(p => p.tipo_prodotto === 'ricotta')?.quantita_kg || 0),
    quantitaForaggio: parseFloat(item.alimentazione.quantita_foraggio_kg),

	venditeFormaggioSpaccio: findSale(item, 'Spaccio Aziendale', 'formaggio'),
    venditeYogurtSpaccio: findSale(item, 'Spaccio Aziendale', 'yogurt'),
    venditeRicottaSpaccio: findSale(item, 'Spaccio Aziendale', 'ricotta'),
    feedbackSpaccio: findFeedback(item, 'Spaccio Aziendale'),

    venditeFormaggioMercato: findSale(item, 'Mercato Locale', 'formaggio'),
    venditeYogurtMercato: findSale(item, 'Mercato Locale', 'yogurt'),
    venditeRicottaMercato: findSale(item, 'Mercato Locale', 'ricotta'),
    feedbackMercato: findFeedback(item, 'Mercato Locale'),

    venditeFormaggioPartner: findSale(item, 'Partner di distribuzione', 'formaggio'),
    venditeYogurtPartner: findSale(item, 'Partner di distribuzione', 'yogurt'),
    venditeRicottaPartner: findSale(item, 'Partner di distribuzione', 'ricotta'),
    feedbackPartner: findFeedback(item, 'Partner di distribuzione')
  }));
  
  // Aggiungi l'etichetta "ultimi 30 giorni" per i titoli dei grafici se l'utente ha selezionato l'intervallo di date predefinito
  const defaultDateLabel = isDefaultDateRange ? ' - ultimi 30 giorni' : '';

  // Logica per i grafici se è stato filtrato un solo giorno 
  if (data.length === 1) {
    const singleDayData = formattedData[0];
    const produzioneCaseariaData = [
      { name: 'Formaggio', value: singleDayData.produzioneFormaggio },
      { name: 'Yogurt', value: singleDayData.produzioneYogurt },
      { name: 'Ricotta', value: singleDayData.produzioneRicotta },
    ];
    const colors = ['#00C49F', '#FFBB28', '#FF8042'];

// Dati per il grafico vendite del singolo giorno
    const venditeData = [
      {
        name: 'Spaccio Aziendale',
        Formaggio: singleDayData.venditeFormaggioSpaccio,
        Yogurt: singleDayData.venditeYogurtSpaccio,
        Ricotta: singleDayData.venditeRicottaSpaccio,
      },
      {
        name: 'Mercato Locale',
        Formaggio: singleDayData.venditeFormaggioMercato,
        Yogurt: singleDayData.venditeYogurtMercato,
        Ricotta: singleDayData.venditeRicottaMercato,
      },
      {
        name: 'Partner di distribuzione',
        Formaggio: singleDayData.venditeFormaggioPartner,
        Yogurt: singleDayData.venditeYogurtPartner,
        Ricotta: singleDayData.venditeRicottaPartner,
      },
    ];
	
    return (
      <div className="dashboard-container">
        
        {/* GRAFICO 1: Produzione Latte (Totale e Media) */}
        <div className="chart-wrapper">
          <h3>Produzione Latte (litri) - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[singleDayData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="produzioneLatte" fill="#82ca9d" name="Produzione Totale" />
              <Bar dataKey="produzioneMediaLatte" fill="#8884d8" name="Media per Capra" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* GRAFICO 2: Produzione Casearia (kg) */}
        <div className="chart-wrapper">
          <h3>Produzione Casearia (kg) - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={produzioneCaseariaData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {produzioneCaseariaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* GRAFICO 3: Temperatura Esterna */}
        <div className="chart-wrapper">
          <h3>Temperatura Esterna (°C) - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[singleDayData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="temperaturaEsterna" fill="#ffc658" name="Temperatura Esterna" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* GRAFICO 4: Umidità */}
        <div className="chart-wrapper">
          <h3>Umidità (%) - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[singleDayData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="umidita" fill="#8884d8" name="Umidità" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRAFICO 5: Ore di Pascolo e Quantità Foraggio */}
        <div className="chart-wrapper">
          <h3>Ore di Pascolo e Quantità Foraggio - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[singleDayData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orePascolo" fill="#00C49F" name="Ore di Pascolo" />
              <Bar dataKey="quantitaForaggio" fill="#FF8042" name="Foraggio (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
		{/* GRAFICO 6: Vendite Prodotti Caseari per Canale di Vendita */}
		<div className="chart-wrapper">
          <h3>Vendite Prodotti Caseari (kg) per Canale di Vendita - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={venditeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Formaggio" fill="#00C49F" />
              <Bar dataKey="Yogurt" fill="#8884d8" />
              <Bar dataKey="Ricotta" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
		
        {/* GRAFICO 7: Stato del Bestiame (Lattazione vs Asciutta) */}
        <div className="chart-wrapper">
          <h3>Stato del Bestiame - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[singleDayData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="capreLattazione" stackId="a" fill="#8884d8" name="Capre in Lattazione" />
              <Bar dataKey="capreAsciutta" stackId="a" fill="#82ca9d" name="Capre in Asciutta" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRAFICO 8: Capre Malate */}
        <div className="chart-wrapper">
          <h3>Capre Malate (Conteggio Giornaliero) - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[singleDayData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis allowDecimals={false} /> 
              <Tooltip />
              <Legend />
              <Bar dataKey="malattie" fill="#ff7300" name="Capre Malate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
		
        {/* GRAFICO 9: Temperatura Corporea Media */}
        <div className="chart-wrapper">
          <h3>Temperatura Corporea Media delle Capre (°C) - {singleDayData.data}{defaultDateLabel}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[singleDayData]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis stroke="#333" /> 
              <Tooltip />
              <Legend />
              <Bar type="monotone" dataKey="temperaturaCorporeaMedia" fill="#ff7300" name="Temperatura Media" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

 // Logica per i grafici se ci sono più giorni 
  return (
    <div className="dashboard-container">
      
      {/* GRAFICO 1: Produzione Giornaliera di Latte */}
      <div className="chart-wrapper">
        <h3>Produzione Giornaliera di Latte (litri){defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="produzioneLatte" stroke="#82ca9d" name="Produzione Totale" />
            <Line type="monotone" dataKey="produzioneMediaLatte" stroke="#8884d8" name="Media per Capra" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 2: Produzione Casearia Giornaliera (kg) */}
	  <div className="chart-wrapper">
        <h3>Produzione Casearia Giornaliera (kg){defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="produzioneFormaggio" fill="#00C49F" name="Formaggio" />
            <Bar dataKey="produzioneYogurt" fill="#8884d8" name="Yogurt" />
            <Bar dataKey="produzioneRicotta" fill="#FF8042" name="Ricotta" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 3: Temperatura Esterna */}
      <div className="chart-wrapper">
        <h3>Temperatura Esterna (°C){defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperaturaEsterna" stroke="#ffc658" name="Temperatura Esterna" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 4: Umidità */}
      <div className="chart-wrapper">
        <h3>Umidità (%){defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="umidita" stroke="#8884d8" name="Umidità" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 5: Ore di Pascolo e Quantità Foraggio */}
	  <div className="chart-wrapper">
        <h3>Ore di Pascolo e Quantità Foraggio{defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orePascolo" stroke="#00C49F" name="Ore di Pascolo" />
            <Line type="monotone" dataKey="quantitaForaggio" stroke="#FF8042" name="Foraggio (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 6: Stato del Bestiame (Lattazione vs Asciutta) */}
      <div className="chart-wrapper">
        <h3>Stato del Bestiame{defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="capreLattazione" stackId="a" fill="#8884d8" name="Capre in Lattazione" />
            <Bar dataKey="capreAsciutta" stackId="a" fill="#82ca9d" name="Capre in Asciutta" />
          </BarChart>
        </ResponsiveContainer>
      </div>
	  
	  {/* GRAFICO 7: Capre Malate */}
      <div className="chart-wrapper">
        <h3>Capre Malate (Conteggio Giornaliero){defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis allowDecimals={false} /> 
            <Tooltip />
            <Legend />
            <Bar dataKey="malattie" fill="#ff7300" name="Capre Malate" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 8: Temperatura Corporea Media */}
	  <div className="chart-wrapper">
        <h3>Temperatura Corporea Media delle Capre (°C){defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis orientation="left" stroke="#333" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperaturaCorporeaMedia" stroke="#ff7300" name="Temp. Media (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 9: Vendite Formaggio (kg) per Canale di Vendita */}
	  <div className="chart-wrapper full-width"> 
        <h3>Vendite Formaggio (kg) per Canale di Vendita{defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="venditeFormaggioSpaccio" stroke="#8884d8" name="Spaccio Aziendale" />
            <Line type="monotone" dataKey="venditeFormaggioMercato" stroke="#82ca9d" name="Mercato Locale" />
            <Line type="monotone" dataKey="venditeFormaggioPartner" stroke="#ff7300" name="Partner di Distribuzione" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 10: Vendite Yogurt (kg) per Canale di Vendita */}
	  <div className="chart-wrapper full-width"> 
        <h3>Vendite Yogurt (kg) per Canale di Vendita{defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="venditeYogurtSpaccio" stroke="#8884d8" name="Spaccio Aziendale" />
            <Line type="monotone" dataKey="venditeYogurtMercato" stroke="#82ca9d" name="Mercato Locale" />
            <Line type="monotone" dataKey="venditeYogurtPartner" stroke="#ff7300" name="Partner di Distribuzione" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* GRAFICO 11: Vendite Ricotta (kg) per Canale di Vendita */}
	  <div className="chart-wrapper full-width"> 
        <h3>Vendite Ricotta (kg) per Canale di Vendita{defaultDateLabel}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="venditeRicottaSpaccio" stroke="#8884d8" name="Spaccio Aziendale" />
            <Line type="monotone" dataKey="venditeRicottaMercato" stroke="#82ca9d" name="Mercato Locale" />
            <Line type="monotone" dataKey="venditeRicottaPartner" stroke="#ff7300" name="Partner di Distribuzione" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;