#!/bin/bash

# Start Docker Compose
docker-compose up -d

# Set password variable
PASSWORD="K0chamTesty"

# Import SQL scripts into MySQL
mysql -h 127.0.0.1 -p$PASSWORD -u root < create_database.sql
mysql -h 127.0.0.1 -p$PASSWORD -u root < insert_test_data.sql

# pause-like behavior
read -p "Press [Enter] key to continue..."

