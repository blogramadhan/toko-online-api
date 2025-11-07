import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Image,
  Text,
  Button,
  Spinner,
  Heading,
  VStack,
  HStack,
  Badge,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Flex,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setError('Product ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await productService.getById(Number(id));

      if (response.success && response.data) {
        setProduct(response.data.product);
      } else {
        setError('Product not found');
      }
    } catch (err: unknown) {
      setError((err as any).response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} has been added to your cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setQuantity(1);
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as any & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to add to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (valueString: string) => {
    const value = parseInt(valueString) || 1;
    if (product) {
      setQuantity(Math.min(Math.max(1, value), product.stock));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading product...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="center" py={12}>
          <Box bg="red.50" p={6} borderRadius="lg" textAlign="center" maxW="md">
            <Heading size="md" color="red.700" mb={2}>
              Error Loading Product
            </Heading>
            <Text color="red.600" mb={4}>
              {error || 'Product not found'}
            </Text>
            <Button colorScheme="blue" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Breadcrumb Navigation */}
        <HStack spacing={4}>
          <IconButton
            aria-label="Go back"
            icon={<ArrowBackIcon />}
            onClick={() => navigate('/products')}
            variant="ghost"
            colorScheme="blue"
          />
          <Breadcrumb spacing={2} separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/products')} color="blue.500">
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="gray.600">{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>

        {/* Product Detail Section */}
        <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden">
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={8}
            p={{ base: 6, md: 8 }}
          >
            {/* Product Image */}
            <Box>
              <Box
                position="relative"
                paddingBottom="100%"
                bg="gray.100"
                borderRadius="lg"
                overflow="hidden"
              >
                <Image
                  src={product.image || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                {product.stock === 0 && (
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme="red"
                    fontSize="md"
                    px={3}
                    py={2}
                  >
                    Out of Stock
                  </Badge>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <Badge
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme="orange"
                    fontSize="md"
                    px={3}
                    py={2}
                  >
                    Only {product.stock} left!
                  </Badge>
                )}
              </Box>
            </Box>

            {/* Product Info */}
            <VStack align="stretch" spacing={4}>
              {product.category && (
                <Badge colorScheme="blue" width="fit-content" fontSize="sm" px={3} py={1}>
                  {product.category}
                </Badge>
              )}

              <Heading size="xl" color="gray.800">
                {product.name}
              </Heading>

              <HStack spacing={4} align="center">
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  {formatPrice(product.price)}
                </Text>
                <Badge
                  colorScheme={product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'}
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </HStack>

              <Divider />

              <Box>
                <Text fontWeight="semibold" color="gray.700" mb={2}>
                  Description
                </Text>
                <Text color="gray.600" lineHeight="tall">
                  {product.description || 'No description available for this product.'}
                </Text>
              </Box>

              <Divider />

              {/* Quantity Selector */}
              <Box>
                <Text fontWeight="semibold" color="gray.700" mb={2}>
                  Quantity
                </Text>
                <NumberInput
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  isDisabled={product.stock === 0}
                  maxW="150px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>

              {/* Total Price */}
              {quantity > 1 && (
                <Box bg="blue.50" p={4} borderRadius="md">
                  <HStack justify="space-between">
                    <Text color="gray.700" fontWeight="medium">
                      Total Price:
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="blue.600">
                      {formatPrice(product.price * quantity)}
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* Action Buttons */}
              <VStack spacing={3} pt={2}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  onClick={handleAddToCart}
                  isDisabled={product.stock === 0}
                  isLoading={addingToCart}
                  loadingText="Adding to cart..."
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </VStack>

              {/* Additional Info */}
              <Box bg="gray.50" p={4} borderRadius="md" mt={4}>
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Product ID:
                    </Text>
                    <Text fontSize="sm" color="gray.800" fontWeight="medium">
                      #{product.id}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Status:
                    </Text>
                    <Badge colorScheme={product.isActive ? 'green' : 'gray'} fontSize="sm" px={3} py={1}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </HStack>
                  {product.createdAt && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Added on:
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="medium">
                        {new Date(product.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </VStack>
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
};

export default ProductDetail;
