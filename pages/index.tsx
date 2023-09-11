import Image from 'next/image'
import { Inter } from 'next/font/google'
import QuickChess from '@/components/QuickChess'
import HomePage from '@/components/HomePage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <QuickChess />
    </>
  )
}
