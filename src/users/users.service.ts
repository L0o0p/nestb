import {
  // BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { DataSource } from 'typeorm';
import { UserEntity } from './users.entity';
import {
  DataSourceService,
  UsernameQuery,
} from 'src/datasource/datasource.service';

export interface CreateUser {
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private userRepository;
  private customUserRepository;
  private logger = new Logger();
  //   inject the Datasource provider
  constructor(
    private dataSource: DataSource,
    private dataSourceService: DataSourceService, // inject our datasource service
  ) {
    // get users table repository to interact with the database
    this.userRepository = this.dataSource.getRepository(UserEntity);
    // assigning the dataSourceService userCustomRepository to the class customUserRepository
    this.customUserRepository = this.dataSourceService.userCustomRepository;
  }
  //  create handler to create new user and save to the database
  async createUser(createUser: CreateUser): Promise<UserEntity> {
    try {
      const { username, password } = createUser;
      // hashed password hash(password) digest
      const hashPassword = this.hashPwd(password);
      const user = new UserEntity(); // 直接使用实体类构造实例
      user.username = username;
      user.password = hashPassword;

      return await this.userRepository.save(user); // 保存用户
    } catch (err) {
      if (err.code == 23505) {
        this.logger.error(err.message, err.stack);
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }
  // the userService filterByUsername handler
  async filterByUsername(usernameQuery: UsernameQuery): Promise<UserEntity[]> {
    if (!usernameQuery) {
      throw new Error('usernameQuery 参数未提供或为空');
    }
    const { username } = usernameQuery;
    if (!username) {
      throw new Error('username 属性未提供或为空');
    }
    try {
      // calling the customUserRepository filterUser custom method
      return await this.customUserRepository.filterUser(usernameQuery);
    } catch (err) {
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }
  async findOne(username: string) {
    return this.userRepository.find((user) => user.username === username);
  }
  hashPwd(password: string) {
    return bcryptjs.hashSync(password, 10);
  }
}

//   async register(createUserDto: CreateUserDto) {
//     const { username, password } = createUserDto;
//     const existUser = await this.userService.findByUsername(username);
//     if (existUser) {
//       throw new BadRequestException('注册用户已存在');
//     }

//     const user = {
//       ...createUserDto,
//       password: encryptPwd(password), // 保存加密后的密码
//     };

//     return await this.userService.create(user);
//   }

//   // user.service.ts

//   /**
//    * 根据用户名查询用户信息
//    * @param username
//    * @returns
//    */
//   async findByUsername(username: string) {
//     return await this.userRepository.findOne({
//       where: { username },
//     });
//   }

//   /**
//    * 创建新用户
//    */
//   async create(user: CreateUserDto) {
//     const { username } = user;
//     await this.userRepository.save(user);
//     return await this.userRepository.findOne({
//       where: { username },
//     });
//   }
