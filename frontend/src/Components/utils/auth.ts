export const getLoggedInUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
};

export const logout = () => {
    localStorage.removeItem('user');
    // Add any other cleanup needed
};

export const getProfiles = async (username: string) => {
    try {
        const response = await fetch('http://localhost:8080/get_profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profiles');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        return null;
    }
};
