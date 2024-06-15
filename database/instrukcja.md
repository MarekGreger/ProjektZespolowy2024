Wymagane zainstalowanie i uruchomienie Dockera https://www.docker.com/products/docker-desktop/ oraz mysql client
	
### Instrukcja instalacji mysql client:
- Mac:
	-wpisz w terminalu "brew install mysql"
- Bill Gates:
	-pobierz i zainstaluj -pobierz i zainstaluj https://dev.mysql.com/downloads/workbench/
	-napraw PATH bo pewnie się nie wpisze "set path=%PATH%;C:\Program Files\MySQL\MySQL Shell 8.0\bin;" 	
		(wrzuciłem domyślną ścieżkę ale możecie mieć inną jak zmienicie w instalce)
		sprawdź czy działa wpisując "mysql" w cmd, jak pisze cokolwiek innego niż "mysql is not recognised as an internal or external 			
		command,operable program or batch" to jest git, jak nie to restart cmd/restart systemu/reinstall mysql/sprawdź czy nie masz innej 		
		instalki mysql zainstalowanej

notatki
1. domyślnie hasło root to: K0chamTesty
2. skrypt StartTestEnv uruchamia pierwsze 3 punkty automatycznie
3. w danej bazie istnieje tylko konto root

### Instrukcja instalacji emulatora serwisu uwierzytelniania:
1. -npm install -g firebase-tools
2. -firebase login --reauth
3. -firebase init

- wybrać nasz projekt
- wybrać tylko emulator

1. uruchomić " docker-compose up -d " w folderze database
2. budowanie bazy przez "mysql -hlocalhost -pK0chamTesty -u root < create_database.sql	(też w tym folderze)
3. ogólnie wrzucanie skryptów na serwer przez: "mysql -hlocalhost -pK0chamTesty -u root < "nazwa pliku albo sciezka"	(też w tym folderze)
4. łączenie i praca przez kod na ip 127.0.0.1 lub localhost , albo przez cmd dalej: "mysql -hlocalhost -pK0chamTesty -u root db_main"
