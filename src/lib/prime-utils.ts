export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function generatePrimesInRange(start: number, end: number): number[] {
  const primes: number[] = [];
  for (let i = start; i <= end; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

export function findNthPrime(n: number): number {
  if (n < 1) throw new Error('N must be a positive integer');
  let count = 0;
  let num = 1;
  while (count < n) {
    num++;
    if (isPrime(num)) count++;
  }
  return num;
}

export function primeFactorization(n: number): number[] {
  if (n < 2) return [];
  const factors: number[] = [];
  let d = 2;
  let remaining = n;
  while (d * d <= remaining) {
    while (remaining % d === 0) {
      factors.push(d);
      remaining = Math.floor(remaining / d);
    }
    d++;
  }
  if (remaining > 1) factors.push(remaining);
  return factors;
}
