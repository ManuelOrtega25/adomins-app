import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET; 

export function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

//este middleware verifica que el usuario esté autenticado
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Falta el token de autorización' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    
    req.user = payload; 
    
    next(); 
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next(); 
  };
}