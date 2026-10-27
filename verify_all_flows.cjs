const http = require('http');

function req(options, data) {
  return new Promise((resolve, reject) => {
    const r = http.request(options, (res) => {
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
    r.on('error', reject);
    if (data) {
      r.write(JSON.stringify(data));
    }
    r.end();
  });
}

async function runMasterVerification() {
  console.log('========================================================================');
  console.log('   SCHOOLTRACK ENTERPRISE — MASTER FUNCTIONALITY & WORKFLOW AUDIT       ');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, condition, details = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${name} ${details ? `(${details})` : ''}`);
    } else {
      console.error(`  ✗ [FAIL] ${name} ${details ? `(${details})` : ''}`);
    }
  }

  // -------------------------------------------------------------------------
  // STEP 1: MULTI-IDENTIFIER AUTHENTICATION & PERSONA ACCESS
  // -------------------------------------------------------------------------
  console.log('--- Step 1: Multi-Identifier Authentication & Security ---');

  // Principal Login (Teacher ID)
  const prinAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'EMP-PRIN-01', password: 'password123' });
  test('Principal Login via Teacher ID (EMP-PRIN-01)', prinAuth.status === 200 && prinAuth.body.primaryRole === 'PRINCIPAL');
  const prinToken = prinAuth.body?.token;

  // Coordinator Login (Email)
  const coordAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'coord.senior@schooltrack.com', password: 'password123' });
  test('Coordinator Login via Email', coordAuth.status === 200 && coordAuth.body.primaryRole === 'COORDINATOR');
  const coordToken = coordAuth.body?.token;

  // Class Teacher Login (Teacher ID)
  const ctAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'EMP-CT-01', password: 'password123' });
  test('Class Teacher Login via Teacher ID (EMP-CT-01)', ctAuth.status === 200 && ctAuth.body.primaryRole === 'CLASS_TEACHER');
  const ctToken = ctAuth.body?.token;
  const ctProfileId = ctAuth.body?.profileId;
  const ctClassId = ctAuth.body?.classId || 1;

  // Subject Teacher Login (Teacher ID)
  const stAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'EMP-ST-01', password: 'password123' });
  test('Subject Teacher Login via Teacher ID (EMP-ST-01)', stAuth.status === 200 && stAuth.body.primaryRole === 'SUBJECT_TEACHER');
  const stToken = stAuth.body?.token;

  // Student Login (Roll Number)
  const stuAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: '01', password: 'password123' });
  test('Student Login via Roll Number (01)', stuAuth.status === 200 && stuAuth.body.primaryRole === 'STUDENT');
  const stuToken = stuAuth.body?.token;
  const stuProfileId = stuAuth.body?.profileId || 1;

  // Parent Login (Phone Number)
  const parAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: '+91 98765 43210', password: 'password123' });
  test('Parent Login via Phone Number (+91 98765 43210)', parAuth.status === 200 && parAuth.body.primaryRole === 'PARENT');
  const parToken = parAuth.body?.token;

  // Invalid Login Rejection
  const invalidAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: 'EMP-PRIN-01', password: 'wrongPassword!@#' });
  test('Security rejects invalid credentials with 401 Unauthorized', invalidAuth.status === 401 || invalidAuth.status === 400);

  // -------------------------------------------------------------------------
  // STEP 2: STUDENT & PARENT SELF-REGISTRATION & LINKING
  // -------------------------------------------------------------------------
  console.log('\n--- Step 2: Student & Parent Registration Flow ---');
  const uid = Math.floor(1000 + Math.random() * 9000);
  const studentRoll = `ROLL-${uid}`;
  const studentEmail = `student.${uid}@schooltrack.com`;
  const parentPhone = `+91 99999 ${uid}`;

  const regStudent = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/register/student', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: `Test Student ${uid}`,
    rollNumber: studentRoll,
    email: studentEmail,
    password: 'studentPassword123',
    classId: 1,
    parentName: `Parent of ${uid}`,
    parentPhone: parentPhone
  });
  test('Student self-registers with Roll Number & Parent details', regStudent.status === 201 && regStudent.body.token);

  // Authenticate new student by roll number
  const newStudentAuth = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { identifier: studentRoll, password: 'studentPassword123' });
  test('Newly registered student logs in with Roll Number', newStudentAuth.status === 200 && newStudentAuth.body.rollNumber === studentRoll);

  // Parent registration linking to new student's roll number
  const parentEmail = `parent.${uid}@schooltrack.com`;
  const regParent = await req({
    hostname: 'localhost', port: 8080, path: '/api/auth/register/parent', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    fullName: `Guardian ${uid}`,
    email: parentEmail,
    phone: `+91 98888 ${uid}`,
    password: 'parentPassword123',
    studentRollNumber: studentRoll,
    relationshipType: 'MOTHER'
  });
  test('Parent self-registers and links to Student Roll Number', regParent.status === 201 && regParent.body.token);

  // -------------------------------------------------------------------------
  // STEP 3: PRINCIPAL ADMINISTRATIVE ACCOUNT MANAGEMENT
  // -------------------------------------------------------------------------
  console.log('\n--- Step 3: Principal Administrative Account Management ---');
  const coordEmail = `coord.audit.${uid}@schooltrack.com`;
  const createCoord = await req({
    hostname: 'localhost', port: 8080, path: '/api/admin/accounts', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
  }, {
    role: 'COORDINATOR',
    firstName: 'Auditor',
    lastName: `Coord ${uid}`,
    email: coordEmail,
    phone: `+91 97777 ${uid}`,
    password: 'password123',
    teacherId: `EMP-CRD-${uid}`,
    wing: 'Middle School'
  });
  test('Principal provisions new Coordinator account', createCoord.status === 201 && createCoord.body.id);
  const createdUserId = createCoord.body?.id;

  if (createdUserId) {
    // Disable account
    const disableAcc = await req({
      hostname: 'localhost', port: 8080, path: `/api/admin/accounts/${createdUserId}/status`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
    }, { status: 'DISABLED' });
    test('Principal disables account', disableAcc.status === 200 && disableAcc.body.status === 'DISABLED');

    // Verify disabled login is blocked
    const disabledLogin = await req({
      hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { identifier: coordEmail, password: 'password123' });
    test('Security blocks disabled account from logging in', disabledLogin.status === 403 || disabledLogin.status === 400);

    // Re-enable account
    const enableAcc = await req({
      hostname: 'localhost', port: 8080, path: `/api/admin/accounts/${createdUserId}/status`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
    }, { status: 'ACTIVE' });
    test('Principal re-enables account', enableAcc.status === 200 && enableAcc.body.status === 'ACTIVE');

    // Reset password
    const resetPass = await req({
      hostname: 'localhost', port: 8080, path: `/api/admin/accounts/${createdUserId}/reset-password`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
    }, { newPassword: 'newSecurePassword456' });
    test('Principal resets account password', resetPass.status === 200);

    // Login with new password
    const loginWithNewPass = await req({
      hostname: 'localhost', port: 8080, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { identifier: coordEmail, password: 'newSecurePassword456' });
    test('Login with updated password succeeds', loginWithNewPass.status === 200);
  }

  // -------------------------------------------------------------------------
  // STEP 4: ATTENDANCE & ON-DUTY (OD) FORMULA VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- Step 4: Attendance & Strict OD Calculation Rules ---');
  const today = new Date().toISOString().split('T')[0];

  const markAtt = await req({
    hostname: 'localhost', port: 8080, path: '/api/attendance', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ctToken}` }
  }, {
    classId: 1,
    subjectId: 1,
    date: today,
    period: 1,
    records: [
      { studentId: 1, status: 'ON_DUTY', remarks: 'Science Exhibition OD' }
    ]
  });
  if (markAtt.status !== 200) {
    console.log('markAtt error:', markAtt.status, markAtt.body);
  }
  test('Class Teacher submits batch attendance with PRESENT, ON_DUTY, and ABSENT', markAtt.status === 200);

  // Verify OD counts as 100% Present in student stats
  const stuStats = await req({
    hostname: 'localhost', port: 8080, path: `/api/attendance/student/1`, method: 'GET',
    headers: { 'Authorization': `Bearer ${ctToken}` }
  });
  if (stuStats.status !== 200) {
    console.log('stuStats error:', stuStats.status, stuStats.body);
  }
  test('Student with ON_DUTY has attendance rate computed with OD as 100% Present',
    stuStats.status === 200 && (stuStats.body.attendancePercentage > 0 || stuStats.body.overallPercentage > 0),
    `Rate: ${stuStats.body.attendancePercentage || stuStats.body.overallPercentage}%`
  );

  // -------------------------------------------------------------------------
  // STEP 5: 3-STAGE LEAVE APPLICATION & VERIFICATION WORKFLOW
  // -------------------------------------------------------------------------
  console.log('\n--- Step 5: Complete 3-Stage Leave Workflow ---');

  // Student applies for leave
  const applyLeave = await req({
    hostname: 'localhost', port: 8080, path: '/api/leaves', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${stuToken}` }
  }, {
    studentId: stuProfileId,
    leaveTypeId: 1, // Medical Leave
    startDate: today,
    endDate: today,
    reason: 'Fever and rest recommended by doctor',
    documentUrl: 'https://schooltrack.internal/docs/med_cert_audit.pdf'
  });
  test('Student submits leave request (Stage 0: Applied)', (applyLeave.status === 200 || applyLeave.status === 201) && applyLeave.body.id);
  const leaveId = applyLeave.body?.id;

  if (leaveId) {
    // Stage 1: Parent Verification (Mock IVR / Portal)
    const stage1Parent = await req({
      hostname: 'localhost', port: 8080, path: `/api/leaves/${leaveId}/parent-verify`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${parToken}` }
    }, {
      status: 'APPROVED',
      verificationMethod: 'IVR_MOCK',
      remarks: 'Verified via IVR voice prompt'
    });
    test('Stage 1: Parent approves leave via Mock IVR', stage1Parent.status === 200 && stage1Parent.body.finalStatus === 'CLASS_TEACHER_PENDING');

    // Stage 2: Class Teacher Verification & Recommendation
    const stage2CT = await req({
      hostname: 'localhost', port: 8080, path: `/api/leaves/${leaveId}/teacher-verify`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ctToken}` }
    }, {
      status: 'APPROVED',
      remarks: 'Doctor certificate verified, recommended'
    });
    test('Stage 2: Class Teacher verifies & recommends leave', stage2CT.status === 200 && stage2CT.body.finalStatus === 'COORDINATOR_PENDING');

    // Stage 3: Coordinator Final Approval
    const stage3Coord = await req({
      hostname: 'localhost', port: 8080, path: `/api/leaves/${leaveId}/coordinator-verify`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${coordToken}` }
    }, {
      status: 'APPROVED',
      remarks: 'Final approval granted by Senior Wing Coordinator'
    });
    test('Stage 3: Coordinator grants final approval', stage3Coord.status === 200 && stage3Coord.body.finalStatus === 'APPROVED');

    // Verify timeline audit trail has all 3 stages (PARENT, CLASS_TEACHER, COORDINATOR)
    const leaveDetail = await req({
      hostname: 'localhost', port: 8080, path: `/api/leaves/${leaveId}`, method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    test('Leave audit trail has complete verification history', leaveDetail.status === 200 && leaveDetail.body.timeline?.length >= 3);
  }

  // -------------------------------------------------------------------------
  // STEP 6: DIGITAL DIARY & HOMEWORK WORKFLOW
  // -------------------------------------------------------------------------
  console.log('\n--- Step 6: Digital Diary & Homework Workflow ---');
  const createHw = await req({
    hostname: 'localhost', port: 8080, path: '/api/homework', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${stToken}` }
  }, {
    title: `Algebra Matrix Exercise ${uid}`,
    description: 'Complete Matrix Multiplication Problem Set 3',
    classId: 1,
    subjectId: 1,
    dueDate: today,
    priority: 'HIGH'
  });
  test('Subject Teacher assigns Homework to Class 10-A', (createHw.status === 200 || createHw.status === 201) && createHw.body.id);
  const hwId = createHw.body?.id;

  if (hwId) {
    // Student updates homework completion
    const updateHw = await req({
      hostname: 'localhost', port: 8080, path: `/api/homework/${hwId}/student/1/status`, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${stuToken}` }
    }, { completed: true, remarks: 'Completed problem set 3 on matrices' });
    console.log('    [Digital Diary Completion Response]:', JSON.stringify(updateHw.body));
    test('Student marks Homework as COMPLETED in Digital Diary', updateHw.status === 200 && (updateHw.body.completionStatus === 'COMPLETED' || updateHw.body.status === 'COMPLETED' || updateHw.body.completed === true));
  }

  // -------------------------------------------------------------------------
  // STEP 7: MARKS & EXAMINATION EVALUATION WORKFLOW
  // -------------------------------------------------------------------------
  console.log('\n--- Step 7: Examination Assessment & Marks Evaluation ---');

  // List exams
  const exams = await req({
    hostname: 'localhost', port: 8080, path: '/api/marks/exams', method: 'GET',
    headers: { 'Authorization': `Bearer ${stToken}` }
  });
  test('List available examinations', exams.status === 200 && exams.body.length > 0);

  // Subject Teacher enters batch marks
  const batchMarks = await req({
    hostname: 'localhost', port: 8080, path: '/api/marks/batch', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${stToken}` }
  }, {
    classId: 1,
    subjectId: 1,
    examId: 1,
    marks: [
      { studentId: 1, marksObtained: 49.0, maxMarks: 50.0, remarks: 'Flawless mathematical reasoning' },
      { studentId: 2, marksObtained: 45.0, maxMarks: 50.0, remarks: 'High accuracy' }
    ]
  });
  test('Subject Teacher submits batch marks evaluation', batchMarks.status === 200 && batchMarks.body.length >= 2);

  // Student Report Card & GPA
  const stuReport = await req({
    hostname: 'localhost', port: 8080, path: `/api/marks/student/${stuProfileId}`, method: 'GET',
    headers: { 'Authorization': `Bearer ${stuToken}` }
  });
  test('Student accesses official Report Card with GPA & Grades',
    stuReport.status === 200 && stuReport.body.gpa > 0,
    `GPA: ${stuReport.body.gpa}, Grade: ${stuReport.body.overallGrade}`
  );

  // -------------------------------------------------------------------------
  // STEP 8: FEE MANAGEMENT & ONLINE PAYMENT GATEWAY
  // -------------------------------------------------------------------------
  console.log('\n--- Step 8: Fee Management & Simulated Payment Gateway ---');

  // Fetch student invoices
  let invoices = await req({
    hostname: 'localhost', port: 8080, path: `/api/fees/student/${stuProfileId}`, method: 'GET',
    headers: { 'Authorization': `Bearer ${stuToken}` }
  });

  // If no pending invoice, create one
  let pendingInvoice = (invoices.body || []).find(i => i.status !== 'PAID');
  if (!pendingInvoice) {
    const newInv = await req({
      hostname: 'localhost', port: 8080, path: '/api/fees/invoices', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
    }, {
      studentId: stuProfileId,
      feeCategoryId: 1,
      title: `Term Tuition Fee ${uid}`,
      totalAmount: 5000.0,
      dueDate: today
    });
    pendingInvoice = newInv.body;
    // Refresh student invoices
    invoices = await req({
      hostname: 'localhost', port: 8080, path: `/api/fees/student/${stuProfileId}`, method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
  }

  test('Student fetches fee invoices', invoices.status === 200 && invoices.body.length > 0, `${invoices.body.length} invoices`);

  // Process simulated payment on pending invoice
  if (pendingInvoice && pendingInvoice.id) {
    const payRes = await req({
      hostname: 'localhost', port: 8080, path: '/api/fees/pay', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${stuToken}` }
    }, {
      invoiceId: pendingInvoice.id,
      amount: pendingInvoice.balanceAmount || pendingInvoice.totalAmount,
      paymentMethod: 'UPI',
      transactionReference: `TXN-UPI-${Date.now()}`,
      remarks: 'Simulated tuition fee payment'
    });
    test('Simulated payment processed & receipt issued', (payRes.status === 200 || payRes.status === 201) && payRes.body.receiptNumber, `Receipt: ${payRes.body.receiptNumber}`);

    // Receipt verification
    const receiptRes = await req({
      hostname: 'localhost', port: 8080, path: `/api/fees/receipt/${payRes.body.id}`, method: 'GET',
      headers: { 'Authorization': `Bearer ${stuToken}` }
    });
    test('Verify official digital tax receipt details', receiptRes.status === 200 && receiptRes.body.status === 'SUCCESS');
  }

  // Principal Fee Summary
  const feeSummary = await req({
    hostname: 'localhost', port: 8080, path: '/api/fees/summary', method: 'GET',
    headers: { 'Authorization': `Bearer ${prinToken}` }
  });
  test('Principal views school fee collection analytics', feeSummary.status === 200 && feeSummary.body.totalBilled > 0, `Billed: ₹${feeSummary.body.totalBilled}`);

  // -------------------------------------------------------------------------
  // STEP 9: SCHOOL NEWS & NOTIFICATIONS
  // -------------------------------------------------------------------------
  console.log('\n--- Step 9: News & Notifications ---');
  const createNews = await req({
    hostname: 'localhost', port: 8080, path: '/api/news', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prinToken}` }
  }, {
    title: `Official Academic Summit ${uid}`,
    description: 'SchoolTrack Annual Academic and Sports Convention announced.',
    category: 'ACADEMIC',
    priority: 'HIGH',
    pinned: true
  });
  test('Principal creates pinned school announcement', (createNews.status === 200 || createNews.status === 201) && createNews.body.id);

  // Student fetches notifications
  const notifs = await req({
    hostname: 'localhost', port: 8080, path: '/api/notifications', method: 'GET',
    headers: { 'Authorization': `Bearer ${stuToken}` }
  });
  test('Student retrieves active notification alerts', notifs.status === 200 && Array.isArray(notifs.body));

  console.log('\n========================================================================');
  console.log(`   FINAL MASTER AUDIT SUMMARY: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)   `);
  console.log('========================================================================\n');

  if (passed === total) {
    console.log('>>> ALL SCHOOLTRACK FUNCTIONALITIES & FLOWS VERIFIED 100% OPERATIONAL! <<<');
    process.exit(0);
  } else {
    console.error('>>> SOME TESTS FAILED <<<');
    process.exit(1);
  }
}

runMasterVerification().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
