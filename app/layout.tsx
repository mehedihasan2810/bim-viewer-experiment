import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import StoreProvider from '@/lib/StoreProvider'

export const metadata = {
  title: 'BIM Viewer',
  description: 'A feature packed BIM viewer.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        {/* {children} */}
        <StoreProvider lastUpdate={new Date().getTime()}>
          <Layout>{children}</Layout>
        </StoreProvider>
      </body>
    </html>
  )
}
