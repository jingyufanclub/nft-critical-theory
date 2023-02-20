import { Navigate } from 'react-router-dom'
import { Button, Page, PageContent, PageHeader } from 'grommet'

import { en } from 'locales'
import { useAuthContext } from 'components/Auth/AuthProvider'

function Home(): JSX.Element {
  const { user, onSignIn } = useAuthContext()

  if (!user) {
    return (
      <Page fill flex justify="center" pad="medium">
        <PageContent>
          <PageHeader title={en.signIn.welcome} />
          <Button size="large" alignSelf="start" label={en.signIn.button} onClick={onSignIn} />
        </PageContent>
      </Page>
    )
  }

  return <Navigate to="/draw" replace={true} />
}

export default Home
