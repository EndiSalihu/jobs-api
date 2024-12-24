const User = require('./../models/User');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')



const register = async (req, res) => {
  const { name, email, password } = req.body

  if(!name || !email || !password) {
    throw new BadRequestError('Please provide name, email and password!')
  }

  const userExists = await User.findOne({ email })

  if(userExists){
    throw new BadRequestError('User exists with this email, try another one!')
  }
  
  const user = await User.create({ name, email, password })

  const token = user.createJwt()

  res.status(StatusCodes.CREATED).json({ username: user.name, token })
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if( !email || !password) {
    throw new BadRequestError('Please provide email and password!')
  }

  const user = await User.findOne({ email })

  if(!user){
    throw new NotFoundError('User does not exist!')
  }

  const isPasswordMatch = await user.comparePassword(password)

  if(!isPasswordMatch){
    throw new UnauthenticatedError('Invalid email address or password!')
  }

  const token = user.createJwt()

  res.status(StatusCodes.OK).json({ username: user.name, token })
}

const getUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: { userId: req.user.userId, name: req.user.name } });
}


module.exports = { register, login, getUser }