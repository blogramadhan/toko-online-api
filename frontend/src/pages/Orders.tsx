import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardBody,
  Text,
  Button,
  Spinner,
  Heading,
  VStack,
  HStack,
  Badge,
  Select,
  Flex,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import { Order } from '../types';

const Orders: React.FC = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getAll({
        status: statusFilter || undefined,
      });

      if (response.success && response.data) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

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

  if (loading && orders.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading orders...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="gray.800">
            My Orders
          </Heading>
        </HStack>

        {/* Filter Section */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <FormControl maxW="300px">
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
              Filter by Status
            </FormLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              bg="gray.50"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </FormControl>
        </Box>

        {/* Error State */}
        {error && (
          <Box bg="red.50" p={4} borderRadius="lg" borderLeft="4px" borderColor="red.500">
            <Text color="red.700">{error}</Text>
          </Box>
        )}

        {/* Orders List */}
        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        ) : orders.length === 0 ? (
          <Box bg="gray.50" p={12} borderRadius="lg" textAlign="center">
            <Text fontSize="lg" color="gray.600" fontWeight="medium">
              No orders found
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              {statusFilter
                ? 'Try selecting a different status filter'
                : "You haven't placed any orders yet"}
            </Text>
            {!statusFilter && (
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => navigate('/products')}
                size="sm"
              >
                Start Shopping
              </Button>
            )}
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={6}
          >
            {orders.map((order) => (
              <Card
                key={order.id}
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  shadow: 'lg',
                }}
                bg="white"
              >
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    {/* Order Number */}
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        Order Number
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color="gray.800">
                        {order.orderNumber}
                      </Text>
                    </Box>

                    {/* Date */}
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        Order Date
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        {formatDate(order.createdAt)}
                      </Text>
                    </Box>

                    {/* Total Amount */}
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        Total Amount
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        {formatPrice(order.totalAmount)}
                      </Text>
                    </Box>

                    {/* Status Badges */}
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={getStatusColor(order.status)}
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                      <Badge
                        colorScheme={getPaymentStatusColor(order.paymentStatus)}
                        fontSize="xs"
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
                    </HStack>

                    {/* Items Count */}
                    <Text fontSize="sm" color="gray.600">
                      {order.items?.length || 0} item(s)
                    </Text>

                    {/* View Details Button */}
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      width="100%"
                    >
                      View Details
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </VStack>
    </Container>
  );
};

export default Orders;
