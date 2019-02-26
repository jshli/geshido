CREATE DATABASE geshido;

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(6000),
    user_id INTEGER,
    completed BOOLEAN,
    project_id INTEGER
);


CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(600),
    max_hours INTEGER,
    user_id INTEGER
);

CREATE TABLE timers (
    id SERIAL PRIMARY KEY,
    task_id INTEGER,
    start_time VARCHAR(600),
    end_time VARCHAR(600)
);


CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(600),
    max_hours INTEGER,
    user_id INTEGER
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    first_name VARCHAR(600),
    last_name VARCHAR(600),
    email VARCHAR(600),
    password_digest VARCHAR(600)
);