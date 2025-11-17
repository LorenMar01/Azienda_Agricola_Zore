// ###############################################
// ### 0. RECUPERO MODULI E PARAMETRI          ###
// ###############################################

// Importazione moduli
const { execSync } = require('child_process');
const path = require('path');
// Directory del progetto: lo script è in una sottocartella, risaliamo di un livello.
const scriptDir = path.dirname(process.argv[1]);
const projectRoot = path.join(scriptDir, '..'); 
const desiredOutputDir = path.join(projectRoot, 'public'); 

// I giorni sono passati allo script nell'indice 2 (0=node, 1=script_name)
const NUMERO_GIORNI = process.argv[2];
console.log('');
console.log('#######################################################################');
console.log(`      SIMULAZIONE creazione dati AZIENDA AGRICOLA ZORE per ${NUMERO_GIORNI} giorni.`);
console.log('      Output impostato su: ' + desiredOutputDir);
console.log('#######################################################################');
console.log('');

// #################################################
// ### 1. LANCIO DELLO SCRIPT DI SIMULAZIONE    ###
// #################################################

// Lancio script di simulazione passando il parametro $NUMERO_GIORNI "
console.log('');
console.log('================================================');
console.log(`Esecuzione simulazione.js con ${NUMERO_GIORNI} giorni`);
const simulateScriptPath = path.join(scriptDir, 'simulazione.js');
const command = `node "${simulateScriptPath}" ${NUMERO_GIORNI} "${desiredOutputDir}"`; 
console.log(`Comando: ${command}`);
console.log('');

try {execSync(command, { stdio: 'inherit'});
     console.log('');
     console.log('================================================');
     console.log('');
    } catch (error) {console.error(`ERRORE durante l'esecuzione di simulazione.js: ${error.message}`);
                     process.exit(1);
                    }