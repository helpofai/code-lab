import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const useSocket = (penId) => {
  const socketRef = useRef()

  useEffect(() => {
    socketRef.current = io('/', {
      path: '/socket.io'
    })

    if (penId) {
      socketRef.current.emit('join-pen', penId)
    }

    return () => {
      socketRef.current.disconnect()
    }
  }, [penId])

  const emitCodeChange = (code) => {
    if (socketRef.current) {
      socketRef.current.emit('code-change', { penId, code })
    }
  }

  const onCodeUpdate = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('code-update', callback)
    }
  }

  return { emitCodeChange, onCodeUpdate }
}

export default useSocket
