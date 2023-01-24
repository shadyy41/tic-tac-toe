import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='h-full'>
      <Head />
        <body className='font-mono h-full w-screen text-blue-100 bg-gray-900'>
          <Main/>
          <NextScript />
        </body>
    </Html>
  )
}
