let rsaKeys = null;

// Alphabet conforme à l'exercice du cours (page 4)
// Index: 0=espace, 1=a, 2=b, ..., 26=z, 27=., 28=., 29=., 30=!, 31=?, 32=-
const ALPHABET = ' abcdefghijklmnopqrstuvwxyz...!?-';
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
    const lowerText = text.toLowerCase();
    const numbers = [];
    for (let i = 0; i < lowerText.length; i++) {
        const index = ALPHABET.indexOf(lowerText[i]);
        if (index >= 0) numbers.push(index);
    }
    return numbers;
}

function numbersToText(numbers) {
    return numbers.map(n => ALPHABET[n] || '?').join('');
}

function numbersToChiffreText(numbers) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (const num of numbers) {
        const high = Math.floor(num / 36);
        const low = num % 36;
        result += chars[high] + chars[low];
    }
    return result;
}

function chiffreTextToNumbers(text) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = [];
    for (let i = 0; i < text.length; i += 2) {
        if (i + 1 < text.length) {
            const high = chars.indexOf(text[i]);
            const low = chars.indexOf(text[i + 1]);
            if (high !== -1 && low !== -1) {
                numbers.push(high * 36 + low);
            }
        }
    }
    return numbers;
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
    
    if (isNaN(p) || isNaN(q) || isNaN(e)) {
        status.innerHTML = '<div class="status error">❌ Veuillez entrer des nombres valides !</div>';
        return;
    }
    
    if (!isPrime(p) || !isPrime(q)) {
        status.innerHTML = '<div class="status error">❌ p et q doivent être des nombres premiers ! (cf. cours §2.1)</div>';
        return;
    }
    if (p === q) {
        status.innerHTML = '<div class="status error">❌ p et q doivent être différents !</div>';
        return;
    }

    const n = p * q;
    if (n < ALPHABET_SIZE) {
        status.innerHTML = `<div class="status error">❌ n = ${n} trop petit ! Il faut n ≥ ${ALPHABET_SIZE} pour couvrir l'alphabet.</div>`;
        return;
    }

    const phi = (p - 1) * (q - 1);
    if (e <= 1 || e >= phi || gcd(e, phi) !== 1) {
        status.innerHTML = `<div class="status error">❌ e = ${e} invalide ! Il doit être premier avec φ(n)=${phi}. (cf. cours §2.1)</div>`;
        return;
    }

    const d = modInverse(e, phi);
    rsaKeys = { p, q, n, phi, e, d };

    document.getElementById('keysDisplay').innerHTML = `
        <div class="keys-display">
            <div class="key-box">
                <div class="key-label">🔓 Clé PUBLIQUE (e, n)</div>
                <div class="key-value">(${e}, ${n})</div>
            </div>
            <div class="key-box">
                <div class="key-label">🔐 Clé PRIVÉE (d, n)</div>
                <div class="key-value">(${d}, ${n})</div>
            </div>
            <div class="key-box">
                <div class="key-label">📐 Paramètres (secrets)</div>
                <div class="key-value">p = ${p}, q = ${q}<br>φ(n) = ${phi}</div>
            </div>
        </div>
    `;
    document.getElementById('keysDisplay').style.display = 'block';
    document.getElementById('btnChiffrer').disabled = false;
    document.getElementById('btnDechiffrer').disabled = false;

    status.innerHTML = '<div class="status success">✅ Clés générées avec succès ! Conformément au cours RSA (§2.1 et §2.2)</div>';
}

function chiffrerMessage() {
    if (!rsaKeys) {
        showResult('resultChiffre', 'error', '❌ Veuillez d\'abord générer les clés RSA !');
        return;
    }
    
    const message = document.getElementById('messageClair').value;
    const { n, e } = rsaKeys;

    if (!message.trim()) {
        showResult('resultChiffre', 'error', '❌ Veuillez entrer un message à chiffrer !');
        return;
    }

    const numbers = textToNumbers(message);
    const chiffreeNumbers = numbers.map(m => modPow(m, e, n));
    const chiffreText = numbersToChiffreText(chiffreeNumbers);
    const numbersText = chiffreeNumbers.map(c => String(c).padStart(4, '0')).join(' ');
    
    document.getElementById('messageChiffre').value = chiffreText;
    
    showResult('resultChiffre', 'success', `
        <strong>✅ Chiffrement réussi (C = M^e mod n) :</strong><br>
        
        <div style="margin-top: 15px;">
            <div style="font-weight: bold; color: #fbbf24;">📋 À copier (message chiffré) :</div>
            <div style="font-family: monospace; font-size: 1.2em; background: #0f172a; padding: 12px; border-radius: 8px; margin: 8px 0; word-break: break-all; border: 1px solid #334155;">${chiffreText}</div>
        </div>
        
        <details style="margin-top: 15px;">
            <summary style="cursor: pointer; color: #94a3b8;">🔍 Voir les détails techniques</summary>
            <div style="margin-top: 10px;">
                <div style="font-weight: bold; color: #60a5fa;">📊 Nombres chiffrés :</div>
                <div style="font-family: monospace; background: #0f172a; padding: 8px; border-radius: 8px; margin-top: 5px; font-size: 0.9em;">${numbersText}</div>
            </div>
        </details>
    `);
}

function dechiffrerMessage() {
    if (!rsaKeys) {
        showResult('resultDechiffre', 'error', '❌ Veuillez d\'abord générer les clés RSA !');
        return;
    }
    
    const chiffreText = document.getElementById('messageChiffre').value.trim();
    const { n, d } = rsaKeys;

    if (!chiffreText) {
        showResult('resultDechiffre', 'error', '❌ Veuillez coller un message chiffré !');
        return;
    }

    let chiffreeNumbers = chiffreTextToNumbers(chiffreText);
    
    if (chiffreeNumbers.length === 0) {
        chiffreeNumbers = chiffreText.split(/\s+/).map(Number).filter(n => !isNaN(n));
    }
    
    if (chiffreeNumbers.length === 0) {
        showResult('resultDechiffre', 'error', '❌ Format de message chiffré invalide !');
        return;
    }
    
    const dechiffreeNumbers = chiffreeNumbers.map(c => modPow(c, d, n));
    const resultText = numbersToText(dechiffreeNumbers);
    
    showResult('resultDechiffre', 'success', `
        <strong>✅ Déchiffrement réussi (M = C^d mod n) :</strong><br>
        
        <div style="margin-top: 15px;">
            <div style="font-weight: bold; color: #4ade80;">📝 Message original :</div>
            <div style="font-size: 1.5em; margin: 10px 0; background: #0f172a; padding: 15px; border-radius: 12px; font-weight: bold; font-family: monospace; text-align: center; border: 1px solid #334155;">${resultText}</div>
        </div>
        
        <details style="margin-top: 15px;">
            <summary style="cursor: pointer; color: #94a3b8;">🔍 Voir les détails techniques</summary>
            <div style="margin-top: 10px;">
                <div style="font-weight: bold; color: #60a5fa;">🔢 Nombres déchiffrés :</div>
                <div style="font-family: monospace; background: #0f172a; padding: 8px; border-radius: 8px; margin-top: 5px;">${dechiffreeNumbers.join(', ')}</div>
            </div>
        </details>
        
        <div style="margin-top: 10px; font-size: 0.85em; color: #94a3b8;">
            🎉 Conforme au cours : M = C^d mod n (page 2) et théorème d'Euler (§2.1)
        </div>
    `);
}

function showResult(elementId, type, html) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="result-box ${type}">${html}</div>`;
}

function clearAll() {
    document.getElementById('p').value = '5';
    document.getElementById('q').value = '11';
    document.getElementById('e').value = '7';
    document.getElementById('messageClair').value = 'edith';
    document.getElementById('messageChiffre').value = '';
    document.getElementById('status').innerHTML = '';
    document.getElementById('keysDisplay').style.display = 'none';
    document.getElementById('resultChiffre').innerHTML = '';
    document.getElementById('resultDechiffre').innerHTML = '';
    document.getElementById('btnChiffrer').disabled = true;
    document.getElementById('btnDechiffrer').disabled = true;
    rsaKeys = null;
    
    showResult('resultChiffre', 'info', '💡 Générez d\'abord les clés pour commencer !');
}

window.onload = () => {
    clearAll();
    generateKeys();
};