import { ReactNode } from 'react'

import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import { useRecoilState, useResetRecoilState } from 'recoil'

import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'

import { selectedOrganizationCodeState } from 'src/recoil/atom'

type MainLayoutProps = {
  children?: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentUser, logOut } = useAuth()
  const [selectedOrganizationCode, setSelectedOrganizationCode] =
    useRecoilState(selectedOrganizationCodeState)
  const reset = useResetRecoilState(selectedOrganizationCodeState)

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
            <Select
              bg="white"
              placeholder=" "
              onChange={(e) => {
                if (!e.target.value) {
                  reset()
                  return
                }
                setSelectedOrganizationCode(e.target.value)
              }}
            >
              {currentUser.organizations.map((organization) => (
                <option
                  key={organization.id}
                  value={organization.organizationCode}
                  selected={
                    organization.organizationCode === selectedOrganizationCode
                  }
                >
                  {organization.name}
                </option>
              ))}
            </Select>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link to={routes.settings()}>Settings</Link>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      <Box p={4}>{children}</Box>
    </>
  )
}

export default MainLayout
