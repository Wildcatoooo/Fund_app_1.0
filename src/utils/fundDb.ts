export interface LocalFund {
  code: string;
  pinyin: string;
  name: string;
  type: string;
  pinyinFull: string;
}

const DB_NAME = 'FundDatabase';
const STORE_NAME = 'funds';
const METADATA_STORE = 'metadata';

export const initFundDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'code' });
      }
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
      }
    };
  });
};

export const updateFundDb = async () => {
  try {
    const db = await initFundDb();
    
    // Check last update time
    const lastUpdate = await new Promise<number>((resolve) => {
      const tx = db.transaction(METADATA_STORE, 'readonly');
      const store = tx.objectStore(METADATA_STORE);
      const req = store.get('lastUpdate');
      req.onsuccess = () => resolve(req.result?.value || 0);
      req.onerror = () => resolve(0);
    });

    const now = Date.now();
    // Update once a day
    if (now - lastUpdate < 24 * 60 * 60 * 1000) {
      return;
    }

    const response = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('http://fund.eastmoney.com/js/fundcode_search.js'));
    const text = await response.text();
    
    // Parse var r = [[...],...];
    const match = text.match(/var r = (\[.*\]);/);
    if (match && match[1]) {
      const data: string[][] = JSON.parse(match[1]);
      
      const tx = db.transaction([STORE_NAME, METADATA_STORE], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      // Clear existing
      store.clear();
      
      for (const item of data) {
        if (item.length >= 5) {
          store.put({
            code: item[0],
            pinyin: item[1],
            name: item[2],
            type: item[3],
            pinyinFull: item[4]
          });
        }
      }
      
      const metaStore = tx.objectStore(METADATA_STORE);
      metaStore.put({ key: 'lastUpdate', value: now });
      
      return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (error) {
    console.error('Failed to update local fund DB:', error);
  }
};

export const searchLocalFunds = async (query: string): Promise<LocalFund[]> => {
  try {
    const db = await initFundDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const allFunds: LocalFund[] = request.result;
        const results = allFunds.filter(f => 
          f.code.includes(query) || 
          f.name.includes(query) || 
          f.pinyin.includes(query.toUpperCase())
        ).slice(0, 50); // Return top 50 matches
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
};

export const getAllLocalFunds = async (): Promise<LocalFund[]> => {
  try {
    const db = await initFundDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
};
