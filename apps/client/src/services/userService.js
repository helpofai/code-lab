import useAuthStore from '../store/authStore';

const getHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const getAllUsers = async () => {
    const res = await fetch('/api/users', { headers: getHeaders() });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch users');
    }
    return res.json();
};

export const createUser = async (userData) => {
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create user');
    }
    return res.json();
};

export const updateUser = async (id, userData) => {
    const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update user');
    }
    return res.json();
};

export const deleteUser = async (id) => {
    const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete user');
    }
    return res.json();
};

export const toggleUserStatus = async (id) => {
    const res = await fetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to toggle status');
    }
    return res.json();
};