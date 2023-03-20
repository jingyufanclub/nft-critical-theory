import { useNavigate } from 'react-router-dom'
import { Button, Heading, Main, Paragraph } from 'grommet'

import { AnchorLink, AppFooter } from 'components'

import { en } from 'locales'

function Home(): JSX.Element {
  const navigate = useNavigate()
  return (
    <>
      <Main pad={{ vertical: 'medium', horizontal: 'large' }}>
        <Heading>{en.home.pageTitle}</Heading>
        <Paragraph size="xlarge">{en.home.projectDescription}</Paragraph>
        <Paragraph size="large">
          {en.home.requirements}
          <br />
          <AnchorLink to={en.home.xrplFaucetUrl} label={en.home.xrplFaucet} />
          <br />
          <AnchorLink to={en.home.nftStorageUrl} label={en.home.nftStorage} />
        </Paragraph>
        <Button size="large" alignSelf="start" label={en.home.button} onClick={() => navigate('/draw')} />
      </Main>
      <AppFooter />
    </>
  )
}

export default Home
