import { TileCache } from '../cache';

let fetchTileMock: jest.Mock;
const DELAY = 1000;

beforeEach(() => {
  jest.useFakeTimers();
  fetchTileMock = jest.fn(async (key: string) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(`fetched ${key}`), DELAY)
    });
  });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

test('should initialize', () => {
  const cache = new TileCache<string | null>({ 
    maxCache: 2, 
    fetchTile: () => Promise.resolve(null)
  });
  expect(cache).toBeTruthy();
});

test('should cache fetched items', async () => {
  const cache = new TileCache<string | null>({ 
    maxCache: 2, 
    fetchTile: fetchTileMock
  });

  const reqPromise0 = cache.getTile('key-0');
  jest.runOnlyPendingTimers();
  await expect(reqPromise0).resolves.toBe('fetched key-0');

  const reqPromise1 = cache.getTile('key-0');
  jest.runOnlyPendingTimers();
  await expect(reqPromise1).resolves.toBe('fetched key-0');

  expect(fetchTileMock).toHaveBeenCalledTimes(1);
});

test('should remove old cached items when max cache size reached', async () => {
  const cache = new TileCache<string | null>({ 
    maxCache: 2, 
    fetchTile: fetchTileMock
  });

  const reqPromise0 = cache.getTile('key-0');
  jest.runOnlyPendingTimers();
  await expect(reqPromise0).resolves.toBe('fetched key-0');

  const reqPromise1 = cache.getTile('key-1');
  jest.runOnlyPendingTimers();
  await expect(reqPromise1).resolves.toBe('fetched key-1');

  // removes tileKey0 from cache
  const reqPromise2 = cache.getTile('key-2'); 
  jest.runOnlyPendingTimers();
  await expect(reqPromise2).resolves.toBe('fetched key-2');

  // fetched again
  const reqPromise3 = cache.getTile('key-0'); 
  jest.runOnlyPendingTimers();
  await expect(reqPromise3).resolves.toBe('fetched key-0');

  expect(fetchTileMock).toHaveBeenCalledTimes(4);
  expect(fetchTileMock).toHaveBeenNthCalledWith(1, 'key-0');
  expect(fetchTileMock).toHaveBeenNthCalledWith(2, 'key-1');
  expect(fetchTileMock).toHaveBeenNthCalledWith(3, 'key-2');
  expect(fetchTileMock).toHaveBeenNthCalledWith(4, 'key-0');
});

test('should dedupe concurrent inflight requests', async () => {
  const cache = new TileCache<string | null>({ 
    maxCache: 2, 
    fetchTile: fetchTileMock
  });

  const reqPromise0 = cache.getTile('key-0');
  const reqPromise1 = cache.getTile('key-0');
  jest.runOnlyPendingTimers();

  await expect(reqPromise0).resolves.toBe('fetched key-0');
  await expect(reqPromise1).resolves.toBe('fetched key-0');
  expect(fetchTileMock).toHaveBeenCalledTimes(1);
});

test('should handle errors when fetching tile', async () => {
  const errorMessage = 'Test fetch tile error';
  const cache = new TileCache<string | null>({ 
    maxCache: 2, 
    fetchTile: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error(errorMessage));
        }, 1000);
      })
    }
  });

  const reqPromise = cache.getTile('key-0');
  jest.runOnlyPendingTimers();
  await expect(reqPromise).rejects.toThrow(errorMessage);
});