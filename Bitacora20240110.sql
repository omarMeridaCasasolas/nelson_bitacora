-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bitacora_transporte
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id_administrador` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_administrador` varchar(255) NOT NULL,
  `celular_administrador` varchar(15) NOT NULL,
  `login_administrador` varchar(127) NOT NULL,
  `pass_administrador` varchar(63) NOT NULL,
  `estado_administrador` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_administrador`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (1,'Admin ','78212268','administrador@gmail.com','123456',1),(5,'demo Admin','78566645','demoAdmin2023@gmail.com','7826664',1);
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrador_unidad`
--

DROP TABLE IF EXISTS `administrador_unidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador_unidad` (
  `id_administrador` int(11) NOT NULL,
  `id_unidad` int(11) NOT NULL,
  KEY `id_administrador` (`id_administrador`),
  KEY `id_unidad` (`id_unidad`),
  CONSTRAINT `administrador_unidad_ibfk_1` FOREIGN KEY (`id_administrador`) REFERENCES `administrador` (`id_administrador`),
  CONSTRAINT `administrador_unidad_ibfk_2` FOREIGN KEY (`id_unidad`) REFERENCES `unidad` (`id_unidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador_unidad`
--

LOCK TABLES `administrador_unidad` WRITE;
/*!40000 ALTER TABLE `administrador_unidad` DISABLE KEYS */;
INSERT INTO `administrador_unidad` VALUES (1,1),(1,4);
/*!40000 ALTER TABLE `administrador_unidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `id_bitacora` int(11) NOT NULL AUTO_INCREMENT,
  `id_vehiculo` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_bitacora` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_final` time DEFAULT NULL,
  `estado_bitacora` enum('Ocupado','Disponible','Reservado') DEFAULT 'Disponible',
  `destino_bitacora` varchar(1024) DEFAULT NULL,
  `nro_vale` varchar(25) DEFAULT NULL,
  `kilometraje_inicio` varchar(10) DEFAULT NULL,
  `kilometraje_final` varchar(10) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `estado_evaluacion` enum('Pendiente','Aceptado','Rechazado') DEFAULT 'Pendiente',
  `id_administrador` int(11) DEFAULT NULL,
  `motivo_evaluacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_bitacora`),
  KEY `id_vehiculo` (`id_vehiculo`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_administrador` (`id_administrador`),
  CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id_vehiculo`),
  CONSTRAINT `bitacora_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `bitacora_ibfk_4` FOREIGN KEY (`id_administrador`) REFERENCES `administrador` (`id_administrador`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacora`
--

LOCK TABLES `bitacora` WRITE;
/*!40000 ALTER TABLE `bitacora` DISABLE KEYS */;
INSERT INTO `bitacora` VALUES (38,1,2,'2023-06-07','07:45:00','08:14:59','Reservado','prueba 1','00001','1000','1002','2023-07-25 02:36:04','Pendiente',NULL,''),(40,1,2,'2023-06-08','07:00:00','07:59:59','Reservado','prueba 2','2377','1888','188299','2023-07-25 23:13:45','Pendiente',NULL,''),(41,1,2,'2023-06-07','08:45:00','09:29:59','Reservado','prueba','27388','1000','1003','2023-07-26 00:03:44','Pendiente',NULL,''),(42,1,2,'2023-08-03','07:30:00','07:59:59','Reservado','prueba','10002','10002','10004','2023-08-02 23:15:59','Pendiente',NULL,''),(47,1,2,'2023-12-25','07:15:00','07:59:59','Reservado','Entrega de archivos al alto','','','','2023-12-24 23:41:26','Pendiente',NULL,''),(48,1,2,'2023-12-24','07:00:00','07:59:59','Reservado','Demo','','','','2023-12-24 23:47:57','Pendiente',NULL,''),(49,1,2,'2023-12-24','07:30:00','07:59:59','Reservado','demo 2 ','','','','2023-12-24 23:48:27','Pendiente',NULL,''),(50,1,2,'2023-12-24','07:15:00','07:59:59','Reservado','demo2','','','','2023-12-24 23:51:18','Pendiente',NULL,''),(51,NULL,2,'2023-12-25','07:30:00','07:59:59','Reservado','demo','','','','2023-12-25 02:13:18','Pendiente',NULL,''),(52,NULL,2,'2023-12-26','07:45:00','08:29:59','Reservado','demo','','','','2023-12-25 02:14:32','Pendiente',NULL,''),(54,1,2,'2023-12-26','07:15:00','08:14:59','Reservado','demo3','','','','2023-12-25 15:07:08','Pendiente',NULL,''),(55,1,2,'2023-12-27','07:15:00','07:44:59','Reservado','demo 3','','','','2023-12-25 15:10:15','Pendiente',NULL,''),(57,2,2,'2023-12-27','07:15:00','07:59:59','Reservado','demo 3','','','','2023-12-26 19:51:22','Pendiente',NULL,''),(58,2,2,'2023-12-28','07:30:00','07:59:59','Reservado','asfsadfasdf','','','','2023-12-26 20:03:52','Pendiente',NULL,''),(59,2,2,'2023-12-28','08:00:00','08:44:59','Reservado','fsdf','','','','2023-12-26 20:05:10','Pendiente',NULL,''),(60,10,2,'2023-12-27','07:30:00','07:59:59','Reservado','viacha enviuo de paquete','','','','2023-12-26 22:40:41','Pendiente',NULL,''),(61,2,2,'2023-12-29','07:30:00','07:59:59','Reservado','demo 2','','','','2023-12-28 02:24:42','Pendiente',NULL,''),(62,2,2,'2023-12-29','08:15:00','08:44:59','Reservado','76912222','','','','2023-12-28 02:29:07','Pendiente',NULL,''),(63,2,2,'2023-12-29','08:00:00','08:14:59','Reservado','demo 3','','','','2023-12-28 13:41:15','Pendiente',NULL,''),(64,2,2,'2024-01-18','07:30:00','07:59:59','Reservado','demo de envio','','','','2023-12-28 13:42:37','Pendiente',NULL,''),(75,1,1,'2023-12-30','07:15:00','07:44:59','Reservado','demo','','','','2023-12-29 03:01:15','Pendiente',NULL,''),(78,10,1,'2023-12-29','07:00:00','08:14:59','Reservado','asdasd','9412','100','200','2023-12-29 03:29:58','Pendiente',NULL,''),(79,10,1,'2024-01-03','07:15:00','07:44:59','Reservado','asdasd','75222','100','105','2024-01-03 17:48:17','Pendiente',NULL,''),(80,10,4,'2024-01-03','08:15:00','08:59:59','Reservado','demo 3','47652','105','125','2024-01-03 17:48:46','Pendiente',NULL,''),(81,1,2,'2024-01-07','07:15:00','07:44:59','Reservado','Prueba demo','','','','2024-01-06 15:34:02','Pendiente',NULL,''),(82,1,2,'2024-01-08','07:45:00','08:29:59','Reservado','demo 4','','','','2024-01-06 15:34:14','Pendiente',NULL,''),(83,10,2,'2024-01-07','07:15:00','07:29:59','Reservado','asdsafdsdf','','','','2024-01-06 15:35:49','Aceptado',1,'Ya se llevo la documentacion 2'),(84,10,2,'2024-01-07','08:00:00','08:44:59','Reservado','sdfsd sdfsdf','','','','2024-01-06 15:36:03','Pendiente',NULL,'por ser negro'),(106,10,1,'2024-01-10','10:45:00','11:29:59','Reservado','jhkhjk','','','','2024-01-10 13:23:41','Pendiente',NULL,NULL);
/*!40000 ALTER TABLE `bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chofer`
--

DROP TABLE IF EXISTS `chofer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chofer` (
  `id_chofer` int(11) NOT NULL AUTO_INCREMENT,
  `carnet_chofer` varchar(14) DEFAULT NULL,
  `nombre_chofer` varchar(254) DEFAULT NULL,
  `celular_chofer` varchar(10) DEFAULT NULL,
  `estado_chofer` tinyint(1) DEFAULT 1,
  `login_chofer` varchar(255) DEFAULT NULL,
  `pass_chofer` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id_chofer`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chofer`
--

LOCK TABLES `chofer` WRITE;
/*!40000 ALTER TABLE `chofer` DISABLE KEYS */;
INSERT INTO `chofer` VALUES (1,'983742','Nelson Limachi ','7676868',1,'nelsonLimachi@gmail.com','123456'),(3,'44983742','Oscar Vargas','74466868',1,'OscarVargas@gmail.com','666666'),(5,'5782111','juan miguel teran','778211122',1,'JuanMiguelTeran@gmail.com','123456'),(9,'4752111','Yessica Martinez Alnibar','7851756',1,'DanielaCopa@gmail.com','123456');
/*!40000 ALTER TABLE `chofer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chofer_vehiculo`
--

DROP TABLE IF EXISTS `chofer_vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chofer_vehiculo` (
  `id_chofer` int(11) NOT NULL,
  `id_vehiculo` int(11) NOT NULL,
  KEY `id_chofer` (`id_chofer`),
  KEY `id_vehiculo` (`id_vehiculo`),
  CONSTRAINT `chofer_vehiculo_ibfk_1` FOREIGN KEY (`id_chofer`) REFERENCES `chofer` (`id_chofer`),
  CONSTRAINT `chofer_vehiculo_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id_vehiculo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chofer_vehiculo`
--

LOCK TABLES `chofer_vehiculo` WRITE;
/*!40000 ALTER TABLE `chofer_vehiculo` DISABLE KEYS */;
INSERT INTO `chofer_vehiculo` VALUES (3,2),(9,1),(9,10),(9,2),(1,10);
/*!40000 ALTER TABLE `chofer_vehiculo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidad`
--

DROP TABLE IF EXISTS `unidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidad` (
  `id_unidad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_unidad` varchar(255) NOT NULL DEFAULT '',
  `descripcion_unidad` varchar(2048) NOT NULL DEFAULT '',
  `estado_unidad` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidad`
--

LOCK TABLES `unidad` WRITE;
/*!40000 ALTER TABLE `unidad` DISABLE KEYS */;
INSERT INTO `unidad` VALUES (1,'DIRECCIÓN DE EDUCACIÓN','',1),(3,'UNIDAD DE PERSONAS CON DISCAPACIDAD Y ADULTOS MAYORES','Area de dessarrollo a personas',1),(4,'UNIDAD DE DEFENSA INTEGRAL A LA FAMILIA',' ',1);
/*!40000 ALTER TABLE `unidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `carnet_usuario` varchar(14) DEFAULT NULL,
  `nombre_usuario` varchar(254) DEFAULT NULL,
  `celular_usuario` varchar(10) DEFAULT NULL,
  `estado_usuario` tinyint(1) DEFAULT 1,
  `login_usuario` varchar(255) DEFAULT NULL,
  `pass_usuario` varchar(25) DEFAULT NULL,
  `id_unidad` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_usuario`),
  KEY `fk_nombre` (`id_unidad`),
  CONSTRAINT `fk_nombre` FOREIGN KEY (`id_unidad`) REFERENCES `unidad` (`id_unidad`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'123456789','Vanesa Velasco Mamani','7892225',1,'VanesaM@gmail.com','666666',1),(2,'2836472','Daniel Fuentes','78676674',1,'Daniel2021@gmail.com','55555',1),(4,'123456','Vanesa Velasco Mamani','71892225',1,'VanesaVM@gmail.com','666666',4),(6,'1591222','Vanesa Cortez Espejo','177822122',0,'vanesaCE@gmail.com','47852',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculo`
--

DROP TABLE IF EXISTS `vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculo` (
  `id_vehiculo` int(11) NOT NULL AUTO_INCREMENT,
  `placa_vehiculo` varchar(12) NOT NULL,
  `tipo_vehiculo` varchar(25) DEFAULT NULL,
  `detalle_vehiculo` varchar(25) DEFAULT NULL,
  `estado_vehiculo` tinyint(1) DEFAULT 1,
  `km_vehiculo` float NOT NULL DEFAULT 0,
  `id_unidad` int(11) NOT NULL,
  PRIMARY KEY (`id_vehiculo`),
  KEY `fk_vehiculo` (`id_unidad`),
  CONSTRAINT `fk_vehiculo` FOREIGN KEY (`id_unidad`) REFERENCES `unidad` (`id_unidad`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculo`
--

LOCK TABLES `vehiculo` WRITE;
/*!40000 ALTER TABLE `vehiculo` DISABLE KEYS */;
INSERT INTO `vehiculo` VALUES (1,'3221-XLF','Camioneta','Camioneta para 6 ',1,111,1),(2,'FHF-1662','Camioneta','Camioneta Roja ford',1,220,1),(10,'577-FDG','Motocicleta','Moto color blanca',1,1762,4);
/*!40000 ALTER TABLE `vehiculo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'bitacora_transporte'
--
/*!50003 DROP PROCEDURE IF EXISTS `asignarUnidadAdministrador` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asignarUnidadAdministrador`(idAdministrador INT,listaUnidadesAsignadas VARCHAR(2048))
BEGIN
    DECLARE track_no INT DEFAULT 0;
    DECLARE indice INT DEFAULT 0;
    DECLARE id_aux varchar(10) DEFAULT "";
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, NOT FOUND, SQLWARNING
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT track_no, 'Error al asignar vehiculo al chofer' AS estado, idAdministrador, listaUnidadesAsignadas;
    END;
    START TRANSACTION;
		DELETE FROM administrador_unidad WHERE id_administrador = idAdministrador;
        SET track_no = track_no + 1;
		WHILE INSTR(listaUnidadesAsignadas,",") <> 0 DO
			SET indice = INSTR(listaUnidadesAsignadas,",");
			SET	id_aux = LEFT(listaUnidadesAsignadas, indice -1);
            INSERT INTO administrador_unidad(id_administrador,id_unidad) VALUES(idAdministrador,id_aux);
            SET listaUnidadesAsignadas =  RIGHT(listaUnidadesAsignadas, LENGTH(listaUnidadesAsignadas) - indice );
            SET track_no = track_no + 1;
		END WHILE;
        IF(listaUnidadesAsignadas <> "") THEN
			INSERT INTO administrador_unidad(id_administrador,id_unidad) VALUES(idAdministrador,listaUnidadesAsignadas);
			SET track_no = track_no + 1;
        END IF;
        SELECT track_no, 'Exito' AS estado , idAdministrador, listaUnidadesAsignadas;
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asignarVehiculoChofer` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asignarVehiculoChofer`(idChofer INT,listaIDVehiculo VARCHAR(2048))
BEGIN
    DECLARE track_no INT DEFAULT 0;
    DECLARE indice INT DEFAULT 0;
    DECLARE id_aux varchar(10) DEFAULT "";
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, NOT FOUND, SQLWARNING
    BEGIN
        ROLLBACK;
        GET DIAGNOSTICS CONDITION 1 @`errno` = MYSQL_ERRNO, @`sqlstate` = RETURNED_SQLSTATE, @`text` = MESSAGE_TEXT;
        SET @full_error = CONCAT('ERROR ', @`errno`, ' (', @`sqlstate`, '): ', @`text`);
        SELECT track_no, 'Error al asignar vehiculo al chofer' AS estado, idChofer, listaIDVehiculo;
    END;
    START TRANSACTION;
		DELETE FROM chofer_vehiculo WHERE id_chofer = idChofer;
        SET track_no = track_no + 1;
		WHILE INSTR(listaIDVehiculo,",") <> 0 DO
			SET indice = INSTR(listaIDVehiculo,",");
			SET	id_aux = LEFT(listaIDVehiculo, indice -1);
            INSERT INTO chofer_vehiculo(id_chofer,id_vehiculo) VALUES(idChofer,id_aux);
            SET listaIDVehiculo =  RIGHT(listaIDVehiculo, LENGTH(listaIDVehiculo) - indice );
            SET track_no = track_no + 1;
		END WHILE;
        IF(listaIDVehiculo <> "") THEN
			INSERT INTO chofer_vehiculo(id_chofer,id_vehiculo) VALUES(idChofer,listaIDVehiculo);
			SET track_no = track_no + 1;
        END IF;
        SELECT track_no, 'Exito' AS estado , idChofer, listaIDVehiculo;
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-10 20:14:50
