import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import * as theme from 'config/chakra.config'
import { RecoilRoot } from 'recoil'

import { AuthProvider } from '@redwoodjs/auth'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'
import './scaffold.css'

const extendedTheme = extendTheme(theme)

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider type="dbAuth">
        <RecoilRoot>
          <ColorModeScript />
          <ChakraProvider theme={extendedTheme}>
            <RedwoodApolloProvider>
              <Routes />
            </RedwoodApolloProvider>
          </ChakraProvider>
        </RecoilRoot>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
