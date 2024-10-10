interface TileCacheOptions<Item = unknown> {
  fetchTile: (key: string) => Promise<Item>;
  maxCache: number;
}

type TileCacheListener<T = unknown> = (item: T, error?: unknown) => void

interface TileCacheItem<T = unknown> {
  error?: string;
  item?: T;
  listeners?: TileCacheListener<T>[];
}

const defaultOptions: Partial<TileCacheOptions> = {
  maxCache: 10,
}

export class TileCache<Item = unknown> {
  private options: TileCacheOptions<Item>;
  private items: Record<string, TileCacheItem<Item | null>> = {};
  private lru: string[] = []; // order by [least recently used, ..., most recently used]

  constructor(options: TileCacheOptions<Item>) {
    this.options = { 
      ...defaultOptions,
      ...options, 
    };
  }

  private removeLeastRecentlyUsed() {
    let i = 0;
    while (i < this.lru.length && this.lru.length >= this.options.maxCache) {
      const key = this.lru[i];
      if (this.items[key].listeners) {
        i += 1;
        continue;
      }
      delete this.items[key];
      this.lru.splice(i, 1);
    }
  }

  private touchItem(key: string) {
    const tileIndex = this.lru.indexOf(key);
    if (tileIndex > -1) {
      this.lru.splice(tileIndex, 1);
      this.lru.push(key);
    }
  }

  private pushItem(key: string, item: TileCacheItem<Item | null>) {
    this.items[key] = item;
    this.lru.push(key);
  }

  private publish(key: string, item: Item | null, error?: unknown) {
    this.items[key].item = item;
    if (error) this.items[key].error = `${error}`;
    this.items[key].listeners?.forEach(listener => listener(item, error));
    delete this.items[key].listeners;
    this.removeLeastRecentlyUsed();
  }

  private subscribe(key: string, listener: TileCacheListener<Item | null>) {
    const cacheItem: TileCacheItem<Item | null> | undefined = this.items[key];
    if (cacheItem?.item !== undefined) {
      // Hit. Item resolved in cache
      this.touchItem(key);
      listener(cacheItem.item, cacheItem.error);
    } else if (cacheItem?.listeners) {
      // Hit. Item pending in cache
      this.touchItem(key);
      cacheItem.listeners.push(listener);
    } else {
      // Miss. Item not in cache
      this.pushItem(key, {
        listeners: [listener]
      });
      this.options.fetchTile(key)
        .then(value => this.publish(key, value))
        .catch(error => this.publish(key, null, error));
    }
  }

  async getTile(key: string): Promise<Item | null> {
    return new Promise((resolve, reject) => {
      this.subscribe(key, (item, error) => {
        if (error) return reject(error);
        resolve(item);
      });
    });
  }
}
