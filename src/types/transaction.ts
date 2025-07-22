export interface APITransaction {
  BTC_summ: string
  bank_name: string
  card_name: string
  email: string
  sender_name: string
  created_at: string
  hashid: string
  id: number
  manager_usertag: string
  status_name: 'Подтверждена' | 'Обработка'
  card_number: string
  summ: number
  typeBTC_name: 'Продажа' | 'Покупка'
  user: number
}

export interface FormattedTransaction {
  id: number
  type: 'Продажа' | 'Покупка'
  status: 'Подтверждена' | 'Обработка'
  date: string
  hashid: string
  amount: string
}
