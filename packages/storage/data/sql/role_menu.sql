-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Erstellungszeit: 09. Nov 2021 um 22:48
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
-- Tabellenstruktur für Tabelle `role_menu`
--

CREATE TABLE `role_menu` (
  `id` varchar(64) NOT NULL,
  `server_id` varchar(21) NOT NULL,
  `channel_id` varchar(21) NOT NULL,
  `message_id` varchar(21) NOT NULL,
  `entries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `message` text NOT NULL,
  `name` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `role_menu`
--
ALTER TABLE `role_menu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `message_id` (`message_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
