import { Button } from '@chakra-ui/react'

interface PaginationItemProps {
  number: number
  isCurrent?: boolean
  onPageChange: (page: number) => void
}

export function PaginationItem({
  number,
  isCurrent = false,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="16px"
        colorScheme="pink"
        disabled
        _disabled={{ bg: 'pink.500', cursor: 'default' }}
      >
        {number}
      </Button>
    )
  } else {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="16px"
        bg="gray.700"
        _hover={{
          bg: 'gray.500',
        }}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Button>
    )
  }
}
