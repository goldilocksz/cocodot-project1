import { Auth } from '@/types/data'
import request from '@/utils/request'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: Auth | null
  logout: () => void
  isAuthenticated: () => boolean
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<Auth | null>(null)
  const [menu, setMenu] = useState()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) return
    setUser(JSON.parse(user))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const isAuthenticated = () => !!user && !!localStorage.getItem('token')

  return (
    <AuthContext.Provider value={{ user, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
