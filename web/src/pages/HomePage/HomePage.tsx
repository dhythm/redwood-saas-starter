import { useRecoilValue } from 'recoil'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import OrganizationCell from 'src/components/OrganizationCell'
import { selectedOrganizationCodeState } from 'src/recoil/atom'

const HomePage = () => {
  const selectedOrganizationCode = useRecoilValue(selectedOrganizationCodeState)
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>HomePage</h1>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
      </p>
      <p>
        My default route is named <code>home</code>, link to me with `
        <Link to={routes.home()}>Home</Link>`
      </p>
      {selectedOrganizationCode && (
        <OrganizationCell organizationCode={selectedOrganizationCode} />
      )}
    </>
  )
}

export default HomePage
