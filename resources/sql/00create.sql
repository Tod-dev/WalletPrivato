CREATE ROLE marco WITH LOGIN PASSWORD 'root';
ALTER ROLE marco CREATEDB;

-- psql -d postgres -U marco
CREATE DATABASE IF NOT EXISTS walletPrivato;

--connection su dbeaver
