import { Injectable } from '@nestjs/common'
import { sign } from 'jsonwebtoken'
import { UserService } from '../users/user.service'
import { LoginDTO } from './auth.dto'
import { FacebookLoginDTO } from './auth.dto'
import { GoogleLoginDTO } from './auth.dto'
import { AppleLoginDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
  ) {}

  signPayload(payload: LoginDTO) {
    const ttl = process.env.NODE_ENV === 'local' ? '12h' : '7d'
    return sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: ttl })
  }

  signFacebookPayload(payload: FacebookLoginDTO) {
    const ttl = process.env.NODE_ENV === 'local' ? '12h' : '7d'
    return sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: ttl })
  }

  signGooglePayload(payload: GoogleLoginDTO) {
    const ttl = process.env.NODE_ENV === 'local' ? '12h' : '7d'
    return sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: ttl })
  }

  signApplePayload(payload: AppleLoginDTO) {
    const ttl = process.env.NODE_ENV === 'local' ? '12h' : '7d'
    return sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: ttl })
  }

  async validateUser(payload: LoginDTO): Promise<any> {
    return await this.usersService.getByLoginInfo(payload.email, payload.password)
  }
  async validateFacebookUser(payload: FacebookLoginDTO): Promise<any> {
    return await this.usersService.getByLoginInfo(payload.loginType, payload.facebookId)
  }
  async validateGoogleUser(payload: GoogleLoginDTO): Promise<any> {
    return await this.usersService.getByLoginInfo(payload.loginType, payload.googleId)
  }
  async validateAppleUser(payload: AppleLoginDTO): Promise<any> {
    return await this.usersService.getByLoginInfo(payload.loginType, payload.appleId)
  }
}
