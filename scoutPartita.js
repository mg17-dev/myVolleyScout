// Oggetto per tracciare tutte le azioni per ogni atleta
let statisticheTotali = {};

// Funzione per inizializzare le statistiche totali per ogni atleta
function inizializzaStatistichePartita(atletaId) {
    if (!statisticheTotali[atletaId]) {
        statisticheTotali[atletaId] = {
            battuta: { '#': 0, '/': 0, '+': 0, '-': 0, '=': 0 },
            ricezione: { '#': 0, '+': 0, '!': 0, '-': 0, '/': 0, '=': 0 },
            attacco: { '#': 0, '+': 0, '-': 0, '/': 0, '=': 0 },
            muro: { '#': 0, '+': 0, '-': 0, '/': 0, '=': 0 },
            difesa: { '#': 0, '+': 0, '!': 0, '-': 0, '/': 0, '=': 0 },
            puntiFatti: 0,   // Nuovo campo per punti fatti
            puntiSubiti: 0,  // Nuovo campo per punti subiti
            efficienza: 0    // Nuovo campo per efficienza
        };
    }
}

// Funzione per aggiornare le statistiche totali per ogni atleta e azione
function aggiornaStatistichePartita(atletaId, fondamentale, esito) {
    if (!statisticheTotali[atletaId]) {
        inizializzaStatistichePartita(atletaId);
    }

    // Incrementa il conteggio dell'azione specifica
    if (statisticheTotali[atletaId][fondamentale][esito] !== undefined) {
        statisticheTotali[atletaId][fondamentale][esito]++;
    }

    // Calcola punti fatti e punti subiti
    calcolaPuntiEfficienza(atletaId);

    // Aggiorna la visualizzazione della tabella delle statistiche totali
    aggiornaTabellaStatistichePartita(atletaId, fondamentale, esito);
}

// Funzione per calcolare punti fatti, punti subiti ed efficienza
function calcolaPuntiEfficienza(atletaId) {
    const stats = statisticheTotali[atletaId];

    // Calcola i punti fatti
    const puntiFatti = stats.battuta['#'] + stats.attacco['#'] + stats.muro['#'];

    // Calcola i punti subiti
    const puntiSubiti = stats.battuta['='] + stats.ricezione['='] + stats.difesa['='] +
                        stats.attacco['/'] + stats.attacco['='] + stats.muro['/'] + stats.muro['='];

    // Aggiorna le statistiche
    stats.puntiFatti = puntiFatti;
    stats.puntiSubiti = puntiSubiti;
    stats.efficienza = puntiFatti - puntiSubiti;

    // Aggiorna le celle della tabella per punti fatti, punti subiti ed efficienza
    aggiornaCellePuntiEfficienza(atletaId);
}

// Funzione per aggiornare le celle di Punti fatti, Punti subiti ed Efficienza
function aggiornaCellePuntiEfficienza(atletaId) {
    document.getElementById(`puntiFatti-${atletaId}`).textContent = statisticheTotali[atletaId].puntiFatti;
    document.getElementById(`puntiSubiti-${atletaId}`).textContent = statisticheTotali[atletaId].puntiSubiti;
    document.getElementById(`efficienza-${atletaId}`).textContent = statisticheTotali[atletaId].efficienza;
}

// Funzione per aggiornare la tabella delle statistiche della partita
function aggiornaTabellaStatistichePartita(atletaId, fondamentale, esito) {
    const cella = document.getElementById(`${fondamentale}-${esito}-${atletaId}`);
    if (cella) {
        cella.textContent = statisticheTotali[atletaId][fondamentale][esito];
    }
}

// Funzione per generare la tabella delle statistiche partita
function generaTabellaStatistichePartita() {
    const atleti = JSON.parse(localStorage.getItem('atleti')); // Carica gli atleti
    const tbody = document.getElementById('statistichePartitaBody'); // Corpo della tabella

    atleti.forEach(atleta => {
        const atletaId = atleta['N. MAGLIA'];
        inizializzaStatistichePartita(atletaId); // Inizializza le statistiche per l'atleta

        // Crea una nuova riga per l'atleta
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${atleta['COGNOME']}</td>
            <td>${atleta['N. MAGLIA']}</td>
            ${generaCelleStatistiche(atletaId)}
            <td id="puntiFatti-${atletaId}" class="bg-info">0</td>
            <td id="puntiSubiti-${atletaId}" class="bg-info">0</td>
            <td id="efficienza-${atletaId}" class="bg-info">0</td>
        `;
        tbody.appendChild(row);
    });

    // Aggiungi la riga "Totale" alla fine della tabella
    generaRigaTotale();
}


// Funzione per generare le celle della tabella per le statistiche
function generaCelleStatistiche(atletaId) {
    const fondamentali = ['battuta', 'ricezione', 'attacco', 'muro', 'difesa'];
    const simboli = {
        battuta: ['#', '/', '+', '-', '='],
        ricezione: ['#', '+', '!', '-', '/', '='],
        attacco: ['#', '+', '-', '/', '='],
        muro: ['#', '+', '-', '/', '='],
        difesa: ['#', '+', '!', '-', '/', '=']
    };

    let celle = '';
    fondamentali.forEach(fondamentale => {
        simboli[fondamentale].forEach(simbolo => {
            celle += `<td id="${fondamentale}-${simbolo}-${atletaId}">0</td>`;
        });
    });


    return celle;
}

// Funzione per generare la riga "Totale" alla fine della tabella
function generaRigaTotale() {
    const tbody = document.getElementById('statistichePartitaBody');
    const row = document.createElement('tr');
    row.classList.add('bg-dark', 'text-white');
    row.id = 'riga-totale'; // Aggiungo un ID alla riga Totale
    row.innerHTML = `
        <td class="bg-info"><strong>Totale</strong></td>
        <td class="bg-info"></td>
        ${generaCelleTotale()}
        <td id="puntiFatti-totale" class="bg-info">0</td>
        <td id="puntiSubiti-totale" class="bg-info">0</td>
        <td id="efficienza-totale" class="bg-info">0</td>
    `;
    tbody.appendChild(row);
    aggiornaRigaTotale(); // Aggiorna i totali dopo aver generato la riga
}

// Funzione per generare le celle di totale della tabella
function generaCelleTotale() {
    const fondamentali = ['battuta', 'ricezione', 'attacco', 'muro', 'difesa'];
    const simboli = {
        battuta: ['#', '/', '+', '-', '='],
        ricezione: ['#', '+', '!', '-', '/', '='],
        attacco: ['#', '+', '-', '/', '='],
        muro: ['#', '+', '-', '/', '='],
        difesa: ['#', '+', '!', '-', '/', '=']
    };

    let celle = '';
    fondamentali.forEach(fondamentale => {
        simboli[fondamentale].forEach(simbolo => {
            // Ogni cella avrà un id con "totale-" per il simbolo e fondamentale
            celle += `<td id="totale-${fondamentale}-${simbolo}" class="bg-info">0</td>`;
        });
    });

    return celle;
}

// Funzione per aggiornare la riga "Totale" con le somme
function aggiornaRigaTotale() {
    const atleti = JSON.parse(localStorage.getItem('atleti'));
    const fondamentali = ['battuta', 'ricezione', 'attacco', 'muro', 'difesa'];
    const simboli = {
        battuta: ['#', '/', '+', '-', '='],
        ricezione: ['#', '+', '!', '-', '/', '='],
        attacco: ['#', '+', '-', '/', '='],
        muro: ['#', '+', '-', '/', '='],
        difesa: ['#', '+', '!', '-', '/', '=']
    };

    // Cicla su ogni fondamentale e simbolo
    fondamentali.forEach(fondamentale => {
        simboli[fondamentale].forEach(simbolo => {
            let totale = 0;

            // Somma i valori delle colonne sopra la cella della riga "Totale"
            atleti.forEach(atleta => {
                const atletaId = atleta['N. MAGLIA'];
                const cellaAtleta = document.getElementById(`${fondamentale}-${simbolo}-${atletaId}`);

                // Verifica che la cella esista e somma il suo contenuto
                if (cellaAtleta) {
                    const valore = parseInt(cellaAtleta.textContent, 10) || 0;  // Valore o 0 se non esiste
                    totale += valore;
                }
            });

            // Aggiorna la cella della riga "Totale" con la somma
            document.getElementById(`totale-${fondamentale}-${simbolo}`).textContent = totale;
        });
    });

    // Aggiorna i totali per Punti fatti, Punti subiti ed Efficienza
    let totalePuntiFatti = 0;
    let totalePuntiSubiti = 0;
    let totaleEfficienza = 0;

    atleti.forEach(atleta => {
        const atletaId = atleta['N. MAGLIA'];
        totalePuntiFatti += statisticheTotali[atletaId].puntiFatti;
        totalePuntiSubiti += statisticheTotali[atletaId].puntiSubiti;
        totaleEfficienza += statisticheTotali[atletaId].efficienza;
    });

    document.getElementById('puntiFatti-totale').textContent = totalePuntiFatti;
    document.getElementById('puntiSubiti-totale').textContent = totalePuntiSubiti;
    document.getElementById('efficienza-totale').textContent = totaleEfficienza;
}

// Funzione per aggiornare la tabella delle statistiche partita (inclusa la riga totale)
function aggiornaTabellaStatistichePartita(atletaId, fondamentale, esito) {
    const cella = document.getElementById(`${fondamentale}-${esito}-${atletaId}`);
    if (cella) {
        cella.textContent = statisticheTotali[atletaId][fondamentale][esito];
    }
    // Dopo ogni aggiornamento, aggiorna anche la riga totale
    aggiornaRigaTotale();
}

// Funzione per aggiornare la tabella con i punti ed errori generici di squadra
function aggiornaTabellaStatisticheGeneriche() {
    const tbody = document.getElementById('statisticheGenericheBody');
    tbody.innerHTML = '';  // Resetta la tabella prima di riempirla di nuovo

    // Cicla su tutti i set e aggiorna i valori nella tabella
    for (let i = 1; i <= numSet; i++) {
        const puntiGenericiSet = puntiGenerici[i] || 0;  // Se non ci sono dati, inizializza a 0
        const erroriGenericiSet = erroriGenerici[i] || 0;

        // Crea una nuova riga
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Set ${i}</td>
            <td>${puntiGenericiSet}</td>
            <td>${erroriGenericiSet}</td>
        `;
        tbody.appendChild(row);
    }
}

function rimuoviAzioneStatistichePartita(atletaId, fondamentale, esito) {
    if (statisticheTotali[atletaId] && statisticheTotali[atletaId][fondamentale][esito] > 0) {
        // Decrementa il conteggio specifico
        statisticheTotali[atletaId][fondamentale][esito]--;

        // Ricalcola punti fatti, punti subiti ed efficienza
        calcolaPuntiEfficienza(atletaId);

        // Aggiorna la tabella delle statistiche totali
        aggiornaTabellaStatistichePartita(atletaId, fondamentale, esito);
    }
}
