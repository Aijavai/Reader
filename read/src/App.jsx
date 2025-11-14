import './App.css'
import {
  Suspense,
  lazy,
  useEffect
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import useAppStore from './store/useAppStore'

// 导入组件
import Loading from './components/Loading'
import MainLayout from './components/MainLayout'
import BlankLayout from './components/BlankLayout'

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'))
const Book = lazy(() => import('./pages/Book'))
const Bookshelf = lazy(() => import('./pages/Bookshelf'))
const Profile = lazy(() => import('./pages/Profile'))
const Category = lazy(() => import('./pages/Category'))
const Search = lazy(() => import('./pages/Search'))
const Settings = lazy(() => import('./pages/Settings'))
const ReadingHistory = lazy(() => import('./pages/ReadingHistory'))
const SearchHistory = lazy(() => import('./pages/SearchHistory'))
const Reader = lazy(() => import('./pages/Reader'))

function App() {
  const { theme } = useAppStore();
  
  useEffect(() => {
    // 应用主题到document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/category' element={<Category />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/bookshelf' element={<Bookshelf />} />
            
          </Route>
          <Route element={<BlankLayout />}>
            <Route path='/search' element={<Search />} />
            <Route path='/book/:id' element={<Book />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/reading-history' element={<ReadingHistory />} />
            <Route path='/search-history' element={<SearchHistory />} />
            <Route path='/reader/:id' element={<Reader />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
