import Vue from 'vue'
import Router from 'vue-router'
import AppHome from '@/components/AppHome'
import AppBranch from '@/components/AppBranch'
import AppFacility from '@/components/AppFacility'
import AppPaidFacility from '@/components/AppPaidFacility'
import AppEmployee from '@/components/AppEmployee'
import AppCustomer from '@/components/AppCustomer'
import AppLogin from '@/components/AppLogin'
import AppRegister from '@/components/AppRegister'
import AppSeason from '@/components/AppSeason'
import AppRoom from '@/components/AppRoom'
import AppAvailableRoom from '@/components/AppAvailableRoom'
import AppRoomType from '@/components/AppRoomType'
import AppPersonalReservation from '@/components/AppPersonalReservation'
import AppMonthlyIncomeReport from '@/components/AppMonthlyIncomeReport'
import AppNumberOfGuests from '@/components/AppNumberOfGuests'
import AppReceipt from '@/components/AppReceipt'
import AppHistory from '@/components/AppHistory'
import AppShowPersonalReservation from '@/components/AppShowPersonalReservation'
import AppShowGroupReservation from '@/components/AppShowGroupReservation'
import AppNewGuestsReport from '@/components/AppNewGuestsReport'
import AppTopFiveCust from '@/components/AppTopFiveCust'
import AppIncomePerYear from '@/components/AppIncomePerYear'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'AppHome',
      component: AppHome
    },
    {
      path: '/branch',
      name: 'AppBranch',
      component: AppBranch,

      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 1)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/facility',
      name: 'AppFacility',
      component: AppFacility,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2 || localStorage.getItem('role') == 5 || localStorage.getItem('role') == 3)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/paidfacility',
      name: 'AppPaidFacility',
      component: AppPaidFacility,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2 || localStorage.getItem('role') == 5 || localStorage.getItem('role') == 3)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/employee',
      name: 'AppEmployee',
      component: AppEmployee,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2 || localStorage.getItem('role') == 1)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/customer',
      name: 'AppCustomer',
      component: AppCustomer,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2 || localStorage.getItem('role') == 1)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/login',
      name: 'AppLogin',
      component: AppLogin,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('user') === null)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/cust/register',
      name: 'AppRegister',
      component: AppRegister
    },
    {
      path: '/season',
      name: 'AppSeason',
      component: AppSeason,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2 || localStorage.getItem('role') == 1)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/room',
      name: 'AppRoom',
      component: AppRoom,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/availableRoom',
      name: 'AppAvailableRoom',
      component: AppAvailableRoom
    },
    {
      path: '/roomtype',
      name: 'AppRoomType',
      component: AppRoomType,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2 || localStorage.getItem('role') == 3)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/reservation/personal',
      name: 'AppPersonalReservation',
      component: AppPersonalReservation,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 6 || localStorage.getItem('user') === null)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/report/monthlyIncome',
      name: 'AppMonthlyIncomeReport',
      component: AppMonthlyIncomeReport,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/report/newCustomer',
      name: 'AppNewGuestsReport',
      component: AppNewGuestsReport,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 4 || localStorage.getItem('role') == 2 || localStorage.getItem('role') == 1)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/report/topFiveCust',
      name: 'AppTopFiveCust',
      component: AppTopFiveCust,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 4 || localStorage.getItem('role') == 2 || localStorage.getItem('role') == 1)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/report/numberOfGuests',
      name: 'AppNumberOfGuests',
      component: AppNumberOfGuests,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 2 || localStorage.getItem('role') == 1)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/report/incomePerYear',
      name: 'AppIncomePerYear',
      component: AppIncomePerYear,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 1 || localStorage.getItem('role') == 2)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/receipt/:id',
      name: 'AppReceipt',
      component: AppReceipt
    },
    {
      path: '/cust/history',
      name: 'AppHistory',
      component: AppHistory,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 6)  {
          next()
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/reservation/report/personal',
      name: 'AppShowPersonalReservation',
      component: AppShowPersonalReservation,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 3 || localStorage.getItem('role') == 1 || localStorage.getItem('role') == 2)  {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/reservation/report/group',
      name: 'AppShowGroupReservation',
      component: AppShowGroupReservation,
      beforeEnter: (to, from, next) => {
        if(localStorage.getItem('role') == 4 || localStorage.getItem('role') == 1 || localStorage.getItem('role') == 2)  {
          next()
        } else {
          next('/')
        }
      }
    }
  ]
})
