import generateID from '../helpers/generateID.js';
import generateJWT from '../helpers/generateJWT.js';
import User from '../models/User.js';
import { registerEmail, forgotPasswordEmail } from '../helpers/emails.js';

const createUser = async (req, res) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email: email });

  if (userExist) {
    const error = new Error('User already register');
    return res.status(400).json({ msg: error.message });
  } else {
    try {
      const user = new User(req.body);
      user.token = generateID();
      await user.save();

      // send confirmation email
      registerEmail({ email: user.email, name: user.name, token: user.token });
      res.json({
        msg: 'User Created succesfully, Check your email for more instructions',
      });
    } catch (error) {
    }
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Check if user exist
  if (!user) {
    const error = new Error('User donst exist');
    return res.status(400).json({ msg: error.message });
  }

  // Check if user is confirmed
  // if (!user.confirmed) {
  //   const error = new Error('Your account is not confirmed');
  //   return res.status(400).json({ msg: error.message });
  // }

  // Check if password is correct
  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    const error = new Error('Password is wrong');
    return res.status(400).json({ msg: error.message });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const confirmUser = await User.findOne({ token });

  if (!confirmUser) {
    const error = new Error('token incorrect');
    return res.status(400).json({ msg: error.message });
  }

  try {
    confirmUser.confirmed = true;
    confirmUser.token = '';
    await confirmUser.save();
    res.json({ msg: 'user confirmed' });
  } catch (error) {
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User donst exist');
    return res.status(400).json({ msg: error.message });
  }

  try {
    user.token = generateID();
    await user.save();
    forgotPasswordEmail({
      email: user.email,
      name: user.name,
      token: user.token,
    });
    res.json({ msg: 'Message sent to email' });
  } catch (error) {
  }
};

const checksPassword = async (req, res) => {
  const { token } = req.params;
  const validToken = await User.findOne({ token });

  if (validToken) {
    res.json({ msg: 'Valid token, user exist' });
  } else {
    const error = new Error('Token not valid');
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = '';
    try {
      await user.save();
      res.json({ msg: 'Password changed correctly' });
    } catch (error) {
    }
  } else {
    const error = new Error('Token not valid');
    return res.status(404).json({ msg: error });
  }
};

const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  createUser,
  authenticate,
  confirm,
  forgotPassword,
  checksPassword,
  newPassword,
  profile,
};
