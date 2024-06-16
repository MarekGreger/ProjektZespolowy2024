-- Edytowanie klienta o podanym id
UPDATE Klient
SET Adres = {adres} 
    Email = {email}
    Nazwa = {nazwa}
    NIP = {nip}
    Telefon = {telefon} 
WHERE IdKlient = {idKlient};


-- Edytowanie modelu o podanym id
UPDATE Model
SET Marka = {marka} 
    Model = {model}
WHERE IdModel = {idModel};


-- Edytowanie auta o podanym id
UPDATE Auto
SET Model_IdModel = {idModel} 
    Klient_IdKlient = {idKlient}
    Rejestracja = {rejestracja}
    Czas_rozpoczecia = {czasRozpoczecia}
    Czas_zakonczenia = {czasZakonczenia}
    Dodatkowe_informacje = {dodatkoweInformacje} 
WHERE IdAuto = {idAuto};


-- Edytowanie pracownika o podanym id
UPDATE Pracownik
SET Imie = {imie} 
    Nazwisko = {nazwisko}
    Telefon = {telefon}
    Email = {email}
WHERE IdPracownik = {idPracownik};


-- Edytowanie uslugi o podanym id
UPDATE Usluga
SET Nazwa = {nazwa} 
    Opis = {opis}
WHERE IdUsluga = {idUsluga};


-- Edytowanie grafiku o podanym id
UPDATE Grafik
SET Pracownik_IdPracownik = {idPracownik} 
    Klient_IdKlient = {idKlient}
    Czas_rozpoczecia = {czasRozpoczecia}
    Czas_zakonczenia = {czasZakonczenia}
    Status = {status}
WHERE IdGrafik = {idGrafik};


-- Edytowanie umowy o podanym id
UPDATE Umowa
SET Klient_IdKlient = {idKlient} 
    Data_rozpoczecia = {dataRozpoczecia}
    Data_zakonczenia = {dataZakonczenia}
WHERE IdUmowa = {idUmowa};


-- Edytowanie wersji umowy o podanym id umowy oraz id uslugi
UPDATE Wersja_umowy
SET Cena = {cena}
WHERE Usluga_IdUsluga = {idUsluga} AND Umowa_IdUmowa = {idUmowa};


--Edytowanie zgloszenia o podanym id
UPDATE Zgloszenie
SET Pracownik_IdPracownik = {idPracownik}
    Klient_IdKlient = {idKlient}
    Opis = {opis}
    Status = {status}
WHERE IdZgloszenie = {idZgloszenie};