import type { APITransaction, FormattedTransaction } from '@/views/Transactions.vue'

export const convertTransaction = (apiTransaction: APITransaction): FormattedTransaction => {
  return {
    id: apiTransaction.id,
    type: apiTransaction.typeBTC_name,
    status: apiTransaction.status_name,
    date: apiTransaction.created_at,
    amount: `${apiTransaction.BTC_summ} BTC`,
    hashid: apiTransaction.hashid,
  }
}
