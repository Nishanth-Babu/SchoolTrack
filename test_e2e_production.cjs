const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('SCHOOLTRACK — COMPLETE END-TO-END PRODUCTION READINESS SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(name, condition, extra = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`  [PASS] ${name} ${extra ? `(${extra})` : ''}`);
    } else {
      console.error(`  [FAIL] ${name} ${extra ? `(${extra})` : ''}`);
    }
  }

  // 1. MULTI-IDENTIFIER LOGINS
  console.log('--- 1. Multi-Identifier Login Verification ---');
  
  // Principal by Teacher ID
  const prinLogin = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'EMP-PRIN-01', password: 'password123' });
  assert('Principal login with Teacher ID (EMP-PRIN-01)', prinLogin.status === 200 && prinLogin.body.primaryRole === 'PRINCIPAL');
  const prinToken = prinLogin.body?.token;

  // Coordinator by Email
  const coordLogin = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'coord.senior@schooltrack.com', password: 'password123' });
  assert('Coordinator login with Email', coordLogin.status === 200 && coordLogin.body.primaryRole === 'COORDINATOR');

  // Class Teacher by Teacher ID
  const ctLogin = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'EMP-CT-01', password: 'password123' });
  assert('Class Teacher login with Teacher ID (EMP-CT-01)', ctLogin.status === 200 && ctLogin.body.primaryRole === 'CLASS_TEACHER');

  // Subject Teacher by Teacher ID
  const stLogin = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'EMP-ST-01', password: 'password123' });
  assert('Subject Teacher login with Teacher ID (EMP-ST-01)', stLogin.status === 200 && stLogin.body.primaryRole === 'SUBJECT_TEACHER');
  const stToken = stLogin.body?.token;

  // Student by Roll Number
  const stuLogin = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: '01', password: 'password123' });
  assert('Student login with Roll Number (01)', stuLogin.status === 200 && stuLogin.body.primaryRole === 'STUDENT');
  const stuToken = stuLogin.body?.token;
  const studentProfileId = stuLogin.body?.profileId;

  // Parent by Phone Number
  const parLogin = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: '+91 98765 43210', password: 'password123' });
  assert('Parent login with Phone Number (+91 98765 43210)', parLogin.status === 200 && parLogin.body.primaryRole === 'PARENT');
  const parToken = parLogin.body?.token;

  // 2. STUDENT & PARENT SELF-REGISTRATION
  console.log('\n--- 2. Student & Parent Self-Registration ---');
  const testRoll = 'TEST-' + Math.floor(100 + Math.random() * 900);
  const testEmail = `student.${testRoll.toLowerCase()}@schooltrack.com`;
  const testParentPhone = `+91 99999 ${Math.floor(10000 + Math.random() * 90000)}`;

  const regStudentRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/register/student', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Test Student ' + testRoll,
    rollNumber: testRoll,
    email: testEmail,
    password: 'securePass123',
    classId: 1,
    parentName: 'Parent of ' + testRoll,
    parentPhone: testParentPhone
  });
  assert('Student registration with Roll No, Email & Parent Phone', regStudentRes.status === 201 && regStudentRes.body.token);

  // Login with newly registered student Roll Number
  const newStuLogin = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: testRoll, password: 'securePass123' });
  assert('Login with newly registered student roll number', newStuLogin.status === 200 && newStuLogin.body.rollNumber === testRoll);

  // Register parent linked to student roll number
  const testParentEmail = `parent.${testRoll.toLowerCase()}@schooltrack.com`;
  const regParentRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/auth/register/parent', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: 'Parent Test ' + testRoll,
    email: testParentEmail,
    phone: `+91 98888 ${Math.floor(10000 + Math.random() * 90000)}`,
    password: 'parentPass123',
    studentRollNumber: testRoll,
    relationshipType: 'MOTHER'
  });
  assert('Parent registration linked to student roll number', regParentRes.status === 201 && regParentRes.body.primaryRole === 'PARENT');

  // 3. PRINCIPAL ACCOUNT PROVISIONING & STATUS TOGGLING
  console.log('\n--- 3. Principal Administrative Management ---');
  const newCoordEmail = `coord.new.${Date.now()}@schooltrack.com`;
  const createCoordRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/admin/accounts', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
  }, {
    role: 'COORDINATOR',
    firstName: 'Eleanor',
    lastName: 'Rigby',
    email: newCoordEmail,
    phone: '+91 98111 99999',
    password: 'password123',
    teacherId: 'EMP-CRD-TEST-' + Math.floor(Math.random() * 1000),
    wing: 'Middle Wing'
  });
  assert('Principal provisions new Coordinator account', createCoordRes.status === 201);
  const newUserId = createCoordRes.body?.id;

  // Toggle account to DISABLED
  if (newUserId) {
    const disableRes = await request({
      hostname: 'localhost', port: 8080, path: `/api/admin/accounts/${newUserId}/status`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
    }, { status: 'DISABLED' });
    assert('Principal disables Coordinator account', disableRes.status === 200 && disableRes.body.status === 'DISABLED');

    // Attempt login with disabled account (Must fail with 400 or 401/403)
    const disabledLogin = await request({
      hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { identifier: newCoordEmail, password: 'password123' });
    assert('Disabled account login rejected by security', disabledLogin.status !== 200);

    // Re-enable account
    const enableRes = await request({
      hostname: 'localhost', port: 8080, path: `/api/admin/accounts/${newUserId}/status`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
    }, { status: 'ACTIVE' });
    assert('Principal re-enables account', enableRes.status === 200 && enableRes.body.status === 'ACTIVE');

    // Reset password
    const resetRes = await request({
      hostname: 'localhost', port: 8080, path: `/api/admin/accounts/${newUserId}/reset-password`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
    }, { newPassword: 'newAdminPassword123' });
    assert('Principal resets account password', resetRes.status === 200);

    // Login with new password
    const newPassLogin = await request({
      hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { identifier: newCoordEmail, password: 'newAdminPassword123' });
    assert('Login with updated password succeeds', newPassLogin.status === 200);
  }

  // 4. MARKS & EXAMINATION PORTAL
  console.log('\n--- 4. Marks & Examination Evaluation Portal ---');
  const examsRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/marks/exams', method: 'GET',
    headers: { 'Authorization': `Bearer ${stToken}` }
  });
  assert('Get list of published examinations', examsRes.status === 200 && examsRes.body.length > 0, `${examsRes.body.length} exams available`);

  // Batch entry by Subject Teacher for Class 10-A, Subject 1 (Math), Exam 1
  const batchMarksRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/marks/batch', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${stToken}` }
  }, {
    classId: 1,
    subjectId: 1,
    examId: 1,
    marks: [
      { studentId: 1, marksObtained: 48.5, maxMarks: 50.0, remarks: 'Superb algebraic problem solving' },
      { studentId: 2, marksObtained: 46.0, maxMarks: 50.0, remarks: 'Consistent excellence' }
    ]
  });
  assert('Subject teacher submits batch marks', batchMarksRes.status === 200 && batchMarksRes.body.length === 2);

  // Student Report Card
  const reportCardRes = await request({
    hostname: 'localhost', port: 8080, path: `/api/marks/student/${studentProfileId || 1}`, method: 'GET',
    headers: { 'Authorization': `Bearer ${stuToken}` }
  });
  assert('Student accesses official report card & GPA', reportCardRes.status === 200 && reportCardRes.body.gpa > 0, `GPA: ${reportCardRes.body.gpa}, Overall: ${reportCardRes.body.overallGrade}`);

  // 5. FEE PAYMENT PORTAL & SIMULATED GATEWAY
  console.log('\n--- 5. Fee Payment Portal & Instant Receipts ---');
  const invoicesRes = await request({
    hostname: 'localhost', port: 8080, path: `/api/fees/student/${studentProfileId || 1}`, method: 'GET',
    headers: { 'Authorization': `Bearer ${stuToken}` }
  });
  assert('Student retrieves fee invoices', invoicesRes.status === 200 && invoicesRes.body.length > 0, `${invoicesRes.body.length} invoices found`);

  const pendingInv = invoicesRes.body.find(i => i.status !== 'PAID');
  if (pendingInv) {
    const payRes = await request({
      hostname: 'localhost', port: 8080, path: '/api/fees/pay', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${stuToken}` }
    }, {
      invoiceId: pendingInv.id,
      amount: pendingInv.balanceAmount,
      paymentMethod: 'UPI',
      transactionReference: 'TXN-UPI-' + Date.now(),
      remarks: 'Simulated online UPI fee payment test'
    });
    assert('Instant simulated online payment processing', payRes.status === 201 && payRes.body.receiptNumber, `Receipt: ${payRes.body.receiptNumber}`);

    // Verify digital receipt lookup
    const receiptRes = await request({
      hostname: 'localhost', port: 8080, path: `/api/fees/receipt/${payRes.body.id}`, method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    assert('Verify official digital receipt generation', receiptRes.status === 200 && receiptRes.body.status === 'SUCCESS');
  }

  // Principal Fee Summary
  const feeSummaryRes = await request({
    hostname: 'localhost', port: 8080, path: '/api/fees/summary', method: 'GET',
    headers: { 'Authorization': `Bearer ${prinToken}` }
  });
  assert('Principal views institutional fee revenue analytics', feeSummaryRes.status === 200 && feeSummaryRes.body.totalBilled > 0, `Total Billed: ₹${feeSummaryRes.body.totalBilled}`);

  console.log('\n===============================================================');
  console.log(`TEST RESULTS SUMMARY: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('===============================================================\n');

  if (passed === total) {
    console.log('>>> ALL PRODUCTION MODULE AUDITS & END-TO-END TESTS PASSED CLEANLY! <<<');
    process.exit(0);
  } else {
    console.error('>>> SOME TESTS FAILED <<<');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
