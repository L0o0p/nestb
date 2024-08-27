import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(username: string, password: string): Promise<any> {
    const a = { username, password };
    const user = await this.authService.validateUser(a);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
