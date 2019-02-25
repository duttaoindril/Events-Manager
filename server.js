const port = 5000;
const cors = require('cors');
const path = require('path');
const express = require('express');
const pgp = require('pg-promise')();
const app = express();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'recharge',
  user: 'vagrant',
  password: 'postgres'
});
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'build')));

let totalRows = 0;

db.one('SELECT COUNT(id) AS count FROM events').then(data => {
  totalRows = data.count;
  totalRows &&
    app.listen(port, () => {
      console.log(
        `Server listening on port ${port} with ${totalRows} events in DB!`
      );
    });
});

app.get('/events', async (req, res) => {
  let {
    query: { limit = 10, page = 1 }
  } = req;
  limit = Math.max(Math.min(50, limit), 10);
  const maxPages = ((totalRows / limit) | 0) + 1;
  page = Math.max(Math.min(maxPages, page), 1);
  const rows = await db.any('SELECT * FROM events LIMIT $1 OFFSET $2', [
    limit,
    (page - 1) * limit
  ]);
  res.send({
    maxPages: maxPages,
    limit: limit,
    page: page,
    data: rows
  });
});

app.get('/events/:event_id', async (req, res) => {
  const {
    params: { event_id: eventId }
  } = req;
  if (isNaN(parseInt(eventId))) {
    res.send({ event_id: 'Invalid Event ID' });
    return;
  } else {
    const row = await db.oneOrNone(
      'SELECT * FROM events WHERE id = $1 LIMIT 1',
      eventId
    );
    res.send({ data: row });
  }
});

app.get('/locations/:event_id', async (req, res) => {
  const {
    params: { event_id: eventId }
  } = req;
  if (isNaN(parseInt(eventId))) {
    res.send({ event_id: 'Invalid Event ID' });
    return;
  } else {
    const row = await db.oneOrNone(
      'SELECT * FROM locations WHERE locations.event_id = $1 LIMIT 1',
      eventId
    );
    res.send({ data: row });
  }
});

app.get('/events/attend/:event_id', async (req, res) => {
  const {
    params: { event_id: eventId }
  } = req;
  if (isNaN(parseInt(eventId))) {
    res.send({ event_id: 'Invalid Event ID' });
    return;
  } else {
    const countBefore = await db.one(
      'SELECT participant_count FROM events where id = $1',
      eventId
    );
    db.tx('update-user', async t => {
      await t.any(
        'UPDATE events SET participant_count = participant_count+1 WHERE id = $1 AND (SELECT spaces_remaining FROM locations WHERE event_id = $1) IS TRUE',
        eventId
      );
      await t.any(
        'UPDATE locations SET number_spaces_remaining = number_spaces_remaining-1 WHERE event_id = $1 AND number_spaces_remaining IS NOT NULL AND number_spaces_remaining > 0',
        eventId
      );
      await t.any(
        'UPDATE locations SET spaces_remaining = (SELECT (CASE WHEN number_spaces_remaining = 0 THEN FALSE ELSE TRUE END) FROM locations WHERE event_id = $1) WHERE event_id = $1 AND number_spaces_remaining IS NOT NULL',
        eventId
      );
    })
      .then(async data => {
        const countAfter = await db.one(
          'SELECT participant_count FROM events where id = $1',
          eventId
        );
        res.send({
          success: `Participant Count: ${countBefore.participant_count} -> ${
            countAfter.participant_count
          }`
        });
      })
      .catch(error => {
        res.send({
          failure: error
        });
      });
  }
});
