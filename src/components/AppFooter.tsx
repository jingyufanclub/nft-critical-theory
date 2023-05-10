import { Footer, Text } from 'grommet'

function AppFooter(): JSX.Element {
  return (
    <Footer pad="large" height="xsmall" justify="end">
      <Text size="small">{`Jing Yu & Chris Lee ${new Date().getFullYear()}`}</Text>
    </Footer>
  )
}

export default AppFooter
