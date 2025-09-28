document.getElementById('fileAtleti').addEventListener('change', handleFileAtleti);
document.getElementById('filePartite').addEventListener('change', handleFilePartite);

let atletiData = [];
let partiteData = [];

// Funzione per gestire il caricamento del file Atleti
function handleFileAtleti(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            atletiData = XLSX.utils.sheet_to_json(sheet);
            console.log(atletiData); // Vedi i dati degli atleti
            displayAtletiTable(atletiData);
        };
        reader.readAsArrayBuffer(file);
    }
}

// Funzione per visualizzare la lista di atlete in una tabella
function displayAtletiTable(atleti) {
    const tbody = document.getElementById('tabellaAtleti').querySelector('tbody');
    tbody.innerHTML = ''; // Svuota prima
    
    atleti.forEach(atleta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${atleta['NOME']}</td>
            <td>${atleta['COGNOME']}</td>
            <td>${atleta['RUOLO']}</td>
            <td>${atleta['N. MAGLIA']}</td>
        `;
        tbody.appendChild(row);
    });

    // Mostra la tabella
    document.getElementById('sezioneAtleti').classList.remove('d-none');
}

// Funzione per gestire il caricamento del file Partite
function handleFilePartite(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            partiteData = XLSX.utils.sheet_to_json(sheet);
            console.log(partiteData); // Vedi i dati delle partite
            populatePartitaDropdown(partiteData);
        };
        reader.readAsArrayBuffer(file);
    }
}

// Popola il dropdown delle partite
function populatePartitaDropdown(partite) {
    const selectPartita = document.getElementById('selectPartita');
    selectPartita.innerHTML = ''; // Svuota prima
    partite.forEach((partita, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${partita['SQUADRA IN CASA']} vs ${partita['SQUADRA FUORI CASA']} - ${partita['DATA']}`;
        selectPartita.appendChild(option);
    });
    document.getElementById('selezionePartita').classList.remove('d-none');
}


document.getElementById('iniziaPartita').addEventListener('click', iniziaPartita);

function iniziaPartita() {
    // Controlla che ci siano atlete e una partita selezionata
    const partitaSelezionata = document.getElementById('selectPartita').value;
    if (atletiData.length > 0 && partitaSelezionata !== '') {
        // Salva i dati in localStorage
        localStorage.setItem('atleti', JSON.stringify(atletiData));
        localStorage.setItem('partita', JSON.stringify(partiteData[partitaSelezionata]));
        
        // Vai alla pagina successiva
        window.location.href = 'partita.html';
    } else {
        alert('Devi caricare i dati delle atlete e selezionare una partita per iniziare!');
    }
}

// Mostra il bottone "Inizia Partita" quando atleti e partite sono caricati
function checkPartitaReady() {
    if (atletiData.length > 0 && partiteData.length > 0) {
        document.getElementById('iniziaPartita').classList.remove('d-none');
    }
}

// Aggiungi la chiamata a `checkPartitaReady` dopo il caricamento dei dati
function displayAtletiTable(atleti) {
    // Popola la tabella come prima
    const tbody = document.getElementById('tabellaAtleti').querySelector('tbody');
    tbody.innerHTML = ''; // Svuota prima

    atleti.forEach(atleta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${atleta['NOME']}</td>
            <td>${atleta['COGNOME']}</td>
            <td>${atleta['RUOLO']}</td>
            <td>${atleta['N. MAGLIA']}</td>
        `;
        tbody.appendChild(row);
    });

    // Mostra la tabella
    document.getElementById('sezioneAtleti').classList.remove('d-none');

    // Verifica se possiamo abilitare il bottone
    checkPartitaReady();
}

function populatePartitaDropdown(partite) {
    const selectPartita = document.getElementById('selectPartita');
    selectPartita.innerHTML = ''; // Svuota prima
    partite.forEach((partita, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${partita['SQUADRA IN CASA']} vs ${partita['SQUADRA FUORI CASA']} - ${partita['DATA']}`;
        selectPartita.appendChild(option);
    });
    document.getElementById('selezionePartita').classList.remove('d-none');

    // Verifica se possiamo abilitare il bottone
    checkPartitaReady();
}
