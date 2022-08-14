-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Erstellungszeit: 09. Nov 2021 um 22:46
-- Server-Version: 10.6.4-MariaDB-1:10.6.4+maria~focal
-- PHP-Version: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `eve-dev`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `api_keys`
--

CREATE TABLE `api_keys` (
  `api_key` char(64) NOT NULL,
  `access_token` tinytext NOT NULL,
  `expiration_date` datetime NOT NULL,
  `token_type` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `api_keys`
--
ALTER TABLE `api_keys`
  ADD PRIMARY KEY (`api_key`(40));
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
