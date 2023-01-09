import { Page, PageContent, PageHeader } from 'grommet'

import { en } from 'locales'

function Fallback(): JSX.Element {
  return (
    <Page fill flex align="center" justify="center" pad="medium">
      <PageContent>
        <PageHeader title={en.error.fallback} />
      </PageContent>
    </Page>
  )
}

export default Fallback
