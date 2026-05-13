Fonctionnalités
✅ Génération automatique de clés RSA (p, q → n, φ(n), e, d)

✅ Chiffrement texte → nombres (A-Z + espaces)

✅ Copier-coller du texte chiffré

✅ Déchiffrement parfait

✅ Validation automatique (nombres premiers, coprime)

✅ Interface responsive (mobile/desktop)

✅ Design moderne avec animations

ÉTAPE 1 : Nombres premiers

│
├─ p = 61 ✓

├─ q = 53 ✓

└─ Pourquoi ? n=p×q dur à factoriser

ÉTAPE 2 : Module n

│
├─ n = 61 × 53

├─ n = 3233

└─ Base du modulo

ÉTAPE 3 : Totient φ(n)

│
├─ φ(n) = (61-1) × (53-1)

├─ φ(n) = 60 × 52 = 3120
└─ Nombres coprimes < n

ÉTAPE 4 : Exposant public e
│
├─ 1 < e < 3120

├─ PGCD(e, 3120) = 1

└─ e = 17 ✓

ÉTAPE 5 : Exposant privé d
│
├─ d = 17⁻¹ mod 3120

├─ Algorithme Euclide étendu
└─ d = 2753 ✓
ÉTAPE 6 : CHIFFREMENT
│
├─ "B" → m = 1

├─ c = 1¹⁷ mod 3233 = 1234

├─ "O" → 14¹⁷ mod 3233 = 2790

└─ "BONJOUR" → "1234 2790 0567..."

CLÉS FINALES :
│
├─ PUBLIQUE : (17, 3233) ← Tout le monde

<img width="1060" height="772" alt="vvh" src="https://github.com/user-attachments/assets/b341e2aa-ce36-429c-a254-64f9811eff4b" />
<img width="1090" height="803" alt="capturee" src="https://github.com/user-attachments/assets/3b0d0b9b-7cbc-4460-b723-082172b0fa2a" />

<img width="952" height="847" alt="11" src="https://github.com/user-attachments/assets/cee2e75b-9c26-4b96-9122-fb5d60875a36" />


