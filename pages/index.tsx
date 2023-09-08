import Image from 'next/image'
import { Inter } from 'next/font/google'
import QuickChess from '@/components/QuickChess'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <QuickChess />
    </>
  )
}
