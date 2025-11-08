import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, Spinner, Text } from '@chakra-ui/react';

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" thickness="4px" mb={4} />
          <Text color="gray.600">Loading...</Text>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;