-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 17 mars 2025 à 13:10
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `precin_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `activation_keys`
--

CREATE TABLE `activation_keys` (
  `id` int(11) NOT NULL,
  `activation_key` varchar(255) NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `activated_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `agent_chef`
--

CREATE TABLE `agent_chef` (
  `id` int(11) NOT NULL,
  `noms` varchar(150) NOT NULL,
  `commune_id` int(11) NOT NULL,
  `communeAgent` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `agent_chef`
--

INSERT INTO `agent_chef` (`id`, `noms`, `commune_id`, `communeAgent`) VALUES
(1, 'Alexia n°1', 1, '1'),
(2, 'Agent n°2', 2, '2'),
(3, 'Agent n°3', 3, '3'),
(4, 'Agent n°4', 4, ''),
(5, 'Agent n°5', 5, ''),
(6, 'Agent n°6', 6, ''),
(7, 'Agent n°7', 6, ''),
(8, 'Agent n°8', 8, ''),
(9, 'Agent n°9', 9, ''),
(10, 'Agent n°10', 10, ''),
(11, 'Agent n°11', 11, '11'),
(12, 'Agent n°12', 12, ''),
(13, 'Agent n°13', 13, ''),
(14, 'Agent n°14', 14, '');

-- --------------------------------------------------------

--
-- Structure de la table `communes`
--

CREATE TABLE `communes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` varchar(150) NOT NULL,
  `district_id` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `communes`
--

INSERT INTO `communes` (`id`, `name`, `region_id`, `district_id`) VALUES
(1, 'Fénérive-Ville', '1', '1'),
(2, 'Ambatoharanana', 'Analanjirofo', 'Fénérive-Est'),
(3, 'Vohilengo', 'Analanjirofo', 'Fénérive-Est'),
(4, 'Vohipeno', 'Analanjirofo', 'Fénérive-Est'),
(5, 'Saranambana', 'Analanjirofo', 'Fénérive-Est'),
(6, 'Mahanoro', 'Analanjirofo', 'Fénérive-Est'),
(7, 'Ambodimanga-II', 'Analanjirofo', 'Fénérive-Est'),
(8, 'Ambanjan\'i Sahalava', 'Analanjirofo', 'Fénérive-Est'),
(9, 'Miorimivalana', 'Analanjirofo', 'Fénérive-Est'),
(10, 'Antsiatsiaka', 'Analanjirofo', 'Fénérive-Est'),
(11, 'Betampona', 'Analanjirofo', 'Fénérive-Est'),
(12, 'Ampasina Maningory', 'Analanjirofo', 'Fénérive-Est'),
(13, 'Mahambo', 'Analanjirofo', 'Fénérive-Est'),
(14, 'Ampasimbe Manantsatrana', 'Analanjirofo', 'Fénérive-Est');

-- --------------------------------------------------------

--
-- Structure de la table `commune_i`
--

CREATE TABLE `commune_i` (
  `id` int(11) NOT NULL,
  `agent_chef_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `commune_id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `num_serie_origine` varchar(100) NOT NULL,
  `num_serie_delivre` varchar(12) NOT NULL,
  `date_ajout` date NOT NULL,
  `date_delivre` date NOT NULL,
  `image_carte` varchar(255) NOT NULL,
  `carte_type` enum('Primata','Duplicata','Ratée') NOT NULL,
  `commune_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commune_i`
--

INSERT INTO `commune_i` (`id`, `agent_chef_id`, `user_id`, `commune_id`, `nom`, `prenom`, `num_serie_origine`, `num_serie_delivre`, `date_ajout`, `date_delivre`, `image_carte`, `carte_type`, `commune_name`) VALUES
(4, 1, 2, 1, '', '', '123939A', '214748364722', '2025-03-27', '0000-00-00', '1742032335184-img20250228_10405735.jpg', '', 'Fénérive-Ville'),
(5, 2, 2, 2, '', '', '223455 E', '301111111111', '2025-03-28', '0000-00-00', '1742037820270-img20250305_16423188.bmp', '', 'Ambatoharanana'),
(18, 1, 2, 1, 'rakoto', 'rabe', '222222A', '214748364733', '2025-04-05', '0000-00-00', '1742120231695-img20250306_08541829.jpg', '', 'Fénérive-Ville'),
(19, 2, 2, 3, 'Lyoddie', '', '1111111A', '214748364722', '2025-03-27', '0000-00-00', '1742120909557-img20250305_19363447.jpg', '', 'Vohilengo'),
(20, 4, 2, 4, 'base', 'brevo', '3300305A', '305332244000', '2025-03-16', '0000-00-00', '1742121486064-img20250305_19355057.jpg', '', 'Vohipeno'),
(21, 5, 1, 5, '', '', '8382838 A', '305556666000', '2025-03-16', '0000-00-00', '1742122978224-150px-Flag_of_the_United_States.svg.jpg', '', 'Saranambana'),
(22, 6, 1, 6, '', '', '1111111 B', '305303002226', '2025-03-16', '0000-00-00', '1742124046382-LIVRAISON.jpg', '', 'Mahanoro'),
(23, 7, 1, 7, '', '', '3383948B', '503494828384', '2025-03-16', '0000-00-00', '1742124336289-BALLON.jpg', '', 'Ambodimanga-II'),
(24, 8, 2, 8, '', '', '2223456 A', '333354554647', '2025-03-16', '0000-00-00', '1742125438116-autocollant.png', '', 'Ambanjan\'i Sahalava'),
(25, 9, 2, 9, '', '', '4325353E', '500055556363', '2025-03-16', '0000-00-00', '1742125890687-COLLEGE-PRIVE-ELOQUENCE.jpg', 'Primata', 'Miorimivalana'),
(26, 9, 2, 10, '', '', '1223455 R', '307545345622', '2025-04-05', '0000-00-00', '1742126750038-2146073160.png', '', 'Antsiatsiaka');

--
-- Déclencheurs `commune_i`
--
DELIMITER $$
CREATE TRIGGER `before_commune_i_insert` BEFORE INSERT ON `commune_i` FOR EACH ROW BEGIN
  SET NEW.commune_name = (SELECT name FROM communes WHERE id = NEW.commune_id);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_commune_i_update` BEFORE UPDATE ON `commune_i` FOR EACH ROW BEGIN
  SET NEW.commune_name = (SELECT name FROM communes WHERE id = NEW.commune_id);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_insert_commune_i` BEFORE INSERT ON `commune_i` FOR EACH ROW SET NEW.num_serie_delivre = LEFT(NEW.num_serie_delivre, 12)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `regions`
--

CREATE TABLE `regions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `regions`
--

INSERT INTO `regions` (`id`, `name`) VALUES
(1, 'Analanjirofo'),
(4, 'Reg');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `year`) VALUES
(1, 2025),
(2, 2026),
(3, 2026);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`) VALUES
(1, 'cocodesignservice81@gmail.com', 'coco.tech', '$2b$10$IaFH90B08E9Yr6n9S28SUO995dRQBUeY20o.yCZySkNfco5mCpNpS'),
(2, 'dsdf@gmail.com', 'cocoService', '$2b$10$FJ.4RGb3ZrdkpqeggyaStOZKVfKtSV1shIDee6OjF6GkdTzIEIfce'),
(3, 'new@gmail.com', 'newUser', 'new');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activation_keys`
--
ALTER TABLE `activation_keys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `activation_key` (`activation_key`);

--
-- Index pour la table `agent_chef`
--
ALTER TABLE `agent_chef`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commune_id` (`commune_id`);

--
-- Index pour la table `communes`
--
ALTER TABLE `communes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `commune_i`
--
ALTER TABLE `commune_i`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_serie_origine` (`num_serie_origine`),
  ADD KEY `agent_chef_id_idx` (`agent_chef_id`),
  ADD KEY `user_id_idx` (`user_id`),
  ADD KEY `commune_id_idx` (`commune_id`);

--
-- Index pour la table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activation_keys`
--
ALTER TABLE `activation_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `agent_chef`
--
ALTER TABLE `agent_chef`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT pour la table `communes`
--
ALTER TABLE `communes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `commune_i`
--
ALTER TABLE `commune_i`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `regions`
--
ALTER TABLE `regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `agent_chef`
--
ALTER TABLE `agent_chef`
  ADD CONSTRAINT `agent_chef_ibfk_1` FOREIGN KEY (`commune_id`) REFERENCES `communes` (`id`);

--
-- Contraintes pour la table `commune_i`
--
ALTER TABLE `commune_i`
  ADD CONSTRAINT `fk_commune_i_agent` FOREIGN KEY (`agent_chef_id`) REFERENCES `agent_chef` (`id`),
  ADD CONSTRAINT `fk_commune_i_commune` FOREIGN KEY (`commune_id`) REFERENCES `communes` (`id`),
  ADD CONSTRAINT `fk_commune_i_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
