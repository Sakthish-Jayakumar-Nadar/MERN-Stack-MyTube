import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import ErrorPage from './components/ErrorPage.jsx'
import { lazy, Suspense } from 'react'
import Loader from './components/loader.jsx'

const Home = lazy(() => import('./components/Home.jsx'));
const PlayVideo = lazy(() => import('./components/PlayVideo.jsx'));
const Channel = lazy(() => import('./components/Channel.jsx'));
const SearchResult = lazy(() => import('./components/SearchResult.jsx'))

const appRouter = createBrowserRouter([
  {
    path:'/',
    element: <App />,
    children:[
      {
        path:'/',
        element: <Suspense fallback={<Loader/>}><Home/></Suspense>,
        errorElement : <ErrorPage />
      },
      {
        path:'/playing/:id',
        element: <Suspense fallback={<Loader/>}><PlayVideo/></Suspense>,
        errorElement : <ErrorPage />
      },
      {
        path:'/channel/:id',
        element: <Suspense fallback={<Loader/>}><Channel/></Suspense>,
        errorElement : <ErrorPage />
      },
      {
        path:'/searchVideos/:searchText',
        element: <Suspense fallback={<Loader/>}><SearchResult/></Suspense>,
        errorElement : <ErrorPage />
      }
    ],
    errorElement : <ErrorPage />
  }
])
createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <RouterProvider router={appRouter} />
  </ChakraProvider>,
)
