import { useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import AuthPages from './components/Login'
import TinderFeed from './components/feed'
import ProfileUpdate from './components/Profile'
import ChatAssistant from './components/AIChat'

function App() {


  return (
    <>
<Landing/>
<AuthPages/>
<TinderFeed/>
<ProfileUpdate/>
<ChatAssistant/>
    </>
  )
}

export default App
