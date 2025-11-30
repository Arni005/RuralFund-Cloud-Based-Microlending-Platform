// 
// API Base URL
// 
const API_BASE_URL = "https://XXXXX.amazonaws.com/dev";

// 
// DOM Elements & Configuration
// 
const pageSections = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-links li');
const pageTitle = document.getElementById('page-title');

const pageTitles = {
    'dashboard': 'Lender Dashboard',
    'loan-applications': 'Loan Applications',
    'approved-loans': 'Approved Loans',
    'analytics': 'Analytics & Reports',
    'settings': 'Settings'
};

let currentLoans = [];
let isAuthenticated = false;

// 
// Initialize Dashboard
//
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuthentication();
    if (isAuthenticated) {
        initDashboard();
    }
});

async function initDashboard() {
    setupEventListeners();
    await loadDashboardData();
}

// 
// Authentication
// 
async function checkAuthentication() {
    const token = localStorage.getItem("access_token");
    const code = getQueryParam("code");

    if (code && !token) {
        await exchangeCodeForToken(code);
    } else if (!token) {
        login();
        return;
    }
    
    isAuthenticated = true;
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

async function exchangeCodeForToken(code) {
    try {
        const cognitoDomain = "https://eu-north-1aubs3zojp.auth.eu-north-1.amazoncognito.com";
        const clientId = "5b4fjd5mto265f25ldvc2u7p98";
        const redirectUri = "https://d1qdrvzd3j8qpa.cloudfront.net";

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            code: code,
            redirect_uri: redirectUri
        });

        const response = await fetch(`${cognitoDomain}/oauth2/token`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body.toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            window.history.replaceState({}, document.title, window.location.pathname);
            isAuthenticated = true;
        } else {
            login();
        }
    } catch (error) {
        console.error("Token exchange error:", error);
        login();
    }
}

function login() {
    const cognitoDomain = "https://eu-north-1aubs3zojp.auth.eu-north-1.amazoncognito.com";
    const clientId = "5b4fjd5mto265f25ldvc2u7p98";
    const redirectUri = "https://d1qdrvzd3j8qpa.cloudfront.net";
    
    const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;
}

// 
// Event Listeners
// 
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            switchPage(pageId);
        });
    });

    // Action buttons
    document.addEventListener('click', async function(e) {
        const id = e.target.getAttribute('data-id');
        if (e.target.classList.contains('approve-btn')) await approveLoan(id);
        if (e.target.classList.contains('reject-btn')) await rejectLoan(id);
    });

    // Filter buttons
    setupFilterButtons();
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const activePage = document.querySelector('.page-section.active').id;
            
            this.parentElement.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            if (activePage === 'loan-applications') {
                filterLoans(filter);
            }
        });
    });
}

// 
// Page Navigation
// 
function switchPage(pageId) {
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-page') === pageId));
    pageSections.forEach(s => s.classList.toggle('active', s.id === pageId));
    pageTitle.textContent = pageTitles[pageId];

    if (pageId === 'dashboard') loadDashboardData();
    if (pageId === 'loan-applications') loadAllLoans();
    if (pageId === 'approved-loans') loadApprovedLoans();
}

// 
// Dashboard Functions
// 
async function loadDashboardData() {
    try {
        await loadStats();
        await loadDashboardLoans();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadStats() {
    try {
        const loans = await fetchAllLoans();

        const pendingCount = loans.filter(l => (l.status || '').toLowerCase() === 'pending').length;
        const approvedCount = loans.filter(l => (l.status || '').toLowerCase() === 'approved').length;
        const repaidCount = loans.filter(l => (l.status || '').toLowerCase() === 'repaid').length;

        const totalAmount = loans
            .filter(l => ['approved', 'repaid'].includes((l.status || '').toLowerCase()))
            .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

        document.getElementById('pending-loans-count').textContent = pendingCount;
        document.getElementById('approved-loans-count').textContent = approvedCount;
        document.getElementById('repaid-loans-count').textContent = repaidCount;
        document.getElementById('total-loans-amount').textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadDashboardLoans() {
    try {
        console.log('Loading dashboard loans...');
        const loans = await fetchAllLoans();
        currentLoans = loans;

        // Get ALL loans for dashboard (4 most recent)
        const recentLoans = loans
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 4);

        console.log('Recent loans for dashboard:', recentLoans);
        
        // Render the table
        const tableBody = document.getElementById('loans-table-body');
        if (tableBody) {
            renderLoansTable(tableBody, recentLoans);
        }

        // Update visibility
        updateDashboardVisibility(recentLoans.length > 0);
        
    } catch (error) {
        console.error('Error loading dashboard loans:', error);
        showDashboardError();
    }
}

// Special function for dashboard visibility
function updateDashboardVisibility(hasData) {
    const table = document.getElementById('dashboard-loans-table');
    const loading = document.getElementById('dashboard-loans-loading');
    const error = document.getElementById('dashboard-loans-error');

    console.log('Dashboard visibility update - hasData:', hasData);
    
    if (loading) loading.style.display = 'none';
    
    if (hasData) {
        if (table) table.style.display = 'table';
        if (error) error.style.display = 'none';
    } else {
        if (table) table.style.display = 'none';
        if (error) {
            error.style.display = 'block';
            error.innerHTML = 'No loan applications found.';
        }
    }
}

function showDashboardError() {
    const loading = document.getElementById('dashboard-loans-loading');
    const error = document.getElementById('dashboard-loans-error');
    
    if (loading) loading.style.display = 'none';
    if (error) {
        error.style.display = 'block';
        error.innerHTML = 'Failed to load loan applications. <button class="retry-btn" onclick="loadDashboardLoans()">Retry</button>';
    }
}

// 
// Loan Applications Functions
// 
async function loadAllLoans() {
    try {
        const loans = await fetchAllLoans();
        currentLoans = loans;
        
        renderLoansTable(document.getElementById('applications-table-body'), loans);
        updateApplicationsVisibility(loans.length > 0);
    } catch (error) {
        console.error('Error loading all loans:', error);
        showApplicationsError();
    }
}

function updateApplicationsVisibility(hasData) {
    const table = document.getElementById('applications-table');
    const loading = document.getElementById('applications-loading');
    const error = document.getElementById('applications-error');
    
    if (loading) loading.style.display = 'none';
    
    if (hasData) {
        if (table) table.style.display = 'table';
        if (error) error.style.display = 'none';
    } else {
        if (table) table.style.display = 'none';
        if (error) error.style.display = 'block';
    }
}

function showApplicationsError() {
    const loading = document.getElementById('applications-loading');
    const error = document.getElementById('applications-error');
    
    if (loading) loading.style.display = 'none';
    if (error) error.style.display = 'block';
}

function filterLoans(filter) {
    const tableBody = document.getElementById('applications-table-body');
    let filteredLoans = currentLoans;

    if (filter !== 'all') {
        filteredLoans = currentLoans.filter(loan => 
            (loan.status || '').toLowerCase() === filter
        );
    }

    renderLoansTable(tableBody, filteredLoans);
}

// 
// Approved Loans Functions
// 
async function loadApprovedLoans() {
    try {
        const loans = await fetchAllLoans();
        const approvedLoans = loans.filter(l => (l.status || '').toLowerCase() === 'approved');
        renderLoansTable(document.getElementById('approved-table-body'), approvedLoans);
    } catch (error) {
        console.error('Error loading approved loans:', error);
    }
}

// 
// Table Rendering
// 
function renderLoansTable(tableBody, loans) {
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    tableBody.innerHTML = '';

    if (loans.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">No loans found</td></tr>`;
        return;
    }

    loans.forEach(loan => {
        const status = (loan.status || '').toLowerCase();
        const loanId = loan.loanId || loan.loan_id || 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loanId}</td>
            <td>${loan.borrowerName || loan.applicant || 'N/A'}</td>
            <td>₹${(parseFloat(loan.amount) || 0).toLocaleString('en-IN')}</td>
            <td>${loan.purpose || 'N/A'}</td>
            <td>${loan.borrowerEmail || loan.email || 'N/A'}</td>
            <td><span class="status ${status}">${formatStatus(loan.status)}</span></td>
            <td>
                ${status === 'pending' ?
                    `<button class="action-btn approve-btn" data-id="${loanId}">Approve</button>
                     <button class="action-btn reject-btn" data-id="${loanId}">Reject</button>` : 
                    `<span class="no-actions">No actions available</span>`}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 
// API Functions
// 
async function fetchAllLoans() {
    try {
        const token = localStorage.getItem("access_token");
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`${API_BASE_URL}/GetAllLoans`, {
            headers: headers
        });
        
        if (!res.ok) throw new Error('API error');
        return await res.json();
    } catch (error) {
        console.error('Error fetching loans:', error);
        throw error;
    }
}

// 
// Approve/Reject Functions
// 
async function approveLoan(loanId) {
    if (!confirm(`Approve loan ${loanId}?`)) return;
    await updateLoanStatus(loanId, 'Approved', 'Loan Approved ✅');
}

async function rejectLoan(loanId) {
    if (!confirm(`Reject loan ${loanId}?`)) return;
    await updateLoanStatus(loanId, 'Rejected', 'Loan Rejected 🚫');
}

async function updateLoanStatus(loanId, status, successMessage) {
    try {
        const token = localStorage.getItem("access_token");
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(`${API_BASE_URL}/ApproveLoan`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ loanId: loanId, status: status })
        });
        
        if (res.ok) {
            alert(successMessage);
            await refreshCurrentPage();
        } else {
            alert('Operation failed ❌');
        }
    } catch (error) {
        console.error('Error updating loan status:', error);
        alert('Operation failed ❌');
    }
}

// 
// Helper Functions
// 
function formatStatus(status) {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

async function refreshCurrentPage() {
    const activePage = document.querySelector('.page-section.active').id;
    
    if (activePage === 'dashboard') await loadDashboardData();
    if (activePage === 'loan-applications') await loadAllLoans();
    if (activePage === 'approved-loans') await loadApprovedLoans();
}