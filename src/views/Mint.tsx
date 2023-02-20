import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Page, PageContent, PageHeader } from 'grommet'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xrpl = require('xrpl')

import { en } from 'locales'

function Mint(): JSX.Element {
  const location = useLocation()
  const { svgData } = location.state

  return (
    <Page>
      <PageContent>
        <PageHeader title={en.mint.pageTitle} />
        <img src={svgData} />
      </PageContent>
    </Page>
  )
}

export default Mint
