import jwt from 'jsonwebtoken';

// Middleware pour vérifier la validité d'un token JWT
export const verifyToken = (req, res, next) => {
  // Récupérer le header Authorization
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  // Le header est généralement au format "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  // Vérifier le token avec le secret (préférez stocker le secret dans process.env.JWT_SECRET)
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    // Stocker les informations décodées dans req.user pour les utiliser dans les contrôleurs
    req.user = decoded;
    next();
  });
};

// Middleware pour vérifier si l'utilisateur a le rôle d'administrateur
export const isAdmin = (req, res, next) => {
  // On suppose que le token décodé contient une propriété "role"
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Accès refusé: administrateur requis.' });
  }
};
