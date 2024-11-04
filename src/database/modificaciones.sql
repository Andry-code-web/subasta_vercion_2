-- SUBASTAS
SELECT * FROM subastaonline.subastas;

DELETE FROM subastaonline.subastas WHERE id > 0;


ALTER TABLE subastas
ADD COLUMN descripcion TEXT;

ALTER TABLE `subastaonline`.`subastas`
MODIFY COLUMN `precio_base` DECIMAL(20,2) NOT NULL;

-- Desactivar restricción de clave externa
SET FOREIGN_KEY_CHECKS = 0;
-- Truncar la tabla subastas
TRUNCATE TABLE subastas;
-- Volver a activar restricción de clave externa
SET FOREIGN_KEY_CHECKS = 1;
ALTER TABLE subastas AUTO_INCREMENT = 1;

ALTER TABLE subastas ADD COLUMN auctionEnded BOOLEAN DEFAULT false;
ALTER TABLE subastas ADD COLUMN currentWinner VARCHAR(255) DEFAULT NULL;
ALTER TABLE subastas ADD COLUMN hora_subasta TIME AFTER fecha_subasta;

ALTER TABLE subastas MODIFY COLUMN fecha_subasta DATE AFTER patio;

--IMAGENES_PROPIEDAD

SELECT * FROM subastaonline.imagenes_propiedad;

ALTER TABLE `subastaonline`.`imagenes_propiedad`
ADD COLUMN `imagen` LONGBLOB AFTER `url_imagen`;
ALTER TABLE imagenes_propiedad MODIFY url_imagen VARCHAR(255) DEFAULT 'sin-imagen.jpg';


DELETE FROM subastaonline.imagenes_propiedad WHERE id > 0;
TRUNCATE TABLE imagenes_propiedad;
ALTER TABLE imagenes_propiedad AUTO_INCREMENT = 1;


ALTER TABLE `subastaonline`.`imagenes_propiedad`
DROP COLUMN `imagen`;

ALTER TABLE `subastaonline`.`imagenes_propiedad`
MODIFY COLUMN `url_imagen` VARCHAR(255) DEFAULT 'sin-imagen.jpg';



-- -----------------------------------------------------
-- Table `subastaonline`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo_persona` ENUM('natural', 'juridica') NOT NULL,
  
  -- Campos comunes
  `email` VARCHAR(100) NOT NULL,
  `confirmacion_email` VARCHAR(100) NOT NULL,
  `celular` VARCHAR(15) NOT NULL,
  `telefono` VARCHAR(15) NULL,
  
  -- Campos para persona natural
  `nombre_apellidos` VARCHAR(100) NULL,
  `dni_ce` VARCHAR(20) NULL,
  `fecha_nacimiento` DATE NULL,
  `sexo` ENUM('M', 'F') NULL,
  `estado_civil` ENUM('soltero', 'casado', 'divorciado', 'viudo') NULL,
  
  -- Campos para persona jurídica
  `ruc` VARCHAR(20) NULL,
  `nombre_comercial` VARCHAR(100) NULL,
  `actividad_comercial` VARCHAR(100) NULL,
  
  -- Campos de dirección
  `departamento` VARCHAR(50) NULL,
  `provincia` VARCHAR(50) NULL,
  `distrito` VARCHAR(50) NULL,
  `direccion` VARCHAR(100) NULL,
  `numero` VARCHAR(10) NULL,
  `complemento` VARCHAR(100) NULL,
  
  -- Datos de acceso
  `usuario` VARCHAR(50) NOT NULL,
  `contraseña` VARCHAR(100) NOT NULL,
  
  -- Términos y condiciones
  `terminos_y_condiciones` TINYINT(1) NOT NULL DEFAULT '0',
  
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;



-- -----------------------------------------------------
-- Table `subastaonline`.`ofertas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`ofertas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_subasta` INT NOT NULL,
  `monto_oferta` DECIMAL(10,2) NOT NULL,
  `fecha_oferta` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `id_usuario` (`id_usuario` ASC) VISIBLE,
  INDEX `id_subasta` (`id_subasta` ASC) VISIBLE,
  CONSTRAINT `ofertas_ibfk_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `subastaonline`.`usuarios` (`id`),
  CONSTRAINT `ofertas_ibfk_2`
    FOREIGN KEY (`id_subasta`)
    REFERENCES `subastaonline`.`subastas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `subasta_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `subasta_id` (`subasta_id` ASC) VISIBLE,
  CONSTRAINT `likes_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `subastaonline`.`usuarios` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2`
    FOREIGN KEY (`subasta_id`)
    REFERENCES `subastaonline`.`subastas` (`id`)
    ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


ALTER TABLE subastaonline.subastas ADD COLUMN like_count INT DEFAULT 0;







-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema subastaonline
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema subastaonline
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `subastaonline` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `subastaonline` ;

-- -----------------------------------------------------
-- Table `subastaonline`.`admingeneral`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`admingeneral` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre_usuario` VARCHAR(50) NOT NULL,
  `contraseña` VARCHAR(100) NOT NULL,
  `verification_code` VARCHAR(20) NULL DEFAULT NULL,
  `correo_electronico` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`adminvendedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`adminvendedor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_admin_general` INT NOT NULL,
  `nombre_usuario` VARCHAR(50) NOT NULL,
  `contraseña` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_admin_general` (`id_admin_general` ASC) VISIBLE,
  CONSTRAINT `adminvendedor_ibfk_1`
    FOREIGN KEY (`id_admin_general`)
    REFERENCES `subastaonline`.`admingeneral` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`subastas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`subastas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre_propiedad` VARCHAR(100) NOT NULL,
  `categoria` ENUM('departamento', 'casa_campo', 'casa') NOT NULL,
  `descripcion` TEXT NULL DEFAULT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `precio_base` DECIMAL(20,2) NOT NULL,
  `N_baños` INT NOT NULL,
  `N_cuartos` INT NOT NULL,
  `N_cocina` INT NOT NULL,
  `N_cocheras` INT NOT NULL,
  `patio` ENUM('si', 'no') NOT NULL,
  `fecha_subasta` DATE NULL DEFAULT NULL,
  `hora_subasta` TIME NULL DEFAULT NULL,
  `id_admin_vendedor` INT NULL DEFAULT NULL,
  `auctionEnded` TINYINT(1) NULL DEFAULT '0',
  `currentWinner` VARCHAR(255) NULL DEFAULT NULL,
  `like_count` INT NULL DEFAULT '0',
  `currentBid` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_admin_vendedor` (`id_admin_vendedor` ASC) VISIBLE,
  CONSTRAINT `subastas_ibfk_1`
    FOREIGN KEY (`id_admin_vendedor`)
    REFERENCES `subastaonline`.`adminvendedor` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`anexos_propiedad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`anexos_propiedad` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_subasta` INT NOT NULL,
  `anexo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_subasta` (`id_subasta` ASC) VISIBLE,
  CONSTRAINT `anexos_propiedad_ibfk_1`
    FOREIGN KEY (`id_subasta`)
    REFERENCES `subastaonline`.`subastas` (`id`)
    ON DELETE CASCADE
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`comentarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `comentario` TEXT NOT NULL,
  `rating` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`imagenes_propiedad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`imagenes_propiedad` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_subasta` INT NOT NULL,
  `imagen` LONGBLOB NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_subasta` (`id_subasta` ASC) VISIBLE,
  CONSTRAINT `imagenes_propiedad_ibfk_1`
    FOREIGN KEY (`id_subasta`)
    REFERENCES `subastaonline`.`subastas` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 49
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo_persona` ENUM('natural', 'juridica') NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `confirmacion_email` VARCHAR(100) NOT NULL,
  `celular` VARCHAR(15) NOT NULL,
  `telefono` VARCHAR(15) NULL DEFAULT NULL,
  `nombre_apellidos` VARCHAR(100) NULL DEFAULT NULL,
  `dni_ce` VARCHAR(20) NULL DEFAULT NULL,
  `fecha_nacimiento` DATE NULL DEFAULT NULL,
  `sexo` ENUM('M', 'F') NULL DEFAULT NULL,
  `estado_civil` ENUM('soltero', 'casado', 'divorciado', 'viudo') NULL DEFAULT NULL,
  `ruc` VARCHAR(20) NULL DEFAULT NULL,
  `nombre_comercial` VARCHAR(100) NULL DEFAULT NULL,
  `actividad_comercial` VARCHAR(100) NULL DEFAULT NULL,
  `departamento` VARCHAR(50) NULL DEFAULT NULL,
  `provincia` VARCHAR(50) NULL DEFAULT NULL,
  `distrito` VARCHAR(50) NULL DEFAULT NULL,
  `direccion` VARCHAR(100) NULL DEFAULT NULL,
  `numero` VARCHAR(10) NULL DEFAULT NULL,
  `complemento` VARCHAR(100) NULL DEFAULT NULL,
  `usuario` VARCHAR(50) NOT NULL,
  `contraseña` VARCHAR(100) NOT NULL,
  `terminos_y_condiciones` TINYINT(1) NOT NULL DEFAULT '0',
  `oportunidades` INT NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `subasta_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `subasta_id` (`subasta_id` ASC) VISIBLE,
  CONSTRAINT `likes_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `subastaonline`.`usuarios` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2`
    FOREIGN KEY (`subasta_id`)
    REFERENCES `subastaonline`.`subastas` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`ofertas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`ofertas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `id_subasta` INT NOT NULL,
  `monto_oferta` DECIMAL(10,2) NOT NULL,
  `fecha_oferta` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `id_usuario` (`id_usuario` ASC) VISIBLE,
  INDEX `id_subasta` (`id_subasta` ASC) VISIBLE,
  CONSTRAINT `ofertas_ibfk_1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `subastaonline`.`usuarios` (`id`),
  CONSTRAINT `ofertas_ibfk_2`
    FOREIGN KEY (`id_subasta`)
    REFERENCES `subastaonline`.`subastas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `subastaonline`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subastaonline`.`sessions` (
  `session_id` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NOT NULL,
  `expires` INT UNSIGNED NOT NULL,
  `data` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;