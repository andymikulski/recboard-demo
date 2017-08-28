const jsonfile = require('jsonfile');
const path = require('path');

const DB_PATH = path.resolve(__dirname, './db.json');

class MemoryDB {
  constructor(){
    this.store = {};
  }

  loadMemory(){
    jsonfile.readFile(DB_PATH, (err, obj)=>{
      if (!err && obj) {
        this.store = Object.assign(obj);
      }
    });
  }

  saveMemory() {
    if(this.saveTimer){
      clearTimeout(this.saveTimer);
    }
    this.saveTimer = setTimeout(()=>{
      jsonfile.writeFile(DB_PATH, this.store);
    }, 200);
  }

  get(key, defaultTo){
    const val = this.store[key];
    return typeof val === 'undefined' ? defaultTo : val;
  }

  set(key, value){
    this.store[key] = value;
    this.saveMemory();
  }

  find(type, qualifiers, defaultTo){
    const found = [];
    const store = this.store[type] || [];
    store.forEach((item)=>{
      let passes = true;

      for(const qual in qualifiers) {
        if(typeof qualifiers[qual] === 'function'){
          passes = qualifiers[qual](item[qual]);
        } else if(typeof item[qual] === 'string') {
          passes = item[qual].indexOf(qualifiers[qual]) > -1;
        } else {
          passes = item[qual] == qualifiers[qual];
        }
      }

      if(passes){
        found.push(item);
      }
    });

    return typeof found === 'undefined' ? defaultTo : found;
  }
}

module.exports = MemoryDB;
