const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

class MemoryDB {
  constructor(){
    this.store = {};
  }

  get(key, defaultTo){
    const val = this.store[key];
    return typeof val === 'undefined' ? defaultTo : val;
  }

  set(key, value){
    this.store[key] = value;
  }

  find(type, qualifiers){
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

    return found;
  }
}

const db = new MemoryDB();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/event/list', (req, res)=>{
  const results = db.get('events', []);
  res.json(results);
});

app.get('/event/:id', (req,res)=>{
  const results = db.find('events', { id: req.params.id });
  res.json(results);
});

app.post('/event/new', (req, res)=>{
  const events = db.get('events', []);
  const id = events.length + 1;

  const newEvent = Object.assign({}, req.body, { id });
  db.set('events', events.concat([newEvent]));
  res.json({ status: 'success', id });
});

app.listen(process.env.PORT || 3333, function () {
  console.log(`Example app listening on port ${process.env.PORT || 3333}!`);
});
