import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'
import { AuthService } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    })
  }

  // note: this is automatically called by PassportStrategy and AuthGuard
  async validate(payload: any, done: VerifiedCallback) {
    console.log(payload)
    const user = await this.authService.validateUser(payload)
    if (!user) {
      return done(
        new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED),
        false
      )
    }

    return done(null, user, payload.iat)
  }

  async validateFacebook(payload: any, done: VerifiedCallback) {
    const user = await this.authService.validateFacebookUser(payload)
    if (!user) {
      return done(
        new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED),
        false
      )
    }

    return done(null, user, payload.iat)
  }

  async validateGoogle(payload: any, done: VerifiedCallback) {
    const user = await this.authService.validateGoogleUser(payload)
    if (!user) {
      return done(
        new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED),
        false
      )
    }

    return done(null, user, payload.iat)
  }
}
