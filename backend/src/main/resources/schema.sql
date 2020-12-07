-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema autodealerswebapp
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table `autodealerswebapp`.`autodealer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`autodealer` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(100) NOT NULL,
  `WorkingHours` VARCHAR(20) NOT NULL,
  `City` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(50) NOT NULL,
  `Description` LONGTEXT NOT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `autodealerswebapp`.`car`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`car` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Brand` VARCHAR(30) NOT NULL,
  `Model` VARCHAR(30) NOT NULL,
  `YearOfIssue` INT NOT NULL,
  `BodyType` INT NOT NULL,
  `EngineVolume` FLOAT NOT NULL,
  `EngineType` INT NOT NULL,
  `TransmissionType` INT NOT NULL,
  `WheelDriveType` INT NOT NULL,
  `Mileage` DECIMAL(10,0) NOT NULL,
  `BodyColor` INT NOT NULL,
  `InteriorMaterial` INT NOT NULL,
  `InteriorColor` INT NOT NULL,
  `Price` DECIMAL(10,0) NOT NULL,
  `ReceiptDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsSold` TINYINT NOT NULL DEFAULT '0',
  `ImageName` VARCHAR(255) NULL DEFAULT NULL,
  `AutodealerId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `AutodealerId_idx` (`AutodealerId` ASC) VISIBLE,
  CONSTRAINT `AutodealerId`
    FOREIGN KEY (`AutodealerId`)
    REFERENCES `autodealerswebapp`.`autodealer` (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `autodealerswebapp`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`user` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(20) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Firstname` VARCHAR(20) NOT NULL,
  `Surname` VARCHAR(20) NOT NULL,
  `MobilePhone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  `DateOfRegistration` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `IsAccountNonLocked` TINYINT NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `username_UNIQUE` (`Username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `autodealerswebapp`.`deal`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`deal` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `UserId` INT NOT NULL,
  `Amount` DECIMAL(10,0) NOT NULL,
  `Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CarId` INT NOT NULL,
  `IsConfirmed` TINYINT NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  INDEX `FK7okmvnlsr6umc4pmgxar7q85y` (`CarId` ASC) VISIBLE,
  INDEX `FKdjy5hifqfnag282yvkfpgp01k` (`UserId` ASC) VISIBLE,
  CONSTRAINT `CarId`
    FOREIGN KEY (`CarId`)
    REFERENCES `autodealerswebapp`.`car` (`Id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `UserId_FK2`
    FOREIGN KEY (`UserId`)
    REFERENCES `autodealerswebapp`.`user` (`Id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `autodealerswebapp`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`role` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `autodealerswebapp`.`statistics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`statistics` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Month` INT NOT NULL,
  `Year` INT NOT NULL,
  `CountOfClients` INT NOT NULL,
  `CountOfCarsSold` INT NOT NULL,
  `TotalSales` DECIMAL(10,0) NOT NULL,
  `AutodealerId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `AutodealerId_idx` (`AutodealerId` ASC) VISIBLE,
  CONSTRAINT `AutodealerId_FK`
    FOREIGN KEY (`AutodealerId`)
    REFERENCES `autodealerswebapp`.`autodealer` (`Id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `autodealerswebapp`.`user_autodealer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`user_autodealer` (
  `UserId` INT NOT NULL,
  `AutodealerId` INT NOT NULL,
  PRIMARY KEY (`UserId`, `AutodealerId`),
  INDEX `AutodealerId_idx` (`AutodealerId` ASC) VISIBLE,
  CONSTRAINT `AutodealerId_FK1`
    FOREIGN KEY (`AutodealerId`)
    REFERENCES `autodealerswebapp`.`autodealer` (`Id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `UserId`
    FOREIGN KEY (`UserId`)
    REFERENCES `autodealerswebapp`.`user` (`Id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `autodealerswebapp`.`user_role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `autodealerswebapp`.`user_role` (
  `RoleId` INT NOT NULL,
  `UserId` INT NOT NULL,
  PRIMARY KEY (`RoleId`, `UserId`),
  INDEX `fk_role_has_user_user1_idx` (`UserId` ASC) VISIBLE,
  INDEX `fk_role_has_user_role1_idx` (`RoleId` ASC) INVISIBLE,
  CONSTRAINT `fk_role_has_user_role1`
    FOREIGN KEY (`RoleId`)
    REFERENCES `autodealerswebapp`.`role` (`Id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_role_has_user_user1`
    FOREIGN KEY (`UserId`)
    REFERENCES `autodealerswebapp`.`user` (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
