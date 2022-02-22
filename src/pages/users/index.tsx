import { useEffect } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react'
import { RiAddLine } from 'react-icons/ri'
import Link from 'next/link'
import { useQuery } from 'react-query'

import { Header } from '../../components/Header'
import { Pagination } from '../../components/Pagination'
import { Sidebar } from '../../components/Sidebar'

export default function UserList() {
  const { data, isLoading, error } = useQuery(
    'users',
    async () => {
      const response = await fetch('http://localhost:3000/api/users')
      const data = await response.json()

      const users = data.users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        }
      })

      return users
    },
    {
      staleTime: 1000 * 5, // Durante 5 segundos nao precisa recarregar os dados da api (é fresh)
    }
  )

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then((response) => response.json())
      .then((data) => console.log(data))
  }, [])

  return (
    <Box>
      <Header />

      <Flex w="100%" my="24px" maxWidth="1480px" mx="auto" px="24px">
        <Sidebar />

        <Box flex="1" borderRadius="8px" bg="gray.800" p="32px">
          <Flex mb="32px" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
            </Heading>

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20px" />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>

          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários.</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th
                      px={['16px', '16px', '24px']}
                      color="gray.300"
                      width="32px"
                    >
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    {isWideVersion && <Th>Data de cadastro</Th>}
                    {isWideVersion && <Th width="32px"></Th>}
                  </Tr>
                </Thead>

                <Tbody>
                  {data.map((user) => {
                    return (
                      <>
                        <Tr key={user.id}>
                          <Td px={['16px', '16px', '24px']}>
                            <Checkbox colorScheme="pink" />
                          </Td>
                          <Td>
                            <Box>
                              <Text fontWeight="bold">{user.name}</Text>
                              <Text fontSize="sm" color="gray.300">
                                {user.email}
                              </Text>
                            </Box>
                          </Td>
                          {isWideVersion && <Td>{user.createdAt}</Td>}
                          {/* {isWideVersion && (
                            <Td>
                              <Button
                                as="a"
                                size="sm"
                                fontSize="sm"
                                colorScheme="purple"
                                leftIcon={
                                  <Icon as={RiPencilLine} fontSize="16px" />
                                }
                              >
                                Editar
                              </Button>
                            </Td>
                          )} */}
                        </Tr>
                      </>
                    )
                  })}
                </Tbody>
              </Table>

              <Pagination />
            </>
          )}
        </Box>
      </Flex>
    </Box>
  )
}
