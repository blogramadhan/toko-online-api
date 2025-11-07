import React from 'react';
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
  Button,
  IconButton,
  Heading,
  HStack,
  VStack,
  Flex,
  useToast,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = async (cartItemId: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;

    try {
      await updateCartItem(cartItemId, newQuantity);
      toast({
        title: 'Cart updated',
        description: 'Quantity updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleRemoveItem = async (cartItemId: number, productName: string) => {
    try {
      await removeFromCart(cartItemId);
      toast({
        title: 'Item removed',
        description: `${productName} has been removed from your cart`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove item',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleClearCart = async () => {
    if (!cart?.items || cart.items.length === 0) return;

    try {
      await clearCart();
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to clear cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading && !cart) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading cart...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  // Empty cart state
  if (!cart?.items || cart.items.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg" color="gray.800">
            Shopping Cart
          </Heading>

          <Box bg="gray.50" p={12} borderRadius="lg" textAlign="center">
            <VStack spacing={4}>
              <Text fontSize="2xl" color="gray.600">
                Your cart is empty
              </Text>
              <Text fontSize="md" color="gray.500">
                Add some products to get started
              </Text>
              <Button colorScheme="blue" onClick={() => navigate('/products')} mt={4}>
                Continue Shopping
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Heading size="lg" color="gray.800">
            Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </Heading>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            isDisabled={loading}
          >
            Clear Cart
          </Button>
        </Flex>

        {/* Cart Items - Desktop Table View */}
        <Box
          bg="white"
          borderRadius="lg"
          shadow="sm"
          overflow="hidden"
          display={{ base: 'none', md: 'block' }}
        >
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Product</Th>
                <Th isNumeric>Price</Th>
                <Th>Quantity</Th>
                <Th isNumeric>Subtotal</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {cart.items.map((item) => (
                <Tr key={item.id}>
                  <Td>
                    <HStack spacing={4}>
                      <Image
                        src={item.product?.image || 'https://via.placeholder.com/80'}
                        alt={item.product?.name || 'Product'}
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" color="gray.800">
                          {item.product?.name || 'Unknown Product'}
                        </Text>
                        <Text fontSize="sm" color="gray.500" noOfLines={2}>
                          {item.product?.description || ''}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <Text fontWeight="medium" color="gray.700">
                      {formatPrice(item.price)}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Decrease quantity"
                        icon={<MinusIcon />}
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        isDisabled={item.quantity <= 1 || loading}
                        colorScheme="gray"
                      />
                      <Text fontWeight="medium" minW="30px" textAlign="center">
                        {item.quantity}
                      </Text>
                      <IconButton
                        aria-label="Increase quantity"
                        icon={<AddIcon />}
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        isDisabled={
                          loading || (item.product?.stock && item.quantity >= item.product.stock)
                        }
                        colorScheme="gray"
                      />
                    </HStack>
                  </Td>
                  <Td isNumeric>
                    <Text fontWeight="bold" color="blue.600">
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Remove item"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id, item.product?.name || 'Product')}
                      isDisabled={loading}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Cart Items - Mobile Card View */}
        <VStack spacing={4} display={{ base: 'flex', md: 'none' }}>
          {cart.items.map((item) => (
            <Box key={item.id} bg="white" p={4} borderRadius="lg" shadow="sm" width="100%">
              <HStack spacing={4} align="start">
                <Image
                  src={item.product?.image || 'https://via.placeholder.com/80'}
                  alt={item.product?.name || 'Product'}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack align="start" spacing={2} flex={1}>
                  <Text fontWeight="medium" color="gray.800">
                    {item.product?.name || 'Unknown Product'}
                  </Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={2}>
                    {item.product?.description || ''}
                  </Text>
                  <Text fontWeight="medium" color="gray.700">
                    {formatPrice(item.price)}
                  </Text>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Decrease quantity"
                      icon={<MinusIcon />}
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      isDisabled={item.quantity <= 1 || loading}
                      colorScheme="gray"
                    />
                    <Text fontWeight="medium" minW="30px" textAlign="center">
                      {item.quantity}
                    </Text>
                    <IconButton
                      aria-label="Increase quantity"
                      icon={<AddIcon />}
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      isDisabled={
                        loading || (item.product?.stock && item.quantity >= item.product.stock)
                      }
                      colorScheme="gray"
                    />
                  </HStack>
                  <Text fontWeight="bold" color="blue.600">
                    Subtotal: {formatPrice(item.price * item.quantity)}
                  </Text>
                </VStack>
                <IconButton
                  aria-label="Remove item"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemoveItem(item.id, item.product?.name || 'Product')}
                  isDisabled={loading}
                />
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* Cart Summary */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="gray.800">
              Cart Summary
            </Heading>
            <Divider />
            <HStack justify="space-between">
              <Text fontSize="lg" color="gray.600">
                Total Items:
              </Text>
              <Text fontSize="lg" fontWeight="medium" color="gray.800">
                {cart.items.reduce((total, item) => total + item.quantity, 0)}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Total Amount:
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {formatPrice(cart.totalAmount)}
              </Text>
            </HStack>
            <Divider />
            <HStack spacing={4}>
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={() => navigate('/products')}
                flex={1}
              >
                Continue Shopping
              </Button>
              <Button colorScheme="blue" onClick={handleCheckout} flex={1} isDisabled={loading}>
                Proceed to Checkout
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Cart;
