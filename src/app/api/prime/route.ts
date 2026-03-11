import { NextRequest, NextResponse } from 'next/server';
import { isPrime, generatePrimesInRange, findNthPrime, primeFactorization } from '@/lib/prime-utils';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

const MAX_RANGE = 100000;
const MAX_N = 10000;
const MAX_FACTORIZE = 10000000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json({ error: 'Missing calculation type' }, { status: 400 });
    }

    let input = '';
    let result = '';
    let responseData: Record<string, unknown> = {};

    switch (type) {
      case 'check': {
        const { number } = body;
        if (number === undefined || number === null || number === '') {
          return NextResponse.json({ error: 'Missing number parameter' }, { status: 400 });
        }
        const num = parseInt(String(number), 10);
        if (isNaN(num) || num < 0 || !Number.isInteger(Number(number))) {
          return NextResponse.json({ error: 'Please provide a valid non-negative integer' }, { status: 400 });
        }
        if (num > MAX_FACTORIZE) {
          return NextResponse.json({ error: `Number must be at most ${MAX_FACTORIZE}` }, { status: 400 });
        }
        const prime = isPrime(num);
        input = String(num);
        result = String(prime);
        responseData = { number: num, isPrime: prime };
        break;
      }
      case 'generate': {
        const { start, end } = body;
        if (start === undefined || end === undefined) {
          return NextResponse.json({ error: 'Missing start or end parameter' }, { status: 400 });
        }
        const s = parseInt(String(start), 10);
        const e = parseInt(String(end), 10);
        if (isNaN(s) || isNaN(e) || s < 0 || e < 0 || !Number.isInteger(Number(start)) || !Number.isInteger(Number(end))) {
          return NextResponse.json({ error: 'Please provide valid non-negative integers for start and end' }, { status: 400 });
        }
        if (s > e) {
          return NextResponse.json({ error: 'Start must be less than or equal to end' }, { status: 400 });
        }
        if (e - s > MAX_RANGE) {
          return NextResponse.json({ error: `Range cannot exceed ${MAX_RANGE}` }, { status: 400 });
        }
        const primes = generatePrimesInRange(s, e);
        input = `${s} to ${e}`;
        result = JSON.stringify(primes);
        responseData = { start: s, end: e, primes, count: primes.length };
        break;
      }
      case 'nth': {
        const { n } = body;
        if (n === undefined || n === null || n === '') {
          return NextResponse.json({ error: 'Missing n parameter' }, { status: 400 });
        }
        const nNum = parseInt(String(n), 10);
        if (isNaN(nNum) || nNum < 1 || !Number.isInteger(Number(n))) {
          return NextResponse.json({ error: 'Please provide a valid positive integer for N' }, { status: 400 });
        }
        if (nNum > MAX_N) {
          return NextResponse.json({ error: `N must be at most ${MAX_N}` }, { status: 400 });
        }
        const nthPrime = findNthPrime(nNum);
        input = `N=${nNum}`;
        result = String(nthPrime);
        responseData = { n: nNum, prime: nthPrime };
        break;
      }
      case 'factorize': {
        const { number } = body;
        if (number === undefined || number === null || number === '') {
          return NextResponse.json({ error: 'Missing number parameter' }, { status: 400 });
        }
        const num = parseInt(String(number), 10);
        if (isNaN(num) || num < 2 || !Number.isInteger(Number(number))) {
          return NextResponse.json({ error: 'Please provide an integer >= 2 for factorization' }, { status: 400 });
        }
        if (num > MAX_FACTORIZE) {
          return NextResponse.json({ error: `Number must be at most ${MAX_FACTORIZE}` }, { status: 400 });
        }
        const factors = primeFactorization(num);
        input = String(num);
        result = JSON.stringify(factors);
        responseData = { number: num, factors };
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid calculation type' }, { status: 400 });
    }

    try {
      const ds = await getDataSource();
      const repo = ds.getRepository(Calculation);
      const calc = repo.create({ type, input, result });
      await repo.save(calc);
    } catch (dbError) {
      console.error('Database save error:', dbError);
    }

    return NextResponse.json({ success: true, type, ...responseData });
  } catch (error) {
    console.error('Prime API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
