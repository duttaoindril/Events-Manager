# Events Manager

---

## Pre Setup Notes

- I used Node JS + Express + Node Postgres instead of a python/django/flask setup in the interest of the 6 hour deadline, and React to speed up development and use Material UI
  - Sadly, vagrant made it very difficult to do hot code reloading, slowing down development time considerably.
- I had to append values into the pgdump for locations table name column; some columns had missing data making it so that the entire table did not get loaded. I also used clustering as means for sorting the data, so  for best results, please cluster. I also assumed primary key id as the unique value to do everything by, since there was no seperate events_id / guid in the events table.

# Setup

---

## Setup Environment

- `vagrant up`
- `vagrant ssh`

## Setup Database

- Check PSQL exists: `psql --version`
- Enter PSQL Console: `psql`
  - Create database with template to allow for dump restore: `CREATE DATABASE recharge WITH TEMPLATE = template0;`
  - Set a password for the vagrant superuser: `\password vagrant`
  - Save the password as `postgres`; I realize this is very insecure, this is just for server connection configuration.
  - Exit with: `\q`
- Restore data from dump into created database: `psql recharge < data.pgdump`
- Index and Cluster the events and locations tables:
- Events Table start_date and end_date Btree Index: 
    `CREATE INDEX start_end_time_btree
        ON public.events USING btree
        (start_date DESC NULLS LAST, end_date DESC NULLS LAST)
        TABLESPACE pg_default;`
    `ALTER TABLE public.events
        CLUSTER ON start_end_time_btree;`
  - If the primary order of traversal of events would be start_date and/or end_date of events, I’d strongly suggest creating a clustered btree index on start_date and/or end_date. The way I am doing the main event query, clustering it orders rows once and negates the need for an `ORDER BY` in every subsequent query, and it can simply become a paginated `LIMIT` and `OFFSET` query, as such: `SELECT * FROM events LIMIT n OFFSET (p-1)*n;` where n is number of items per page, and p is the page number.
  - Locations Table Events ID Hash Index:
    `CREATE INDEX events_id_hash
        ON public.locations USING hash
        (event_id)
        TABLESPACE pg_default;`
  - The way I’ve implemented the main Events query, it makes sense to query the location separately per event, and to speed that up indexing by event_id makes a lot of sense.

## Install Node & NPM on Vagrant

- Due diligence: `sudo apt-get update`
- Install compiler: `sudo apt-get install -y g++`
- Get desired Node version here: https://github.com/nodesource/distributions/blob/master/README.md
- I used 11.10.0, so run the following: `curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -`
- Install node.js and npm: `sudo apt-get install -y nodejs`
- Check installs: `node -v && npm -v`

I do realize there are much better ways of doing this, such as putting this installation in the Vagrantfile itself, or installing nvm, or installing nvm through the Vagrantfile. But in the interest of not mutating the original files, I decided to opt for simply installing node.

## Install Node Dependencies

- `Package.json` should be in the zip
- If so, run  `npm install`

## Start the Server

- Builds the static website and serves it with the server API backend server: `npm start`

## Post Setup Notes

- I tried to build the main website with infinite scrolling and table virtualization, but my research showed that infinite scrolling is a bad UX pattern and I was having a lot of trouble doing the expandable table rows UI with a virtualized list, it kept bugging out a lot. In the interest of time, I didn’t performance manage the frontend too much. Hope that’s ok. (Easy route would be to do pagination using a table object like this: https://material-ui.com/demos/tables/#sorting-amp-selecting)
- I also could of used React Hooks/React-Redux, but I decided to keep it simple, mainly for time.
- I simply made attendance a local state data, so if you refresh a website after attending, it forgets that you attended that but it does handle the counts properly; I could've implemented local storage that gets hydrated when refreshed for attendance, but it didn't seem necessary
- I did not have the time or desire to make the frontend responsive; If there was a better way to lay out the data that somebody designed for me, or if this was a purely frontend assignment, I would’ve done that, potentially using cards instead of tables to represent events (https://material-ui.com/demos/cards/)
- I made the attendance handler event a GET; I know that's not RESTful and I would never do that in production, I know there's tons of reasons why, but I just did for the sake of time. (For the client side of things)
