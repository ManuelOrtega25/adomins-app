import bcrypt from 'bcryptjs';
import repo from '../repositories/users.repository.js';
import { sign } from '../lib/auth.js';

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    
    const user = await repo.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = sign(payload);

    return res.status(200).json({ 
      message: 'Login exitoso', 
      token: token,
      user: payload 
    });

  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ error: 'Error interno del servidor pipipi' });
  }
}

export async function create(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'El email y el password son obligatorios' });
    }

    const existingUser = await repo.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Credenciales no válidas' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await repo.create({ 
      email: email, 
      passwordHash: hashedPassword, 
      role: role || 'user' 
    });

    delete user.password_hash;

    return res.status(201).json({ 
      ok: true, 
      message: 'Usuario creado con éxito',
      user: user 
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: 'Error interno del servidor pipipi' });
  }
}