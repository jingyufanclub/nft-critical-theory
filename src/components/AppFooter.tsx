import { Anchor, Footer, Text } from 'grommet'

function AppFooter(): JSX.Element {
  return (
    <Footer pad="large" height="xsmall" justify="end">
      <Text size="small">
        {`Jing Yu & Chris Lee ${new Date().getFullYear()}`}
        <br />
        Feedback/business inquiries? <Anchor href="mailto: this.is.not.a.rug.pull@gmail.com" label="Drop us a line" />
        <br />
        Follow us on <Anchor href="https://twitter.com/not_a_rug_pull" target="_blank" rel="noopener" label="Twitter" />
      </Text>
    </Footer>
  )
}

export default AppFooter
