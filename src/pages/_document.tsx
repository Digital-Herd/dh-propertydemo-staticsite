import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <footer className="bg-white mx-auto max-w-2xl sm:pt-20 lg:pb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="border-t border-slate-900/5">
            <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
              <div className="mt-6 flex justify-center space-x-6">
                <img className="w-36" src="/logo.svg" alt="logo" />
              </div>
              <p className="mt-5 text-center text-base text-gray-400">
                &copy; 2022 Digital Houses, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </Html>
  )
}
