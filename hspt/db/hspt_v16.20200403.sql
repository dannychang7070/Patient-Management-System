-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2020 年 04 月 03 日 07:01
-- 伺服器版本： 8.0.18
-- PHP 版本： 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
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

CREATE TABLE `CaseDepartment` (
  `ID` int(11) NOT NULL COMMENT '序號 (PK)',
  `caseNumber` varchar(11) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '病歷號',
  `Department_ID` int(11) NOT NULL COMMENT '分部編號 (FK)',
  `Patients_ID` int(11) NOT NULL COMMENT '病患編號 (FK)',
  `firstTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '初診時間',
  `User_account` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='分部病患';

--
-- 傾印資料表的資料 `CaseDepartment`
--

INSERT INTO `CaseDepartment` (`ID`, `caseNumber`, `Department_ID`, `Patients_ID`, `firstTime`, `User_account`) VALUES
(1, '1', 1, 1, '2020-04-03 13:51:51', 'admin');

-- --------------------------------------------------------

--
-- 資料表結構 `CaseHistory`
--

CREATE TABLE `CaseHistory` (
  `ID` int(11) NOT NULL COMMENT '就醫編號 (PK)',
  `CaseDepartment_ID` int(11) NOT NULL COMMENT '病歷編號 (FK)',
  `time` datetime NOT NULL COMMENT '就醫時間',
  `note` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '就醫備註',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號',
  `User_account2` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '治療師帳號',
  `User_account3` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新者帳號',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `updateTime` datetime DEFAULT NULL COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='就醫紀錄';

--
-- 傾印資料表的資料 `CaseHistory`
--

INSERT INTO `CaseHistory` (`ID`, `CaseDepartment_ID`, `time`, `note`, `User_account1`, `User_account2`, `User_account3`, `createTime`, `updateTime`) VALUES
(9, 1, '2020-04-03 14:22:00', 'test ', 'admin', 'test', NULL, '2020-04-03 14:33:27', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `CaseMerchandise`
--

CREATE TABLE `CaseMerchandise` (
  `ID` int(11) NOT NULL COMMENT '病歷商品編號 (PK)',
  `CaseHistory_ID` int(11) NOT NULL COMMENT '就醫編號 (FK)',
  `Merchandise_ID` int(11) NOT NULL COMMENT '商品編號 (FK)',
  `amount` int(11) NOT NULL COMMENT '數量',
  `price` int(11) NOT NULL COMMENT '當時定價',
  `charge` int(11) NOT NULL COMMENT '實收金額',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號 (FK)',
  `User_account2` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新者帳號',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `updateTime` datetime DEFAULT NULL COMMENT '更新時間',
  `isDelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='病歷商品';

--
-- 傾印資料表的資料 `CaseMerchandise`
--

INSERT INTO `CaseMerchandise` (`ID`, `CaseHistory_ID`, `Merchandise_ID`, `amount`, `price`, `charge`, `User_account1`, `User_account2`, `createTime`, `updateTime`, `isDelete`) VALUES
(1, 9, 1, 1, 100, 100, 'admin', NULL, '2020-04-03 14:33:28', NULL, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `CaseMerchandiseRecord`
--

CREATE TABLE `CaseMerchandiseRecord` (
  `ID` int(11) NOT NULL COMMENT '病歷關聯商品批號ID',
  `CaseMerchandise_ID` int(11) NOT NULL COMMENT '病歷商品ID',
  `MerchandiseRecord_ID` int(11) DEFAULT NULL COMMENT '商品入庫ID',
  `amount` int(11) NOT NULL COMMENT '數量',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號',
  `CreateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `User_account2` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改者帳號',
  `UpdateTime` datetime DEFAULT NULL COMMENT '修改時間',
  `isDelete` int(1) NOT NULL COMMENT '是否刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 傾印資料表的資料 `CaseMerchandiseRecord`
--

INSERT INTO `CaseMerchandiseRecord` (`ID`, `CaseMerchandise_ID`, `MerchandiseRecord_ID`, `amount`, `User_account1`, `CreateTime`, `User_account2`, `UpdateTime`, `isDelete`) VALUES
(1, 1, 2, 1, 'admin', '2020-04-03 14:33:28', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `CaseTreatment`
--

CREATE TABLE `CaseTreatment` (
  `ID` int(11) NOT NULL COMMENT '治療紀錄編號 (PK)',
  `CaseHistory_ID` int(11) NOT NULL COMMENT '就醫編號 (FK)',
  `Disease_ID` int(11) NOT NULL COMMENT '症狀編號 (FK)',
  `TreatmentPrice_ID` int(11) NOT NULL COMMENT '治療包裝價格(FK)',
  `Treatment_ID` int(11) NOT NULL COMMENT '治療編號 (FK)',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '建立者帳號 (FK)',
  `User_account2` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新者帳號',
  `price` int(11) NOT NULL COMMENT '當時定價',
  `charge` int(11) NOT NULL COMMENT '實收金額',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `updateTime` datetime DEFAULT NULL COMMENT '更新時間',
  `isDelete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療紀錄';

--
-- 傾印資料表的資料 `CaseTreatment`
--

INSERT INTO `CaseTreatment` (`ID`, `CaseHistory_ID`, `Disease_ID`, `TreatmentPrice_ID`, `Treatment_ID`, `User_account1`, `User_account2`, `price`, `charge`, `createTime`, `updateTime`, `isDelete`) VALUES
(4, 9, 1, 1, 1, 'admin', NULL, 100, 100, '2020-04-03 14:33:27', NULL, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `DBTrack`
--

CREATE TABLE `DBTrack` (
  `ID` int(11) NOT NULL COMMENT '追蹤編號 (PK)',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '帳號 (FK)',
  `SQLfrom` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'SQL語法',
  `SQLcondition` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'SQL語法',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='資料庫操作紀錄';

-- --------------------------------------------------------

--
-- 資料表結構 `Department`
--

CREATE TABLE `Department` (
  `ID` int(11) NOT NULL COMMENT '分部編號 (PK)',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分部名稱',
  `status` int(11) NOT NULL COMMENT '分部狀態(0=非營業 1=營業中)',
  `phone1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '連絡電話',
  `phone2` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '連絡電話(手機)',
  `address` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分部地址'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='診所分部';

--
-- 傾印資料表的資料 `Department`
--

INSERT INTO `Department` (`ID`, `name`, `status`, `phone1`, `phone2`, `address`) VALUES
(1, '台南學善', 1, '', '', '');

-- --------------------------------------------------------

--
-- 資料表結構 `Disease`
--

CREATE TABLE `Disease` (
  `ID` int(11) NOT NULL COMMENT '症狀編號 (PK)',
  `part` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '身體部位',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '病症名稱',
  `status` int(11) NOT NULL COMMENT '是否啟用(0=不可用 1=可用)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療症狀';

--
-- 傾印資料表的資料 `Disease`
--

INSERT INTO `Disease` (`ID`, `part`, `name`, `status`) VALUES
(1, '手', '瘀青', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `Merchandise`
--

CREATE TABLE `Merchandise` (
  `ID` int(11) NOT NULL COMMENT '商品編號 (PK)',
  `Department_ID` int(11) DEFAULT NULL COMMENT '分部編號 (FK)',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '商品名稱',
  `size` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '商品規格',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新時間',
  `warning` int(11) DEFAULT NULL COMMENT '警示量',
  `price` int(11) DEFAULT NULL COMMENT '定價',
  `remaining` int(11) DEFAULT NULL COMMENT '剩餘數量',
  `status` int(1) DEFAULT NULL COMMENT '是否啟用',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '建立者帳號 (FK)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品';

--
-- 傾印資料表的資料 `Merchandise`
--

INSERT INTO `Merchandise` (`ID`, `Department_ID`, `name`, `size`, `updateTime`, `warning`, `price`, `remaining`, `status`, `User_account1`) VALUES
(1, 1, '按摩藥膏', 'S', '2020-04-03 14:14:44', 5, 100, 8, 1, 'admin');

-- --------------------------------------------------------

--
-- 資料表結構 `MerchandiseRecord`
--

CREATE TABLE `MerchandiseRecord` (
  `ID` int(11) NOT NULL COMMENT '進貨編號 (PK)',
  `Merchandise_ID` int(11) DEFAULT NULL COMMENT '商品編號 (FK)',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入庫時間',
  `type` int(11) DEFAULT NULL COMMENT '庫存異動類型',
  `amount` int(11) DEFAULT NULL COMMENT '入庫數量',
  `cost` int(11) DEFAULT NULL COMMENT '入庫成本',
  `unitCost` decimal(10,0) DEFAULT NULL COMMENT '單位成本',
  `remaining` int(11) DEFAULT NULL COMMENT '剩餘數量',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '建立者帳號 (FK)',
  `User_account2` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '刪除者帳號',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `deleteTime` datetime DEFAULT NULL COMMENT '刪除時間',
  `status` int(1) DEFAULT NULL COMMENT '是否啟用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品進貨紀錄';

--
-- 傾印資料表的資料 `MerchandiseRecord`
--

INSERT INTO `MerchandiseRecord` (`ID`, `Merchandise_ID`, `time`, `type`, `amount`, `cost`, `unitCost`, `remaining`, `User_account1`, `User_account2`, `createTime`, `deleteTime`, `status`) VALUES
(2, 1, '2020-04-03 14:15:00', 1, 10, 1000, '100', 9, 'admin', NULL, '2020-04-03 14:21:42', NULL, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `Patients`
--

CREATE TABLE `Patients` (
  `ID` int(11) NOT NULL COMMENT '病患編號 (PK)',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '姓名',
  `pID` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '身分證字號',
  `birthday` date NOT NULL COMMENT '出生年月日',
  `gender` varchar(5) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '性別',
  `phone1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '電話',
  `phone2` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '電話',
  `address` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '地址',
  `note` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '備註'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='病患資料';

--
-- 傾印資料表的資料 `Patients`
--

INSERT INTO `Patients` (`ID`, `name`, `pID`, `birthday`, `gender`, `phone1`, `phone2`, `address`, `note`) VALUES
(1, '病患１', 'A100000001', '1969-04-03', '男', '0983696959', '098369695', '高雄市梓官區中崙路５６向４７好', '測試');

-- --------------------------------------------------------

--
-- 資料表結構 `Permission`
--

CREATE TABLE `Permission` (
  `ID` int(11) NOT NULL COMMENT '權限序號',
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '權限名稱',
  `p00` tinyint(1) NOT NULL DEFAULT '1' COMMENT '預設權限',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='角色權限設定';

--
-- 傾印資料表的資料 `Permission`
--

INSERT INTO `Permission` (`ID`, `name`, `p00`, `p01`, `p02`, `p03`, `p04`, `p05`, `p06`, `p07`, `p08`, `p09`, `p10`, `p11`, `p12`, `p13`, `p14`, `p15`, `p16`, `p17`, `p18`, `p19`, `p20`, `p21`, `p22`, `status`) VALUES
(1, '管理者角色', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `SCCaseNumber`
--

CREATE TABLE `SCCaseNumber` (
  `ID` int(11) NOT NULL COMMENT 'ID',
  `Department_ID` int(11) NOT NULL COMMENT '分部ID',
  `caseNumber` int(11) NOT NULL COMMENT '分部末碼病歷號'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='系統設定-分部末碼病歷號';

--
-- 傾印資料表的資料 `SCCaseNumber`
--

INSERT INTO `SCCaseNumber` (`ID`, `Department_ID`, `caseNumber`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `SystemTrack`
--

CREATE TABLE `SystemTrack` (
  `ID` int(11) NOT NULL COMMENT '追蹤編號 (PK)',
  `User_account1` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '帳號 (FK)',
  `detail` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '操作敘述',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='系統操作紀錄';

-- --------------------------------------------------------

--
-- 資料表結構 `Treatment`
--

CREATE TABLE `Treatment` (
  `ID` int(11) NOT NULL COMMENT '治療編號 (PK)',
  `TreatmentType_ID` int(11) NOT NULL COMMENT '治療類型(FK)',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '治療名稱',
  `status` int(11) NOT NULL COMMENT '是否啟用(0=不可用 1=可用)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療方式';

--
-- 傾印資料表的資料 `Treatment`
--

INSERT INTO `Treatment` (`ID`, `TreatmentType_ID`, `name`, `status`) VALUES
(1, 1, '按摩', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `TreatmentPrice`
--

CREATE TABLE `TreatmentPrice` (
  `ID` int(11) NOT NULL COMMENT '價格編號(PK)',
  `Disease_ID` int(11) NOT NULL COMMENT '症狀編號(FK)',
  `Department_ID` int(11) NOT NULL COMMENT '分部編號(FK)',
  `TreatmentType_ID` int(11) NOT NULL COMMENT '治療類型',
  `price` int(11) NOT NULL COMMENT '定價',
  `status` int(11) NOT NULL COMMENT '是否啟用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療價格';

--
-- 傾印資料表的資料 `TreatmentPrice`
--

INSERT INTO `TreatmentPrice` (`ID`, `Disease_ID`, `Department_ID`, `TreatmentType_ID`, `price`, `status`) VALUES
(1, 1, 1, 1, 100, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `TreatmentType`
--

CREATE TABLE `TreatmentType` (
  `ID` int(11) NOT NULL COMMENT '價格編號(PK)',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '類型名稱',
  `status` int(11) NOT NULL COMMENT '是否啟用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='治療類型';

--
-- 傾印資料表的資料 `TreatmentType`
--

INSERT INTO `TreatmentType` (`ID`, `name`, `status`) VALUES
(1, '徒手治療', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `User`
--

CREATE TABLE `User` (
  `ID` int(11) NOT NULL COMMENT '使用者ID',
  `account` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '使用者帳號',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '密碼',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '姓名',
  `type` int(11) NOT NULL COMMENT '使用者類型',
  `Permission_ID` int(11) NOT NULL COMMENT '角色權限ID',
  `isTherapist` int(1) DEFAULT NULL COMMENT '是否為診療師',
  `Department_ID` int(11) NOT NULL COMMENT '可操作分店',
  `status` int(11) DEFAULT NULL COMMENT '是否啟用',
  `checkMerchandise` date DEFAULT NULL COMMENT '商品庫存通知',
  `token` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '授權Hash',
  `expireTime` datetime DEFAULT NULL COMMENT '授權到期日'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='使用者';

--
-- 傾印資料表的資料 `User`
--

INSERT INTO `User` (`ID`, `account`, `password`, `name`, `type`, `Permission_ID`, `isTherapist`, `Department_ID`, `status`, `checkMerchandise`, `token`, `expireTime`) VALUES
(1, 'admin', 'admin', '管理者', 1, 1, 0, 1, 1, NULL, '7bb305785eb5613bfa9bd32e8f1a5e6f', '2020-04-03 15:55:22'),
(2, 'test', 'test', '治療師', 3, 1, 1, 1, 1, NULL, '', NULL);

--
-- 已傾印資料表的索引
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
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `CaseDepartment`
--
ALTER TABLE `CaseDepartment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '序號 (PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `CaseHistory`
--
ALTER TABLE `CaseHistory`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '就醫編號 (PK)', AUTO_INCREMENT=10;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `CaseMerchandise`
--
ALTER TABLE `CaseMerchandise`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '病歷商品編號 (PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `CaseMerchandiseRecord`
--
ALTER TABLE `CaseMerchandiseRecord`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '病歷關聯商品批號ID', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `CaseTreatment`
--
ALTER TABLE `CaseTreatment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '治療紀錄編號 (PK)', AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `DBTrack`
--
ALTER TABLE `DBTrack`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '追蹤編號 (PK)';

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `Department`
--
ALTER TABLE `Department`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '分部編號 (PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `Disease`
--
ALTER TABLE `Disease`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '症狀編號 (PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `Merchandise`
--
ALTER TABLE `Merchandise`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品編號 (PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `MerchandiseRecord`
--
ALTER TABLE `MerchandiseRecord`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '進貨編號 (PK)', AUTO_INCREMENT=3;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `Patients`
--
ALTER TABLE `Patients`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '病患編號 (PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `Permission`
--
ALTER TABLE `Permission`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '權限序號', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `SCCaseNumber`
--
ALTER TABLE `SCCaseNumber`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `SystemTrack`
--
ALTER TABLE `SystemTrack`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '追蹤編號 (PK)';

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `Treatment`
--
ALTER TABLE `Treatment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '治療編號 (PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `TreatmentPrice`
--
ALTER TABLE `TreatmentPrice`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '價格編號(PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `TreatmentType`
--
ALTER TABLE `TreatmentType`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '價格編號(PK)', AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `User`
--
ALTER TABLE `User`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT COMMENT '使用者ID', AUTO_INCREMENT=3;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_Department` FOREIGN KEY (`Department_ID`) REFERENCES `department` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
