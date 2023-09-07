import Image from 'next/image'
import { Inter } from 'next/font/google'
import Chessboard from '@/components/ChessBoard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Chessboard />
    </>
  )
}
