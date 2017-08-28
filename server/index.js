const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const MemoryDB = require('./MemoryDB.js');

const combineDateTime = (date, time) => {
  if (!(date instanceof moment)){
    date = moment(date);
  }
  if (!(time instanceof moment)){
    time = moment(time);
  }
  const combined = moment();

  combined.year(date.year());
  combined.month(date.month());
  combined.date(date.date()); // Date!...Date..!...Date....!
  combined.hour(time.hour());
  combined.minute(time.minute());

  return combined;
}


const db = new MemoryDB();
db.loadMemory();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/events/list', (req, res)=>{
  const results = db.get('events', []);
  res.json(results);
});

app.get('/events/:id', (req,res)=>{
  const results = db.find('events', { id: req.params.id });
  res.json(results[0] || null);
});

app.post('/events/new', (req, res)=>{
  const events = db.get('events', []);
  const id = events.length + 1;
  const startDateTime = combineDateTime(req.body.eventStartDate, req.body.eventStartTime).valueOf();
  const endDateTime = combineDateTime(req.body.eventEndDate, req.body.eventEndTime).valueOf();

  const additionalProps = {
    id,
    startDateTime,
    endDateTime,
  };
  const newEvent = Object.assign({}, req.body, additionalProps);

  db.set('events', events.concat([newEvent]));
  res.json({ status: 'success', id });
});

app.listen(process.env.PORT || 3333, function () {
  console.log(`Example app listening on port ${process.env.PORT || 3333}!`);
});
