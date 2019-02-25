# Pre Setup Notes

- I had to append values into the pgdump for locations table name column; some columns had missing data making it so that the entire table did not get loaded.
- I used Node JS + Express + Node Postgres instead of a python/django/flask setup in the interest of the 6 hour deadline.
- I used React to speed up development and use Material UI

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
    - Save the password as `postgres`
      - I realize this is very insecure, this is just for connection configuration.
  - Exit with: `\q`
- Index and Cluster the events and locations tables:
  - Events Table start_date and end_date Btree Index: 
    `CREATE INDEX start_end_time_btree
        ON public.events USING btree
        (start_date DESC NULLS LAST, end_date DESC NULLS LAST)
        TABLESPACE pg_default;`
    `ALTER TABLE public.events
        CLUSTER ON start_end_time_btree;`
    - If the primary order of traversal of events would be start_date and/or end_date of events, I’d strongly suggest creating a clustered btree index against start_date and/or end_date. The way I am doing the main event query, clustering it by this order negates the need for an `ORDER BY` and it can simply become a `LIMIT` and `OFFSET` query, as such: `SELECT * FROM events LIMIT n OFFSET (p-1)*n;` where n is number of items per page, and p is the page number
  - Locations Table Events ID Hash Index:
    `CREATE INDEX events_id_hash
        ON public.locations USING hash
        (event_id)
        TABLESPACE pg_default;`
    - The way I’ve implemented the main Events query, it makes sense to 
- Restore data from dump into created database: `psql recharge < data.pgdump`

## Install Node & NPM

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

## Post Notes

- I tried to build the main website with infinite scrolling and table virtualization, but my research showed that infinite scrolling is a bad UX pattern and I was having a lot of trouble doing the expandable table rows UI with a virtualized list, it kept bugging out a lot. In the interest of time, I didn’t performance manage the frontend too much. Hope that’s ok.
- I also could of used React Hooks/React-Redux, but I decided to keep it simple, mainly for time, and to avoid any unexpected behavior
- I simply made attendance a local state thing, so if you refresh a website after attending, it forgets that you attended that but it does handle the counts properly
- I did not have the time or desire to make it responsive; If there was a better way to lay out the data that somebody designed for me - or if this was a purely frontend assignment, I would’ve done that, potentially using cards instead of tables