export interface UserData {
  user_id?: string
  balance?: number
  btc_ammount?: number
}

export interface User {
  data: UserData
  login: () => Promise<void>
}
