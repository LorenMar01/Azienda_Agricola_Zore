#  Azienda Agricola Zore - Dashboard Analitica Interattiva

## Panoramica del Progetto

Questo repository contiene il codice sorgente completo per la **Dashboard Analitica Interattiva**, realizzata come project work per il corso di Laurea in **INFORMATICA PER LE AZIENDE DIGITALI (L-31)**.

L'obiettivo principale del progetto è supportare l'Azienda Agricola Zore nei processi di digitalizzazione e nel monitoraggio delle performance aziendali, trasformando dati grezzi simulati (relativi a quattro macro-aree: Ambientale, Animale, Produttiva e Commerciale) in **Key Performance Indicators (KPI)** chiari e sintetici, immediatamente interpretabili.

Il progetto si pone come un modello **replicabile e sostenibile** per le Piccole e Medie Imprese (PMI) agricole, sfruttando tecnologie accessibili e a basso costo di implementazione.

---

## Risorse e Contatti

| Risorsa | Dettaglio |
| :--- | :--- |
| **Dashboard Pubblica (Deploy)** | [https://azienda-agricola-zore.vercel.app](https://azienda-agricola-zore.vercel.app/) |
| **Codice Sorgente (Repository)** | [https://github.com/LorenMar01/Azienda\_Agricola\_Zore](https://github.com/LorenMar01/Azienda_Agricola_Zore) |
| **Autore** | MARTA LORENZON |
| **Contatti** | lorenzonmarta@gmail.com |

---

## Caratteristiche Chiave

La dashboard è stata sviluppata utilizzando il framework **React** e offre le seguenti funzionalità principali:

* **Gestione del Dato Simulato:** Implementazione di un simulatore in Node.js/JavaScript per generare dati realistici che tengano conto di **correlazioni** e **fattori stagionali** (ad esempio, il calo o l'aumento della produzione di latte in base al mese).
* **Visualizzazione KPI:** Trasformazione di dati simulati in KPI e grafici aggiornati.
* **Interattività e Filtri Dinamici:** Possibilità di selezionare intervalli temporali, condizioni ambientali e metriche specifiche (ad esempio, l'impatto delle "Ore di Pascolo" sulle "Vendite di Formaggio").
* **Duplice Prospettiva:** Offre una visualizzazione grafica (diversificata per singolo giorno o più giorni, utile per l'identificazione di trend e anomalie) e una visualizzazione tabellare (necessaria per l'analisi dettagliata e puntuale dei valori grezzi).
* **Esportazione Dati:** Funzionalità di download dei dati filtrati in formato **CSV**, con possibilità di ordinamento dinamico delle colonne.

---

## Piattaforma Tecnologica

Il progetto è articolato in tre componenti principali: il simulatore dati, il frontend (dashboard) e il continuo deployment dei dati generati.

* **Simulatore Dati:**
    * JavaScript / Node.js: Utilizzato per la coerenza tecnologica e la gestione nativa del formato JSON.
    * File di Output: `dati_azienda_zore.json`, il file JSON che alimenta direttamente il frontend.
* **Frontend:**
    * React: Libreria principale per l'interfaccia utente.
    * Recharts: Libreria specializzata per la creazione dei grafici.
* **Deployment:**
    * GitHub: Versionamento del codice sorgente e dei dati.
    * Vercel: Continuous Deployment (CI/CD).

---

## Workflow di Automazione Dati (GitHub Actions)

Il progetto è dotato di un workflow automatizzato, configurato tramite **GitHub Actions**. L'obiettivo primario di questo workflow è rigenerare quotidianamente il file `dati_azienda_zore.json` che alimenta la dashboard, garantendo che i dati analizzati siano sempre aggiornati.

### Trigger

Il workflow è progettato per essere attivato in due modalità:

* **Manuale:** È possibile lanciare l'esecuzione manualmente in qualsiasi momento, accedendo alla scheda **"Actions"** del repository GitHub.
* **Schedulato:** Viene eseguito automaticamente ogni giorno alle **02:00 AM** (Ora Italiana Solare). L'espressione CRON utilizzata è `'0 1 * * *'`, che corrisponde all'orario 01:00 AM UTC.

### Job: `run-simulation` (Passaggi Chiave)

Il job `run-simulation` viene eseguito su un server virtuale fornito da GitHub (Runner con `runs-on: ubuntu-latest`) e si articola nei seguenti cinque passaggi chiave:

1.  **Checkout del codice** (`actions/checkout@v4`): Recupera l'ultima versione del codice sorgente dal repository, rendendolo disponibile al Runner.
2.  **Configurazione Node.js** (`actions/setup-node@v4`): Installa l'ambiente Node.js (versione '20') necessario per l'esecuzione dello script di simulazione in JavaScript.
3.  **Installazione dipendenze NPM** (Esegue `npm install`): Installa eventuali moduli richiesti dallo script all'interno della cartella `javascript_creazione_dati_simulati/`.
4.  **Esecuzione dello script JavaScript** (Lancia il codice): Esegue lo script `lancia_con_giorni_costante.js` che realizza la simulazione completa, generando o aggiornando il file `dati_azienda_zore.json` con un anno completo di dati coerenti.
5.  **Committa il file generato nel repository** (`git-auto-commit-action`): Salva il nuovo file JSON aggiornato (`public/dati_azienda_zore.json`) direttamente nel repository, rendendolo disponibile al frontend per il deployment continuo su Vercel.
   
### Struttura del Codice

Il codice del progetto è organizzato in modo modulare per separare la logica del frontend dalla gestione dei dati statici e di simulazione.

* **javascript_creazione_dati_simulati/**: Questa cartella contiene gli script Node.js utilizzati per la generazione dei dati simulati:
    * `lancia_con_giorni_costante.js` (Launcher): È lo script di avvio eseguito da GitHub Actions. Fissa il numero di giorni da simulare a un valore costante (es. 365) e passa questo parametro al componente orchestratore.
    * `lancia_simulazione.js` (Orchestratore): Riceve il numero di giorni e il percorso di output ed esegue lo script di generazione vero e proprio (`simulazione.js`), gestendo l'invio dei parametri e intercettando eventuali errori di esecuzione.
    * `simulazione.js` (Core Logico): È il motore della generazione dati. Applica la logica di stagionalità e di correlazione. Genera il dataset giornaliero, lo ordina e lo salva nel file JSON di output.

* **public/**: Contiene il file di dati JSON (`dati_azienda_zore.json`) che alimenta la dashboard.

* **src/**: Questa cartella contiene tutti i componenti React (Frontend) del progetto. La struttura è composta dai seguenti file principali e dai relativi fogli di stile:
    * **File JSX (Logica e Componenti)**
        * `main.jsx`: Punto di ingresso principale dell'applicazione React, si occupa di inizializzare e renderizzare il componente radice `<App />`.
        * `App.jsx`: Gestisce il caricamento dei dati, la logica di filtraggio dinamico, lo stato di visualizzazione (`Dashboard` o `DataTable`) e contiene l'interfaccia dei filtri utente.
        * `Dashboard.jsx`: Componente dedicato alla visualizzazione dei KPI. Contiene la logica di formattazione dei dati e il rendering degli 11 grafici utilizzando la libreria Recharts.
        * `DataTable.jsx`: Componente per la presentazione dei dati in formato tabellare. Implementa la logica di ordinamento dinamico delle colonne e la funzionalità di esportazione dei dati filtrati in formato CSV.
    * **Fogli di Stile (CSS)**
        * `index.css`: Contiene gli stili CSS globali dell'applicazione, inclusi font e layout di base del corpo.
        * `App.css`: Contiene gli stili specifici per l'header, i controlli dei filtri e le regole di ridimensionamento del container principale, inclusi i media query.
        * `DataTable.css`: Foglio di stile dedicato al componente `DataTable`, che definisce la struttura della tabella, le larghezze delle colonne e lo stile del pulsante di download CSV.
