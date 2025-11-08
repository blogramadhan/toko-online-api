import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  VStack,
  HStack,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import type { Product } from '../types';
import { productService } from '../services/product.service';

interface ProductFormProps {
  product?: Product;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || '',
        image: product.image || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 2 || formData.name.length > 200) {
      newErrors.name = 'Product name must be between 2-200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock must be a positive number';
    }

    if (formData.category && formData.category.length > 100) {
      newErrors.category = 'Category must be less than 100 characters';
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Image must be a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let response;
      if (product) {
        response = await productService.update(product.id, formData);
      } else {
        response = await productService.create(formData);
      }

      if (response.success && response.data) {
        toast({
          title: product ? 'Product updated' : 'Product created',
          description: `Product has been successfully ${product ? 'updated' : 'created'}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onSuccess(response.data.product);
      } else {
        toast({
          title: 'Error',
          description: response.message || `Failed to ${product ? 'update' : 'create'} product`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${product ? 'update' : 'create'} product`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Product Name</FormLabel>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter product name"
          />
          {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter product description"
            rows={4}
          />
          {errors.description && <Text color="red.500" fontSize="sm">{errors.description}</Text>}
        </FormControl>

        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.price}>
            <FormLabel>Price</FormLabel>
            <NumberInput
              value={formData.price}
              onChange={(value) => handleChange('price', parseFloat(value) || 0)}
              min={0}
              precision={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.price && <Text color="red.500" fontSize="sm">{errors.price}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.stock}>
            <FormLabel>Stock</FormLabel>
            <NumberInput
              value={formData.stock}
              onChange={(value) => handleChange('stock', parseInt(value) || 0)}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.stock && <Text color="red.500" fontSize="sm">{errors.stock}</Text>}
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.category}>
          <FormLabel>Category</FormLabel>
          <Select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Select category"
          >
            <option value="">No Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          {errors.category && <Text color="red.500" fontSize="sm">{errors.category}</Text>}
        </FormControl>

        <FormControl isInvalid={!!errors.image}>
          <FormLabel>Image URL</FormLabel>
          <Input
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="Enter image URL"
          />
          {errors.image && <Text color="red.500" fontSize="sm">{errors.image}</Text>}
        </FormControl>

        {product && (
          <FormControl>
            <FormLabel>Active</FormLabel>
            <Switch
              isChecked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
          </FormControl>
        )}

        <HStack spacing={4} pt={4}>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText={product ? 'Updating...' : 'Creating...'}
          >
            {product ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            isDisabled={loading}
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProductForm;