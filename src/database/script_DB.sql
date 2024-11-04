-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 04-10-2024 a las 23:49:41
-- Versión del servidor: 8.0.39
-- Versión de PHP: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `iqjcontm_subastaDB`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admingeneral`
--

CREATE TABLE `admingeneral` (
  `id` int NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `verificacion_code` varchar(20) DEFAULT NULL,
  `correo_electronico` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adminvendedor`
--

CREATE TABLE `adminvendedor` (
  `id` int NOT NULL,
  `id_admin_general` int NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contraseña` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `anexos_propiedad`
--

CREATE TABLE `anexos_propiedad` (
  `id` int NOT NULL,
  `id_subasta` int NOT NULL,
  `anexo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_propiedad`
--

CREATE TABLE `imagenes_propiedad` (
  `id` int NOT NULL,
  `id_subasta` int NOT NULL,
  `imagen` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `likes`
--

CREATE TABLE `likes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `subasta_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

CREATE TABLE `ofertas` (
  `id` int NOT NULL,
  `id_subasta` int NOT NULL,
  `usuario` VARCHAR(50) NOT NULL,
  `monto_oferta` decimal(10,2) NOT NULL,
  `fecha_oferta` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subastas`
--

CREATE TABLE `subastas` (
  `id` int NOT NULL,
  `marca` varchar(100) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` enum('auto','camioneta','moto','piezas') NOT NULL,
  `anio` year NOT NULL,
  `precio_base` decimal(20,2) NOT NULL,
  `placa` varchar(50) NOT NULL,
  `tarjeta_propiedad` enum('si','no') NOT NULL,
  `llave` enum('si','no') NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `estado` enum('SINIESTRADO','USADO') NOT NULL,
  `importante` text NOT NULL,
  `fecha_subasta` date DEFAULT NULL,
  `hora_subasta` time DEFAULT NULL,
  `id_admin_vendedor` int DEFAULT NULL,
  `auctionEnded` tinyint(1) DEFAULT '0',
  `currentWinner` varchar(255) DEFAULT NULL,
  `like_count` int DEFAULT '0',
  `currentBid` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `tipo_persona` enum('natural','juridica') NOT NULL,
  `email` varchar(100) NOT NULL,
  `confirmacion_email` varchar(100) NOT NULL,
  `celular` varchar(15) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `nombre_apellidos` varchar(100) DEFAULT NULL,
  `dni_ce` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('M','F') DEFAULT NULL,
  `estado_civil` enum('soltero','casado','divorciado','viudo') DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `nombre_comercial` varchar(100) DEFAULT NULL,
  `actividad_comercial` varchar(100) DEFAULT NULL,
  `departamento` varchar(50) DEFAULT NULL,
  `provincia` varchar(50) DEFAULT NULL,
  `distrito` varchar(50) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `terminos_y_condiciones` tinyint(1) NOT NULL DEFAULT '0',
  `oportunidades` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visitas_subasta`
--

CREATE TABLE `visitas_subasta` (
  `id` int NOT NULL,
  `subasta_id` int NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `fecha_visita` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE IF NOT EXISTS mensajes_subasta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_subasta INT NOT NULL,
  id_usuario INT NOT NULL,
  mensaje TEXT NOT NULL,
  monto DECIMAL(15,2) NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_subasta) REFERENCES subastas(id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admingeneral`
--
ALTER TABLE `admingeneral`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `adminvendedor`
--
ALTER TABLE `adminvendedor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_admin_general` (`id_admin_general`);

--
-- Indices de la tabla `anexos_propiedad`
--
ALTER TABLE `anexos_propiedad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_subasta` (`id_subasta`);

--
-- Indices de la tabla `imagenes_propiedad`
--
ALTER TABLE `imagenes_propiedad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_subasta` (`id_subasta`);

--
-- Indices de la tabla `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `subasta_id` (`subasta_id`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_subasta` (`id_subasta`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `subastas`
--
ALTER TABLE `subastas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_admin_vendedor` (`id_admin_vendedor`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `visitas_subasta`
--
ALTER TABLE `visitas_subasta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subasta_id` (`subasta_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admingeneral`
--
ALTER TABLE `admingeneral`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `adminvendedor`
--
ALTER TABLE `adminvendedor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `anexos_propiedad`
--
ALTER TABLE `anexos_propiedad`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagenes_propiedad`
--
ALTER TABLE `imagenes_propiedad`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `subastas`
--
ALTER TABLE `subastas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `visitas_subasta`
--
ALTER TABLE `visitas_subasta`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adminvendedor`
--
ALTER TABLE `adminvendedor`
  ADD CONSTRAINT `adminvendedor_ibfk_1` FOREIGN KEY (`id_admin_general`) REFERENCES `admingeneral` (`id`);

--
-- Filtros para la tabla `anexos_propiedad`
--
ALTER TABLE `anexos_propiedad`
  ADD CONSTRAINT `anexos_propiedad_ibfk_1` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes_propiedad`
--
ALTER TABLE `imagenes_propiedad`
  ADD CONSTRAINT `imagenes_propiedad_ibfk_1` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`subasta_id`) REFERENCES `subastas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD CONSTRAINT `ofertas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `ofertas_ibfk_2` FOREIGN KEY (`id_subasta`) REFERENCES `subastas` (`id`);

--
-- Filtros para la tabla `subastas`
--
ALTER TABLE `subastas`
  ADD CONSTRAINT `subastas_ibfk_1` FOREIGN KEY (`id_admin_vendedor`) REFERENCES `adminvendedor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `visitas_subasta`
--
ALTER TABLE `visitas_subasta`
  ADD CONSTRAINT `visitas_subasta_ibfk_1` FOREIGN KEY (`subasta_id`) REFERENCES `subastas` (`id`),
  ADD CONSTRAINT `visitas_subasta_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
