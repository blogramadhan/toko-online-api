import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Divider,
  Image,
  useToast,
  Spinner,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/order.service';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cart, loading: cartLoading, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ shippingAddress?: string; paymentMethod?: string }>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: { shippingAddress?: string; paymentMethod?: string } = {};

    if (!shippingAddress.trim()) {
      newErrors.shippingAddress = 'Shipping address is required';
    } else if (shippingAddress.trim().length < 10) {
      newErrors.shippingAddress = 'Shipping address must be at least 10 characters';
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty. Please add items before checkout.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/cart');
      return;
    }

    try {
      setLoading(true);
      const response = await orderService.create({
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
      });

      if (response.success && response.data) {
        await clearCart();

        toast({
          title: 'Order Placed Successfully',
          description: `Order ${response.data.order.orderNumber} has been created`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        navigate('/orders');
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.response?.data?.message || error.message || 'Failed to place order',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading && !cart) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading checkout...</Text>
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
            Checkout
          </Heading>

          <Box bg="gray.50" p={12} borderRadius="lg" textAlign="center">
            <VStack spacing={4}>
              <Text fontSize="2xl" color="gray.600">
                Your cart is empty
              </Text>
              <Text fontSize="md" color="gray.500">
                Add some products to proceed with checkout
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
        <Heading size="lg" color="gray.800">
          Checkout
        </Heading>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Checkout Form */}
          <VStack spacing={6} align="stretch">
            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={4} color="gray.800">
                Shipping Information
              </Heading>

              <FormControl isInvalid={!!errors.shippingAddress} mb={4}>
                <FormLabel color="gray.700">Shipping Address *</FormLabel>
                <Textarea
                  placeholder="Enter your complete shipping address including street, city, postal code, etc."
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    if (errors.shippingAddress) {
                      setErrors((prev) => ({ ...prev, shippingAddress: undefined }));
                    }
                  }}
                  rows={4}
                  bg="gray.50"
                  _focus={{ bg: 'white', borderColor: 'blue.500' }}
                />
                <FormErrorMessage>{errors.shippingAddress}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.paymentMethod}>
                <FormLabel color="gray.700">Payment Method *</FormLabel>
                <Select
                  placeholder="Select payment method"
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    if (errors.paymentMethod) {
                      setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
                    }
                  }}
                  bg="gray.50"
                  _focus={{ bg: 'white', borderColor: 'blue.500' }}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="e_wallet">E-Wallet</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </Select>
                <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
              </FormControl>
            </Box>
          </VStack>

          {/* Order Summary */}
          <VStack spacing={6} align="stretch">
            <Box bg="white" p={6} borderRadius="lg" shadow="sm">
              <Heading size="md" mb={4} color="gray.800">
                Order Summary
              </Heading>

              <VStack spacing={4} align="stretch" mb={4}>
                {cart.items.map((item) => (
                  <Box key={item.id}>
                    <HStack spacing={3} align="start">
                      <Image
                        src={item.product?.image || 'https://via.placeholder.com/60'}
                        alt={item.product?.name || 'Product'}
                        boxSize="60px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.800" noOfLines={2}>
                          {item.product?.name || 'Unknown Product'}
                        </Text>
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.500">
                            Qty: {item.quantity}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            •
                          </Text>
                          <Text fontSize="xs" color="gray.600" fontWeight="medium">
                            {formatPrice(item.price)}
                          </Text>
                        </HStack>
                      </VStack>
                      <Text fontSize="sm" fontWeight="bold" color="gray.800">
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                    </HStack>
                    <Divider mt={4} />
                  </Box>
                ))}
              </VStack>

              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text fontWeight="medium" color="gray.800">
                    {formatPrice(cart.totalAmount)}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text fontWeight="medium" color="gray.800">
                    Free
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Tax</Text>
                  <Text fontWeight="medium" color="gray.800">
                    Included
                  </Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    Total
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {formatPrice(cart.totalAmount)}
                  </Text>
                </HStack>
              </VStack>

              <Divider my={4} />

              <VStack spacing={3}>
                <Button
                  colorScheme="blue"
                  width="100%"
                  size="lg"
                  onClick={handlePlaceOrder}
                  isLoading={loading}
                  loadingText="Processing..."
                  isDisabled={cartLoading}
                >
                  Place Order
                </Button>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  width="100%"
                  onClick={() => navigate('/cart')}
                  isDisabled={loading}
                >
                  Back to Cart
                </Button>
              </VStack>

              <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
                By placing your order, you agree to our terms and conditions
              </Text>
            </Box>
          </VStack>
        </Grid>
      </VStack>
    </Container>
  );
};

export default Checkout;
