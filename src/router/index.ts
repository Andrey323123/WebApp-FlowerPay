import { createRouter, createWebHistory } from 'vue-router'

import PortfolioOverview from '@/views/PortfolioOverview.vue'
import News from '@/views/News.vue'
import CoinStats from '@/views/CoinStats.vue'
import Exchange from '@/views/Exchange.vue'
import AppSettings from '@/views/AppSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'portfolio',
      component: PortfolioOverview,
    },
    {
      path: '/stats',
      name: 'crypto-stats',
      component: CoinStats,
    },
    {
      path: '/news',
      name: 'news',
      component: News,
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: Exchange,
    },
    {
      path: '/settings',
      name: 'settings',
      component: AppSettings,
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: () => import('@/views/withdraw/Withdraw.vue'),
    },
    {
      path: '/withdraw/bank/confirm',
      name: 'withdraw-bank-confirm',
      component: () => import('@/views/withdraw/ExchangeConfirm.vue'),
    },
    {
      path: '/withdraw-coins',
      name: 'WithdrawCoins',
      component: () => import('@/views/withdraw/WithdrawCoins.vue'),
    },
    {
      path: '/withdraw-coin/:coin',
      name: 'WithdrawCoin',
      component: () => import('@/views/withdraw/WithdrawCoin.vue'),
    },
    {
      path: '/deposit',
      name: 'deposit',
      component: () => import('@/views/deposit/DepositPage.vue'),
    },
    {
      path: '/bank-deposit',
      name: 'bank-deposit',
      component: () => import('@/views/deposit/DepositChoice.vue'),
    },
    {
      path: '/deposit-form/:bank',
      name: 'deposit-form',
      component: () => import('@/views/deposit/DepositForm.vue'),
    },
    {
      path: '/crypto-deposit',
      name: 'crypto-deposit',
      component: () => import('@/views/deposit/СryptoDeposit.vue'),
    },
    {
      path: '/crypto-deposit/details',
      name: 'crypto-deposit-details',
      component: () => import('@/views/deposit/CryptoDepositDetails.vue'),
    },
    {
      path: '/deposit/receipt',
      name: 'deposit-receipt',
      component: () => import('@/views/deposit/DepositReceiptAttachment.vue'),
    },
    {
      path: '/deposit/success',
      name: 'deposit-success',
      component: () => import('@/views/deposit/DepositSuccessful.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/Transactions.vue'),
    },
    {
      path: '/transactions/:id',
      name: 'transaction',
      props: true,
      component: () => import('@/views/Transaction.vue'),
    },
    {
      path: '/settings/notifications',
      name: 'notifications',
      component: () => import('@/views/Notifications.vue'),
    },
  ],
})

export default router
