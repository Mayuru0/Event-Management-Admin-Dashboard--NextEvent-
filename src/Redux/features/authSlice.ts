/*eslint-disable @typescript-eslint/no-explicit-any*/
"use client"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store/store"
import type { User } from "@/type/user"
import { isTokenExpired } from "@/utils/tokenUtils"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const storage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  },
  setItem: (key: string, value: any) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },
}

const initialState: AuthState = {
  user: storage.getItem("user") || null,
  token: storage.getItem("token") || null,
  isAuthenticated: !!storage.getItem("token"),
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      if (action.payload.user && action.payload.token) {
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        storage.setItem("token", action.payload.token)
        storage.setItem("user", action.payload.user)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      storage.removeItem("token")
      storage.removeItem("user")
    },
    checkAuth: (state) => {
      const token = storage.getItem("token")
      if (!token || isTokenExpired(token)) {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        storage.removeItem("token")
        storage.removeItem("user")
      }
    },
  },
})

export const { setCredentials, logout, checkAuth } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectuser = (state: RootState) => state.auth.user

export default authSlice.reducer

