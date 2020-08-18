/*
Copyright 2016, Jake Archibald

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Modified by Markus Walther.
*/

class Store {
  constructor(dbName = 'keyval-store', storeName = 'keyval') {
    this.storeName = storeName;
    this._dbp = new Promise((resolve, reject) => {
      const openreq = indexedDB.open(dbName, 1);
      openreq.onerror = () => reject(openreq.error);
      openreq.onsuccess = () => resolve(openreq.result);
      // First time setup: create an empty object store
      openreq.onupgradeneeded = () => {
        openreq.result.createObjectStore(storeName);
      };
    });
  }

  _withIDBStore(type, callback) {
    return this._dbp.then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, type);
          transaction.oncomplete = () => resolve();
          transaction.onabort = transaction.onerror = () =>
            reject(transaction.error);
          callback(transaction.objectStore(this.storeName));
        })
    );
  }
}

let store;

function getDefaultStore() {
  if (!store) store = new Store();
  return store;
}

export function get(key, store = getDefaultStore()) {
  let req;
  return store
    ._withIDBStore('readonly', (store) => {
      req = store.get(key);
    })
    .then(() => req.result);
}

export function set(key, value, store = getDefaultStore()) {
  return store._withIDBStore('readwrite', (store) => {
    store.put(value, key);
  });
}

export function del(key, store = getDefaultStore()) {
  return store._withIDBStore('readwrite', (store) => {
    store.delete(key);
  });
}

export function clear(store = getDefaultStore()) {
  return store._withIDBStore('readwrite', (store) => {
    store.clear();
  });
}

export function keys(store = getDefaultStore(), prefix = '') {
  // cf. https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/, section startsWith(str)!
  const keyRangeValue = IDBKeyRange.bound(
    prefix,
    prefix + '\uffff',
    false,
    false
  );
  const keys = [];
  return store
    ._withIDBStore('readonly', (store) => {
      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // And openKeyCursor isn't supported by Safari.
      (store.openKeyCursor || store.openCursor).call(
        store,
        keyRangeValue
      ).onsuccess = function () {
        if (!this.result) return;
        const key = this.result.key;
        keys.push(key);
        this.result.continue();
      };
    })
    .then(() => keys);
}

export const capacity = async (inPercent) => {
  const info = await window.navigator.storage.estimate();

  const {
    quota,
    usage,
    usageDetails: { indexedDB },
  } = info;
  return inPercent ? (100 * (indexedDB / quota)).toFixed(2) + ' %' : info;
};
