export interface IAuthDto {
  email: string
  password: string
}

export interface IRegisterDto {
  email: string
  name: string
  password: string
  country?: string
}

export interface IUpdateUserDto {
  name?: string
  email?: string
  oldPassword?: string
  newPassword?: string
}
