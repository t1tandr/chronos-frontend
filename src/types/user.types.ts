import { string } from 'zod'

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

export interface IUser {
  id: string
  name: string
  email: string
  country: string | null
}

export interface IAuthResponse {
  user: IUser
  accessToken: string
}
