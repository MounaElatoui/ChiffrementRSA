let rsaKeys = null;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
const ALPHABET_SIZE = ALPHABET.length;

function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

function modInverse(a, m) {
    let m0 = m, t, q;
    let x0 = 0, x1 = 1;
    if (m === 1) return 0;
    while (a > 1) {
        q = Math.floor(a / m);
        t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }
    if (x1 < 0) x1 += m0;
    return x1;
}

function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

function textToNumbers(text) {
    return text.toUpperCase().split('').map(char => ALPHABET.indexOf(char)).filter(n => n >= 0);
}

function numbersToText(numbers) {
    return numbers.map(n => ALPHABET[n]).join('');
}

function gcd(a, b) {
    while (b !== 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function generateKeys() {
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const e = parseInt(document.getElementById('e').value);

    const status = document.getElementById('status');
    
    // Validation
    if (!isPrime(p) || !isPrime(q)) {
        status.innerHTML = '<div class="status error">❌ p et q doivent être des nombres premiers !</div>';
        return;
    }
    if (p === q) {
        status.innerHTML = '<div class="status error">❌ p et q doivent être différents !</div>';
        return;
    }

    const n = p * q;
    if (n < ALPHABET_SIZE) {
        status.innerHTML = '<div class="status error">❌ n = p×q trop petit ! Essayez des nombres plus grands.</div>';
        return;
    }

    const phi = (p - 1) * (q - 1);
    if (e <= 1 || e >= phi || gcd(e, phi) !== 1) {
        status.innerHTML = '<div class="status error">❌ e invalide ! Doit être coprime avec φ(n).</div>';
        return;
    }

    const d = modInverse(e, phi);
    rsaKeys = { p, q, n, phi, e, d };

    // Afficher clés
    document.getElementById('keysDisplay').innerHTML = `
        <div class="keys-display">
            <div class="key-box">
                <div class="key-label">🔓 Clé PUBLIQUE</div>
                (${e}, ${n})
            </div>
            <div class="key-box">
                <div class="key-label">🔐 Clé PRIVÉE</div>
                (${d}, ${n})
            </div>
        </div>
    `;
    document.getElementById('keysDisplay').style.display = 'block';
    document.getElementById('btnChiffrer').disabled = false;
    document.getElementById('btnDechiffrer').disabled = false;

    status.innerHTML = '<div class="status success">✅ Clés générées ! Vous pouvez chiffrer/déchiffrer.</div>';
}

function chiffrerMessage() {
    const message = document.getElementById('messageClair').value;
    const { n, e } = rsaKeys;

    if (!message.trim()) {
        showResult('resultChiffre', 'error', '❌ Entrez un message !');
        return;
    }

    const numbers = textToNumbers(message);
    const chiffree = numbers.map(m => modPow(m, e, n));

    const resultText = chiffree.map(c => String(c).padStart(4, '0')).join(' ');
    
    document.getElementById('messageChiffre').value = resultText;
    
    showResult('resultChiffre', 'success', `
        <strong>✅ Message chiffré :</strong><br>
        <div style="font-size: 1.1em; margin-top: 10px;">${resultText}</div>
        <div style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
            📋 Copiez ce texte et collez-le dans "Message chiffré" pour déchiffrer !
        </div>
    `);
}

function dechiffrerMessage() {
    const chiffreeText = document.getElementById('messageChiffre').value.trim();
    const { n, d } = rsaKeys;

    if (!chiffreeText) {
        showResult('resultDechiffre', 'error', '❌ Collez un message chiffré !');
        return;
    }

    const numbers = chiffreeText.split(/\s+/).map(Number).filter(n => !isNaN(n));
    const dechiffree = numbers.map(c => modPow(c, d, n));

    const resultText = numbersToText(dechiffree);
    
    showResult('resultDechiffre', 'success', `
        <strong>✅ Message déchiffré :</strong><br>
        <div style="font-size: 1.5em; margin: 15px 0; color: #27ae60; font-weight: bold;">${resultText}</div>
        <div style="font-size: 0.9em; opacity: 0.8;">
            🎉 RSA fonctionne parfaitement !
        </div>
    `);
}

function showResult(elementId, type, html) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="result-box ${type}">${html}</div>`;
}

function clearAll() {
    document.getElementById('p').value = '61';
    document.getElementById('q').value = '53';
    document.getElementById('e').value = '17';
    document.getElementById('messageClair').value = 'BONJOUR';
    document.getElementById('messageChiffre').value = '';
    document.getElementById('status').innerHTML = '';
    document.getElementById('keysDisplay').style.display = 'none';
    document.getElementById('resultChiffre').innerHTML = '';
    document.getElementById('resultDechiffre').innerHTML = '';
    document.getElementById('btnChiffrer').disabled = true;
    document.getElementById('btnDechiffrer').disabled = true;
    rsaKeys = null;
}

// Auto-générer au chargement
window.onload = generateKeys;