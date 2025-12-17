import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState } from '@/lib/store'

// User info type definition
export interface UserInfo {
  id?: string
  email?: string
  walletAddress?: string
  username?: string
  displayName?: string
  avatar?: string
  bio?: string
  verified?: boolean
  verifiedAt?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

const initialState: UserInfo = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      if (!action.payload) return
      return {
        ...state,
        ...action.payload,
      }
    },
    clearUserInfo: () => {
      return initialState
    },
  },
})

export const { setUserInfo, clearUserInfo } = userSlice.actions

export const userInfo = (state: AppState) => state.user

export default userSlice.reducer
