import { useNavigate } from 'react-router-dom'
import { Button, Page, PageContent, PageHeader, Paragraph } from 'grommet'

import { AnchorLink } from 'components'

import { en } from 'locales'

function Home(): JSX.Element {
  const navigate = useNavigate()
  return (
    <Page fill flex justify="center" pad="medium">
      <PageContent>
        <PageHeader title={en.home.pageTitle} />
        <Paragraph size="xlarge">{en.home.projectDescription}</Paragraph>
        <Paragraph size="xlarge">
          {en.home.requirements}
          <br />
          <AnchorLink to={en.home.xrplFaucetUrl} label={en.home.xrplFaucet} />
          <br />
          <AnchorLink to={en.home.nftStorageUrl} label={en.home.nftStorage} />
        </Paragraph>
        <Button size="large" alignSelf="start" label={en.home.button} onClick={() => navigate('/draw')} />
      </PageContent>
    </Page>
  )
}

export default Home
