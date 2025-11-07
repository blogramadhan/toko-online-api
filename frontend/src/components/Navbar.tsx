import {
  Box,
  Flex,
  Button,
  Stack,
  useColorMode,
  useColorModeValue,
  Text,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Text
            as={RouterLink}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            color={useColorModeValue('blue.600', 'blue.300')}
          >
            Toko Online
          </Text>
        </Flex>

        <Flex alignItems="center" gap={4}>
          <Stack direction="row" spacing={4} alignItems="center">
            {user ? (
              <>
                <Button
                  as={RouterLink}
                  to="/products"
                  variant="ghost"
                  size="sm"
                >
                  Products
                </Button>
                <Button
                  as={RouterLink}
                  to="/cart"
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiShoppingCart />}
                  position="relative"
                >
                  Cart
                  {cartItemCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-1"
                      right="-1"
                      colorScheme="red"
                      borderRadius="full"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  as={RouterLink}
                  to="/orders"
                  variant="ghost"
                  size="sm"
                >
                  Orders
                </Button>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiUser />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem as={RouterLink} to="/profile">
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button as={RouterLink} to="/login" variant="ghost" size="sm">
                  Login
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="blue" size="sm">
                  Register
                </Button>
              </>
            )}
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              aria-label="Toggle color mode"
            />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
