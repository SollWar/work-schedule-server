-- create
CREATE TABLE workers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  access_id INTEGER NOT NULL
);

CREATE TABLE workplaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE workers_telegram_auth (
  worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  telegram_id TEXT NOT NULL,
  PRIMARY KEY (worker_id, telegram_id)
);

CREATE TABLE workers_schedules (
  worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  schedule TEXT NOT NULL,
  PRIMARY KEY (worker_id, year, month)
);

CREATE TABLE workers_workplaces (
  worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  workplace_id TEXT NOT NULL REFERENCES workplaces(id) ON DELETE CASCADE,
  editable INTEGER NOT NULL,
  PRIMARY KEY (worker_id, workplace_id)
);

CREATE TABLE requests (
  telegram_id TEXT PRIMARY KEY,
  worker_name TEXT NOT NULL,
  workplace_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);


-- insert
INSERT INTO workers VALUES ('C468ImhehUC6', 'Никита', '#4CAF50', '1');

INSERT INTO workers_telegram_auth VALUES ('C468ImhehUC6','924296919');
