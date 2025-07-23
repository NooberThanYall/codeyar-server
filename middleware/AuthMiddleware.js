import { decrypt } from '../utils/jwt.js';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ message: 'توکن وجود نداره' });
  }

  try {
    const decoded = await decrypt(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'توکن نامعتبر یا منقضی شده' });
  }
};

export default authMiddleware;


