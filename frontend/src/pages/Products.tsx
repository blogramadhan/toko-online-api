import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardBody,
  Image,
  Text,
  Button,
  Input,
  Select,
  Spinner,
  Heading,
  VStack,
  HStack,
  Badge,
  useToast,
  InputGroup,
  InputLeftElement,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  Flex,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);

  // Categories for filter
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAll({
        page: currentPage,
        limit,
        search: search || undefined,
        category: category || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        sortOrder,
      });

      if (response.success && response.data) {
        setProducts(response.data.products);
        setTotalPages((response.data.pagination as any)?.totalPages || 1);
      } else {
        setError('Failed to load products');
      }
    } catch (err: unknown) {
      setError((err as any).response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, category, priceRange, sortBy, sortOrder, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      await addToCart(productId, 1);
      toast({
        title: 'Added to cart',
        description: `${productName} has been added to your cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as any).response?.data?.message || 'Failed to add to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading && products.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading products...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="gray.800">
          Products
        </Heading>

        {/* Filters Section */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
            {/* Search */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                Search
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  bg="gray.50"
                />
              </InputGroup>
            </FormControl>

            {/* Category */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                Category
              </FormLabel>
              <Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                bg="gray.50"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Sort By */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                Sort By
              </FormLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} bg="gray.50">
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Newest</option>
              </Select>
            </FormControl>

            {/* Sort Order */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                Order
              </FormLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                bg="gray.50"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Select>
            </FormControl>
          </Grid>

          {/* Price Range */}
          <FormControl mt={4}>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
              Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </FormLabel>
            <RangeSlider
              min={0}
              max={1000000}
              step={10000}
              value={priceRange}
              onChange={(val) => setPriceRange(val as [number, number])}
              onChangeEnd={() => setCurrentPage(1)}
              colorScheme="blue"
            >
              <RangeSliderTrack bg="gray.200">
                <RangeSliderFilledTrack bg="blue.500" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </FormControl>
        </Box>

        {/* Error State */}
        {error && (
          <Box bg="red.50" p={4} borderRadius="lg" borderLeft="4px" borderColor="red.500">
            <Text color="red.700">{error}</Text>
          </Box>
        )}

        {/* Products Grid */}
        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        ) : products.length === 0 ? (
          <Box bg="gray.50" p={12} borderRadius="lg" textAlign="center">
            <Text fontSize="lg" color="gray.600">
              No products found
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Try adjusting your search or filters
            </Text>
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={6}
          >
            {products.map((product) => (
              <Card
                key={product.id}
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                }}
                cursor="pointer"
                bg="white"
              >
                <Box onClick={() => handleProductClick(product.id)}>
                  <Box position="relative" paddingBottom="100%" bg="gray.100">
                    <Image
                      src={product.image || 'https://via.placeholder.com/300'}
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
                        top={2}
                        right={2}
                        colorScheme="red"
                        fontSize="xs"
                        px={2}
                        py={1}
                      >
                        Out of Stock
                      </Badge>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <Badge
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme="orange"
                        fontSize="xs"
                        px={2}
                        py={1}
                      >
                        Low Stock
                      </Badge>
                    )}
                  </Box>

                  <CardBody>
                    <VStack align="stretch" spacing={2}>
                      {product.category && (
                        <Badge colorScheme="blue" width="fit-content" fontSize="xs">
                          {product.category}
                        </Badge>
                      )}
                      <Heading size="sm" color="gray.800" noOfLines={2}>
                        {product.name}
                      </Heading>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {product.description || 'No description available'}
                      </Text>
                      <HStack justify="space-between" align="center">
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">
                          {formatPrice(product.price)}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Stock: {product.stock}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Box>

                <Box px={4} pb={4}>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id, product.name);
                    }}
                    isDisabled={product.stock === 0}
                    size="sm"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </Box>
              </Card>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <HStack justify="center" spacing={2} pt={4}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              isDisabled={currentPage === 1}
              size="sm"
              variant="outline"
              colorScheme="blue"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    colorScheme={currentPage === page ? 'blue' : 'gray'}
                    variant={currentPage === page ? 'solid' : 'outline'}
                    size="sm"
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <Text key={page}>...</Text>;
              }
              return null;
            })}

            <Button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              isDisabled={currentPage === totalPages}
              size="sm"
              variant="outline"
              colorScheme="blue"
            >
              Next
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
};

export default Products;
