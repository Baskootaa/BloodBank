-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 30, 2026 at 10:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;
SET sql_require_primary_key = OFF;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bloodbank`
--

-- --------------------------------------------------------

--
-- Table structure for table `blood_requests`
--

CREATE TABLE `blood_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `patient_id` bigint(20) UNSIGNED DEFAULT NULL,
  `blood_type` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `bags_quantity` int(11) NOT NULL DEFAULT 1,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `hospital_id` bigint(20) UNSIGNED DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blood_requests`
--

INSERT INTO `blood_requests` (`id`, `name`, `patient_id`, `blood_type`, `phone`, `age`, `bags_quantity`, `status`, `city_id`, `hospital_id`, `details`, `created_at`, `updated_at`) VALUES
(1, 'مازن', 7, 'A+', '01222331212', 20, 2, 'accepted', 1, 1, NULL, '2026-05-01 21:50:48', '2026-05-01 21:56:22'),
(2, 'انس', 8, 'A-', '01123232121', 20, 2, 'accepted', 7, 12, NULL, '2026-05-01 22:42:58', '2026-05-01 22:58:57'),
(3, 'عمرو', 9, 'B+', '01055555555', 21, 2, 'accepted', 3, 6, NULL, '2026-05-04 14:07:50', '2026-05-04 14:10:08');

-- --------------------------------------------------------

--
-- Table structure for table `blood_stocks`
--

CREATE TABLE `blood_stocks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `blood_type` varchar(255) NOT NULL,
  `bags_quantity` int(11) NOT NULL DEFAULT 0,
  `hospital_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blood_stocks`
--

INSERT INTO `blood_stocks` (`id`, `blood_type`, `bags_quantity`, `hospital_id`, `created_at`, `updated_at`) VALUES
(1, 'A+', 18, 1, '2026-05-01 22:55:56', '2026-05-01 21:56:22'),
(2, 'A-', 20, 1, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(3, 'B+', 20, 1, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(4, 'B-', 20, 1, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(5, 'AB+', 20, 1, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(6, 'AB-', 20, 1, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(7, 'O+', 21, 1, '2026-05-01 22:55:56', '2026-05-02 21:55:09'),
(8, 'O-', 20, 1, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(9, 'A+', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(10, 'A-', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(11, 'B+', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(12, 'B-', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(13, 'AB+', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(14, 'AB-', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(15, 'O+', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(16, 'O-', 20, 2, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(17, 'A+', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(18, 'A-', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(19, 'B+', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(20, 'B-', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(21, 'AB+', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(22, 'AB-', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(23, 'O+', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:00:35'),
(24, 'O-', 20, 3, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(25, 'A+', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(26, 'A-', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(27, 'B+', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(28, 'B-', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(29, 'AB+', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(30, 'AB-', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(31, 'O+', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(32, 'O-', 20, 4, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(33, 'A+', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(34, 'A-', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(35, 'B+', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(36, 'B-', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(37, 'AB+', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(38, 'AB-', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(39, 'O+', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(40, 'O-', 20, 5, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(41, 'A+', 20, 6, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(42, 'A-', 20, 6, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(43, 'B+', 18, 6, '2026-05-01 22:55:56', '2026-05-04 14:10:08'),
(44, 'B-', 20, 6, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(45, 'AB+', 20, 6, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(46, 'AB-', 20, 6, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(47, 'O+', 20, 6, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(48, 'O-', 20, 6, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(49, 'A+', 21, 7, '2026-05-01 22:55:56', '2026-05-01 21:56:08'),
(50, 'A-', 20, 7, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(51, 'B+', 20, 7, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(52, 'B-', 20, 7, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(53, 'AB+', 20, 7, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(54, 'AB-', 20, 7, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(55, 'O+', 20, 7, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(56, 'O-', 20, 7, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(57, 'A+', 20, 8, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(58, 'A-', 21, 8, '2026-05-01 22:55:56', '2026-05-04 14:09:52'),
(59, 'B+', 20, 8, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(60, 'B-', 20, 8, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(61, 'AB+', 20, 8, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(62, 'AB-', 20, 8, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(63, 'O+', 20, 8, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(64, 'O-', 20, 8, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(65, 'A+', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(66, 'A-', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(67, 'B+', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(68, 'B-', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(69, 'AB+', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(70, 'AB-', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(71, 'O+', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(72, 'O-', 20, 9, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(73, 'A+', 21, 10, '2026-05-01 22:55:56', '2026-05-07 17:07:05'),
(74, 'A-', 20, 10, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(75, 'B+', 20, 10, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(76, 'B-', 20, 10, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(77, 'AB+', 20, 10, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(78, 'AB-', 20, 10, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(79, 'O+', 20, 10, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(80, 'O-', 20, 10, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(81, 'A+', 21, 11, '2026-05-01 22:55:56', '2026-05-02 11:44:21'),
(82, 'A-', 20, 11, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(83, 'B+', 21, 11, '2026-05-01 22:55:56', '2026-05-01 22:58:39'),
(84, 'B-', 20, 11, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(85, 'AB+', 20, 11, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(86, 'AB-', 20, 11, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(87, 'O+', 20, 11, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(88, 'O-', 20, 11, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(89, 'A+', 20, 12, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(90, 'A-', 18, 12, '2026-05-01 22:55:56', '2026-05-01 22:58:57'),
(91, 'B+', 20, 12, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(92, 'B-', 20, 12, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(93, 'AB+', 20, 12, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(94, 'AB-', 20, 12, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(95, 'O+', 20, 12, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(96, 'O-', 20, 12, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(97, 'A+', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(98, 'A-', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(99, 'B+', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(100, 'B-', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(101, 'AB+', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(102, 'AB-', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(103, 'O+', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(104, 'O-', 20, 13, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(105, 'A+', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(106, 'A-', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(107, 'B+', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(108, 'B-', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(109, 'AB+', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(110, 'AB-', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(111, 'O+', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(112, 'O-', 20, 14, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(113, 'A+', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(114, 'A-', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(115, 'B+', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(116, 'B-', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(117, 'AB+', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(118, 'AB-', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(119, 'O+', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(120, 'O-', 20, 15, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(121, 'A+', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(122, 'A-', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(123, 'B+', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(124, 'B-', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(125, 'AB+', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(126, 'AB-', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(127, 'O+', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(128, 'O-', 20, 16, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(129, 'A+', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(130, 'A-', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(131, 'B+', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(132, 'B-', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(133, 'AB+', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(134, 'AB-', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(135, 'O+', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(136, 'O-', 20, 17, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(137, 'A+', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(138, 'A-', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(139, 'B+', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(140, 'B-', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(141, 'AB+', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(142, 'AB-', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(143, 'O+', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(144, 'O-', 20, 18, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(145, 'A+', 20, 19, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(146, 'A-', 20, 19, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(147, 'B+', 20, 19, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(148, 'B-', 20, 19, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(149, 'AB+', 20, 19, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(150, 'AB-', 21, 19, '2026-05-01 22:55:56', '2026-05-07 17:50:30'),
(151, 'O+', 20, 19, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(152, 'O-', 20, 19, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(153, 'A+', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(154, 'A-', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(155, 'B+', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(156, 'B-', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(157, 'AB+', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(158, 'AB-', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(159, 'O+', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56'),
(160, 'O-', 20, 20, '2026-05-01 22:55:56', '2026-05-01 22:55:56');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'سمنود ', '2026-05-01 21:31:01', '2026-05-01 21:31:01'),
(2, 'المحلة الكبري', '2026-05-01 21:31:43', '2026-05-01 21:31:43'),
(3, 'المنصورة', '2026-05-01 21:32:20', '2026-05-01 21:32:20'),
(4, 'طنطا ', '2026-05-01 21:32:45', '2026-05-01 21:32:45'),
(5, 'الجيزة ', '2026-05-01 21:33:11', '2026-05-01 21:33:11'),
(6, 'بنها ', '2026-05-01 21:33:29', '2026-05-01 21:33:29'),
(7, 'شبرا', '2026-05-01 21:33:47', '2026-05-01 21:33:47'),
(8, 'العبور', '2026-05-01 21:34:47', '2026-05-01 21:34:47'),
(9, 'الدقي', '2026-05-01 21:35:04', '2026-05-01 21:35:04'),
(10, 'الاسكندرية ', '2026-05-01 21:35:24', '2026-05-01 21:35:24');

-- --------------------------------------------------------

--
-- Table structure for table `donors`
--

CREATE TABLE `donors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `blood_type` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `bags_quantity` int(11) DEFAULT 1,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `hospital_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `donors`
--

INSERT INTO `donors` (`id`, `name`, `blood_type`, `phone`, `age`, `bags_quantity`, `status`, `city_id`, `hospital_id`, `created_at`, `updated_at`) VALUES
(1, 'ادم', 'A+', '01233221212', 22, 1, 'accepted', 4, 7, '2026-05-01 21:55:37', '2026-05-01 21:56:08'),
(2, 'محمد', 'B+', '01123232121', 20, 1, 'accepted', 6, 11, '2026-05-01 22:33:51', '2026-05-01 22:58:39'),
(3, 'احمد', 'A-', '01044444444', 20, 1, 'accepted', 4, 8, '2026-05-04 14:08:18', '2026-05-04 14:09:52'),
(4, 'عمر', 'AB-', '01154548778', 25, 1, 'accepted', 10, 19, '2026-05-07 17:50:18', '2026-05-07 17:50:30');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `address`, `city_id`, `created_at`, `updated_at`) VALUES
(1, 'سمنود العام', 'وسط البلد - سمنود', 1, '2026-05-01 22:12:13', '2026-05-01 22:12:13'),
(2, 'الواحة التخصصي', 'شارع الشهيد وائل المر - سمنود', 1, '2026-05-01 22:26:35', '2026-05-01 22:26:35'),
(3, 'المحلة العام ', 'شارع البحر - المحلة الكبري', 2, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(4, 'القصر', 'شارع عادل الرفاعي - المحلة الكبري', 2, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(5, 'المنصورة العام ', 'الجامعة - المنصورة ', 3, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(6, 'مستشفي الطوارئ', 'جيهان السادات - المنصورة', 3, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(7, 'طنطا الجامعي', 'شارع الجيش - طنطا ', 4, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(8, 'دار الشفاء', 'شارع معاوية - طنطا (قسم 2)', 4, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(9, 'مستشفي الشروق', 'شارع بحر الغزال - 5 احمد عرابي ', 5, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(10, 'الجيزة التخصصي', 'محمد الذكي , متفرع من شارع 4 - خاتم المرسلين الهرم ', 5, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(11, 'الجامعة ببنها ', 'الشهيد فريد ندا - قسم ثان بنها ', 6, '2026-05-01 22:27:58', '2026-05-01 22:27:58'),
(12, 'مستشفي النيل ', 'ميدان المؤسسة - دمنهور شبرا', 7, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(13, 'مستشفي الناس ', '2, شبرا الخيمة - قسم اول شبرا الخيمة ', 7, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(14, 'العبور التخصصي', 'العبور - القليوبية ', 8, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(15, 'جامعة عين شمي التخصصي', '1 فاطمة الزهراء - العبور', 8, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(16, 'مستشفي ميلينيوم ', 'احمد الشاطوري - قسم الدقي ', 9, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(17, 'مستشفي الكوكب الطبي', '12 شارع السلولي , ميدان شارع المساحة - الدقي ', 9, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(18, 'مستشفي زمزم ', 'احمد محمد اسماعيل - محرم بك', 10, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(19, 'بيت النعمة ', 'قسم سيدي جابر ', 10, '2026-05-01 22:27:59', '2026-05-01 22:27:59'),
(20, 'المستشفي الألماني', '56 شارع عبد السلام عارف - قسم اول الرمل', 10, '2026-05-01 22:27:59', '2026-05-01 22:27:59');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_02_1_203830_create_cities_table', 1),
(5, '2026_02_2_193821_create_hospitals_table', 1),
(6, '2026_02_3_221014_create_blood_requests_table', 1),
(7, '2026_03_13_230904_create_donors_table', 1),
(8, '2026_03_13_230935_create_patients_table', 1),
(9, '2026_03_13_230958_create_blood_stocks_table', 1),
(10, '2026_03_23_013239_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `blood_type` varchar(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `age` int(11) NOT NULL,
  `bags_quantity` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') NOT NULL,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `hospital_id` bigint(20) UNSIGNED NOT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `name`, `blood_type`, `phone`, `age`, `bags_quantity`, `status`, `city_id`, `hospital_id`, `details`, `created_at`, `updated_at`) VALUES
(7, 'مازن', 'A+', '01222331212', 20, 2, 'accepted', 1, 0, NULL, '2026-05-01 21:50:48', '2026-05-01 21:50:48'),
(8, 'انس', 'A-', '01123232121', 20, 2, 'accepted', 7, 12, NULL, '2026-05-01 22:42:58', '2026-05-01 22:58:57'),
(9, 'عمرو', 'B+', '01055555555', 21, 2, 'accepted', 3, 6, NULL, '2026-05-04 14:07:50', '2026-05-04 14:10:08');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', 'ea89b3e909363ab8acb17475d9c964df7396376d1b55c7ba16279d29dc383d06', '[\"*\"]', NULL, NULL, '2026-05-01 18:24:28', '2026-05-01 18:24:28'),
(2, 'App\\Models\\User', 1, 'auth_token', '972d36a0f999850232ee74dafb3857b19a5646cb89293da4994ca854f0c4fdf0', '[\"*\"]', '2026-05-01 18:26:03', NULL, '2026-05-01 18:25:02', '2026-05-01 18:26:03'),
(3, 'App\\Models\\User', 1, 'auth_token', 'b85742195178d09620c0eb52a6e80c2f9726df4c078991b08ccdd4b1df2675ab', '[\"*\"]', '2026-05-01 19:58:34', NULL, '2026-05-01 19:58:28', '2026-05-01 19:58:34'),
(4, 'App\\Models\\User', 1, 'auth_token', 'f9cb6110e1a5bfda0227b47eb411f2294c18b3897a0fadcc05f48cea1a9858e9', '[\"*\"]', '2026-05-01 20:00:04', NULL, '2026-05-01 19:59:58', '2026-05-01 20:00:04'),
(5, 'App\\Models\\User', 1, 'auth_token', 'e3da2741d00ab21d6baf355048cf2da8a9b591ff46f9005033f3de3436144c13', '[\"*\"]', '2026-05-01 20:15:15', NULL, '2026-05-01 20:04:11', '2026-05-01 20:15:15'),
(6, 'App\\Models\\User', 1, 'auth_token', '0cd047ca46f2c5a0bd095fd935438411805d2100f7aa52be40118b14307770b7', '[\"*\"]', '2026-05-01 20:17:26', NULL, '2026-05-01 20:15:23', '2026-05-01 20:17:26'),
(7, 'App\\Models\\User', 1, 'auth_token', '790a3b8275e2c33cac2d4648a3ff625dca66e3c247e383700882753b5301b6a8', '[\"*\"]', '2026-05-01 20:18:13', NULL, '2026-05-01 20:17:47', '2026-05-01 20:18:13'),
(8, 'App\\Models\\User', 2, 'auth_token', '8856895cb498608f51a4267cf78b5e33eec6cfe83714fb230a16fe1e7fb50eac', '[\"*\"]', NULL, NULL, '2026-05-01 20:19:36', '2026-05-01 20:19:36'),
(9, 'App\\Models\\User', 2, 'auth_token', '851d2a5ec08eef408e251411aff5d803518de1f951d2ceb830ef797e8a453a5f', '[\"*\"]', '2026-05-01 20:20:14', NULL, '2026-05-01 20:19:51', '2026-05-01 20:20:14'),
(10, 'App\\Models\\User', 2, 'auth_token', '6d7c260c5d2b7da172771e12e80a816a3b487c8bcd61870c88577eac2d74b1b5', '[\"*\"]', '2026-05-01 20:20:45', NULL, '2026-05-01 20:20:25', '2026-05-01 20:20:45'),
(11, 'App\\Models\\User', 2, 'auth_token', '366a6c085ebb3371cf5069d7994a4eb88a1e39459eeb9d9be5731e0d9234a0a0', '[\"*\"]', NULL, NULL, '2026-05-01 20:28:22', '2026-05-01 20:28:22'),
(12, 'App\\Models\\User', 1, 'auth_token', '39ff3282a63d962c7334c95d5213681375b2867a67a8f2a8aa6841861d7fef2e', '[\"*\"]', '2026-05-01 22:29:44', NULL, '2026-05-01 21:56:00', '2026-05-01 22:29:44'),
(13, 'App\\Models\\User', 2, 'auth_token', 'a429365e882b1d261d652918f61202f73b5b7fe5f2b1c9957ac34f17089551bb', '[\"*\"]', '2026-05-01 22:58:20', NULL, '2026-05-01 22:29:56', '2026-05-01 22:58:20'),
(14, 'App\\Models\\User', 1, 'auth_token', '29cfb939158b979fbefc73b784140a3048fd22763b0af5027dbf641961133a88', '[\"*\"]', '2026-05-01 22:59:14', NULL, '2026-05-01 22:58:32', '2026-05-01 22:59:14'),
(15, 'App\\Models\\User', 2, 'auth_token', '344ada3ca6ae562653ca1f63cb6bf1ab39f4fa04f94685b5f6f8119aae252e7c', '[\"*\"]', '2026-05-02 11:43:32', NULL, '2026-05-02 11:43:26', '2026-05-02 11:43:32'),
(16, 'App\\Models\\User', 1, 'auth_token', '9942006d23797a9c8e06d7d2e6f82aa18a747aa5433dbddb37c203d62252f3ca', '[\"*\"]', '2026-05-03 18:36:43', NULL, '2026-05-02 11:44:00', '2026-05-03 18:36:43'),
(17, 'App\\Models\\User', 1, 'auth_token', '03bdaa2eb5a776944849eb18f929283820e58707ac3ce371b4589903c74dd70f', '[\"*\"]', NULL, NULL, '2026-05-02 13:35:35', '2026-05-02 13:35:35'),
(18, 'App\\Models\\User', 1, 'auth_token', '961293ed1f70bd6254fbb6739093abd1703bec684c0e008293c8d3c018cfe837', '[\"*\"]', NULL, NULL, '2026-05-02 14:41:52', '2026-05-02 14:41:52'),
(19, 'App\\Models\\User', 1, 'auth_token', '75f588f5ae49880b7a1ee8777fcc74f082657e5bef9cf2f82088452d9362cec2', '[\"*\"]', NULL, NULL, '2026-05-02 14:47:18', '2026-05-02 14:47:18'),
(20, 'App\\Models\\User', 1, 'auth_token', 'f1925802f8acfe4d2b2555e7cd1d15a074027391366c1c3584970ae69f8ef8f2', '[\"*\"]', NULL, NULL, '2026-05-02 14:54:49', '2026-05-02 14:54:49'),
(21, 'App\\Models\\User', 1, 'auth_token', 'e38573be6f984f312d52c7306cd2ab34de9bfb87b2b9607ec65c5cbde029b1c1', '[\"*\"]', NULL, NULL, '2026-05-02 16:27:27', '2026-05-02 16:27:27'),
(22, 'App\\Models\\User', 1, 'auth_token', 'ffcdeea990f7b45466df4d784dcf948d012de69db2ba27fa43fbca8514c9db8a', '[\"*\"]', NULL, NULL, '2026-05-02 16:40:21', '2026-05-02 16:40:21'),
(23, 'App\\Models\\User', 1, 'auth_token', '175c7e026f87aa4de18565dd4ee8b50a3782659fa3a16c13321e7cd651c0b06d', '[\"*\"]', NULL, NULL, '2026-05-02 16:41:25', '2026-05-02 16:41:25'),
(24, 'App\\Models\\User', 1, 'auth_token', '6038a461c8b9e02da190cc9deb81854258da6d422560d645dfc5f89a02f44f79', '[\"*\"]', NULL, NULL, '2026-05-02 16:48:48', '2026-05-02 16:48:48'),
(25, 'App\\Models\\User', 1, 'auth_token', '3f022d2f2629d92d71534ca9d31d941faf4d28d616fdb1219e536f71de9ee78b', '[\"*\"]', NULL, NULL, '2026-05-02 16:55:04', '2026-05-02 16:55:04'),
(26, 'App\\Models\\User', 1, 'auth_token', '687a39232a1a58ac7c13c41b33bbadbece31728814a694315c2a32a381e69bdc', '[\"*\"]', NULL, NULL, '2026-05-02 17:24:32', '2026-05-02 17:24:32'),
(27, 'App\\Models\\User', 1, 'auth_token', 'adb1e87db1d8170458c49d7115ad84d45682fb5ec9bfba49d7dacb52c0e6f4fb', '[\"*\"]', NULL, NULL, '2026-05-03 17:03:31', '2026-05-03 17:03:31'),
(28, 'App\\Models\\User', 1, 'auth_token', 'b0ce8ee1d24bbb343a277bef22419afd407196cdfdfa3b122088599f7e0b204d', '[\"*\"]', NULL, NULL, '2026-05-03 17:03:31', '2026-05-03 17:03:31'),
(29, 'App\\Models\\User', 1, 'auth_token', '412dd974b63f22c5f10ceedb6f5a84aad6e9cecbb100cdd1f087edc3b4dccb1a', '[\"*\"]', NULL, NULL, '2026-05-03 17:03:31', '2026-05-03 17:03:31'),
(30, 'App\\Models\\User', 1, 'auth_token', '288799018a515af0094030a1e54fe9e1896481830d263782ba9d3180162f0797', '[\"*\"]', NULL, NULL, '2026-05-03 17:04:23', '2026-05-03 17:04:23'),
(31, 'App\\Models\\User', 1, 'auth_token', 'fbdf924b838ca655f89c7d259d7d9485948dc617c0fe496d240c353d444e2bc1', '[\"*\"]', NULL, NULL, '2026-05-03 17:19:35', '2026-05-03 17:19:35'),
(32, 'App\\Models\\User', 1, 'auth_token', '06e67e8003b8e8c16333ff390263f8b4b8e9f6c14974b6be2069a302a9e34877', '[\"*\"]', NULL, NULL, '2026-05-03 17:46:23', '2026-05-03 17:46:23'),
(33, 'App\\Models\\User', 1, 'auth_token', 'cc5f86b06a3aef965fdbf5060ccb5107f089012c178628036aba4b26e96200ee', '[\"*\"]', NULL, NULL, '2026-05-03 18:36:22', '2026-05-03 18:36:22'),
(34, 'App\\Models\\User', 1, 'auth_token', 'ef15272a07bc0bfbf4ef21c09e7fe0fe1b3dee7f81d69b56e07ccc6e745fef5f', '[\"*\"]', NULL, NULL, '2026-05-03 18:36:56', '2026-05-03 18:36:56'),
(35, 'App\\Models\\User', 1, 'auth_token', '904d55d6a267c3115a92f4b6fa0ad4b78f629531e9cbce2bcc72c5b6cc16d928', '[\"*\"]', NULL, NULL, '2026-05-04 12:45:52', '2026-05-04 12:45:52'),
(36, 'App\\Models\\User', 1, 'auth_token', 'bf369b9a91a00934aadc3217dbdc0c0929be640ca5326683e6383a2d57a5ec2a', '[\"*\"]', NULL, NULL, '2026-05-04 13:14:28', '2026-05-04 13:14:28'),
(37, 'App\\Models\\User', 1, 'auth_token', '7789432730abdde58840ab4ba5188f06a7c7ae0ae80179b5cb4250d513f6b199', '[\"*\"]', NULL, NULL, '2026-05-04 13:14:53', '2026-05-04 13:14:53'),
(38, 'App\\Models\\User', 1, 'auth_token', 'dd36aa267e409806499e2117bc37e32cef1768ba3c35304d134d4318cb9a614f', '[\"*\"]', NULL, NULL, '2026-05-04 13:20:46', '2026-05-04 13:20:46'),
(39, 'App\\Models\\User', 2, 'auth_token', '67d19a6faec1f0d1589359959596eaa167a38450dab6f07c31468dccd1448bbe', '[\"*\"]', '2026-05-04 14:09:08', NULL, '2026-05-04 14:08:58', '2026-05-04 14:09:08'),
(40, 'App\\Models\\User', 1, 'auth_token', '0c4090fb8a046a13cfabf2be151442e99515e6d44f1d3125d35d7ebc215b7abc', '[\"*\"]', '2026-05-04 14:09:41', NULL, '2026-05-04 14:09:33', '2026-05-04 14:09:41'),
(41, 'App\\Models\\User', 1, 'auth_token', '9633bff62d65ec95b9835d9b70ec9ec7b96fa312ac405141956748c91b236ef5', '[\"*\"]', '2026-05-07 17:14:02', NULL, '2026-05-04 14:11:16', '2026-05-07 17:14:02'),
(42, 'App\\Models\\User', 1, 'auth_token', '3e698b7b4a0b28ad833cd5844a7f41b9013663e008adff74b78161771c7b21e5', '[\"*\"]', NULL, NULL, '2026-05-04 14:16:03', '2026-05-04 14:16:03'),
(43, 'App\\Models\\User', 1, 'auth_token', 'd682cd8510d622176acaf293a371fb984ef98bad3103dd3d2c9922be1bd53ae3', '[\"*\"]', NULL, NULL, '2026-05-04 14:19:15', '2026-05-04 14:19:15'),
(44, 'App\\Models\\User', 1, 'auth_token', '696dfe55d0788257dad888323c77711ac70a6d438d9509edbab4d75e063ce422', '[\"*\"]', NULL, NULL, '2026-05-07 14:32:28', '2026-05-07 14:32:28'),
(45, 'App\\Models\\User', 1, 'auth_token', '6697694f2e0c70a12d9c505199d2650e4f237ac05259881d48b3278ec776c8ac', '[\"*\"]', NULL, NULL, '2026-05-07 14:33:15', '2026-05-07 14:33:15'),
(46, 'App\\Models\\User', 1, 'auth_token', 'e0541bb8ab3898d327eb5ac6a91f7f6ebf6f39ff4b4660fec1696ae408474af3', '[\"*\"]', NULL, NULL, '2026-05-07 16:23:47', '2026-05-07 16:23:47'),
(47, 'App\\Models\\User', 1, 'auth_token', '62de69aa0e9963ca27abad75a029fec069ba7ffeb4aee421f2939596b5c29604', '[\"*\"]', NULL, NULL, '2026-05-07 16:31:43', '2026-05-07 16:31:43'),
(48, 'App\\Models\\User', 1, 'auth_token', '4c51a50cb36079f98e28129c102f2a5f40735cd53bc01ba98d6179110a9c85e3', '[\"*\"]', NULL, NULL, '2026-05-07 16:35:39', '2026-05-07 16:35:39'),
(49, 'App\\Models\\User', 1, 'auth_token', 'f2accb93a22adb52d6e90174431c01a1f6ba15ae9d10371b5cead6c92e97c5a4', '[\"*\"]', NULL, NULL, '2026-05-07 16:38:17', '2026-05-07 16:38:17'),
(50, 'App\\Models\\User', 1, 'auth_token', '26e11279bd9303fcb681881d8270abf4b6a6ade43834da758fbe5864af3295b9', '[\"*\"]', NULL, NULL, '2026-05-07 16:43:29', '2026-05-07 16:43:29'),
(51, 'App\\Models\\User', 1, 'auth_token', '4fe2a3c420d212c3a195f340c90436f27f253760c095256c154c46c9adce60e2', '[\"*\"]', NULL, NULL, '2026-05-07 16:46:47', '2026-05-07 16:46:47'),
(52, 'App\\Models\\User', 1, 'auth_token', '1dde1da03873974680270a76a09f4a11f13e3119fe912d30e09740e10491ae46', '[\"*\"]', NULL, NULL, '2026-05-07 16:47:04', '2026-05-07 16:47:04'),
(53, 'App\\Models\\User', 1, 'auth_token', '4a5f993b8b8d470fa29a7c9b97e5bf724215147e46a9d4f6700802d8a0fa3e57', '[\"*\"]', NULL, NULL, '2026-05-07 17:01:00', '2026-05-07 17:01:00'),
(54, 'App\\Models\\User', 1, 'auth_token', '91b44609fd598be6465da9f7c2ca0470629b9e21fc8f38f99cc233365f7e0d1d', '[\"*\"]', NULL, NULL, '2026-05-07 17:05:01', '2026-05-07 17:05:01'),
(55, 'App\\Models\\User', 1, 'auth_token', '0ab7df0b91e087cb4580f2d3709f442d6911b546e2c4828bcfca1ed8c5eb86b1', '[\"*\"]', NULL, NULL, '2026-05-07 17:11:35', '2026-05-07 17:11:35'),
(56, 'App\\Models\\User', 1, 'auth_token', '8efa959714e87dd78453fd52ecb2e8b1e35f9dc93a8f2a057df35b2d4becd674', '[\"*\"]', NULL, NULL, '2026-05-07 17:30:47', '2026-05-07 17:30:47'),
(57, 'App\\Models\\User', 1, 'auth_token', '81421c9d6b81ff72ac705c894581cd955e7338eaaa20bc9b624c2502736a29f4', '[\"*\"]', NULL, NULL, '2026-05-07 17:36:06', '2026-05-07 17:36:06'),
(58, 'App\\Models\\User', 1, 'auth_token', '27a2811a459f0a8a5ce64138d9b5cba45759069c6524aae0df1d8e8cde74a5cd', '[\"*\"]', NULL, NULL, '2026-05-07 17:52:07', '2026-05-07 17:52:07'),
(59, 'App\\Models\\User', 1, 'auth_token', '613b0a59503033a24d2355fdbbbc2c39660a77d20858350d7494a5e0b226f0f0', '[\"*\"]', NULL, NULL, '2026-05-07 17:55:43', '2026-05-07 17:55:43'),
(60, 'App\\Models\\User', 1, 'auth_token', 'c043852ca893f34b178242587ce087f9dcd60f335ec3f7e0a9907719362219fb', '[\"*\"]', NULL, NULL, '2026-05-07 18:01:33', '2026-05-07 18:01:33'),
(61, 'App\\Models\\User', 1, 'auth_token', '0ed504276ef8b7fb7184ebc01e94fb279aa41678866989647d19e76f630cb5d1', '[\"*\"]', NULL, NULL, '2026-05-07 18:02:13', '2026-05-07 18:02:13'),
(62, 'App\\Models\\User', 1, 'auth_token', '26da673ee7d55350b5f232e3bcfe5e7c010f6c86f1e3622a569f9952cbb21e47', '[\"*\"]', NULL, NULL, '2026-05-07 18:03:20', '2026-05-07 18:03:20'),
(63, 'App\\Models\\User', 1, 'auth_token', 'c5fda013fe578a94bfaee46a90fa2b2f163bd14bce1ffcb3f409955519ae2c31', '[\"*\"]', NULL, NULL, '2026-05-07 20:49:41', '2026-05-07 20:49:41'),
(64, 'App\\Models\\User', 1, 'auth_token', '74ecb29a69688ef9e4f669bbf16f97eea4bec1757cac7f7d2b77795b66b6f363', '[\"*\"]', NULL, NULL, '2026-05-07 20:51:05', '2026-05-07 20:51:05'),
(65, 'App\\Models\\User', 1, 'auth_token', '3a6c9e6d15025781920a3319560da3b27db5cf20be1dcf65d97880711e2c86a6', '[\"*\"]', NULL, NULL, '2026-05-07 20:55:26', '2026-05-07 20:55:26'),
(66, 'App\\Models\\User', 1, 'auth_token', '31f59e35d48e587d5caa5de3d4a2b35a677f07f6c52cb7e47873c3e7e7341534', '[\"*\"]', NULL, NULL, '2026-05-07 21:09:24', '2026-05-07 21:09:24'),
(67, 'App\\Models\\User', 1, 'auth_token', '87a772a4fbe976b483daa45f4aa8395dad357fd0495352674f59e08e07c32889', '[\"*\"]', NULL, NULL, '2026-05-07 21:18:27', '2026-05-07 21:18:27'),
(68, 'App\\Models\\User', 1, 'auth_token', 'f36ad35a077630db3d25a27dff29f71206065bf9b12b458e209facea993661cd', '[\"*\"]', NULL, NULL, '2026-05-07 21:20:43', '2026-05-07 21:20:43'),
(69, 'App\\Models\\User', 1, 'auth_token', 'b93c416dab3daae3dae368a1ecc72fe6fb09309a394860a6c9a83282b1eafe6e', '[\"*\"]', NULL, NULL, '2026-05-08 11:01:16', '2026-05-08 11:01:16'),
(70, 'App\\Models\\User', 1, 'auth_token', '2f618f5d0c18cea96df770f8da37806feab3a5b476e70c4eece30f54a57fe1a7', '[\"*\"]', NULL, NULL, '2026-05-08 11:02:38', '2026-05-08 11:02:38'),
(71, 'App\\Models\\User', 1, 'auth_token', '55d114b3628e743419846541176c08f7c6fe8aa2ce4e4f6482b1f62f031dd212', '[\"*\"]', NULL, NULL, '2026-05-08 11:03:05', '2026-05-08 11:03:05'),
(72, 'App\\Models\\User', 3, 'auth_token', '777b28395d324855149e6b4a00b5749dc049fe83a7ab01dd893e4896f5a48cb5', '[\"*\"]', NULL, NULL, '2026-05-09 16:53:38', '2026-05-09 16:53:38'),
(73, 'App\\Models\\User', 3, 'auth_token', '5017c84436f6b616a214c881d344f6d28afbbc821f238c7a67e2b0b82f5160e8', '[\"*\"]', '2026-05-09 16:54:19', NULL, '2026-05-09 16:54:01', '2026-05-09 16:54:19'),
(74, 'App\\Models\\User', 1, 'auth_token', 'b792609ca3422d9c2f9cbd5e103b6730c4da81f5a432a71a3c72e9c7642725f3', '[\"*\"]', '2026-05-10 05:34:01', NULL, '2026-05-10 05:33:18', '2026-05-10 05:34:01'),
(75, 'App\\Models\\User', 1, 'auth_token', 'b6f7604f49bc88a4cf1fd80d7a95d5b1fd4f5a418a845008956250f2102977dc', '[\"*\"]', NULL, NULL, '2026-05-10 05:38:08', '2026-05-10 05:38:08'),
(76, 'App\\Models\\User', 1, 'auth_token', 'c29f6cb3b4febc62ac1cd77914e9b922a835d65164a449975e661c76c39c2222', '[\"*\"]', NULL, NULL, '2026-05-10 05:39:55', '2026-05-10 05:39:55'),
(77, 'App\\Models\\User', 2, 'auth_token', '1891049d5f88495e767334dde094bcdf1308e4ae3e337febe434e50cd760f23b', '[\"*\"]', NULL, NULL, '2026-05-10 05:40:03', '2026-05-10 05:40:03'),
(78, 'App\\Models\\User', 1, 'auth_token', '8211211a51e5da59ba19563f2c0c66e6f350b748b122f3d96730f886115097a1', '[\"*\"]', NULL, NULL, '2026-05-10 05:59:44', '2026-05-10 05:59:44'),
(79, 'App\\Models\\User', 1, 'auth_token', '59b49c837f0e9732fd69b5237c661b4533544a626d58775bfd6f893d167d7718', '[\"*\"]', NULL, NULL, '2026-07-29 09:01:16', '2026-07-29 09:01:16'),
(80, 'App\\Models\\User', 2, 'auth_token', 'a71256d060154b0b5d8db20fb94ec43e7c6a01ff4f55c9b6668806568d66fa9b', '[\"*\"]', '2026-07-29 09:01:36', NULL, '2026-07-29 09:01:29', '2026-07-29 09:01:36');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('PY8FlYR3mZmLSZtSMnGiXoAlP8ySlQHoV9RuHO7B', NULL, '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/147.0.7727.99 Mobile/15E148 Safari/604.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVDU2a1c1UXRIUmRQY2k4d3dQTzVpeGxOcm5OSkllcE8ycFB5SGJzaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjA6Imh0dHA6Ly91bm1pcmFjdWxvdXNseS1ub25leGhhdXN0aWJsZS1zaGFsYW5kYS5uZ3Jvay1mcmVlLmRldiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777742946),
('q2KKLVlCp4tRw2a8Ok1yosgdrnWXDSo4aTr7RriH', NULL, '127.0.0.1', 'WhatsApp/2.2615.101 W', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSGo0VXlBcFF6MlVBV2RRSXpZSHE2TkM1SnNJbHk4RnlFbjdDc1BXVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjA6Imh0dHA6Ly91bm1pcmFjdWxvdXNseS1ub25leGhhdXN0aWJsZS1zaGFsYW5kYS5uZ3Jvay1mcmVlLmRldiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777734733);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `blood_type` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `age`, `phone`, `blood_type`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'BASKOTA', 'Baskota@gmail.com', NULL, '$2y$12$V4Ibm4XvrV0vFyBtlgWvyuIXI7As.kWNd.weWcasWvszdP3r.Lgz6', 21, '01228249057', 'A+', 'admin', NULL, '2026-05-01 18:24:28', '2026-05-01 20:17:27'),
(2, 'مازن  البسيوني', 'mazen@gmail.com', NULL, '$2y$12$GcYf0jRnn0BPijEphsCNhePHEMMrH.nfl0DVKmnef11ezRT77YhcO', 20, '01222331212', 'A+', 'user', NULL, '2026-05-01 20:19:36', '2026-05-01 20:19:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood_requests`
--
ALTER TABLE `blood_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blood_requests_city_id_foreign` (`city_id`),
  ADD KEY `blood_requests_hospital_id_foreign` (`hospital_id`),
  ADD KEY `patients-id-bloodrequests` (`patient_id`);

--
-- Indexes for table `blood_stocks`
--
ALTER TABLE `blood_stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_ibfk_1` (`hospital_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donors`
--
ALTER TABLE `donors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `donors_city_id_foreign` (`city_id`),
  ADD KEY `donors_hospital_id_foreign` (`hospital_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hospitals_city_id_foreign` (`city_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ordering` (`hospital_id`),
  ADD KEY `cons_shops` (`city_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blood_requests`
--
ALTER TABLE `blood_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `blood_stocks`
--
ALTER TABLE `blood_stocks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `donors`
--
ALTER TABLE `donors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blood_requests`
--
ALTER TABLE `blood_requests`
  ADD CONSTRAINT `blood_requests_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blood_requests_hospital_id_foreign` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `patients-id-bloodrequests` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

--
-- Constraints for table `blood_stocks`
--
ALTER TABLE `blood_stocks`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`);

--
-- Constraints for table `donors`
--
ALTER TABLE `donors`
  ADD CONSTRAINT `donors_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `donors_hospital_id_foreign` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD CONSTRAINT `hospitals_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `cons_shops` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  ADD CONSTRAINT `ordering` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
