const API_BASE_URL = 'https://XXXXXXX.amazonaws.com/dev';

// to test the SubmitLoan endpoint
export const testAWSConnection = async () => {
  try {
    const testData = {
      borrowerName: "Test User",
      amount: 1000,
      borrowerEmail: "test@example.com",
      purpose: "Testing API connection"
    };

    console.log('Testing AWS API connection...');
    console.log('Sending data:', testData);

    const response = await fetch(`${API_BASE_URL}/SubmitLoan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('API Response Status:', response.status);
    console.log('API Response OK:', response.ok);

    const data = await response.json();
    console.log('✅ API Test SUCCESS! Response Data:', data);
    return data;
  } catch (error) {
    console.error('❌ API Test FAILED:', error);
    return null;
  }
};

// to test getting all loans
export const testGetAllLoans = async () => {
  try {
    console.log('Testing GetAllLoans endpoint...');
    const response = await fetch(`${API_BASE_URL}/GetAllLoans`);
    const data = await response.json();
    console.log('✅ GetAllLoans SUCCESS!', data);
    return data;
  } catch (error) {
    console.error('❌ GetAllLoans FAILED:', error);
    return null;
  }
};