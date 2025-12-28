import { useSelector, useDispatch } from 'react-redux'
import { setCredentials, clearCredentials, setError, clearError } from './slices/authSlice'
import {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from './api/authApi'

// Auth state selector
export const useAuth = () => {
  return useSelector((state) => state.auth)
}

// Auth actions hook
export const useAuthActions = () => {
  const dispatch = useDispatch()
  return {
    setCredentials: (user, token) => dispatch(setCredentials({ user, token })),
    clearCredentials: () => dispatch(clearCredentials()),
    setError: (error) => dispatch(setError(error)),
    clearError: () => dispatch(clearError()),
  }
}

// Combined auth hook with RTK Query mutations
export const useAuthState = () => {
  const auth = useAuth()
  const actions = useAuthActions()
  const [login, loginResult] = useLoginMutation()
  const [register, registerResult] = useRegisterMutation()
  const [logout, logoutResult] = useLogoutMutation()
  const [forgotPassword, forgotPasswordResult] = useForgotPasswordMutation()
  const [resetPassword, resetPasswordResult] = useResetPasswordMutation()
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !auth.token, // Skip if no token
  })

  return {
    ...auth,
    ...actions,
    // Mutations
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    // Mutation states
    loginResult,
    registerResult,
    logoutResult,
    forgotPasswordResult,
    resetPasswordResult,
    // Current user query
    currentUser,
    isLoadingUser,
    userError,
  }
}

// Selector helpers (for backward compatibility)
export const selectIsAuthenticated = (state) => state.auth?.isAuthenticated ?? false
export const selectUser = (state) => state.auth?.user ?? null
export const selectToken = (state) => state.auth?.token ?? null
export const selectAuthError = (state) => state.auth?.error ?? null
export const selectAuthLoading = (state) => state.auth?.isLoading ?? false
