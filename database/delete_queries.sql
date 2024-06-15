-- Usuwanie klienta o podanym id
DELETE FROM Klient
WHERE IdKlient = {idKlient};


-- Usuwanie modelu o podanym id
DELETE FROM Model
WHERE IdModel = {idModel};


-- Usuwanie auta o podanym id
DELETE FROM Auto
WHERE IdAuto = {idAuto};


-- Usuwanie pracownika o podanym id
DELETE FROM Pracownik
WHERE IdPracownik = {idPracownik};


-- Usuwanie przypisania pracownika do auta
DELETE FROM Auto_Pracownik
WHERE Pracownik_IdPracownik = {idPracownik} AND Auto_IdAuto = {idAuto};


-- Usuwanie uslugi o podanym id
DELETE FROM Usluga
WHERE IdUsluga = {idUsluga};


-- Usuwanie przypisania uslugi do auta
DELETE FROM Auto_Usluga
WHERE Usluga_IdUsluga = {idUsluga} AND Auto_IdAuto = {idAuto};


-- Usuwanie grafiku o podanym id
DELETE FROM Grafik
WHERE IdGrafik = {idGrafik};


-- Usuwanie umowy o podanym id
DELETE FROM Umowa
WHERE IdUmowa = {idUmowa};


-- Usuwanie wersji umowy o podanym id umowy oraz id uslugi
DELETE FROM Wersja_umowy
WHERE Usluga_IdUsluga = {idUsluga} AND Umowa_IdUmowa = {idUmowa};


-- Usuwanie zgloszenia o podanym id
DELETE FROM Zgloszenie
WHERE IdZgloszenie = {idZgloszenie};