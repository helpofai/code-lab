import useAuthStore from '../store/authStore';

const getHeaders = (auth = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (auth) {
        const token = useAuthStore.getState().token;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
};

export const createPost = async (postData) => {
    const res = await fetch('/api/posts', {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(postData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create post');
    }
    return res.json();
};

export const getAllPosts = async () => {
    const res = await fetch('/api/posts', {
        headers: getHeaders(),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch posts');
    }
    return res.json();
};

export const getUserPosts = async () => {
    const res = await fetch('/api/posts/user', {
        headers: getHeaders(true),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch user posts');
    }
    return res.json();
};

export const getPostById = async (id) => {
    // optional auth to see drafts
    const res = await fetch(`/api/posts/${id}`, {
        headers: getHeaders(true), 
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch post');
    }
    return res.json();
};

export const updatePost = async (id, postData) => {
    const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(postData),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update post');
    }
    return res.json();
};

export const deletePost = async (id) => {
    const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete post');
    }
    return res.json();
};
