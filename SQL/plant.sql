-- --------------------------------------------------------
-- 涓绘満:                           127.0.0.1
-- 鏈嶅姟鍣ㄧ増鏈�:                        10.6.5-MariaDB - mariadb.org binary distribution
-- 鏈嶅姟鍣ㄦ搷浣滅郴缁�:                      Win64
-- HeidiSQL 鐗堟湰:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 瀵煎嚭  琛� demo.plant 缁撴瀯
CREATE TABLE IF NOT EXISTS plant (
  plant_id varchar(50) NOT NULL ,
  site varchar(50) DEFAULT NULL,
  plant_name varchar(50) DEFAULT NULL,
  PRIMARY KEY (plant_id) 
) 

-- 姝ｅ湪瀵煎嚭琛�  demo.plant 鐨勬暟鎹細~22 rows (澶х害)
/*!40000 ALTER TABLE `plant` DISABLE KEYS */;
insert  INTO plant (plant_id, site, plant_name) VALUES
	('A000', 'WKS', 'Entrusted'),
	('A001', 'WKS', 'Site Unit'),
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
	('TBD4', 'WTZ', 'LCM'),
	('TBD3', 'WVN', 'WVN-P1');
/*!40000 ALTER TABLE `plant` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
  