// auth.service.ts

/**
  * 用户注册
  * @param createUserDto
  * @returns
  */
async register(createUserDto: CreateUserDto) {
  const { username, password } = createUserDto;
  const existUser = await this.userService.findByUsername(username);
  if (existUser) {
    throw new BadRequestException('注册用户已存在');
  }

  const user = {
    ...createUserDto,
    password: encryptPwd(password), // 保存加密后的密码
  };

  return await this.userService.create(user);
}


// user.service.ts

/**
   * 根据用户名查询用户信息
   * @param username
   * @returns
   */
  async findByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

/**
   * 创建新用户
   */
  async create(user: CreateUserDto) {
    const { username } = user;
    await this.userRepository.save(user);
    return await this.userRepository.findOne({
      where: { username },
    });
  }