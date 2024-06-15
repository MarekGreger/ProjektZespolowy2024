-- MySQL Script generated by MySQL Workbench
-- Wed Nov 15 12:42:48 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

drop schema if exists db_main;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema db_main
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema db_main
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_main` DEFAULT CHARACTER SET utf8mb3 ;
USE `db_main` ;

-- -----------------------------------------------------
-- Table `db_main`.`Klient`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Klient` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Klient` (
  `IdKlient` INT NOT NULL AUTO_INCREMENT,
  `Adres` VARCHAR(45) NULL DEFAULT NULL,
  `Email` VARCHAR(45) NULL DEFAULT NULL,
  `Nazwa` VARCHAR(45) NULL DEFAULT NULL,
  `NIP` VARCHAR(45) NULL DEFAULT NULL,
  `Telefon` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`IdKlient`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Model`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Model` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Model` (
  `IdModel` INT NOT NULL AUTO_INCREMENT,
  `Marka` VARCHAR(45) NULL DEFAULT NULL,
  `Model` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`IdModel`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Auto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Auto` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Auto` (
  `IdAuto` INT NOT NULL AUTO_INCREMENT,
  `Model_IdModel` INT,
  `Klient_IdKlient` INT,
  `Rejestracja` VARCHAR(20) NULL DEFAULT NULL,
  `Czas_rozpoczecia` TIMESTAMP NULL DEFAULT NULL,
  `Czas_zakonczenia` TIMESTAMP NULL DEFAULT NULL,
  `Dodatkowe_informacje` VARCHAR(150) NULL DEFAULT NULL,
  PRIMARY KEY (`IdAuto`),
  INDEX `fk_Auto_Modele1_idx` (`Model_IdModel` ASC) VISIBLE,
  INDEX `fk_Auto_Klient1_idx` (`Klient_IdKlient` ASC) VISIBLE,
  CONSTRAINT `fk_Auto_Klient1`
    FOREIGN KEY (`Klient_IdKlient`)
    REFERENCES `db_main`.`Klient` (`IdKlient`)
    ON DELETE SET NULL,
  CONSTRAINT `fk_Auto_Modele1`
    FOREIGN KEY (`Model_IdModel`)
    REFERENCES `db_main`.`Model` (`IdModel`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Pracownik`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Pracownik` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Pracownik` (
  `IdPracownik` INT NOT NULL AUTO_INCREMENT,
  `Email` VARCHAR(45) NULL DEFAULT NULL,
  `Imie` VARCHAR(45) NULL DEFAULT NULL,
  `Nazwisko` VARCHAR(45) NULL DEFAULT NULL,
  `Telefon` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`IdPracownik`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Auto_Pracownik`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Auto_Pracownik` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Auto_Pracownik` (
  `Pracownik_IdPracownik` INT NOT NULL,
  `Auto_IdAuto` INT NOT NULL,
  PRIMARY KEY (`Pracownik_IdPracownik`, `Auto_IdAuto`),
  INDEX `fk_Pracownik_has_Auto_Auto1_idx` (`Auto_IdAuto` ASC) VISIBLE,
  INDEX `fk_Pracownik_has_Auto_Pracownik1_idx` (`Pracownik_IdPracownik` ASC) VISIBLE,
  CONSTRAINT `fk_Pracownik_has_Auto_Auto1`
    FOREIGN KEY (`Auto_IdAuto`)
    REFERENCES `db_main`.`Auto` (`IdAuto`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Pracownik_has_Auto_Pracownik1`
    FOREIGN KEY (`Pracownik_IdPracownik`)
    REFERENCES `db_main`.`Pracownik` (`IdPracownik`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Usluga`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Usluga` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Usluga` (
  `IdUsluga` INT NOT NULL AUTO_INCREMENT,
  `Opis` VARCHAR(150) NULL DEFAULT NULL,
  `Nazwa` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`IdUsluga`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Auto_Usluga`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Auto_Usluga` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Auto_Usluga` (
  `Auto_IdAuto` INT NOT NULL,
  `Usluga_IdUsluga` INT NOT NULL,
  PRIMARY KEY (`Auto_IdAuto`, `Usluga_IdUsluga`),
  INDEX `fk_Auto_has_Usluga_Usluga1_idx` (`Usluga_IdUsluga` ASC) VISIBLE,
  INDEX `fk_Auto_has_Usluga_Auto1_idx` (`Auto_IdAuto` ASC) VISIBLE,
  CONSTRAINT `fk_Auto_has_Usluga_Auto1`
    FOREIGN KEY (`Auto_IdAuto`)
    REFERENCES `db_main`.`Auto` (`IdAuto`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Auto_has_Usluga_Usluga1`
    FOREIGN KEY (`Usluga_IdUsluga`)
    REFERENCES `db_main`.`Usluga` (`IdUsluga`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Grafik`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Grafik` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Grafik` (
  `IdGrafik` INT NOT NULL AUTO_INCREMENT,
  `Pracownik_IdPracownik` INT,
  `Klient_IdKlient` INT NOT NULL,
  `Czas_rozpoczecia` TIMESTAMP NULL DEFAULT NULL,
  `Czas_zakonczenia` TIMESTAMP NULL DEFAULT NULL,
  `Status` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`IdGrafik`, `Klient_IdKlient`),
  INDEX `fk_Grafik_Pracownik_idx` (`Pracownik_IdPracownik` ASC) VISIBLE,
  INDEX `fk_Grafik_Klient1_idx` (`Klient_IdKlient` ASC) VISIBLE,
  CONSTRAINT `fk_Grafik_Pracownik`
    FOREIGN KEY (`Pracownik_IdPracownik`)
    REFERENCES `db_main`.`Pracownik` (`IdPracownik`)
    ON DELETE SET NULL,
  CONSTRAINT `fk_Grafik_Klient1`
    FOREIGN KEY (`Klient_IdKlient`)
    REFERENCES `db_main`.`Klient` (`IdKlient`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Umowa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Umowa` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Umowa` (
  `IdUmowa` INT NOT NULL AUTO_INCREMENT,
  `Klient_IdKlient` INT,
  `Data_rozpoczecia` DATE NULL DEFAULT NULL,
  `Data_zakonczenia` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`IdUmowa`),
  INDEX `fk_Umowa_Klient1_idx` (`Klient_IdKlient` ASC) VISIBLE,
  CONSTRAINT `fk_Umowa_Klient1`
    FOREIGN KEY (`Klient_IdKlient`)
    REFERENCES `db_main`.`Klient` (`IdKlient`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Wersja_umowy`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Wersja_umowy` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Wersja_umowy` (
  `Usluga_IdUsluga` INT NOT NULL,
  `Umowa_IdUmowa` INT NOT NULL,
  `Cena` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`Usluga_IdUsluga`, `Umowa_IdUmowa`),
  INDEX `fk_Usluga_has_Umowa_Umowa1_idx` (`Umowa_IdUmowa` ASC) VISIBLE,
  INDEX `fk_Usluga_has_Umowa_Usluga1_idx` (`Usluga_IdUsluga` ASC) VISIBLE,
  CONSTRAINT `fk_Usluga_has_Umowa_Umowa1`
    FOREIGN KEY (`Umowa_IdUmowa`)
    REFERENCES `db_main`.`Umowa` (`IdUmowa`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Usluga_has_Umowa_Usluga1`
    FOREIGN KEY (`Usluga_IdUsluga`)
    REFERENCES `db_main`.`Usluga` (`IdUsluga`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db_main`.`Zgloszenie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db_main`.`Zgloszenie` ;

CREATE TABLE IF NOT EXISTS `db_main`.`Zgloszenie` (
  `IdZgloszenie` INT NOT NULL AUTO_INCREMENT,
  `Pracownik_IdPracownik` INT,
  `Klient_IdKlient` INT,
  `Opis` VARCHAR(150) NULL DEFAULT NULL,
  `Status` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`IdZgloszenie`),
  INDEX `fk_Żądanie_Pracownik1_idx` (`Pracownik_IdPracownik` ASC) VISIBLE,
  INDEX `fk_Żądanie_Klient1_idx` (`Klient_IdKlient` ASC) VISIBLE,
  CONSTRAINT `fk_Żądanie_Klient1`
    FOREIGN KEY (`Klient_IdKlient`)
    REFERENCES `db_main`.`Klient` (`IdKlient`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Żądanie_Pracownik1`
    FOREIGN KEY (`Pracownik_IdPracownik`)
    REFERENCES `db_main`.`Pracownik` (`IdPracownik`)
    ON DELETE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
