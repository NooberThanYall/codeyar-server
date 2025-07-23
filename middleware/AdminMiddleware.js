import { decrypt } from '../utils/jwt.js';
import User from './../models/UserModel.js';

const adminMiddleware = async (req, res, next) => {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ message: 'توکن وجود نداره' });
  }

  try {
    const {_id: id} = await decrypt(token);
    const user = await User.findById(id);

    if(!user.admin) return res.status(400).json('user isnt an admin you motherfucking fool')
    next();
  } catch (err) {
    res.status(401).json({ message: 'توکن نامعتبر یا منقضی شده' });
  }
};

export default adminMiddleware;


