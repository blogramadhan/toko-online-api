import React, { useState, useEffect } from 'react';
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
  FormControl,
  FormLabel,
  Input,
  useToast,
  Grid,
  Divider,
} from '@chakra-ui/react';
import { authService } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';

const Profile: React.FC = () => {
  const toast = useToast();
  const {} = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.getProfile();

      if (response.success && response.data) {
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err: unknown) {
      setError((err as any).response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await authService.updateProfile({
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });

      if (response.success && response.data) {
        setUser(response.data.user);
        setEditing(false);

        // Update user in localStorage to keep it in sync
        localStorage.setItem('user', JSON.stringify(response.data.user));

        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: (err as any).response?.data?.message || 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin' ? 'purple' : 'blue';
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading profile...</Text>
          </VStack>
        </Flex>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxW="container.md" py={8}>
        <Box bg="red.50" p={8} borderRadius="lg" borderLeft="4px" borderColor="red.500">
          <Text color="red.700" fontSize="lg">
            {error || 'Profile not found'}
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="gray.800">
            My Profile
          </Heading>
          {!editing && (
            <Button colorScheme="blue" size="sm" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </HStack>

        {/* Profile Card */}
        <Card bg="white" shadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={6}>
              {/* View Mode */}
              {!editing ? (
                <>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                        Name
                      </Text>
                      <Text fontSize="md" color="gray.800" fontWeight="medium">
                        {user.name}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                        Email
                      </Text>
                      <Text fontSize="md" color="gray.800">
                        {user.email}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                        Phone
                      </Text>
                      <Text fontSize="md" color="gray.800">
                        {user.phone || '-'}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
                        Role
                      </Text>
                      <Badge
                        colorScheme={getRoleBadgeColor(user.role)}
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        {user.role.toUpperCase()}
                      </Badge>
                    </Box>
                  </Grid>

                  <Divider />

                  <Box>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={2}>
                      Address
                    </Text>
                    <Box bg="gray.50" p={4} borderRadius="md">
                      <Text fontSize="md" color="gray.800" whiteSpace="pre-line">
                        {user.address || 'No address provided'}
                      </Text>
                    </Box>
                  </Box>
                </>
              ) : (
                /* Edit Mode */
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Name
                    </FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl isReadOnly>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Email
                    </FormLabel>
                    <Input value={user.email} bg="gray.100" isReadOnly />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Email cannot be changed
                    </Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Phone
                    </FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl isReadOnly>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Role
                    </FormLabel>
                    <Input value={user.role.toUpperCase()} bg="gray.100" isReadOnly />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Role cannot be changed
                    </Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Address
                    </FormLabel>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      bg="gray.50"
                    />
                  </FormControl>

                  <Divider />

                  {/* Action Buttons */}
                  <HStack spacing={3} justify="flex-end">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      isDisabled={saving}
                      size="md"
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={handleSave}
                      isLoading={saving}
                      loadingText="Saving..."
                      size="md"
                    >
                      Save Changes
                    </Button>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Account Information */}
        <Card bg="blue.50" shadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={2}>
              <Heading size="sm" color="blue.800">
                Account Information
              </Heading>
              <Text fontSize="sm" color="blue.700">
                User ID: {user.id}
              </Text>
              <Text fontSize="sm" color="blue.700">
                Account Type: {user.role === 'admin' ? 'Administrator' : 'Customer'}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Profile;
