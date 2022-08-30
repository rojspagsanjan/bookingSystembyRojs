-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2021 at 04:41 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookingsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `stocks` varchar(255) NOT NULL,
  `addedby` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '1 = active, 2 = deleted'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `author`, `price`, `stocks`, `addedby`, `status`) VALUES
(1, 'Letting Go', 'Philip Roth', '170', '100', 'cpadmin', 1),
(2, 'Fear of Flying', 'Erica Jong', '150', '5', 'cpadmin', 1),
(3, 'Encyclopedia Brown, Boy Detective', 'Donald J. Sobol', '50', '1', 'cpadmin', 1),
(4, 'The Phantom Tollbooth', 'NORTON JUSTER', '890', '10', 'rmpagsanjan', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bu_password` varchar(255) NOT NULL,
  `usertype` int(11) NOT NULL DEFAULT '2' COMMENT '1 = admin, 2 = users',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '1 = active, 2 = deactivated, 3 = deleted'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `username`, `password`, `bu_password`, `usertype`, `status`) VALUES
(1, 'Cloud ', 'Panda PH', 'cpadmin', '$2y$10$NgAHDzeIXnLBd5VJoxtLTu1/.n56yC5ilXO00zFIJGoOLZMFGPuz2', 'admin@123!', 1, 1),
(2, 'Rogen Mae', 'Pagsanjan', 'rmpagsanjan', '$2y$10$OKsAdvihv.FUnid/qK1Neu1YpKOh7aOkOx7OfwerA03wLule/2PJ6', 'password@123!', 2, 1),
(3, 'John Doe', 'Lopez', 'jdlopez', '$2y$10$zVEpFSlmULZDPp.prj2B0eJ5yk/iYxBTB.Bn1JJf7326msAsj8SHG', 'password@2021!', 2, 1),
(4, 'Peter John', 'Perez', 'pjperez', '$2y$10$/0Z3rakPFh1vkRp8rrepTuuwLxonfYwKjycrY4nzMLqU92ZmUwlMO', 'password@123!!', 2, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
