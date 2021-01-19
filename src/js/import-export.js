import { get, set, keys } from './indexed-db.js';
import fireEvent from './custom-event.js';

// constants
const eventTarget = e => (e.path || (e.composedPath && e.composedPath()))[0];

const saveAsFile = (fileName, text, type = 'application/json') =>
  new Promise(resolve => {
    try {
      const file = new Blob([text], { type });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      link.onclick = () =>
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          resolve(true);
        }, 0);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      resolve(false);
    }
  });

const readFile = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  });

const exportToJSONFile = async event => {
  try {
    // initialize
    const all = {};
    // get all keys (of type String) from indexedDB
    const allKeys = await keys();
    // for every key...
    for (let key of allKeys) {
      // get its value
      all[key] = await get(key);
    }
    // construct overall JSON
    const allJSON = JSON.stringify(all, null, '\t');
    // save it
    const ok = await saveAsFile(
      `AXA-Time-Tracker-Backup-${new Date().toISOString()}.json`,
      allJSON
    );
    if (!ok) {
      throw Error('Datei konnte nicht geschrieben werden');
    }
    fireEvent('success', 'exported', eventTarget(event));
    // alert on any errors (e.g. indexedDB full, JSON serialization failure)
  } catch (e) {
    alert(`JSON-Export des AXA Time Trackers fehlgeschlagen ('${e}').`);
  }
};

const importFromJSONFile = async event => {
  try {
    // initialize
    const {
      target: { files },
      target,
    } = event;
    const file = files && files[0];
    if (!file) return; // should never happen
    const { name, size, type } = file;
    // sanity checks
    if (!/^AXA\-Time\-Tracker\-Backup\-.*\.json$/.test(name)) {
      throw Error('Falscher Dateiname');
    }
    if (size < 1) {
      throw Error('Leere Datei');
    }
    if (type !== 'application/json') {
      throw Error('Falscher Dateityp');
    }
    // read file asynchronously
    const allJSON = await readFile(file);
    // parse it into a plain JS object
    const all = JSON.parse(allJSON);
    // insert all keys and their values into indexedDB
    for (let key in all) {
      await set(key, all[key]);
    }
    fireEvent('success', 'imported', eventTarget(event));
    // reset input
    target.value = '';
    // alert on any errors (e.g. indexedDB full, JSON parse failure)
  } catch (e) {
    alert(`JSON-Import des AXA Time Trackers fehlgeschlagen ('${e}').`);
  }
};

export { exportToJSONFile, importFromJSONFile, eventTarget };
