-- Dodanie klienta
INSERT INTO db_main.Klient (Adres, Email, Nazwa, NIP, Telefon)
VALUES ('{adres}', '{email}', '{nazwa}', '{nip}', '{telefon}');


-- Dodanie modelu
INSERT INTO db_main.Model (Marka, Model)
VALUES ('{marka}', '{model}');


-- Dodanie auta
INSERT INTO db_main.Auto (Model_IdModel, Klient_IdKlient, Rejestracja, Czas_rozpoczecia, Czas_zakonczenia, Dodatkowe_informacje)
VALUES ({id_model}, {id_klient}, '{rejestracja}', CURRENT_DATE(), '{czas_zakonczenia}');


-- Dodanie pracownika
INSERT INTO db_main.Pracownik (Email, Imie, Nazwisko, Telefon)
VALUES ('{email}', '{imie}', '{nazwisko}', '{telefon}');


-- Dodanie pracownika do auta
INSERT INTO db_main.Auto_Pracownik (Pracownik_IdPracownik, Auto_IdAuto)
VALUES ({id_pracownika}, {id_auta});


-- Dodanie usługi
INSERT INTO db_main.Usluga (Opis, Nazwa)
VALUES ('{opis}', '{nazwa}');


-- Dodanie auta do usługi
INSERT INTO db_main.Auto_Usluga (Auto_IdAuto, Usluga_IdUsluga)
VALUES ({id_auta}, {id_uslugi});


-- Dodanie grafiku
INSERT INTO db_main.Grafik (Pracownik_IdPracownik, Klient_IdKlient, Czas_rozpoczecia, Czas_zakonczenia, Status)
VALUES ({id_pracownika}, {id_klienta}, '{czas_rozpoczecia}', '{czas_zakonczenia}', '{status}');


-- Dodanie umowy
INSERT INTO db_main.Umowa (Klient_IdKlient, Data_rozpoczecia, Data_zakonczenia)
VALUES ({id_klienta}, '{data_rozpoczecia}', '{data_zakonczenia}');


-- Dodanie wersji umowy
INSERT INTO db_main.Wersja_umowy (Umowa_IdUmowa, Usluga_IdUsluga, Cena)
VALUES ({id_umowy}, {id_uslugi}, {cena});


-- Dodanie zgłoszenia
INSERT INTO db_main.Zgloszenie (Klient_IdKlient, Pracownik_IdPracownik, Opis, Status)
VALUES ({id_klienta}, {id_pracownika}, '{opis}', '{status}');