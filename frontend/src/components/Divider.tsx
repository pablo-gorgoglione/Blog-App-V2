import { Box } from '@chakra-ui/react';

interface Props {
  height?: string;
}

const Divider = ({ height = '100px' }: Props) => {
  return (
    <Box
      height={height}
      border='1px'
      borderColor='green'
      textAlign={'center'}
      verticalAlign={'middle'}
    ></Box>
  );
};

export default Divider;
