-- phpMyAdmin SQL Dump
-- version 4.4.15.7
-- http://www.phpmyadmin.net
--
-- 主機: 127.0.0.1
-- 產生時間： 2018 年 12 月 30 日 17:14
-- 伺服器版本: 5.6.37
-- PHP 版本： 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `hspt`
--

-- --------------------------------------------------------

--
-- 資料表結構 `CaseDepartment`
--

CREATE TABLE IF NOT EXISTS `CaseDepartment` (
  `ID` int(11) NOT NULL COMMENT '序號 (PK)',
  `caseNumber` varchar(11) COLLATE utf8_unicode_ci NOT NULL COMMENT '病歷號',
  `Department_ID` int(11) NOT NULL COMMENT '分部編號 (FK)',
  `Patients_ID` int(11) NOT NULL COMMENT '病患編號 (FK)',
  `firstTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '初診時間',
  `User_account` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號'
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='分部病患';

--
-- 資料表的匯出資料 `CaseDepartment`
--

INSERT INTO `CaseDepartment` (`ID`, `caseNumber`, `Department_ID`, `Patients_ID`, `firstTime`, `User_account`) VALUES
(1, '1', 1, 1, '2016-10-01 00:00:00', ''),
(2, '1', 2, 1, '2016-12-15 00:00:00', ''),
(3, '台南學善001', 1, 3, '2017-06-17 08:00:00', ''),
(4, '台南學善002', 1, 4, '2017-06-17 08:00:00', ''),
(5, '台南學善003', 1, 5, '2017-06-17 08:00:00', ''),
(6, '台南學善004', 1, 6, '2017-06-17 08:00:00', ''),
(7, '台南學善005', 1, 7, '2017-06-17 08:00:00', ''),
(8, '台南學善006', 1, 8, '2017-06-17 08:00:00', ''),
(9, '台南學善007', 1, 9, '2017-06-17 08:00:00', ''),
(10, '台南學善008', 1, 10, '2017-06-17 08:00:00', ''),
(11, '台南學善009', 1, 11, '2017-06-17 08:00:00', ''),
(12, '台南學善010', 1, 12, '2017-06-17 08:00:00', ''),
(13, '台南學善011', 1, 13, '2017-06-17 08:00:00', ''),
(14, '台南學善012', 1, 14, '2017-06-17 08:00:00', ''),
(15, '台南學善013', 1, 15, '2017-06-17 08:00:00', ''),
(16, '台南學善014', 1, 16, '2017-06-17 08:00:00', ''),
(17, '台南學善015', 1, 17, '2017-06-17 08:00:00', ''),
(18, '台南學善016', 1, 18, '2017-06-17 08:00:00', ''),
(19, '台南學善017', 1, 19, '2017-06-17 08:00:00', ''),
(20, '台南學善018', 1, 20, '2017-06-17 08:00:00', ''),
(21, '台南學善019', 1, 21, '2017-06-17 08:00:00', ''),
(22, '台南學善020', 1, 22, '2017-06-17 08:00:00', ''),
(23, '台中學善001', 2, 3, '2017-06-17 08:00:00', ''),
(24, '台中學善002', 2, 4, '2017-06-17 08:00:00', ''),
(25, '台中學善003', 2, 5, '2017-06-17 08:00:00', ''),
(26, '台中學善004', 2, 6, '2017-06-17 08:00:00', ''),
(27, '台中學善005', 2, 7, '2017-06-17 08:00:00', ''),
(28, '台中學善006', 2, 8, '2017-06-17 08:00:00', ''),
(29, '台中學善007', 2, 9, '2017-06-17 08:00:00', ''),
(30, '台中學善008', 2, 10, '2017-06-17 08:00:00', ''),
(31, '台中學善009', 2, 11, '2017-06-17 08:00:00', ''),
(32, '台中學善010', 2, 12, '2017-06-17 08:00:00', ''),
(33, '台中學善011', 2, 13, '2017-06-17 08:00:00', ''),
(34, '台中學善012', 2, 14, '2017-06-17 08:00:00', ''),
(35, '台中學善013', 2, 15, '2017-06-17 08:00:00', ''),
(36, '台中學善014', 2, 16, '2017-06-17 08:00:00', ''),
(37, '台中學善015', 2, 17, '2017-06-17 08:00:00', ''),
(38, '台中學善016', 2, 18, '2017-06-17 08:00:00', ''),
(39, '台中學善017', 2, 19, '2017-06-17 08:00:00', ''),
(40, '台中學善018', 2, 20, '2017-06-17 08:00:00', ''),
(41, '台中學善019', 2, 21, '2017-06-17 08:00:00', ''),
(42, '台中學善020', 2, 22, '2017-06-17 08:00:00', ''),
(43, '台南仕安001', 3, 23, '2017-06-17 08:00:00', ''),
(44, '台南仕安002', 3, 24, '2017-06-17 08:00:00', ''),
(45, '台南仕安003', 3, 25, '2017-06-17 08:00:00', ''),
(46, '台南仕安004', 3, 26, '2017-06-17 08:00:00', ''),
(47, '台南仕安005', 3, 27, '2017-06-17 08:00:00', ''),
(48, '台南仕安006', 3, 28, '2017-06-17 08:00:00', ''),
(49, '台南仕安007', 3, 29, '2017-06-17 08:00:00', ''),
(50, '台南仕安008', 3, 30, '2017-06-17 08:00:00', ''),
(51, '台南仕安009', 3, 31, '2017-06-17 08:00:00', ''),
(52, '台南仕安010', 3, 32, '2017-06-17 08:00:00', ''),
(53, '台南仕安011', 3, 33, '2017-06-17 08:00:00', ''),
(54, '台南仕安012', 3, 34, '2017-06-17 08:00:00', ''),
(55, '台南仕安013', 3, 35, '2017-06-17 08:00:00', ''),
(56, '台南仕安014', 3, 36, '2017-06-17 08:00:00', ''),
(57, '台南仕安015', 3, 37, '2017-06-17 08:00:00', ''),
(58, '台南仕安016', 3, 38, '2017-06-17 08:00:00', ''),
(59, '台南仕安017', 3, 39, '2017-06-17 08:00:00', ''),
(60, '台南仕安018', 3, 20, '2017-06-17 08:00:00', ''),
(61, '台南仕安019', 3, 21, '2017-06-17 08:00:00', ''),
(62, '台南仕安020', 3, 22, '2017-06-17 08:00:00', ''),
(63, '台北學善001', 4, 41, '2017-06-17 08:00:00', ''),
(64, '台北學善002', 4, 42, '2017-06-17 08:00:00', ''),
(65, '台北學善003', 4, 43, '2017-06-17 08:00:00', ''),
(66, '台北學善004', 4, 44, '2017-06-17 08:00:00', ''),
(67, '台北學善005', 4, 45, '2017-06-17 08:00:00', ''),
(68, '台北學善006', 4, 46, '2017-06-17 08:00:00', ''),
(69, '台北學善007', 4, 47, '2017-06-17 08:00:00', ''),
(70, '台北學善008', 4, 48, '2017-06-17 08:00:00', ''),
(71, '台北學善009', 4, 49, '2017-06-17 08:00:00', ''),
(72, '台北學善010', 4, 32, '2017-06-17 08:00:00', ''),
(73, '台北學善011', 4, 33, '2017-06-17 08:00:00', ''),
(74, '台北學善012', 4, 34, '2017-06-17 08:00:00', ''),
(75, '台北學善013', 4, 35, '2017-06-17 08:00:00', ''),
(76, '台北學善014', 4, 36, '2017-06-17 08:00:00', ''),
(77, '台北學善015', 4, 37, '2017-06-17 08:00:00', ''),
(78, '台北學善016', 4, 38, '2017-06-17 08:00:00', ''),
(79, '台北學善017', 4, 39, '2017-06-17 08:00:00', ''),
(80, '台北學善018', 4, 50, '2017-06-17 08:00:00', ''),
(81, '台北學善019', 4, 51, '2017-06-17 08:00:00', ''),
(82, '台北學善020', 4, 52, '2017-06-17 08:00:00', ''),
(99, '1', 4, 72, '2018-03-03 18:19:37', 'admin'),
(100, '2', 3, 72, '2018-03-03 18:21:50', 'admin'),
(101, '9', 1, 72, '2018-03-04 12:03:09', 'test311'),
(102, '10', 1, 73, '2018-05-27 01:07:03', 'admin'),
(103, '11', 1, 74, '2018-06-24 11:28:34', 'admin');

-- --------------------------------------------------------

--
-- 資料表結構 `CaseHistory`
--

CREATE TABLE IF NOT EXISTS `CaseHistory` (
  `ID` int(11) NOT NULL COMMENT '就醫編號 (PK)',
  `CaseDepartment_ID` int(11) NOT NULL COMMENT '病歷編號 (FK)',
  `time` datetime NOT NULL COMMENT '就醫時間',
  `note` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '就醫備註',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號',
  `User_account2` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '治療師帳號',
  `User_account3` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新者帳號',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `updateTime` datetime DEFAULT NULL COMMENT '更新時間'
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='就醫紀錄';

--
-- 資料表的匯出資料 `CaseHistory`
--

INSERT INTO `CaseHistory` (`ID`, `CaseDepartment_ID`, `time`, `note`, `User_account1`, `User_account2`, `User_account3`, `createTime`, `updateTime`) VALUES
(68, 3, '2018-06-09 00:00:00', '', 'admin', 'admin', NULL, '2018-06-09 23:39:37', NULL),
(69, 3, '2018-06-09 23:46:35', '', 'admin', 'admin', NULL, '2018-06-09 23:47:42', NULL),
(75, 10, '2018-06-24 01:12:00', '', 'admin', 'test312', NULL, '2018-06-24 01:12:51', NULL),
(78, 10, '2018-06-24 01:38:00', '', 'admin', 'dapartTherapist1', NULL, '2018-06-24 01:39:25', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `CaseMerchandise`
--

CREATE TABLE IF NOT EXISTS `CaseMerchandise` (
  `ID` int(11) NOT NULL COMMENT '病歷商品編號 (PK)',
  `CaseHistory_ID` int(11) NOT NULL COMMENT '就醫編號 (FK)',
  `Merchandise_ID` int(11) NOT NULL COMMENT '商品編號 (FK)',
  `amount` int(11) NOT NULL COMMENT '數量',
  `price` int(11) NOT NULL COMMENT '當時定價',
  `charge` int(11) NOT NULL COMMENT '實收金額',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號 (FK)',
  `User_account2` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新者帳號',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `updateTime` datetime DEFAULT NULL COMMENT '更新時間',
  `isDelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否刪除'
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='病歷商品';

--
-- 資料表的匯出資料 `CaseMerchandise`
--

INSERT INTO `CaseMerchandise` (`ID`, `CaseHistory_ID`, `Merchandise_ID`, `amount`, `price`, `charge`, `User_account1`, `User_account2`, `createTime`, `updateTime`, `isDelete`) VALUES
(36, 68, 6, 10, 100, 1000, 'admin', NULL, '2018-06-09 23:39:37', NULL, 0),
(37, 69, 4, 1, 100, 100, 'admin', NULL, '2018-06-09 23:47:42', NULL, 0),
(38, 69, 6, 1, 100, 100, 'admin', NULL, '2018-06-09 23:47:42', NULL, 0),
(39, 68, 3, 1, 100, 500, 'admin', NULL, '2018-06-23 22:44:45', NULL, 0),
(40, 68, 4, 1, 100, 99, 'admin', NULL, '2018-06-23 22:44:45', NULL, 0),
(41, 75, 4, 1, 100, 100, 'admin', NULL, '2018-06-24 01:12:51', NULL, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `CaseMerchandiseRecord`
--

CREATE TABLE IF NOT EXISTS `CaseMerchandiseRecord` (
  `ID` int(11) NOT NULL COMMENT '病歷關聯商品批號ID',
  `CaseMerchandise_ID` int(11) NOT NULL COMMENT '病歷商品ID',
  `MerchandiseRecord_ID` int(11) DEFAULT NULL COMMENT '商品入庫ID',
  `amount` int(11) NOT NULL COMMENT '數量',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號',
  `CreateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `User_account2` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改者帳號',
  `UpdateTime` datetime DEFAULT NULL COMMENT '修改時間',
  `isDelete` int(1) NOT NULL COMMENT '是否刪除'
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 資料表的匯出資料 `CaseMerchandiseRecord`
--

INSERT INTO `CaseMerchandiseRecord` (`ID`, `CaseMerchandise_ID`, `MerchandiseRecord_ID`, `amount`, `User_account1`, `CreateTime`, `User_account2`, `UpdateTime`, `isDelete`) VALUES
(8, 36, 4, 1, 'admin', '2018-06-09 23:39:37', NULL, NULL, 0),
(9, 36, 6, 2, 'admin', '2018-06-09 23:39:37', NULL, NULL, 0),
(10, 36, 7, 7, 'admin', '2018-06-09 23:39:37', NULL, NULL, 0),
(11, 37, 0, 1, 'admin', '2018-06-09 23:47:42', NULL, NULL, 0),
(12, 38, 7, 1, 'admin', '2018-06-09 23:47:42', NULL, NULL, 0),
(13, 39, 1, 1, 'admin', '2018-06-23 22:44:45', NULL, NULL, 0),
(14, 40, 3, 1, 'admin', '2018-06-23 22:44:45', NULL, NULL, 0),
(15, 41, 0, 1, 'admin', '2018-06-24 01:12:51', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `CaseTreatment`
--

CREATE TABLE IF NOT EXISTS `CaseTreatment` (
  `ID` int(11) NOT NULL COMMENT '治療紀錄編號 (PK)',
  `CaseHistory_ID` int(11) NOT NULL COMMENT '就醫編號 (FK)',
  `Disease_ID` int(11) NOT NULL COMMENT '症狀編號 (FK)',
  `TreatmentPrice_ID` int(11) NOT NULL COMMENT '治療包裝價格(FK)',
  `Treatment_ID` int(11) NOT NULL COMMENT '治療編號 (FK)',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號 (FK)',
  `User_account2` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新者帳號',
  `price` int(11) NOT NULL COMMENT '當時定價',
  `charge` int(11) NOT NULL COMMENT '實收金額',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `updateTime` datetime DEFAULT NULL COMMENT '更新時間',
  `isDelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否刪除'
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療紀錄';

--
-- 資料表的匯出資料 `CaseTreatment`
--

INSERT INTO `CaseTreatment` (`ID`, `CaseHistory_ID`, `Disease_ID`, `TreatmentPrice_ID`, `Treatment_ID`, `User_account1`, `User_account2`, `price`, `charge`, `createTime`, `updateTime`, `isDelete`) VALUES
(133, 68, 5, 3, 5, 'admin', 'admin', 100, 150, '2018-06-09 23:39:37', '2018-06-23 22:44:44', 0),
(134, 68, 5, 3, 4, 'admin', 'admin', 100, 150, '2018-06-09 23:39:37', '2018-06-23 22:44:44', 0),
(135, 68, 1, 2, 2, 'admin', NULL, 100, 100, '2018-06-09 23:39:37', NULL, 0),
(136, 69, 1, 2, 2, 'admin', NULL, 100, 100, '2018-06-09 23:47:42', NULL, 0),
(137, 69, 5, 3, 5, 'admin', 'admin', 100, 100, '2018-06-09 23:47:42', '2018-08-19 23:42:49', 0),
(138, 69, 5, 3, 5, 'admin', 'admin', 100, 150, '2018-06-09 23:47:42', '2018-06-23 22:35:39', 0),
(139, 68, 5, 3, 4, 'admin', NULL, 100, 150, '2018-06-23 22:35:39', NULL, 0),
(140, 70, 1, 2, 2, 'admin', NULL, 100, 100, '2018-06-24 01:09:00', NULL, 0),
(141, 71, 1, 2, 2, 'admin', NULL, 100, 100, '2018-06-24 01:09:27', NULL, 0),
(142, 72, 1, 1, 12, 'admin', NULL, 123, 123, '2018-06-24 01:09:36', NULL, 0),
(143, 73, 1, 1, 12, 'admin', NULL, 123, 123, '2018-06-24 01:10:05', NULL, 0),
(144, 74, 1, 1, 12, 'admin', NULL, 123, 123, '2018-06-24 01:12:01', NULL, 0),
(145, 75, 5, 3, 13, 'admin', NULL, 100, 100, '2018-06-24 01:12:51', NULL, 0),
(146, 76, 5, 3, 13, 'admin', NULL, 200, 200, '2018-06-24 01:13:32', NULL, 0),
(147, 76, 5, 3, 11, 'admin', NULL, 200, 200, '2018-06-24 01:13:32', NULL, 0),
(148, 76, 5, 3, 5, 'admin', NULL, 200, 200, '2018-06-24 01:13:32', NULL, 0),
(149, 76, 5, 3, 4, 'admin', NULL, 200, 200, '2018-06-24 01:13:32', NULL, 0),
(150, 77, 5, 3, 11, 'admin', NULL, 100, 100, '2018-06-24 01:19:24', NULL, 0),
(151, 78, 5, 3, 13, 'admin', NULL, 100, 599, '2018-06-24 01:39:25', NULL, 0),
(152, 69, 1, 1, 3, 'admin', 'admin', 123, 1234, '2018-06-24 11:30:50', '2018-08-19 23:41:50', 0),
(153, 69, 1, 1, 3, 'admin', NULL, 123, 1234, '2018-08-19 23:42:49', NULL, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `DBTrack`
--

CREATE TABLE IF NOT EXISTS `DBTrack` (
  `ID` int(11) NOT NULL COMMENT '追蹤編號 (PK)',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '帳號 (FK)',
  `SQLfrom` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'SQL語法',
  `SQLcondition` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT 'SQL語法',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='資料庫操作紀錄';

-- --------------------------------------------------------

--
-- 資料表結構 `Department`
--

CREATE TABLE IF NOT EXISTS `Department` (
  `ID` int(11) NOT NULL COMMENT '分部編號 (PK)',
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '分部名稱',
  `status` int(11) NOT NULL COMMENT '分部狀態(0=非營業 1=營業中)',
  `phone1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '連絡電話',
  `phone2` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '連絡電話(手機)',
  `address` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '分部地址'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='診所分部';

--
-- 資料表的匯出資料 `Department`
--

INSERT INTO `Department` (`ID`, `name`, `status`, `phone1`, `phone2`, `address`) VALUES
(1, '台南學善物理治療所', 1, '06-2608867', '', '台南市東區崇善路233-6號'),
(2, '台中學善物理治療所', 1, '02-28312465', '', '台北市士林區福國路50巷6弄8號'),
(3, '台南仕安物理治療所', 1, '06-7213939', '', '台南市佳里區公園路262號'),
(4, '台北學善物理治療所', 1, '04-23055637', '', '台中市西區向上路一段105號');

-- --------------------------------------------------------

--
-- 資料表結構 `Disease`
--

CREATE TABLE IF NOT EXISTS `Disease` (
  `ID` int(11) NOT NULL COMMENT '症狀編號 (PK)',
  `part` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '身體部位',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '病症名稱',
  `status` int(11) NOT NULL COMMENT '是否啟用(0=不可用 1=可用)'
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療症狀';

--
-- 資料表的匯出資料 `Disease`
--

INSERT INTO `Disease` (`ID`, `part`, `name`, `status`) VALUES
(1, 'Shoulder', 'Dysfunction', 1),
(2, 'Neck', 'Derangement', 1),
(3, '腳', '瘀青', 1),
(4, '頭', '擦傷', 0),
(5, '腰椎', '椎間盤突出', 1),
(6, 'hand', 'new hurt', 0),
(7, 'hand', 'hurt', 0);

-- --------------------------------------------------------

--
-- 資料表結構 `Merchandise`
--

CREATE TABLE IF NOT EXISTS `Merchandise` (
  `ID` int(11) NOT NULL COMMENT '商品編號 (PK)',
  `Department_ID` int(11) NOT NULL COMMENT '分部編號 (FK)',
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '商品名稱',
  `size` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '商品規格',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新時間',
  `warning` int(11) NOT NULL COMMENT '警示量',
  `price` int(11) NOT NULL COMMENT '定價',
  `remaining` int(11) NOT NULL COMMENT '剩餘數量',
  `status` int(1) NOT NULL COMMENT '是否啟用',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號 (FK)'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品';

--
-- 資料表的匯出資料 `Merchandise`
--

INSERT INTO `Merchandise` (`ID`, `Department_ID`, `name`, `size`, `updateTime`, `warning`, `price`, `remaining`, `status`, `User_account1`) VALUES
(1, 1, '按摩藥膏', '5ml', '2016-10-02 00:00:00', 5, 35, 1, 0, 'admin'),
(3, 1, '瑜珈墊', 'S', '0000-00-00 00:00:00', 0, 0, -1, 1, 'admin'),
(4, 1, '瑜珈墊', 'M', '2017-08-12 19:35:54', 5, 100, -4, 1, 'admin'),
(5, 1, '瑜珈墊', 'XL', '2018-04-15 13:24:05', 5, 99, 1, 1, 'admin'),
(6, 1, '瑜珈墊', 'L', '2018-05-26 23:45:31', 5, 100, 2, 1, 'admin');

-- --------------------------------------------------------

--
-- 資料表結構 `MerchandiseRecord`
--

CREATE TABLE IF NOT EXISTS `MerchandiseRecord` (
  `ID` int(11) NOT NULL COMMENT '進貨編號 (PK)',
  `Merchandise_ID` int(11) NOT NULL COMMENT '商品編號 (FK)',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入庫時間',
  `type` int(11) NOT NULL COMMENT '庫存異動類型',
  `amount` int(11) NOT NULL COMMENT '入庫數量',
  `cost` int(11) NOT NULL COMMENT '入庫成本',
  `unitCost` decimal(10,0) NOT NULL COMMENT '單位成本',
  `remaining` int(11) NOT NULL COMMENT '剩餘數量',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號 (FK)',
  `User_account2` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '刪除者帳號',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `deleteTime` datetime NOT NULL COMMENT '刪除時間',
  `status` int(1) NOT NULL COMMENT '是否啟用'
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品進貨紀錄';

--
-- 資料表的匯出資料 `MerchandiseRecord`
--

INSERT INTO `MerchandiseRecord` (`ID`, `Merchandise_ID`, `time`, `type`, `amount`, `cost`, `unitCost`, `remaining`, `User_account1`, `User_account2`, `createTime`, `deleteTime`, `status`) VALUES
(1, 3, '2018-05-01 23:00:00', 1, 5, 100, 20, 0, 'admin', '', '2018-05-02 00:09:04', '2018-05-02 00:12:48', 1),
(2, 3, '2018-05-01 23:00:00', 1, 5, 100, 20, 5, 'admin', 'admin', '2018-05-02 00:09:41', '2018-05-02 00:21:43', 0),
(3, 4, '2018-05-26 23:21:22', 1, 10, 1000, 100, 0, 'admin', '', '2018-05-26 23:21:38', '0000-00-00 00:00:00', 1),
(4, 6, '2018-05-26 23:46:22', 1, 5, 500, 100, 0, 'admin', '', '2018-05-26 23:51:44', '0000-00-00 00:00:00', 1),
(5, 6, '2018-05-27 00:08:58', 2, -3, 300, -100, 0, 'admin', '', '2018-05-27 00:10:21', '0000-00-00 00:00:00', 1),
(6, 6, '2018-05-27 00:10:29', 1, 8, 800, 100, 0, 'admin', '', '2018-05-27 00:13:29', '0000-00-00 00:00:00', 1),
(7, 6, '2018-05-27 00:13:36', 1, 3, 480, 160, 2, 'admin', '', '2018-05-27 00:14:55', '0000-00-00 00:00:00', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `Patients`
--

CREATE TABLE IF NOT EXISTS `Patients` (
  `ID` int(11) NOT NULL COMMENT '病患編號 (PK)',
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '姓名',
  `pID` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '身分證字號',
  `birthday` date NOT NULL COMMENT '出生年月日',
  `gender` varchar(5) COLLATE utf8_unicode_ci NOT NULL COMMENT '性別',
  `phone1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '電話',
  `phone2` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '電話',
  `address` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '地址',
  `note` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '備註'
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='病患資料';

--
-- 資料表的匯出資料 `Patients`
--

INSERT INTO `Patients` (`ID`, `name`, `pID`, `birthday`, `gender`, `phone1`, `phone2`, `address`, `note`) VALUES
(1, '測試病患', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(2, 'patient1', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(3, 'patient01', '', '2016-10-02', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(4, 'patient02', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(5, 'patient03', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(6, 'patient04', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(7, 'patient05', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(8, 'patient06', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(9, 'patient07', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(10, 'patient08', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(11, 'patient09', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(12, 'patient10', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(13, 'patient11', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(14, 'patient12', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(15, 'patient13', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(16, 'patient14', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(17, 'patient15', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(18, 'patient16', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(19, 'patient17', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(20, 'patient18', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(21, 'patient19', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(22, 'patient20', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(23, 'patient21', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(24, 'patient22', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(25, 'patient23', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(26, 'patient24', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(27, 'patient25', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(28, 'patient26', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(29, 'patient27', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(30, 'patient28', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(31, 'patient29', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(32, 'patient30', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(33, 'patient31', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(34, 'patient32', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(35, 'patient33', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(36, 'patient34', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(37, 'patient35', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(38, 'patient36', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(39, 'patient37', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(40, 'patient38', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(41, 'patient39', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(42, 'patient40', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(43, 'patient41', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(44, 'patient42', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(45, 'patient43', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(46, 'patient44', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(47, 'patient45', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(48, 'patient46', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(49, 'patient47', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(50, 'patient48', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(51, 'patient49', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(52, 'patient50', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(53, 'patient51', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(54, 'patient52', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(55, 'patient53', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(56, 'patient54', '', '2016-10-01', '男', '0800000123', '', '台南市佳里區公園路262號', ''),
(72, 'zhiHong', 'S0000000', '2018-01-01', '7', '0800000123', '', 'Taiwan', 'no more note\none note\ntwo note test'),
(73, '陳志鴻', 'A00000000', '2018-05-27', '男', '123456789', '', '123', ''),
(74, '賴育達', 'E12345678', '1992-06-26', '男', '0912123213', '', '台中', '');

-- --------------------------------------------------------

--
-- 資料表結構 `Permission`
--

CREATE TABLE IF NOT EXISTS `Permission` (
  `ID` int(11) NOT NULL COMMENT '權限序號',
  `name` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT '權限名稱',
  `p01` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限01',
  `p02` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限02',
  `p03` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限03',
  `p04` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限04',
  `p05` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限05',
  `p06` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限06',
  `p07` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限07',
  `p08` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限08',
  `p09` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限09',
  `p10` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限10',
  `p11` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限11',
  `p12` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限12',
  `p13` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限13',
  `p14` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限14',
  `p15` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限15',
  `p16` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限16',
  `p17` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限17',
  `p18` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限18',
  `p19` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限19',
  `p20` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限20',
  `p21` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限21',
  `p22` tinyint(1) NOT NULL DEFAULT '0' COMMENT '權限22',
  `status` int(11) NOT NULL COMMENT '是否啟用'
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='角色權限設定';

--
-- 資料表的匯出資料 `Permission`
--

INSERT INTO `Permission` (`ID`, `name`, `p01`, `p02`, `p03`, `p04`, `p05`, `p06`, `p07`, `p08`, `p09`, `p10`, `p11`, `p12`, `p13`, `p14`, `p15`, `p16`, `p17`, `p18`, `p19`, `p20`, `p21`, `p22`, `status`) VALUES
(1, '管理者', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
(8, '分部管理者', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0),
(10, '會計人員', 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `SCCaseNumber`
--

CREATE TABLE IF NOT EXISTS `SCCaseNumber` (
  `ID` int(11) NOT NULL COMMENT 'ID',
  `Department_ID` int(11) NOT NULL COMMENT '分部ID',
  `caseNumber` int(11) NOT NULL COMMENT '分部末碼病歷號'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='系統設定-分部末碼病歷號';

--
-- 資料表的匯出資料 `SCCaseNumber`
--

INSERT INTO `SCCaseNumber` (`ID`, `Department_ID`, `caseNumber`) VALUES
(1, 1, 11),
(2, 2, 2),
(3, 3, 2),
(4, 4, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `SystemTrack`
--

CREATE TABLE IF NOT EXISTS `SystemTrack` (
  `ID` int(11) NOT NULL COMMENT '追蹤編號 (PK)',
  `User_account1` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '帳號 (FK)',
  `detail` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '操作敘述',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='系統操作紀錄';

-- --------------------------------------------------------

--
-- 資料表結構 `Treatment`
--

CREATE TABLE IF NOT EXISTS `Treatment` (
  `ID` int(11) NOT NULL COMMENT '治療編號 (PK)',
  `TreatmentType_ID` int(11) NOT NULL COMMENT '治療類型(FK)',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '治療名稱',
  `status` int(11) NOT NULL COMMENT '是否啟用(0=不可用 1=可用)'
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療方式';

--
-- 資料表的匯出資料 `Treatment`
--

INSERT INTO `Treatment` (`ID`, `TreatmentType_ID`, `name`, `status`) VALUES
(1, 1, 'new1', 0),
(2, 2, '拉筋', 1),
(3, 1, '推拿', 0),
(4, 3, '肌肉放鬆', 1),
(5, 3, '神經鬆動', 1),
(6, 3, '測試治療1', 1),
(7, 3, '測試治療2', 1),
(8, 3, '測試治療3', 0),
(9, 3, '測試治療4', 0),
(10, 3, '測試治療3', 1),
(11, 3, '測試治療4', 1),
(12, 1, '123', 1),
(13, 3, '1234', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `TreatmentPrice`
--

CREATE TABLE IF NOT EXISTS `TreatmentPrice` (
  `ID` int(11) NOT NULL COMMENT '價格編號(PK)',
  `Disease_ID` int(11) NOT NULL COMMENT '症狀編號(FK)',
  `Department_ID` int(11) NOT NULL COMMENT '分部編號(FK)',
  `TreatmentType_ID` int(11) NOT NULL COMMENT '治療類型',
  `price` int(11) NOT NULL COMMENT '定價',
  `status` int(11) NOT NULL COMMENT '是否啟用'
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療價格';

--
-- 資料表的匯出資料 `TreatmentPrice`
--

INSERT INTO `TreatmentPrice` (`ID`, `Disease_ID`, `Department_ID`, `TreatmentType_ID`, `price`, `status`) VALUES
(1, 5, 2, 3, 200, 1),
(2, 1, 1, 2, 200, 0),
(3, 2, 1, 1, 100, 1),
(4, 3, 1, 1, 100, 1),
(5, 4, 1, 1, 100, 1),
(6, 5, 1, 3, 100, 1),
(7, 1, 1, 1, 123, 1),
(8, 1, 1, 3, 150, 1),
(9, 1, 1, 2, 100, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `TreatmentType`
--

CREATE TABLE IF NOT EXISTS `TreatmentType` (
  `ID` int(11) NOT NULL COMMENT '價格編號(PK)',
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '類型名稱',
  `status` int(11) NOT NULL COMMENT '是否啟用'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療類型';

--
-- 資料表的匯出資料 `TreatmentType`
--

INSERT INTO `TreatmentType` (`ID`, `name`, `status`) VALUES
(1, '徒手治療', 1),
(2, '運動治療', 1),
(3, '關節鬆動術', 1),
(4, '儀器治療', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `ID` int(11) NOT NULL COMMENT '使用者ID',
  `account` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '使用者帳號',
  `password` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '密碼',
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '姓名',
  `type` int(11) NOT NULL COMMENT '使用者類型',
  `Permission_ID` int(11) NOT NULL COMMENT '角色權限ID',
  `isTherapist` int(1) DEFAULT NULL COMMENT '是否為診療師',
  `Department_ID` int(11) NOT NULL COMMENT '可操作分店',
  `status` int(11) DEFAULT NULL COMMENT '是否啟用',
  `checkMerchandise` date DEFAULT NULL COMMENT '商品庫存通知'
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='使用者';

--
-- 資料表的匯出資料 `User`
--

INSERT INTO `User` (`ID`, `account`, `password`, `name`, `type`, `Permission_ID`, `isTherapist`, `Department_ID`, `status`, `checkMerchandise`) VALUES
(1, 'admin', 'hspt1', '管理者', 1, 1, 0, 2, 1, NULL),
(2, 'store1', 'hspt', '分店1店長', 3, 8, NULL, 1, 0, NULL),
(4, 'store2', 'hspt', '分店2店長', 3, 8, NULL, 2, 1, NULL),
(5, 'accountant1', 'hspt', '分店1會計人員', 3, 10, NULL, 1, 1, NULL);

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `CaseDepartment`
--
ALTER TABLE `CaseDepartment`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Patients_ID` (`Patients_ID`),
  ADD KEY `Department_ID` (`Department_ID`) USING BTREE;

--
-- 資料表索引 `CaseHistory`
--
ALTER TABLE `CaseHistory`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CaseDepartment_ID` (`CaseDepartment_ID`),
  ADD KEY `User_account1` (`User_account1`,`User_account2`,`User_account3`),
  ADD KEY `CaseHistory_User2` (`User_account2`),
  ADD KEY `CaseHistory_User3` (`User_account3`);

--
-- 資料表索引 `CaseMerchandise`
--
ALTER TABLE `CaseMerchandise`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CaseHistory _ID` (`CaseHistory_ID`),
  ADD KEY `Merchandise _ID` (`Merchandise_ID`),
  ADD KEY `User_account1` (`User_account1`) USING BTREE,
  ADD KEY `User_account2` (`User_account2`) USING BTREE;

--
-- 資料表索引 `CaseMerchandiseRecord`
--
ALTER TABLE `CaseMerchandiseRecord`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `CaseTreatment`
--
ALTER TABLE `CaseTreatment`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID` (`ID`),
  ADD KEY `CaseHistory_ID` (`CaseHistory_ID`),
  ADD KEY `Disease_ID` (`Disease_ID`),
  ADD KEY `Treatment_ID` (`Treatment_ID`),
  ADD KEY `User_account` (`User_account1`),
  ADD KEY `User_name` (`User_account2`),
  ADD KEY `TreatmentPrice_ID` (`TreatmentPrice_ID`),
  ADD KEY `User_account1` (`User_account1`,`User_account2`);

--
-- 資料表索引 `DBTrack`
--
ALTER TABLE `DBTrack`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User_account` (`User_account1`);

--
-- 資料表索引 `Department`
--
ALTER TABLE `Department`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `Disease`
--
ALTER TABLE `Disease`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `Merchandise`
--
ALTER TABLE `Merchandise`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Departmemt_ID` (`Department_ID`),
  ADD KEY `User_account` (`User_account1`);

--
-- 資料表索引 `MerchandiseRecord`
--
ALTER TABLE `MerchandiseRecord`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Merchandise_ID` (`Merchandise_ID`),
  ADD KEY `User_account1` (`User_account1`);

--
-- 資料表索引 `Patients`
--
ALTER TABLE `Patients`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `Permission`
--
ALTER TABLE `Permission`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `SCCaseNumber`
--
ALTER TABLE `SCCaseNumber`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `SystemTrack`
--
ALTER TABLE `SystemTrack`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `User_account` (`User_account1`);

--
-- 資料表索引 `Treatment`
--
ALTER TABLE `Treatment`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TreatmentType_ID` (`TreatmentType_ID`);

--
-- 資料表索引 `TreatmentPrice`
--
ALTER TABLE `TreatmentPrice`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Disease_ID` (`Disease_ID`),
  ADD KEY `Department_ID` (`Department_ID`),
  ADD KEY `TreatmentType_ID` (`TreatmentType_ID`);

--
-- 資料表索引 `TreatmentType`
--
ALTER TABLE `TreatmentType`
  ADD PRIMARY KEY (`ID`);

--
-- 資料表索引 `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Department_ID` (`Department_ID`),
  ADD KEY `name` (`name`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `CaseDepartment`
--
ALTER TABLE `CaseDepartment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '序號 (PK)',AUTO_INCREMENT=104;
--
-- 使用資料表 AUTO_INCREMENT `CaseHistory`
--
ALTER TABLE `CaseHistory`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '就醫編號 (PK)',AUTO_INCREMENT=79;
--
-- 使用資料表 AUTO_INCREMENT `CaseMerchandise`
--
ALTER TABLE `CaseMerchandise`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '病歷商品編號 (PK)',AUTO_INCREMENT=42;
--
-- 使用資料表 AUTO_INCREMENT `CaseMerchandiseRecord`
--
ALTER TABLE `CaseMerchandiseRecord`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '病歷關聯商品批號ID',AUTO_INCREMENT=16;
--
-- 使用資料表 AUTO_INCREMENT `CaseTreatment`
--
ALTER TABLE `CaseTreatment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '治療紀錄編號 (PK)',AUTO_INCREMENT=154;
--
-- 使用資料表 AUTO_INCREMENT `DBTrack`
--
ALTER TABLE `DBTrack`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '追蹤編號 (PK)';
--
-- 使用資料表 AUTO_INCREMENT `Department`
--
ALTER TABLE `Department`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '分部編號 (PK)',AUTO_INCREMENT=5;
--
-- 使用資料表 AUTO_INCREMENT `Disease`
--
ALTER TABLE `Disease`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '症狀編號 (PK)',AUTO_INCREMENT=8;
--
-- 使用資料表 AUTO_INCREMENT `Merchandise`
--
ALTER TABLE `Merchandise`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品編號 (PK)',AUTO_INCREMENT=7;
--
-- 使用資料表 AUTO_INCREMENT `MerchandiseRecord`
--
ALTER TABLE `MerchandiseRecord`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '進貨編號 (PK)',AUTO_INCREMENT=8;
--
-- 使用資料表 AUTO_INCREMENT `Patients`
--
ALTER TABLE `Patients`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '病患編號 (PK)',AUTO_INCREMENT=75;
--
-- 使用資料表 AUTO_INCREMENT `Permission`
--
ALTER TABLE `Permission`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '權限序號',AUTO_INCREMENT=11;
--
-- 使用資料表 AUTO_INCREMENT `SCCaseNumber`
--
ALTER TABLE `SCCaseNumber`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',AUTO_INCREMENT=5;
--
-- 使用資料表 AUTO_INCREMENT `SystemTrack`
--
ALTER TABLE `SystemTrack`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '追蹤編號 (PK)';
--
-- 使用資料表 AUTO_INCREMENT `Treatment`
--
ALTER TABLE `Treatment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '治療編號 (PK)',AUTO_INCREMENT=14;
--
-- 使用資料表 AUTO_INCREMENT `TreatmentPrice`
--
ALTER TABLE `TreatmentPrice`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '價格編號(PK)',AUTO_INCREMENT=10;
--
-- 使用資料表 AUTO_INCREMENT `TreatmentType`
--
ALTER TABLE `TreatmentType`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '價格編號(PK)',AUTO_INCREMENT=5;
--
-- 使用資料表 AUTO_INCREMENT `User`
--
ALTER TABLE `User`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '使用者ID',AUTO_INCREMENT=6;
--
-- 已匯出資料表的限制(Constraint)
--

--
-- 資料表的 Constraints `CaseDepartment`
--
ALTER TABLE `CaseDepartment`
  ADD CONSTRAINT `CaseDepartment_Departmemt` FOREIGN KEY (`Department_ID`) REFERENCES `Department` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `CaseDepartment_Patients` FOREIGN KEY (`Patients_ID`) REFERENCES `Patients` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `CaseHistory`
--
ALTER TABLE `CaseHistory`
  ADD CONSTRAINT `CaseHistory_CaseDepartment` FOREIGN KEY (`CaseDepartment_ID`) REFERENCES `CaseDepartment` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `CaseMerchandise`
--
ALTER TABLE `CaseMerchandise`
  ADD CONSTRAINT `CaseMerchandise_Merchandise` FOREIGN KEY (`Merchandise_ID`) REFERENCES `Merchandise` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `CaseTreatment`
--
ALTER TABLE `CaseTreatment`
  ADD CONSTRAINT `CaseTreatment_Disease` FOREIGN KEY (`Disease_ID`) REFERENCES `Disease` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `CaseTreatment_Treatment` FOREIGN KEY (`Treatment_ID`) REFERENCES `Treatment` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `CaseTreatment_TreatmentPrice` FOREIGN KEY (`TreatmentPrice_ID`) REFERENCES `TreatmentPrice` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `Merchandise`
--
ALTER TABLE `Merchandise`
  ADD CONSTRAINT `Merchandise_Departmemt` FOREIGN KEY (`Department_ID`) REFERENCES `Department` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `MerchandiseRecord`
--
ALTER TABLE `MerchandiseRecord`
  ADD CONSTRAINT `MerchandiseRecord_Merchandise` FOREIGN KEY (`Merchandise_ID`) REFERENCES `Merchandise` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `Treatment`
--
ALTER TABLE `Treatment`
  ADD CONSTRAINT `Treatment_TreatmentType` FOREIGN KEY (`TreatmentType_ID`) REFERENCES `TreatmentType` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `TreatmentPrice`
--
ALTER TABLE `TreatmentPrice`
  ADD CONSTRAINT `TreatmentPrice_Department` FOREIGN KEY (`Department_ID`) REFERENCES `Department` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `TreatmentPrice_Disease` FOREIGN KEY (`Disease_ID`) REFERENCES `Disease` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `TreatmentPrice_TreatmentType` FOREIGN KEY (`TreatmentType_ID`) REFERENCES `TreatmentType` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 資料表的 Constraints `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_Department` FOREIGN KEY (`Department_ID`) REFERENCES `Department` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
