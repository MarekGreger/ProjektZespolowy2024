@echo off

docker-compose up -d
start firebase emulators:start --only auth

timeout 10

set PASSWORD=K0chamTesty

mysql -hlocalhost -p%PASSWORD% -u root < create_database.sql
mysql -hlocalhost -p%PASSWORD% -u root < insert_test_data.sql
pause