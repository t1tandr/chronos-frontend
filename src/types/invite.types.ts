export interface IInvite {
  id: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  calendar: {
    id: string
    name: string
    owner: {
      id: string
      name: string
    }
  }
}

export interface IInviteDto {
  email: string
}
