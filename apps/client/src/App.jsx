import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MyProjects from './pages/MyProjects'
import PublicPen from './pages/PublicPen'
import AdminNotifications from './pages/admin/Notifications'
import UserManagement from './pages/admin/UserManagement'
import Analytics from './pages/admin/Analytics'
import ScriptManagement from './pages/admin/ScriptManagement'
import UpdateWebsite from './pages/admin/UpdateWebsite'
import ProtectedRoute from './components/layout/ProtectedRoute'
import BlogList from './pages/blog/BlogList'
import BlogPost from './pages/blog/BlogPost'
import MyPosts from './pages/MyPosts'
import CreateEditPost from './pages/CreateEditPost'
import { useEffect } from 'react'
import useThemeStore from './store/themeStore'
import useAuthStore from './store/authStore'

function App() {
  const initTheme = useThemeStore((state) => state.initTheme)
  const { token, setUser } = useAuthStore()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Session expired')
      })
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // If token is invalid, clear it
        useAuthStore.getState().logout()
      })
    }
  }, [token, setUser])

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/pen/:id" element={<PublicPen />} />
        <Route path="/login" element={<Login />} />
        
        {/* Blog Routes */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogPost />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/pens" element={<MyProjects />} />
          <Route path="/dashboard/posts" element={<MyPosts />} />
          <Route path="/dashboard/posts/new" element={<CreateEditPost />} />
          <Route path="/dashboard/posts/edit/:id" element={<CreateEditPost />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard/admin/users" element={<UserManagement />} />
          <Route path="/dashboard/admin/analytics" element={<Analytics />} />
          <Route path="/dashboard/admin/scripts" element={<ScriptManagement />} />
          <Route path="/dashboard/admin/updates" element={<UpdateWebsite />} />
          <Route path="/dashboard/admin/notifications" element={<AdminNotifications />} />
          
          <Route path="/dashboard/:role/editor" element={<Editor />} />
          <Route path="/dashboard/:role/editor/:id" element={<Editor />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App