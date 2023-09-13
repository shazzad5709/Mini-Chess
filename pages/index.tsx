import Image from 'next/image'
import { Inter } from 'next/font/google'
import QuickChess from '@/components/QuickChess'
import HomePage from '@/components/HomePage'
import Chess from '@/components/Chess'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Chess />
    </>
  )
}
