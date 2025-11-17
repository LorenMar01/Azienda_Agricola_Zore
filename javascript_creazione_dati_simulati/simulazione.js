const fs = require('fs');

// Funzione per generare un numero casuale in un range
const getRandomNumber = (min, max) => (Math.random() * (max - min) + min);

// Funzione per determinare il fattore di correzione stagionale
const getSeasonalFactor = (date) => {
    
    const month = date.getMonth();  // 0 = Gennaio, 11 = Dicembre

    if (month >= 0 && month <= 1) { // Gennaio, Febbraio
        return 0.05; // Diminuzione del 95% (1 - 0.95)
    } else if (month == 2 ) { // Marzo
        return 0.35; // Diminuzione del 65% (1 - 0.65)
    } else if (month == 3 ) { // Aprile
        return 0.90; // Diminuzione del 10% (1 - 0.10)
    } else if (month == 4 ) { // Maggio
        return 0.95; // Diminuzione del 5%  (1 - 0.05)
    } else if (month == 5 ) { // Giugno
        return 1.00; // Nessuna variazione
    } else if (month == 6 ) { // Luglio
        return 0.95; // Diminuzione del 5%  (1 - 0.05)
    } else if (month == 7 ) { // Agosto
        return 0.85; // Diminuzione del 15% (1 - 0.15)
    } else if (month == 8 ) { // Settembre
        return 0.75; // Diminuzione del 25% (1 - 0.25)
    } else if (month == 9 ) { // Ottobre
        return 0.55; // Diminuzione del 45% (1 - 0.45)
    } else if (month == 10 ) { // Novembre
        return 0.30; // Diminuzione del 70% (1 - 0.70)
    } else if (month == 11 ) { // Dicembre
        return 0.10; // Diminuzione del 90% (1 - 0.90)
    }
    return 1.00; // Default
};

// Funzione per determinare i valori della condizioni_ambientali basati sul clima del Friuli-Venezia Giulia (zone interne/prealpine)
const getCondAmbientale = (date) => {
    const month = date.getMonth(); // 0 = Gennaio, 11 = Dicembre
    let tempRange, pascoloRange, umiditaRange;

    switch (month) {
        case 11: // Dicembre
        case 0:  // Gennaio
        case 1:  // Febbraio
            tempRange = { min: -5, max: 8 };   
            pascoloRange = { min: 0, max: 3 }; 
            umiditaRange = { min: 75, max: 98 }; 
            break;
        case 2:  // Marzo
            tempRange = { min: 2, max: 15 };
            pascoloRange = { min: 3, max: 5 };
            umiditaRange = { min: 70, max: 90 };
            break;
        case 3:  // Aprile
        case 9:  // Ottobre
            tempRange = { min: 8, max: 20 };
            pascoloRange = { min: 5, max: 8 };
            umiditaRange = { min: 65, max: 85 }; 
            break;
        case 4:  // Maggio
        case 5:  // Giugno
            tempRange = { min: 12, max: 25 };
            pascoloRange = { min: 7, max: 11 }; 
            umiditaRange = { min: 60, max: 80 };
            break;
        case 6:  // Luglio
        case 7:  // Agosto
            tempRange = { min: 18, max: 30 }; 
            pascoloRange = { min: 6, max: 9 }; 
            umiditaRange = { min: 55, max: 75 }; 
            break;
        case 8:  // Settembre
            tempRange = { min: 14, max: 24 };
            pascoloRange = { min: 6, max: 8 };
            umiditaRange = { min: 60, max: 80 };
            break;
        case 10: // Novembre
            tempRange = { min: 5, max: 12 };
            pascoloRange = { min: 3, max: 5 };
            umiditaRange = { min: 75, max: 95 }; 
            break;
        default:
            tempRange = { min: 5, max: 20 };
            pascoloRange = { min: 4, max: 8 };
            umiditaRange = { min: 60, max: 85 };
    }

    return { tempRange, pascoloRange, umiditaRange };
};

// Funzione per generare dati di produzione giornaliera, condizionato dal fattore di correzione basato sul mese
const generateDailyData = (date) => {

    const factor = getSeasonalFactor(date); 

    const numeroCapre = 100;
    const capreInLattazioneBase = Math.floor(getRandomNumber(90, 100));
    const capreInLattazione = Math.floor(capreInLattazioneBase * factor); 
    const capreInAsciutta = numeroCapre - capreInLattazione;

    // le Capre in malattia non devono superare il 95% delle capre in Lattazione	
    const limiteMassimoCapreMalattie = Math.floor(capreInLattazione * 0.95);
    const capreMalattieFinali = Math.random() < 0.05 ? Math.min(Math.floor(getRandomNumber(1, 3)), limiteMassimoCapreMalattie): 0;
 
    // la produzione di latte e dei prodotti caseari giornaliera dipendono dalle capre in Lattazione in quel preciso giorno
    const produzioneLatteBase = getRandomNumber(capreInLattazione * 1.3, capreInLattazione * 1.7);
    const produzioneLatteTotale = produzioneLatteBase * factor; 
	
    // La resa indica la percentuale di prodotto finito che si ottiene da un'unità di materia prima (latte). 
	// Esempio : una resa del 10\% indica che per 100 kg di latte si ottengono 10 kg di formaggio
    const resaFormaggio = getRandomNumber(0.09, 0.11);  // Resa bassa (si elimina molta acqua/siero)
    const resaRicotta = getRandomNumber(0.54, 0.58);    // Resa media (sottoprodotto)
	const resaYogurt = getRandomNumber(0.69, 0.78);     // Resa alta (poco prodotto eliminato)
    
	// Moltiplicazione per la variabilità o destinazione d'uso (quanto latte viene effettivamente destinato)
    const produzioneFormaggi = (produzioneLatteTotale * resaFormaggio) * getRandomNumber(0.8, 1.2);
    const produzioneRicotte  = (produzioneLatteTotale * resaRicotta) * getRandomNumber(0.1, 0.5);
    const produzioneYogurt   = (produzioneLatteTotale * resaYogurt) * getRandomNumber(0.1, 0.5);

    // Simulazione vendite, torniamo ad applicare il fattore stagionale
	// sono stabilite come un valore atteso giornaliero indipendente dalla produzione del giorno
    const venditeSpaccio = {
        formaggio: getRandomNumber(6, 13) * factor,
        yogurt: getRandomNumber(5, 15) * factor,
        ricotta: getRandomNumber(8, 18) * factor,
    };
    const venditeMercato = {
        formaggio: getRandomNumber(5, 15) * factor,
        yogurt: getRandomNumber(4, 12) * factor,
        ricotta: getRandomNumber(5, 10) * factor,
    };
    const venditeDistribuzione = {
        formaggio: getRandomNumber(8, 15) * factor,
        yogurt: getRandomNumber(6, 17) * factor,
        ricotta: getRandomNumber(8, 14) * factor,
    };
   
    // Estrazione dei parametri ambientali in base alla data (Taipana, Nord-Est)
    const condAmbientale = getCondAmbientale(date); 
	// Una capra ha un fabbisogno giornaliero è 2 kg, ma per ogni ora passata al pascolo necessita di 0.2 kg in meno 
	const fabbisogno_base_kg = 2.0; 
    const sostituzione_per_ora_kg = 0.2;
	const ore_pascolo_effettive = (Math.round(getRandomNumber(condAmbientale.pascoloRange.min, condAmbientale.pascoloRange.max) * 2)/2).toFixed(1);
	// Quantità di foraggio è inversamente porporzionale alle ore pascolo delle capre 
	const foraggioPerCapra = Math.max(0, (fabbisogno_base_kg - (ore_pascolo_effettive * sostituzione_per_ora_kg)));
	
	
    return {
        data: date.toISOString().split('T')[0],
        condizioni_ambientali: {
            temperatura_esterna: Math.floor(getRandomNumber(condAmbientale.tempRange.min, condAmbientale.tempRange.max)),
            umidita: getRandomNumber(condAmbientale.umiditaRange.min, condAmbientale.umiditaRange.max).toFixed(2),
            ore_pascolo: ore_pascolo_effettive,
        },
        benessere_animale: {
            capre_in_lattazione: capreInLattazione,
            capre_in_asciutta: capreInAsciutta,
            temperatura_corporea_media: getRandomNumber(38.5, 39.5).toFixed(2),
            malattie: capreMalattieFinali, 
        },
        produzione_latte: {
            quantita_totale_litri: produzioneLatteTotale.toFixed(2),
            media_per_capra_litri: (produzioneLatteTotale / capreInLattazione).toFixed(2),
        },
        produzione_casearia: [
            { tipo_prodotto: 'formaggio', quantita_kg: produzioneFormaggi.toFixed(2) },
            { tipo_prodotto: 'yogurt', quantita_kg: produzioneYogurt.toFixed(2) },
            { tipo_prodotto: 'ricotta', quantita_kg: produzioneRicotte.toFixed(2) },
        ],
        alimentazione: {
            quantita_foraggio_kg: (numeroCapre * foraggioPerCapra).toFixed(2), 
            rapporto_latte_foraggio: (produzioneLatteTotale / ((numeroCapre * foraggioPerCapra).toFixed(2))),
        },
        vendite: [
            { canale_vendita: 'Spaccio Aziendale', 
              formaggio: venditeSpaccio.formaggio.toFixed(2), 
              yogurt: venditeSpaccio.yogurt.toFixed(2), 
              ricotta: venditeSpaccio.ricotta.toFixed(2), 
              feedback: Math.floor(getRandomNumber(3, 5)) 
            },
            { canale_vendita: 'Mercato Locale', 
              formaggio: venditeMercato.formaggio.toFixed(2), 
              yogurt: venditeMercato.yogurt.toFixed(2), 
              ricotta: venditeMercato.ricotta.toFixed(2), 
              feedback: Math.floor(getRandomNumber(3, 5)) 
            },
            { canale_vendita: 'Partner di distribuzione', 
              formaggio: venditeDistribuzione.formaggio.toFixed(2), 
              yogurt: venditeDistribuzione.yogurt.toFixed(2), 
              ricotta: venditeDistribuzione.ricotta.toFixed(2), 
              feedback: Math.floor(getRandomNumber(3, 5)) 
            },
        ],
    };
};

const main = () => {
    
// Parametro Input : process.argv[2] contiene il numero di giorni per la simulazione, imposta un valore di default di 365 in caso di assenza 
    const numeroGiorniParam = parseInt(process.argv[2], 10);
    const giorniDaSimulare = isNaN(numeroGiorniParam) || numeroGiorniParam <= 0 
                               ? 365 
                               : numeroGiorniParam; 

    const startDate = new Date();
    const dataSet = [];
	
// Generazione dei dati in base al giorniDaSimulare passata da parametro
    for (let i = 0; i < giorniDaSimulare; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() - i); 
        dataSet.push(generateDailyData(currentDate));
    }
    
// Ordina i dati dalla data più vecchia a quella più recente
    dataSet.sort((a, b) => new Date(a.data) - new Date(b.data));

    const jsonData = JSON.stringify(dataSet, null, 2);
	
// Parametro Input : process.argv[3] contiene il percorso del file di output
    const customOutputDir = process.argv[3];
    const outputDir = customOutputDir 
    const outputFile = `${outputDir}/dati_azienda_zore.json`;

// Crea la cartella 'dati_simulati' se non esiste
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

// Scrive i dati nel file
    fs.writeFile(outputFile, jsonData, (err) => {
        if (err) {
            console.error('Si è verificato un errore durante la scrittura del file:', err);
        } else {
            console.log(`#########################################################################################`)
            console.log(`     File ${outputFile} generato con successo per ${giorniDaSimulare} giorni!`);
            console.log(`#########################################################################################`)
        }
    });
};

main();