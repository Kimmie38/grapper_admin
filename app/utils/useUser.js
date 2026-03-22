import React from 'react';

const mockAdminUser = {
	id: 'admin_001',
	email: 'admin@grapper.com',
	name: 'Admin User',
	account_type: 'admin',
	role: 'admin',
	created_at: '2024-01-01T00:00:00Z',
};

export const useUser = () => {
	// Return mock admin user for frontend demo
	const [user, setUser] = React.useState(mockAdminUser);

	const refetchUser = React.useCallback(() => {
		setUser(mockAdminUser);
	}, []);

	return {
		user,
		data: user,
		loading: false,
		refetch: refetchUser,
	};
};

export default useUser;
