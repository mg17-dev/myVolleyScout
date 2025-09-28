// Oggetto per tenere traccia delle statistiche per atleta e per set
let statistichePerSet = {};

// Oggetto di riferimento per i valori minimi per ruolo e fondamentale
const valoriRiferimentoPerRuolo = {
    palleggiatore: {
        battuta: 10,
        ricezione: 0,
        attacco: 80,
        muro: 10,
        difesa: 40
    },
    schiacciatore: {
        battuta: 10,
        ricezione: 40,
        attacco: 45,
        muro: 10,
        difesa: 40
    },
    opposto: {
        battuta: 10,
        ricezione: 0,
        attacco: 40,
        muro: 10,
        difesa: 40
    },
    centrale: {
        battuta: 10,
        ricezione: 60,
        attacco: 70,
        muro: 10,
        difesa: 40
    },
    libero: {
        battuta: 0,
        ricezione: 45,
        attacco: 0,
        muro: 0,
        difesa: 45
    }
};

// Funzione per inizializzare le statistiche di un atleta per un set
function inizializzaStatisticheAtleta(atletaId, setId) {
    if (!statistichePerSet[setId]) {
        statistichePerSet[setId] = {};
    }

    statistichePerSet[setId][atletaId] = {
        battuta: { positive: 0, totale: 0 },
        ricezione: { positive: 0, totale: 0 },
        attacco: { positive: 0, totale: 0 },
        muro: { positive: 0, totale: 0 },
        difesa: { positive: 0, totale: 0 }
    };
}

// Funzione per aggiornare le statistiche
function aggiornaStatistiche(atletaId, fondamentale, esito, setId = setIdCorrente) {
    console.log(`Aggiornamento statistica: Atleta ${atletaId}, Fondamentale: ${fondamentale}, Esito: ${esito}, Set: ${setId}`);

    if (!statistichePerSet[setId]) {
        statistichePerSet[setId] = {};
    }

    if (!statistichePerSet[setId][atletaId]) {
        inizializzaStatisticheAtleta(atletaId, setId);
    }

    const fondamentaleStats = statistichePerSet[setId][atletaId][fondamentale];

    // Incrementa il conteggio totale per ogni azione
    fondamentaleStats.totale++;

    // Verifica se l'esito è considerato positivo per il fondamentale
    if ((fondamentale === 'battuta' && ['#', '/', '+'].includes(esito)) ||
        (fondamentale === 'ricezione' && ['#', '+', '!'].includes(esito)) ||
        (fondamentale === 'attacco' && esito === '#') ||
        (fondamentale === 'muro' && ['#', '+'].includes(esito)) ||
        (fondamentale === 'difesa' && ['#', '+', '!'].includes(esito))) {
        fondamentaleStats.positive++;
    }

    // Aggiorna la tabella delle prestazioni per il set corrente
    aggiornaTabellaPrestazioni(atletaId, fondamentale, setId);

    // Aggiungi la chiamata a aggiornaStatistichePartita per aggiornare le statistiche totali
    aggiornaStatistichePartita(atletaId, fondamentale, esito);
}


// Funzione per aggiornare la cella della tabella delle prestazioni
function aggiornaTabellaPrestazioni(atletaId, fondamentale, setId = setIdCorrente) {
    const fondamentaleStats = statistichePerSet[setId][atletaId][fondamentale];
    const cella = document.getElementById(`${fondamentale}-${atletaId}-${setId}`);

    if (cella) {
        const positiveCount = fondamentaleStats.positive;
        const totaleCount = fondamentaleStats.totale;

        // Calcola l'efficienza come rapporto tra positivi e totale
        const efficienza = totaleCount > 0 ? ((positiveCount / totaleCount) * 100).toFixed(1) : null;

        // Aggiorna la cella con l'efficienza in percentuale se disponibile
        cella.textContent = efficienza !== null ? `${efficienza}%` : '';

        // Colora la cella in base all'efficienza rispetto ai valori di riferimento
        coloraTabellaPrestazioni(atletaId, setId);
    }
}

// Funzione per colorare la tabella delle prestazioni in base ai valori di riferimento per ruolo
function coloraTabellaPrestazioni(atletaId, setId = setIdCorrente) {
    const ruoloAtleta = recuperaRuoloAtleta(atletaId);  // Funzione che recupera il ruolo dell'atleta
    const fondamentali = ['battuta', 'ricezione', 'attacco', 'muro', 'difesa'];

    fondamentali.forEach(fondamentale => {
        const cella = document.getElementById(`${fondamentale}-${atletaId}-${setId}`);

        if (cella) {
            // Elimina eventuali spazi e rimuovi correttamente il simbolo di percentuale
            const valoreCella = parseFloat(cella.textContent.trim().replace('%', ''));
            const valoreRiferimento = valoriRiferimentoPerRuolo[ruoloAtleta]?.[fondamentale];

            // Verifica che entrambi i valori siano numerici
            if (!isNaN(valoreCella) && valoreRiferimento !== null && valoreRiferimento !== undefined) {
                // Controlla se l'efficienza è inferiore o superiore al valore di riferimento
                if (valoreCella >= valoreRiferimento) {
                    cella.style.backgroundColor = '#198754';  // Verde
                    cella.style.color = 'white';
                } else {
                    cella.style.backgroundColor = '#dc3545';  // Rosso
                    cella.style.color = 'white';
                }
            } else {
                // Se non ci sono valori di riferimento o la cella non è valida, lasciala bianca
                cella.style.backgroundColor = 'white';
                cella.style.color = 'black';  // Colore del testo normale
            }
        }
    });
}

function recuperaRuoloAtleta(atletaId) {
    const atleti = JSON.parse(localStorage.getItem('atleti'));  // Recupera gli atleti dal localStorage
    const atleta = atleti.find(a => a['N. MAGLIA'] === atletaId);  // Recupera l'atleta in base al numero di maglia

    if (atleta) {
        console.log(`Atleta trovato: ${atleta['COGNOME']}, Ruolo: ${atleta['RUOLO']}`);
        return atleta['RUOLO'].toLowerCase();  // Restituisce il ruolo in minuscolo
    } else {
        console.error(`Atleta con id ${atletaId} non trovato`);
        return 'palleggiatore';  // Ruolo di default se l'atleta non viene trovato
    }
}

function rimuoviAzioneStatistiche(atletaId, fondamentale, esito, setId) {
    if (!statistichePerSet[setId] || !statistichePerSet[setId][atletaId] || !statistichePerSet[setId][atletaId][fondamentale]) {
        console.error(`Statistiche non trovate per atleta ${atletaId}, fondamentale ${fondamentale}, set ${setId}`);
        return;
    }

    const fondamentaleStats = statistichePerSet[setId][atletaId][fondamentale];

    // Decrementa il conteggio totale e positivo se necessario
    fondamentaleStats.totale--;
    if ((fondamentale === 'battuta' && ['#', '/', '+'].includes(esito)) ||
        (fondamentale === 'ricezione' && ['#', '+', '!'].includes(esito)) ||
        (fondamentale === 'attacco' && esito === '#') ||
        (fondamentale === 'muro' && ['#', '+'].includes(esito)) ||
        (fondamentale === 'difesa' && ['#', '+', '!'].includes(esito))) {
        fondamentaleStats.positive--;
    }

    // Aggiorna la tabella delle prestazioni
    aggiornaTabellaPrestazioni(atletaId, fondamentale, setId);

    // Rimuove l'azione anche dalle statistiche totali
    rimuoviAzioneStatistichePartita(atletaId, fondamentale, esito);
}



