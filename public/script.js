/* =======================================
   Firebase Configuration & Initialization
   ======================================= */
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFdrSSFITp8FU78bZ7JRNRc48vt97c2Yo",
  authDomain: "demoregistrations.firebaseapp.com",
  projectId: "demoregistrations",
  storageBucket: "demoregistrations.firebasestorage.app",
  messagingSenderId: "582201279389",
  appId: "1:582201279389:web:55239adeb6d9e8f1baa574",
  measurementId: "G-F7X2KDDCZF"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const analytics = firebase.analytics();
const auth = app.auth();

/* =======================================
   DOM References & Global State
   ======================================= */
const yearEl = document.getElementById('year');
const nextCohortEl = document.getElementById('nextCohort');
const statLearners = document.getElementById('statLearners');
const statCourses = document.getElementById('statCourses');
const statProjects = document.getElementById('statProjects');
const track = document.getElementById('courseTrack');
const courseTrack = document.getElementById("courseTrack");
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const demoForm = document.getElementById('demoForm');
const demoMsg = document.getElementById('demoMsg');
const demoTableBody = document.querySelector('#demoTable tbody');
const demoCourse = document.getElementById('demoCourse');
const exportDemoCsvBtn = document.getElementById('exportDemoCsv');
const authButton = document.getElementById('authButton');
const adminLink = document.getElementById('adminLink');
const batchesLink = document.getElementById('batchesLink');
const authSection = document.getElementById('auth');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authMessage = document.getElementById('authMessage');
const authHeading = document.getElementById('authHeading');
const authSubheading = document.getElementById('authSubheading');
const authSubmitButton = document.getElementById('authSubmitButton');
const switchModeButton = document.getElementById('switchModeButton');
const adminSection = document.getElementById('admin');
const studentBatchesSection = document.getElementById('batches');
const batchForm = document.getElementById('batchForm');
const adminBatchTableBody = document.querySelector('#adminBatchTable tbody');
const studentBatchTableBody = document.querySelector('#studentBatchTable tbody');
const batchCourse = document.getElementById('batchCourse');
const exportBatchCsvBtn = document.getElementById('exportBatchCsv');

const courses = [
  { id: 'c01', title: 'MERN Full Stack', level:'Beginner–Advanced', duration:'12 weeks',img:"Mern-Stack.png" },
  { id: 'c02', title: 'React + TypeScript', level:'Intermediate', duration:'6 weeks', img:"React+TypeScript.png" },
  { id: 'c03', title: 'Node.js & Express', level:'Intermediate', duration:'5 weeks', img:"Nodejs.png" },
  { id: 'c04', title: 'MongoDB & Prisma', level:'Intermediate', duration:'4 weeks', img: "mongodb.png" },
  { id: 'c05', title: 'Data Structures & Algorithms', level:'All Levels', duration:'10 weeks',img:"DSA.png" },
  { id: 'c06', title: 'SQL from Zero to Hero', level:'Beginner', duration:'6 weeks', img:"SQL.png" },
  { id: 'c07', title: 'Python for Developers', level:'Beginner', duration:'8 weeks', img:"Python.png" },
  { id: 'c08', title: 'DevOps Bootcamp', level:'Intermediate', duration:'8 weeks', img:"DevOps.png" },
  { id: 'c09', title: 'Docker & Kubernetes', level:'Intermediate', duration:'6 weeks',img:"Docker-Kubernetes.png" },
  { id: 'c10', title: 'AWS for Developers', level:'Intermediate', duration:'6 weeks',img:"AWS.png" },
  { id: 'c11', title: 'Git & GitHub Mastery', level:'Beginner', duration:'2 weeks', img:"Git-Github.png" },
  { id: 'c12', title: 'Next.js 15 Essentials', level:'Intermediate', duration:'5 weeks',img:"Nextjs.png" },
  { id: 'c13', title: 'Tailwind CSS Pro', level:'Beginner', duration:'2 weeks', img:"TailwindCSS.png" },
  { id: 'c14', title: 'System Design Basics', level:'Advanced', duration:'5 weeks', img:"SystemDesign.png" },
  { id: 'c15', title: 'Java Spring Boot', level:'Intermediate', duration:'8 weeks', img:"JavaSpringBoot.png" },
  { id: 'c16', title: 'Android with Kotlin', level:'Intermediate', duration:'8 weeks', img:"Android.png" },
  { id: 'c17', title: 'AI for Web Devs', level:'Intermediate', duration:'6 weeks', img:"AI.png" },
  { id: 'c18', title: 'Prompt Engineering', level:'All Levels', duration:'3 weeks', img:"PromptEngineering.png" },
  { id: 'c19', title: 'Cybersecurity Basics', level:'Beginner', duration:'4 weeks',img:"Cybersecurity.png" },
  { id: 'c20', title: 'Data Analytics with Power BI', level:'Beginner', duration:'6 weeks',img:"PowerBI.png" },
  { id: 'c21', title: 'Rust for Backend', level:'Advanced', duration:'6 weeks',img:"Rust.png" },
  { id: 'c22', title: 'Go Microservices', level:'Advanced', duration:'6 weeks',img:"Go.png" },
];

let authMode = 'login';

/* =======================================
   Authentication Logic
   ======================================= */
auth.onAuthStateChanged(async user => {
  if (user) {
    // User is signed in. Check their role.
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    
    // UI changes for a logged-in user
    authButton.textContent = 'Log Out';
    authButton.onclick = () => auth.signOut();
    batchesLink.style.display = 'block';
    studentBatchesSection.style.display = 'block';

    if (userData && userData.role === 'admin') {
      adminLink.style.display = 'block';
      adminSection.style.display = 'block';
      renderAdminBatches(); // Render admin table with actions
    } else {
      adminLink.style.display = 'none';
      adminSection.style.display = 'none';
      renderStudentBatches(); // Render student table without actions
    }

    // Hide the auth section after login
    authSection.style.display = 'none';
  } else {
    // User is signed out.
    authButton.textContent = 'Log In / Register';
    authButton.onclick = () => {
      authSection.style.display = 'block';
      window.location.href = '#auth';
    };
    batchesLink.style.display = 'none';
    adminLink.style.display = 'none';
    adminSection.style.display = 'none'; // Hide admin panel when logged out
    studentBatchesSection.style.display = 'none';
  }
});

// Handle Login/Register Form Submission
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = authEmail.value;
  const password = authPassword.value;
  authMessage.textContent = '';

  try {
    if (authMode === 'register') {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection('users').doc(userCredential.user.uid).set({
        email: email,
        role: 'student', // Default role for new users
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      authMessage.textContent = '✅ Registration successful! You are now logged in.';
    } else { // Login mode
      await auth.signInWithEmailAndPassword(email, password);
      authMessage.textContent = '✅ Logged in successfully!';
    }
    authMessage.style.color = 'var(--success)';
  } catch (error) {
    console.error("Authentication failed:", error.message);
    authMessage.textContent = `❌ Authentication failed: ${error.message}`;
    authMessage.style.color = 'var(--danger)';
  }
});

// Switch between Login and Register modes
switchModeButton.addEventListener('click', () => {
  authMessage.textContent = '';
  if (authMode === 'login') {
    authMode = 'register';
    authHeading.textContent = 'Register';
    authSubheading.textContent = 'Create a new account.';
    authSubmitButton.textContent = 'Register';
    switchModeButton.textContent = 'Switch to Login';
  } else {
    authMode = 'login';
    authHeading.textContent = 'Log In';
    authSubheading.textContent = 'Log in to your account.';
    authSubmitButton.textContent = 'Log In';
    switchModeButton.textContent = 'Switch to Register';
  }
});


/* =============================
   Populate stats & hero details
   ============================= */
async function hydrateStats() {
    yearEl.textContent = new Date().getFullYear();
    try {
        const demoSnapshot = await db.collection('democlassregistrations').get();
        statLearners.textContent = (demoSnapshot.size + 80).toLocaleString('en-IN');
    } catch (error) {
        console.error("Error fetching demo stats: ", error);
        statLearners.textContent = '80+';
    }
    statCourses.textContent = '20+';
    statProjects.textContent = '50+';
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 9, 1);
    const day = nextMonth.getDay();
    const diff = (1 - day + 7) % 7;
    const nextCohortDate = new Date(new Date().getFullYear(), 9, 1);
    nextCohortEl.textContent = nextCohortDate.toDateString() + ' • 7:00 PM IST';
}

/* ==================
   Build course cards
   ==================*/
function renderCourses() {
  courses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course card";
    div.innerHTML = `
      <div class="thumb">
        <img src="${course.img || 'placeholder.png'}" 
             alt="${course.title}" 
             style="width:100%;height:150px;object-fit:cover;border-radius:12px;">
      </div>
      <h4>${course.title}</h4>
      <span class="pill">${course.level}</span>
    `;
    courseTrack.appendChild(div);
  });
}

/* =====================
   Carousel interactions
   ===================== */
function setupCarousel(){
  const step = 276;
  prevBtn.addEventListener('click', ()=> track.scrollBy({left: -step, behavior:'smooth'}));
  nextBtn.addEventListener('click', ()=> track.scrollBy({left: step, behavior:'smooth'}));
  let auto = setInterval(()=> track.scrollBy({left: step, behavior:'smooth'}), 3500);
  [track, prevBtn, nextBtn].forEach(el=>{
    el.addEventListener('mouseenter', ()=> clearInterval(auto));
    el.addEventListener('mouseleave', ()=> auto = setInterval(()=> track.scrollBy({left: step, behavior:'smooth'}), 3500));
  });
}

/* ==========================
   Demo registration handling
   ========================== */
db.collection('democlassregistrations').orderBy('timestamp', 'desc').limit(20).onSnapshot(snapshot => {
    const regs = snapshot.docs.map(doc => doc.data());
    demoTableBody.innerHTML = '';
    regs.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td><td>${r.course}</td><td>${r.date}</td><td>${r.notes || ''}</td>`;
        demoTableBody.appendChild(tr);
    });
});

function populateDemoCourseSelect() {
    demoCourse.innerHTML = ''; // Clear existing options
    courses.forEach(c => {
        const option = document.createElement('option');
        option.value = c.title;       // The value submitted in form
        option.textContent = c.title; // The visible text
        demoCourse.appendChild(option);
    });
}

demoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(demoForm);
    const record = Object.fromEntries(fd.entries());
    record.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    try {
        await db.collection('democlassregistrations').add(record);
        demoForm.reset();
        demoMsg.textContent = '✅ Registered! We will contact you soon.';
        setTimeout(() => demoMsg.textContent = '', 3000);
        hydrateStats();
    } catch (error) {
        console.error("Error adding document: ", error);
        demoMsg.textContent = '❌ An error occurred. Please try again.';
    }
});

exportDemoCsvBtn.addEventListener('click', async () => {
    const snapshot = await db.collection('democlassregistrations').get();
    const regs = snapshot.docs.map(doc => doc.data());
    const csv = toCsv(regs);
    download('fail2fwd_demo_registrations.csv', csv);
});

/* =====================
   Batch scheduler (CRUD)
   ===================== */
// Function to render the student's view of batches
function renderStudentBatches() {
    db.collection('batches').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        studentBatchTableBody.innerHTML = '';
        items.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${b.title}</td>
                <td>${b.course}</td>
                <td>${b.instructor}</td>
                <td>${b.mode}</td>
                <td>${b.start}</td>
                <td>${b.time}</td>
                <td>${b.notes || ''}</td>
            `;
            studentBatchTableBody.appendChild(tr);
        });
    });
}

// Function to render the admin's view of batches
function renderAdminBatches() {
    db.collection('batches').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        adminBatchTableBody.innerHTML = '';
        items.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${b.title}</td>
                <td>${b.course}</td>
                <td>${b.instructor}</td>
                <td>${b.mode}</td>
                <td>${b.start}</td>
                <td>${b.time}</td>
                <td>${b.notes || ''}</td>
                <td style="display:flex;gap:8px">
                    <button class="btn" data-edit="${b.id}">Edit</button>
                    <button class="btn danger" data-del="${b.id}">Delete</button>
                </td>
            `;
            adminBatchTableBody.appendChild(tr);
        });
    });
}

batchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(batchForm);
    const data = Object.fromEntries(fd.entries());
    try {
        if (!data.id) {
            await db.collection('batches').add({ ...data, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        } else {
            const docRef = db.collection('batches').doc(data.id);
            await docRef.update(data);
        }
        batchForm.reset();
        batchForm.querySelector('[name=id]').value = '';
    } catch (error) {
        console.error("Error saving document: ", error);
    }
});

document.getElementById('resetBatch').addEventListener('click', () => {
    batchForm.querySelector('[name=id]').value = '';
});

adminBatchTableBody.addEventListener('click', async (e) => {
    const editId = e.target.getAttribute('data-edit');
    const delId = e.target.getAttribute('data-del');
    if (editId) {
        const doc = await db.collection('batches').doc(editId).get();
        const b = { id: doc.id, ...doc.data() };
        if (!b) return;
        for (const [k, v] of Object.entries(b)) {
            const el = batchForm.querySelector(`[name=${CSS.escape(k)}]`);
            if (el) el.value = v;
        }
        window.scrollTo({ top: batchForm.closest('section').offsetTop - 70, behavior: 'smooth' });
    }
    if (delId) {
        if (confirm('Delete this batch?')) {
            try {
                await db.collection('batches').doc(delId).delete();
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        }
    }
});

exportBatchCsvBtn.addEventListener('click', async () => {
    const snapshot = await db.collection('batches').get();
    const items = snapshot.docs.map(doc => doc.data());
    const csv = toCsv(items);
    download('fail2fwd_batches.csv', csv);
});

/* pdf access for my students */
function checkPassword(inputId, linkId) {
  const password = document.getElementById(inputId).value;

  // ✅ Define passwords per module
  const passwords = {
    "pass1-1": "python123",  // Python Module 1
    "pass1-2": "python123",  // Python Module 2
    "pass1-3": "python123",  // Python Module 3
    "pass1-4": "python123",  // Python Module 4
    "pass1-5": "python123",  // Python Module 5

    "pass2-1": "clang456",   // C Module 1
    "pass2-2": "clang456",   // C Module 2
    "pass2-3": "clang456",
    "pass2-4": "clang456",
    "pass2-5": "clang456",
    "pass2-6": "clang456",
    "pass2-7": "clang456",
    "pass2-8": "clang456",
    "pass2-9": "clang456"
  };

  if (password === passwords[inputId]) {
    document.getElementById(linkId).classList.remove("hidden");
  } else {
    alert("Incorrect password! Try again.");
  }
}


/* ==========
   Boot
   ========== */
function boot() {
    hydrateStats();
    renderCourses();
    setupCarousel();
    populateDemoCourseSelect();
    // No initial setup needed for tables, as it's handled by onAuthStateChanged
}

document.addEventListener('DOMContentLoaded', boot);
