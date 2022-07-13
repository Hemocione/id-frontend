import { Button } from '@mui/material';

const SimpleButton = ({ onClick, children, passStyle }) => (
  <Button type="submit" onClick={onClick} style={passStyle} sx={{
    'height': '3em',
    'background-color': '#D1151A',
    'font-size': '1em',
    'width': '8em',
    'color': '#FFFFFF',
    'border': 'none',
    'border-radius': '5px',
    'align-self': 'center',
    'cursor': 'pointer',
    'transition': 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
  }}>
    {children}
  </Button>
)

export default SimpleButton
