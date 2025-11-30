const API_BASE_URL = 'https://XXXXXXX.amazonaws.com/dev';

// Submit loan to AWS
export const submitLoanToAWS = async (loanData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/SubmitLoan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loanData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Loan submitted to AWS:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting to AWS:', error);
    return { success: false, error: error.message };
  }
};

// Get all loans (for lender dashboard)
export const getAllLoansFromAWS = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetAllLoans`);
    const loans = await response.json();
    return { success: true, data: loans };
  } catch (error) {
    console.error('Error fetching loans:', error);
    return { success: false, error: error.message };
  }
};

// loan status
export const getLoanStatus = async (loanId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/GetLoanStatus?loanId=${loanId}`);
    const status = await response.json();
    return { success: true, data: status };
  } catch (error) {
    console.error('Error fetching loan status:', error);
    return { success: false, error: error.message };
  }
};