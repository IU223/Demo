-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        10.6.5-MariaDB - mariadb.org binary distribution
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 导出  表 demo.plant 结构
CREATE TABLE IF NOT EXISTS plant (
  plant_id varchar(50) NOT NULL ,
  site varchar(50) DEFAULT NULL,
  plant_name varchar(50) DEFAULT NULL,
  PRIMARY KEY (plant_id) 
) 

-- 正在导出表  demo.plant 的数据：~22 rows (大约)
/*!40000 ALTER TABLE `plant` DISABLE KEYS */;
insert  INTO plant (plant_id, site, plant_name) VALUES
	('A000', 'WKS', 'WKS-Entrusted'),
	('A001', 'WKS', 'WKS-Site Unit'),
	('F130', 'WZS', 'WZS-P3'),
	('F131', 'WZS', 'WZS-P3'),
	('F132', 'WZS', 'WZS-P6'),
	('F135', 'WZS', 'WZS-P3'),
	('F136', 'WZS', 'WZS-P1'),
	('F138', 'WZS', 'WZS-P6'),
	('F230', 'WKS', 'WKS-P1'),
	('F232', 'WKS', 'WKS-P5'),
	('F236', 'WKS', 'WKS-P6B'),
	('F237', 'WKS', 'WKS-P6A'),
	('F2C1', 'XTRKS', 'XTRKS-F2C1'),
	('F60B', 'WIH', 'WIH-P1'),
	('F60C', 'WIH', 'WIH-P1'),
	('F710', 'WCQ', 'WCQ-P1'),
	('F711', 'WCQ', 'WCQ-P1'),
	('F715', 'WCQ', 'WCQ-P1'),
	('F721', 'WCD', 'WCD-P1'),
	('F7B1', 'WMY', 'WMY-P1'),
	('TBD2', 'WMX', 'WMX-P1'),
	('TBD3', 'WVN', 'WVN-P1');
/*!40000 ALTER TABLE `plant` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
