import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Input,
  Select,
  Spinner,
  Flex,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Switch,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { SearchIcon, EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/product.service';
import ProductForm from '../components/ProductForm';
import type { Product } from '../types';

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAdminProducts({
        page: currentPage,
        limit,
        search: search || undefined,
        category: category || undefined,
        isActive,
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
  }, [currentPage, search, category, isActive, sortBy, sortOrder, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    onFormOpen();
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setSubmitting(true);
    try {
      const response = await productService.delete(productToDelete.id);
      if (response.success) {
        toast({
          title: 'Product deleted',
          description: `${productToDelete.name} has been deleted`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchProducts();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete product',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
      onDeleteClose();
      setProductToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    onFormClose();
    fetchProducts();
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
        <HStack justify="space-between">
          <Heading size="lg" color="gray.800">
            Product Management
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </HStack>

        {/* Filters */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} flexWrap="wrap">
              <FormControl maxW="300px">
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                  Search
                </FormLabel>
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  bg="gray.50"
                />
              </FormControl>

              <FormControl maxW="200px">
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

              <FormControl maxW="200px">
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                  Status
                </FormLabel>
                <Select
                  value={isActive === undefined ? '' : isActive.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setIsActive(value === '' ? undefined : value === 'true');
                    setCurrentPage(1);
                  }}
                  bg="gray.50"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FormControl>

              <FormControl maxW="150px">
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                  Sort By
                </FormLabel>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} bg="gray.50">
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="createdAt">Created Date</option>
                </Select>
              </FormControl>

              <FormControl maxW="150px">
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
            </HStack>
          </VStack>
        </Box>

        {/* Error State */}
        {error && (
          <Box bg="red.50" p={4} borderRadius="lg" borderLeft="4px" borderColor="red.500">
            <Text color="red.700">{error}</Text>
          </Box>
        )}

        {/* Products Table */}
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
          <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => (
                  <Tr key={product.id}>
                    <Td>
                      <Box
                        w="50px"
                        h="50px"
                        bg="gray.100"
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <img
                          src={product.image || 'https://via.placeholder.com/50'}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{product.name}</Text>
                        {product.description && (
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {product.description}
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      {product.category ? (
                        <Badge colorScheme="blue">{product.category}</Badge>
                      ) : (
                        <Text color="gray.400">-</Text>
                      )}
                    </Td>
                    <Td>{formatPrice(product.price)}</Td>
                    <Td>
                      <Text
                        color={product.stock === 0 ? 'red.500' : product.stock < 10 ? 'orange.500' : 'inherit'}
                      >
                        {product.stock}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={product.isActive ? 'green' : 'red'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit product"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                        />
                        <IconButton
                          aria-label="Delete product"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
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

      {/* Product Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProductForm
              product={selectedProduct || undefined}
              onSuccess={handleFormSuccess}
              onCancel={onFormClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={submitting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default ProductManagement;