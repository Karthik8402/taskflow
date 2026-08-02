import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isGuest: boolean
  isLiveSupabase: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  enableGuestMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const GUEST_USER_KEY = 'taskflow_guest_active'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    // If Supabase is not configured, default to Guest Mode
    if (!isSupabaseConfigured) return true
    return localStorage.getItem(GUEST_USER_KEY) === 'true'
  })

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Auto enable demo guest user when Supabase is not connected
      setUser({
        id: 'guest-demo-user-id',
        email: 'guest@taskflow.demo',
        app_metadata: {},
        user_metadata: { full_name: 'Demo Explorer' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User)
      setIsGuest(true)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setUser(session.user)
        setIsGuest(false)
      } else if (localStorage.getItem(GUEST_USER_KEY) === 'true') {
        setIsGuest(true)
        setUser({
          id: 'guest-demo-user-id',
          email: 'guest@taskflow.demo',
          app_metadata: {},
          user_metadata: { full_name: 'Demo Explorer' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session?.user) {
          setUser(session.user)
          setIsGuest(false)
          localStorage.removeItem(GUEST_USER_KEY)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase project URL & Anon key not set in environment. Using Demo Mode.')
    }
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase project URL & Anon key not set in environment. Using Demo Mode.')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setIsGuest(false)
    localStorage.removeItem(GUEST_USER_KEY)
  }

  const signOut = async () => {
    if (isSupabaseConfigured && session) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setIsGuest(false)
    localStorage.removeItem(GUEST_USER_KEY)
  }

  const enableGuestMode = () => {
    setIsGuest(true)
    localStorage.setItem(GUEST_USER_KEY, 'true')
    setUser({
      id: 'guest-demo-user-id',
      email: 'guest@taskflow.demo',
      app_metadata: {},
      user_metadata: { full_name: 'Demo Explorer' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isGuest,
        isLiveSupabase: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        enableGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
