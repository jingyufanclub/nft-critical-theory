import { Footer, Text } from 'grommet'

function AppFooter(): JSX.Element {
  return (
    <Footer pad="large" height="xsmall" justify="end">
      <Text size="small">
        {`Jing Yu & Chris Lee ${new Date().getFullYear()}`}
        <br />
        Feedback/business inquiries? <a href="mailto: this.is.not.a.rug.pull@gmail.com">Drop us a line</a>
        <br />
        Follow us on <a href="https://twitter.com/not_a_rug_pull">Twitter</a>
      </Text>
    </Footer>
  )
}

export default AppFooter
