// Test script to verify token functionality
// Run this in browser console to test token

// Test 1: Check if token exists
function checkToken() {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  console.log('Token exists:', !!token);
  console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token');
  return token;
}

// Test 2: Test API call
async function testApiCall() {
  try {
    const response = await fetch('/api/me', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const userData = await response.json();
      console.log('✅ API call successful:', userData);
      return userData;
    } else {
      console.log('❌ API call failed:', response.status);
      return null;
    }
  } catch (error) {
    console.log('❌ API call error:', error);
    return null;
  }
}

// Test 3: Test login flow
async function testLogin(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful:', data);
      
      // Check token after login
      setTimeout(() => {
        checkToken();
        testApiCall();
      }, 1000);
      
      return data;
    } else {
      console.log('❌ Login failed:', data);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error);
    return null;
  }
}

// Export functions for use in browser console
window.tokenTests = {
  checkToken,
  testApiCall,
  testLogin
};

console.log('Token test functions loaded. Use:');
console.log('- window.tokenTests.checkToken()');
console.log('- window.tokenTests.testApiCall()');
console.log('- window.tokenTests.testLogin(email, password)'); 