import { User } from '../users/user.entity'

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthResponseDTO {
  user: User
  token: string
}

export interface FacebookLoginDTO {
  facebookId: string
  loginType: string
}

export interface GoogleLoginDTO {
  googleId: string
  loginType: string
}

export interface AppleLoginDTO {
  appleId: string
  loginType: string
}

export interface forgotDTO {
  email: string
}