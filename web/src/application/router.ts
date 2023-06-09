import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocation,
} from 'vue-router'
import { useAuthenticationService } from '@/application/authentication/AuthenticationService'
import LoginPage from '@/application/LoginPage.vue'
import { appRoutes } from '@/application/app/routes'
import { loadEnvironment } from '@/Environment'
import AuthenticatedApp from '@/application/AuthenticatedApp.vue'

const appRoute = {
  path: '/app',
  component: AuthenticatedApp,
  beforeEnter: async (
    to: RouteLocation,
    from: RouteLocation,
    next: NavigationGuardNext
  ) => {
    const authenticationService = useAuthenticationService(
      await loadEnvironment()
    )
    if (await authenticationService.isAuthenticated()) {
      const loginTargetPath = authenticationService.getAndClearLoginTargetPath()
      if (loginTargetPath !== null) {
        return next({ path: loginTargetPath })
      } else {
        return next()
      }
    } else {
      authenticationService.setLoginTargetPath(to.fullPath)
      return next({ path: '/login' })
    }
  },
  children: appRoutes,
}

const loginRoute = {
  path: '/login',
  component: LoginPage,
  beforeEnter: async (
    to: RouteLocation,
    from: RouteLocation,
    next: NavigationGuardNext
  ) => {
    const authenticationService = useAuthenticationService(
      await loadEnvironment()
    )
    if (await authenticationService.isAuthenticated()) {
      return next({ path: '/app' })
    } else {
      return next()
    }
  },
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    appRoute,
    loginRoute,
    {
      path: '/:pathMatch(.*)*',
      redirect: { path: '/app' },
    },
  ],
})
