// Importazione moduli per la gestione del file system e dei percorsi
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ###############################################
// ### 1. IMPOSTAZIONE MANUALE DELLA VARIABILE ###
// ###   (default 365 giorni)                  ###
// ###############################################

const NUMERO_GIORNI = 365;

console.log('');
console.log(`PARAMETRO IMPOSTATO: ${NUMERO_GIORNI} giorni.`);
console.log('');

// ###########################
// ### 2. ESECUZIONE BATCH ###
// ###########################

async function main() {
    try {
        // lancia_simulazione.js passandogli il numero giorni di simulazione
         console.log('Esecuzione di lancia_simulazione.js...');
			
        const scriptToCall = path.join(path.dirname(process.argv[1]), 'lancia_simulazione.js');
        const child = spawn('node', [scriptToCall, NUMERO_GIORNI.toString()], {stdio: 'inherit'});

        // Attendere il completamento della creazione dati
        await new Promise((resolve, reject) => {
            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                 } else {
                    reject(new Error(`lancia_simulazione.js è terminato con codice ${code}`));
                 }
            });
            child.on('error', (err) => {
                reject(err);
            });
        });
        
    } catch (error) {
        console.error(`ERRORE durante l'esecuzione: ${error.message}`);
        process.exit(1); 
    }
}

// Avvia la funzione principale
main();