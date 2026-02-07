-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 20-Dez-2021 às 02:22
-- Versão do servidor: 10.4.22-MariaDB
-- versão do PHP: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `contato_seguro`
--
CREATE DATABASE IF NOT EXISTS `contato_seguro` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `contato_seguro`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `adress`
--

CREATE TABLE `adress` (
  `id_adress` int(11) NOT NULL,
  `cep` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `number` int(11) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `additional` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `adress`
--

INSERT INTO `adress` (`id_adress`, `cep`, `country`, `state`, `city`, `street`, `number`, `district`, `additional`) VALUES
(1, '95500000', 'Brasil', 'RS', 'Porto Alegre', 'Rua General Mostarda', 919, 'Menino Deus', NULL),
(2, '93080130', 'Argentina', 'BN', 'Burnos Aires', 'Krakoa', 513, 'Antiskio', 'bloco 43'),
(3, '95500000', 'Brasil', 'RS', 'Santo Antônio da Patrulha', 'Borges', 60, 'Bairro Real', 'apt. 110'),
(4, '95500000', 'Brasil', 'RS', 'São Timão', 'Nossa Senhora', 60, 'Litmas', 'apt. 120');

-- --------------------------------------------------------

--
-- Estrutura da tabela `company`
--

CREATE TABLE `company` (
  `id_company` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `cnpj` varchar(45) DEFAULT NULL,
  `show` tinyint(1) NOT NULL DEFAULT 1,
  `id_adress` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `company`
--

INSERT INTO `company` (`id_company`, `name`, `cnpj`, `show`, `id_adress`) VALUES
(1, 'QA Station', '991836547193', 1, 1),
(4, 'Compliance Station', '33333333333', 1, 2),
(5, 'Contato Seguro', '12312312312', 1, 3),
(6, 'Compliance Total', '12312312312', 0, 4);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_city` varchar(255) DEFAULT NULL,
  `show` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `user`
--

-- INSERT INTO `user` (`id_user`, `name`, `email`, `telephone`, `birth_date`, `birth_city`, `show`) VALUES
-- (1, 'Josh Smith', 'josh@mail.com', '515559284', '2000-01-01', 'Porto Alegre', 1),
-- (2, 'Anna Brown', 'anna@mail.com', '515559285', '1995-02-02', 'São Paulo', 1),
-- (3, 'Mike Johnson', 'mike@mail.com', '515559286', '1988-03-03', 'Rio de Janeiro', 1),
-- (4, 'Sara Davis', 'sara@mail.com', '515559287', '1992-04-04', 'Curitiba', 1),
-- (5, 'Tom Wilson', 'tom@mail.com', '515559288', '1990-05-05', 'Florianópolis', 1),
-- (6, 'Emma Moore', 'emma@mail.com', '515559289', '1985-06-06', 'Belo Horizonte', 1),
-- (7, 'Lucas Taylor', 'lucas@mail.com', '515559290', '1998-07-07', 'Fortaleza', 1),
-- (8, 'Olivia Anderson', 'olivia@mail.com', '515559291', '1991-08-08', 'Salvador', 1),
-- (9, 'Liam Thomas', 'liam@mail.com', '515559292', '1987-09-09', 'Brasília', 1),
-- (10, 'Sophia Jackson', 'sophia@mail.com', '515559293', '1993-10-10', 'Manaus', 1),
-- (11, 'Noah White', 'noah@mail.com', '515559294', '1996-11-11', 'Recife', 1),
-- (12, 'Mia Harris', 'mia@mail.com', '515559295', '1989-12-12', 'Belém', 1),
-- (13, 'James Martin', 'james@mail.com', '515559296', '1994-01-13', 'Goiânia', 1),
-- (14, 'Ava Thompson', 'ava@mail.com', '515559297', '1997-02-14', 'Campinas', 1),
-- (15, 'Benjamin Garcia', 'benjamin@mail.com', '515559298', '1986-03-15', 'São Luís', 1),
-- (16, 'Isabella Martinez', 'isabella@mail.com', '515559299', '1999-04-16', 'Maceió', 1),
-- (17, 'Elijah Robinson', 'elijah@mail.com', '515559300', '2001-05-17', 'Natal', 1),
-- (18, 'Charlotte Clark', 'charlotte@mail.com', '515559301', '1990-06-18', 'Teresina', 1),
-- (19, 'William Rodriguez', 'william@mail.com', '515559302', '1988-07-19', 'João Pessoa', 1),
-- (20, 'Amelia Lewis', 'amelia@mail.com', '515559303', '1992-08-20', 'Aracaju', 1),
-- (21, 'Henry Lee', 'henry@mail.com', '515559304', '1991-09-21', 'Campo Grande', 1),
-- (22, 'Evelyn Walker', 'evelyn@mail.com', '515559305', '1987-10-22', 'Cuiabá', 1),
-- (23, 'Alexander Hall', 'alexander@mail.com', '515559306', '1993-11-23', 'Porto Velho', 1),
-- (24, 'Harper Allen', 'harper@mail.com', '515559307', '1996-12-24', 'Macapá', 1),
-- (25, 'Daniel Young', 'daniel@mail.com', '515559308', '1989-01-25', 'Boa Vista', 1),
-- (26, 'Abigail King', 'abigail@mail.com', '515559309', '1994-02-26', 'Palmas', 1),
-- (27, 'Matthew Wright', 'matthew@mail.com', '515559310', '1997-03-27', 'Rio Branco', 1),
-- (28, 'Ella Scott', 'ella@mail.com', '515559311', '1986-04-28', 'Vitória', 1),
-- (29, 'David Green', 'david@mail.com', '515559312', '1999-05-29', 'Porto Alegre', 1),
-- (30, 'Grace Adams', 'grace@mail.com', '515559313', '2000-06-30', 'São Paulo', 1),
-- (31, 'Joseph Nelson', 'joseph@mail.com', '515559314', '1995-07-31', 'Rio de Janeiro', 1),
-- (32, 'Chloe Baker', 'chloe@mail.com', '515559315', '1988-08-01', 'Curitiba', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_company`
--

CREATE TABLE `user_company` (
  `id_user_company` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_company` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `user_company`
--

-- INSERT INTO `user_company` (`id_user_company`, `id_user`, `id_company`) VALUES
-- (1, 1, 4),
-- (2, 1, 5),
-- (3, 1, 6),
-- (4, 3, 4),
-- (5, 3, 6),
-- (6, 6, 4),
-- (7, 6, 5),
-- (8, 6, 6),
-- (11, 8, 4),
-- (12, 8, 5),
-- (13, 8, 6),
-- (18, 12, 1),
-- (19, 13, 4),
-- (20, 13, 5),
-- (21, 13, 6),
-- (23, 15, 4),
-- (24, 15, 5),
-- (25, 15, 6),
-- (26, 16, 4),
-- (27, 16, 5),
-- (28, 16, 6),
-- (29, 17, 4),
-- (30, 17, 5),
-- (31, 17, 6),
-- (32, 18, 4),
-- (33, 18, 5),
-- (34, 18, 6),
-- (35, 19, 4),
-- (36, 19, 5),
-- (37, 19, 6),
-- (38, 20, 4),
-- (39, 20, 5),
-- (40, 20, 6),
-- (41, 21, 4),
-- (42, 21, 5),
-- (43, 21, 6),
-- (44, 22, 5),
-- (45, 22, 4),
-- (46, 22, 6),
-- (47, 23, 5),
-- (48, 23, 4),
-- (49, 23, 6),
-- (50, 24, 4),
-- (51, 25, 4),
-- (52, 25, 5),
-- (53, 25, 6),
-- (54, 26, 4),
-- (55, 26, 5),
-- (56, 26, 6),
-- (57, 27, 4),
-- (58, 27, 5),
-- (59, 27, 6),
-- (60, 28, 4),
-- (61, 28, 5),
-- (62, 29, 4),
-- (63, 29, 5),
-- (64, 29, 6),
-- (65, 30, 4),
-- (66, 30, 5),
-- (67, 30, 6),
-- (68, 31, 4),
-- (69, 31, 5),
-- (70, 31, 6),
-- (71, 32, 4),
-- (72, 32, 5),
-- (73, 32, 6);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `adress`
--
ALTER TABLE `adress`
  ADD PRIMARY KEY (`id_adress`);

--
-- Índices para tabela `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id_company`,`id_adress`),
  ADD KEY `fk_empresa_endereco1` (`id_adress`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- Índices para tabela `user_company`
--
ALTER TABLE `user_company`
  ADD PRIMARY KEY (`id_user_company`,`id_user`,`id_company`),
  ADD KEY `fk_usuario_empresa_usuario` (`id_user`),
  ADD KEY `fk_usuario_empresa_empresa1` (`id_company`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `adress`
--
ALTER TABLE `adress`
  MODIFY `id_adress` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `company`
--
ALTER TABLE `company`
  MODIFY `id_company` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `user_company`
--
ALTER TABLE `user_company`
  MODIFY `id_user_company` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `company`
--
ALTER TABLE `company`
  ADD CONSTRAINT `fk_empresa_endereco1` FOREIGN KEY (`id_adress`) REFERENCES `adress` (`id_adress`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `user_company`
--
ALTER TABLE `user_company`
  ADD CONSTRAINT `fk_usuario_empresa_empresa1` FOREIGN KEY (`id_company`) REFERENCES `company` (`id_company`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_usuario_empresa_usuario` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
