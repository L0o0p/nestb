import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/users.entity';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { LoginUserDto } from './dto/loginUserDto.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  userRepository: Repository<UserEntity>;

  constructor(
    private usersService: UsersService,
    // private jwtService: JwtService,
    private dataSource: DataSource,
    // 在authService类构造函数中注入JwtService
    private readonly jwtService: JwtService,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }
  async login(loginUser: LoginUserDto) {
    console.log('loginUser', loginUser);
    const user = await this.validateUser(loginUser);
    const token = await this.createToken(user);
    return {
      token,
    };
  }
  /**
   * 校验登录用户
   * @param user
   * @returns
   */
  async validateUser(user: LoginUserDto) {
    const { username, password } = user;
    const existUser = await this.findByUsername(username);
    console.log('existUser', existUser);
    if (!existUser) {
      throw new BadRequestException('用户不存在');
    }
    const { password: hashPwd } = existUser;
    const isOk = comparePwd(password, hashPwd);
    if (!isOk) {
      throw new BadRequestException('登录密码错误');
    }
    return existUser;
  }

  /**
   * 创建token
   * @param user
   * @returns
   */
  createToken(user: UserEntity) {
    const payload = {
      // pd: user.password,
      id: user.id,
      name: user.username,
    };
    console.log('JWT Secret:', jwtConstants.secret);
    return this.jwtService.sign(payload, { secret: jwtConstants.secret });
  }
  /**
   * 根据用户名查询用户信息
   * @param username
   * @returns
   */
  async findByUsername(username: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
/**
 * 比较明文密码和加密密码是否匹配
 */
function comparePwd(password: string, hashPwd: string): boolean {
  if (!password || !hashPwd) {
    console.error(
      `Invalid arguments passed to comparePwd: password=${password}, encryptPwd=${hashPwd}`,
    );
    return false;
  }
  // 示例：使用bcrypt进行密码比较
  console.log('password', password, 'encryptPwd', hashPwd);
  // console.log(password === encryptPwd);
  return bcrypt.compareSync(password, hashPwd);
  // return password === encryptPwd;
}
