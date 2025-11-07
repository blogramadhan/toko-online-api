import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Card,
  CardBody,
  Text,
  Button,
  Spinner,
  Heading,
  VStack,
  HStack,
  Badge,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  useToast,
  Grid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { orderService } from '../services/order.service';
import type { Order } from '../types';

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getById(Number(id));

      if (response.success && response.data) {
        setOrder(response.data.order);
      } else {
        setError('Failed to load order details');
      }
    } catch (err: unknown) {
      setError((err as any).response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelling(true);

      const response = await orderService.cancel(order.id);

      if (response.success && response.data) {
        setOrder(response.data.order);
        toast({
          title: 'Order cancelled',
          description: 'Your order has been cancelled successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        onClose();
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: (err as any).response?.data?.message || 'Failed to cancel order',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'purple',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    const colors: Record<Order['paymentStatus'], string> = {
      pending: 'orange',
      paid: 'green',
      failed: 'red',
    };
    return colors[status] || 'gray';
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading order details...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxW="container.lg" py={8}>
        <VStack spacing={6}>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => navigate('/orders')}
            alignSelf="flex-start"
          >
            Back to Orders
          </Button>

          <Box bg="red.50" p={8} borderRadius="lg" borderLeft="4px" borderColor="red.500" w="100%">
            <Text color="red.700" fontSize="lg">
              {error || 'Order not found'}
            </Text>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Back Button */}
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate('/orders')}
          alignSelf="flex-start"
          size="sm"
        >
          Back to Orders
        </Button>

        {/* Header */}
        <Box>
          <Heading size="lg" color="gray.800">
            Order Details
          </Heading>
          <Text color="gray.600" mt={1}>
            Order Number: {order.orderNumber}
          </Text>
        </Box>

        {/* Order Information Card */}
        <Card bg="white" shadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={6}>
              {/* Order Info Grid */}
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                    Order Date
                  </Text>
                  <Text fontSize="md" color="gray.800">
                    {formatDate(order.createdAt)}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                    Last Updated
                  </Text>
                  <Text fontSize="md" color="gray.800">
                    {formatDate(order.updatedAt)}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                    Order Status
                  </Text>
                  <Badge
                    colorScheme={getStatusColor(order.status)}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                    Payment Status
                  </Text>
                  <Badge
                    colorScheme={getPaymentStatusColor(order.paymentStatus)}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    {order.paymentStatus.toUpperCase()}
                  </Badge>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                    Payment Method
                  </Text>
                  <Text fontSize="md" color="gray.800">
                    {order.paymentMethod || 'Not specified'}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                    Total Amount
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    {formatPrice(order.totalAmount)}
                  </Text>
                </Box>
              </Grid>

              <Divider />

              {/* Shipping Address */}
              <Box>
                <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={2}>
                  Shipping Address
                </Text>
                <Box bg="gray.50" p={4} borderRadius="md">
                  <Text fontSize="md" color="gray.800" whiteSpace="pre-line">
                    {order.shippingAddress}
                  </Text>
                </Box>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Order Items Card */}
        <Card bg="white" shadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Heading size="md" color="gray.800">
                Order Items
              </Heading>

              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Product Name</Th>
                      <Th isNumeric>Quantity</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Subtotal</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <Tr key={item.id}>
                          <Td fontWeight="medium" color="gray.800">
                            {item.productName}
                          </Td>
                          <Td isNumeric>{item.quantity}</Td>
                          <Td isNumeric>{formatPrice(item.price)}</Td>
                          <Td isNumeric fontWeight="semibold">
                            {formatPrice(item.price * item.quantity)}
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={4} textAlign="center" color="gray.500">
                          No items found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>

              <Divider />

              {/* Total */}
              <HStack justify="space-between" px={4}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Total Amount
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  {formatPrice(order.totalAmount)}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Cancel Order Button */}
        {order.status === 'pending' && (
          <Button colorScheme="red" onClick={onOpen} size="md">
            Cancel Order
          </Button>
        )}
      </VStack>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Order
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={cancelling}>
                No, Keep Order
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCancelOrder}
                ml={3}
                isLoading={cancelling}
                loadingText="Cancelling..."
              >
                Yes, Cancel Order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default OrderDetail;
