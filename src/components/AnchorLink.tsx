import { Anchor, AnchorExtendedProps } from 'grommet/components/Anchor'
import { Link, LinkProps } from 'react-router-dom'

type AnchorLinkProps = LinkProps & AnchorExtendedProps

function AnchorLink(props: AnchorLinkProps): JSX.Element {
  return <Anchor as={Link} {...props} />
}

export default AnchorLink
