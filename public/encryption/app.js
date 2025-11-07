function isPrime(n) {
    let isItPrime = true;

    if (n <= 1) {
        isItPrime = false;
    } else {
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) {
                isItPrime = false;
                break;
            }
        }
    }
    return isItPrime;
}

function makePrime(max) {
    let p = Math.floor(Math.random() * max);
    if (p % 2 === 0) {
        p += 1;
    }
    while (!isPrime(p)) {
        p += 2;
    }
    return p;
}

function expmod( base, exp, mod ){
  if (exp == 0) return 1;
  if (exp % 2 == 0){
    return Math.pow( expmod( base, (exp / 2), mod), 2) % mod;
  }
  else {
    return (base * expmod( base, (exp - 1), mod)) % mod;
  }
}

function modInverse(a, m)
{
    let m0 = m;
    let y = 0;
    let x = 1;

    if (m == 1)
        return 0;

    while (a > 1)
    {
        
        // q is quotient
        let q = parseInt(a / m);
        let t = m;

        // m is remainder now,
        // process same as
        // Euclid's algo
        m = a % m;
        a = t;
        t = y;

        // Update y and x
        y = x - q * y;
        x = t;
    }

    // Make x positive
    if (x < 0)
        x += m0;

    return x;
}

function genKeys() {
    p = makePrime(10000)
    q = makePrime(10000)

    n = p * q
    phi = (p - 1) * (q - 1)

    e = 65537

    d = modInverse(e, phi)

    alert("Public Key: (" + e + ", " + n + ")")
    alert("Private Key: (" + d + ", " + n + ")")

    return { "pubkey" : { "e": e, "n": n }, "privkey" : { "d": d, "n": n } }
}
function decrypt() {}
keyPair = genKeys()
message = 4

ciphertext = expmod(message, keyPair.pubkey.e, keyPair.pubkey.n)
alert("Ciphertext: " + ciphertext)

decrypted = expmod(ciphertext, keyPair.privkey.d, keyPair.privkey.n)
alert("Decrypted: " + decrypted)