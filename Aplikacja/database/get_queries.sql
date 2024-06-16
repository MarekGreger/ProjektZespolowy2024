-- Zgłoszenia
-- Pobieranie wszystkich zgłoszeń
SELECT Z.IdZgloszenie,
    Z.Klient_IdKlient,
    Z.Pracownik_IdPracownik, 
    P.Imie, 
    P.Nazwisko,
    K.Nazwa,
    Z.Opis,
    Z.Status
FROM db_main.Zgloszenie Z LEFT JOIN db_main.Klient K ON Z.Klient_IdKlient = K.IdKlient
    LEFT JOIN db_main.Pracownik P ON Z.Pracownik_IdPracownik = P.IdPracownik;


-- Grafiki
-- Pobranie grafików dla wszystkich pracowników
SELECT G.IdGrafik,
    G.Pracownik_IdPracownik,
    G.Klient_IdKlient,
    P.Imie, 
    P.Nazwisko,
    K.Nazwa,
    G.Czas_rozpoczecia,
    G.Czas_zakonczenia,
    G.Status
FROM db_main.Grafik G LEFT JOIN db_main.Pracownik P ON G.Pracownik_IdPracownik = P.IdPracownik
    LEFT JOIN db_main.Klient K ON G.Klient_IdKlient = K.IdKlient;

-- Pobranie grafików dla konkretnego pracownika
SELECT G.IdGrafik,
    G.Pracownik_IdPracownik,
    G.Klient_IdKlient,
    P.Imie, 
    P.Nazwisko,
    K.Nazwa,
    G.Czas_rozpoczecia,
    G.Czas_zakonczenia,
    G.Status
FROM db_main.Grafik G LEFT JOIN db_main.Pracownik P ON G.Pracownik_IdPracownik = P.IdPracownik
    LEFT JOIN db_main.Klient K ON G.Klient_IdKlient = K.IdKlient
WHERE
    G.Pracownik_IdPracownik = {id_pracownika};

-- Pobranie grafików dla konkretnego klienta
SELECT G.IdGrafik,
    G.Pracownik_IdPracownik,
    G.Klient_IdKlient,
    P.Imie, 
    P.Nazwisko,
    K.Nazwa,
    G.Czas_rozpoczecia,
    G.Czas_zakonczenia,
    G.Status
FROM db_main.Grafik G LEFT JOIN db_main.Pracownik P ON G.Pracownik_IdPracownik = P.IdPracownik
    LEFT JOIN db_main.Klient K ON G.Klient_IdKlient = K.IdKlient
WHERE
    G.Klient_IdKlient = {id_klienta};


-- Umowy 
-- Pobranie umów dla wszystkich klientów
SELECT U.IdUmowa,
    U.Klient_IdKlient,
    K.Nazwa_klienta,
    U.Data_rozpoczecia,
    U.Data_zakonczenia
FROM db_main.Umowa U LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient;

-- Pobranie umów dla konkretnego klienta
SELECT U.IdUmowa,
    U.Klient_IdKlient, 
    K.Nazwa,
    U.Data_rozpoczecia,
    U.Data_zakonczenia
FROM db_main.Umowa U LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient
WHERE
    U.Klient_IdKlient = {id_klienta};

-- Pobranie szczegółów dla konkretnej umowy (wyświetlenie cen usług)
SELECT U.IdUmowa,
    U.Klient_IdKlient,
    UU.IdUsluga,
    K.Nazwa_klienta,
    UU.Nazwa_uslugi,
    WU.Cena,
    U.Data_rozpoczecia,
    U.Data_zakonczenia
FROM db_main.Umowa U LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient
    JOIN db_main.Wersja_umowy WU ON U.IdUmowa = WU.Umowa_IdUmowa
    LEFT JOIN db_main.Usluga UU ON WU.Usluga_IdUsluga = UU.IdUsluga
WHERE
    U.IdUmowa = {id_umowy};


-- Klienci
-- Pobranie danych klientów
SELECT K.IdKlient,
    K.Nazwa_klienta,
    K.NIP,
    K.Adres,
    K.Telefon,
    K.Email
FROM db_main.Klient K;


-- Pracownicy
-- Pobranie danych pracowników
SELECT P.IdPracownik,
    P.Imie,
    P.Nazwisko,
    P.Telefon,
    P.Email
FROM db_main.Pracownik P;


-- Modele
-- Pobranie danych modeli
SELECT M.IdModel,
    M.Marka,
    M.Model
FROM db_main.Model M;


-- Auta
-- Pobranie danych aut
WITH A AS (
    SELECT A.IdAuto AS IdAuto,
        A.Klient_IdKlient AS IdKlient,
        A.Model_IdModel AS IdModel,
        A.Rejestracja AS Rejestracja,
        M.Marka AS Marka, 
        M.Model AS Model,
        A.Czas_rozpoczecia AS Czas_rozpoczecia,
        A.Czas_zakonczenia AS Czas_zakonczenia,
        K.Nazwa AS Klient_nazwa,
        GROUP_CONCAT(P.Imie, ' ', P.Nazwisko SEPARATOR ', ') AS Pracownicy,
        A.Dodatkowe_informacje AS Dodatkowe_informacje
    FROM db_main.Auto A LEFT JOIN db_main.Klient K ON A.Klient_IdKlient = K.IdKlient
        LEFT JOIN db_main.Model M ON A.Model_IdModel = M.IdModel
        LEFT JOIN db_main.Auto_Pracownik AP ON A.IdAuto = AP.Auto_IdAuto
        LEFT JOIN db_main.Pracownik P ON AP.Pracownik_IdPracownik = P.IdPracownik
    GROUP BY A.IdAuto, A.Klient_IdKlient
)
SELECT DISTINCT A.IdAuto,
    A.IdKlient,
    A.IdModel,
    A.Rejestracja,
    A.Marka, 
    A.Model,
    A.Czas_rozpoczecia,
    IFNULL(A.Czas_zakonczenia, 'W trakcie') AS Czas_zakonczenia,
    A.Klient_nazwa,
    A.Pracownicy,
    A.Dodatkowe_informacje,
    GROUP_CONCAT(U.Nazwa SEPARATOR ', ') AS Uslugi
FROM A
    LEFT JOIN db_main.Auto_Usluga AU ON A.IdAuto = AU.Auto_IdAuto
    LEFT JOIN db_main.Usluga U ON AU.Usluga_IdUsluga = U.IdUsluga
GROUP BY
    A.IdAuto, A.IdKlient;

-- Pobieranie wszystkich aut wersja z ceną
WITH A AS (
    SELECT A.IdAuto AS IdAuto,
        A.Klient_IdKlient AS IdKlient,
        A.Model_IdModel AS IdModel,
        A.Rejestracja AS Rejestracja,
        M.Marka AS Marka, 
        M.Model AS Model,
        A.Czas_rozpoczecia AS Czas_rozpoczecia,
        A.Czas_zakonczenia AS Czas_zakonczenia,
        K.Nazwa AS Klient_nazwa,
        GROUP_CONCAT(P.Imie, ' ', P.Nazwisko SEPARATOR ', ') AS Pracownicy,
        A.Dodatkowe_informacje AS Dodatkowe_informacje
    FROM db_main.Auto A LEFT JOIN db_main.Klient K ON A.Klient_IdKlient = K.IdKlient
        LEFT JOIN db_main.Model M ON A.Model_IdModel = M.IdModel
        LEFT JOIN db_main.Auto_Pracownik AP ON A.IdAuto = AP.Auto_IdAuto
        LEFT JOIN db_main.Pracownik P ON AP.Pracownik_IdPracownik = P.IdPracownik
    GROUP BY A.IdAuto, A.Klient_IdKlient
)
SELECT DISTINCT A.IdAuto,
    A.IdKlient,
    A.IdModel,
    A.Rejestracja,
    A.Marka, 
    A.Model,
    A.Czas_rozpoczecia,
    IFNULL(A.Czas_zakonczenia, 'W trakcie') AS Czas_zakonczenia,
    A.Klient_nazwa,
    A.Pracownicy,
    A.Dodatkowe_informacje,
    GROUP_CONCAT(U.Nazwa SEPARATOR ', ') AS Uslugi,
    IFNULL(SUM(WU.Cena), 0) AS Cena
FROM A
    LEFT JOIN db_main.Auto_Usluga AU ON A.IdAuto = AU.Auto_IdAuto
    LEFT JOIN db_main.Usluga U ON AU.Usluga_IdUsluga = U.IdUsluga
    LEFT JOIN db_main.Wersja_umowy WU ON U.IdUsluga = WU.Usluga_IdUsluga
    LEFT JOIN db_main.Umowa UM ON WU.Umowa_IdUmowa = UM.IdUmowa
WHERE (UM.Klient_IdKlient = A.IdKlient AND A.Czas_zakonczenia BETWEEN UM.Data_rozpoczecia AND UM.Data_zakonczenia)
    OR A.Czas_zakonczenia IS NULL AND Czas_rozpoczecia BETWEEN UM.Data_rozpoczecia AND UM.Data_zakonczenia AND UM.Klient_IdKlient = A.IdKlient
GROUP BY
    A.IdAuto, A.IdKlient;

-- Pobieranie aut dla konkretnego klienta
WITH A AS (
    SELECT A.IdAuto AS IdAuto,
        A.Klient_IdKlient AS IdKlient,
        A.Model_IdModel AS IdModel,
        A.Rejestracja AS Rejestracja,
        M.Marka AS Marka, 
        M.Model AS Model,
        A.Czas_rozpoczecia AS Czas_rozpoczecia,
        IFNULL(A.Czas_zakonczenia, 'W trakcie') AS Czas_zakonczenia,
        K.Nazwa AS Klient_nazwa,
        GROUP_CONCAT(P.Imie, ' ', P.Nazwisko SEPARATOR ', ') AS Pracownicy,
        A.Dodatkowe_informacje AS Dodatkowe_informacje
    FROM db_main.Auto A LEFT JOIN db_main.Klient K ON A.Klient_IdKlient = K.IdKlient
        LEFT JOIN db_main.Model M ON A.Model_IdModel = M.IdModel
        LEFT JOIN db_main.Auto_Pracownik AP ON A.IdAuto = AP.Auto_IdAuto
        LEFT JOIN db_main.Pracownik P ON AP.Pracownik_IdPracownik = P.IdPracownik
    WHERE A.Klient_IdKlient = {id_klienta}
    GROUP BY A.IdAuto, A.Klient_IdKlient
)
SELECT DISTINCT A.IdAuto,
    A.IdKlient,
    A.IdModel,
    A.Rejestracja,
    A.Marka, 
    A.Model,
    A.Czas_rozpoczecia,
    A.Czas_zakonczenia,
    A.Klient_nazwa,
    A.Pracownicy,
    A.Dodatkowe_informacje,
    GROUP_CONCAT(U.Nazwa SEPARATOR ', ') AS Uslugi,
    IFNULL(SUM(WU.Cena), 0) AS Cena
FROM A
    LEFT JOIN db_main.Auto_Usluga AU ON A.IdAuto = AU.Auto_IdAuto
    LEFT JOIN db_main.Usluga U ON AU.Usluga_IdUsluga = U.IdUsluga
    LEFT JOIN db_main.Wersja_umowy WU ON U.IdUsluga = WU.Usluga_IdUsluga
    LEFT JOIN db_main.Umowa UM ON WU.Umowa_IdUmowa = UM.IdUmowa
WHERE ((UM.Klient_IdKlient = A.IdKlient AND A.Czas_zakonczenia BETWEEN UM.Data_rozpoczecia AND UM.Data_zakonczenia)
    OR A.Czas_zakonczenia IS NULL AND Czas_rozpoczecia BETWEEN UM.Data_rozpoczecia AND UM.Data_zakonczenia AND UM.Klient_IdKlient = A.IdKlient)
    AND A.IdKlient = {id_klienta}
GROUP BY
    A.IdAuto, A.IdKlient;
