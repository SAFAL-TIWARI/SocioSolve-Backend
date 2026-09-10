import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { University } from '../models/University.js';
import { Faculty } from '../models/Faculty.js';
import { Student } from '../models/Student.js';
import { Industry } from '../models/Industry.js';
import { Challenge } from '../models/Challenge.js';
import { Project } from '../models/Project.js';
import { Milestone } from '../models/Milestone.js';
import { Escalation } from '../models/Escalation.js';
import { Notification } from '../models/Notification.js';

async function seed() {
  console.log('🌱 Starting database seeding with realistic Jharkhand Societal Innovation data...');
  await connectDB();

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    University.deleteMany({}),
    Faculty.deleteMany({}),
    Student.deleteMany({}),
    Industry.deleteMany({}),
    Challenge.deleteMany({}),
    Project.deleteMany({}),
    Milestone.deleteMany({}),
    Escalation.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('🧹 Cleared existing data.');

  const passwordHash = await bcrypt.hash('Password@2026', 10);

  // 1. Users for each role
  const citizen = await User.create({
    name: 'Sunita Soren',
    email: 'citizen@jharkhand.gov.in',
    phone: '+91 94311 02938',
    passwordHash,
    role: 'citizen',
    district: 'Ranchi',
    isVerified: true,
  });

  const govtOfficer = await User.create({
    name: 'Dr. Rajeshwar Prasad',
    email: 'officer@jharkhand.gov.in',
    phone: '+91 98350 49120',
    passwordHash,
    role: 'government',
    district: 'Ranchi',
    designation: 'Executive Engineer & Nodal Officer',
    departmentName: 'Drinking Water & Sanitation Department',
    isVerified: true,
  });

  const facultyUser = await User.create({
    name: 'Prof. Ananya Mukherjee',
    email: 'faculty@bitmesra.ac.in',
    phone: '+91 94313 88124',
    passwordHash,
    role: 'university',
    district: 'Ranchi',
    designation: 'Professor & Head, Environmental Science',
    institutionName: 'Birla Institute of Technology, Mesra',
    isVerified: true,
  });

  const studentUser = await User.create({
    name: 'Aman Kumar Verma',
    email: 'student@bitmesra.ac.in',
    phone: '+91 79031 55672',
    passwordHash,
    role: 'student',
    district: 'Ranchi',
    designation: 'Lead Student Researcher (IoT & Robotics Club)',
    institutionName: 'National Institute of Technology, Jamshedpur',
    isVerified: true,
  });

  const industryUser = await User.create({
    name: 'Vikramaditya Roy',
    email: 'csr@tatasteel.com',
    phone: '+91 657 242 4242',
    passwordHash,
    role: 'industry',
    district: 'East Singhbhum',
    designation: 'Head of CSR & Community Development',
    institutionName: 'Tata Steel Foundation',
    isVerified: true,
  });

  const admin = await User.create({
    name: 'State Nodal Administrator',
    email: 'admin@jharkhand.gov.in',
    passwordHash,
    role: 'admin',
    district: 'Ranchi',
    designation: 'Director of Innovation & Citizen Services',
    isVerified: true,
  });

  console.log('👤 Created demo users for all ecosystem roles.');

  // 2. Departments
  const deptWater = await Department.create({
    name: 'Drinking Water & Sanitation Department',
    code: 'DWSD-JH',
    domain: 'Water & Sanitation',
    jurisdictionDistricts: ['Ranchi', 'Dhanbad', 'East Singhbhum', 'Hazaribagh', 'Palamu', 'Bokaro'],
    nodalOfficerRef: govtOfficer._id,
    slaDaysDefault: 5,
    activeChallengesCount: 8,
    resolvedChallengesCount: 34,
  });

  const deptRoads = await Department.create({
    name: 'Road Construction Department',
    code: 'RCD-JH',
    domain: 'Urban Infrastructure',
    jurisdictionDistricts: ['Ranchi', 'East Singhbhum', 'Dhanbad', 'Giridih', 'Deoghar'],
    slaDaysDefault: 7,
    activeChallengesCount: 14,
    resolvedChallengesCount: 52,
  });

  const deptAgri = await Department.create({
    name: 'Agriculture, Animal Husbandry & Cooperative Department',
    code: 'AGRI-JH',
    domain: 'Agriculture & Livelihoods',
    jurisdictionDistricts: ['Dumka', 'Godda', 'Gumla', 'Khunti', 'West Singhbhum', 'Ranchi'],
    slaDaysDefault: 6,
    activeChallengesCount: 6,
    resolvedChallengesCount: 19,
  });

  const deptEnergy = await Department.create({
    name: 'Jharkhand Bijli Vitran Nigam Ltd (JBVNL)',
    code: 'JBVNL-JH',
    domain: 'Energy & Power Infrastructure',
    jurisdictionDistricts: ['All 24 Districts'],
    slaDaysDefault: 3,
    activeChallengesCount: 11,
    resolvedChallengesCount: 68,
  });

  // 3. Universities
  const bitMesra = await University.create({
    name: 'Birla Institute of Technology, Mesra',
    code: 'BIT-MESRA',
    location: { district: 'Ranchi', city: 'Ranchi', state: 'Jharkhand' },
    departments: ['Civil & Environmental Engineering', 'Computer Science', 'Remote Sensing', 'Chemical Engineering'],
    disciplines: ['Water Purification', 'IoT Sensing', 'Renewable Energy', 'GIS Mapping'],
    facultyCount: 220,
    studentCount: 5400,
    labs: ['Water Quality Testing Lab', 'GIS Center', 'TBI Incubation Hub'],
    researchCenters: ['Center for Rural Technology', 'Environmental Engineering Research Lab'],
    incubationCenters: ['BIT TBI Startups Incubator'],
    patentsCount: 42,
    activeProjectsCount: 18,
  });

  const nitJsr = await University.create({
    name: 'National Institute of Technology, Jamshedpur',
    code: 'NIT-JSR',
    location: { district: 'East Singhbhum', city: 'Jamshedpur', state: 'Jharkhand' },
    departments: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Metallurgy'],
    disciplines: ['Structural Health', 'Solar Irrigation', 'Automated Waste Segregation', 'Smart Grids'],
    facultyCount: 180,
    studentCount: 4200,
    labs: ['Smart Grid Lab', 'Robotics & Automation Center'],
    researchCenters: ['Center for Advanced Material Testing'],
    incubationCenters: ['NIT Innovation Hub'],
    patentsCount: 31,
    activeProjectsCount: 14,
  });

  const iitIsm = await University.create({
    name: 'Indian Institute of Technology (ISM), Dhanbad',
    code: 'IIT-ISM',
    location: { district: 'Dhanbad', city: 'Dhanbad', state: 'Jharkhand' },
    departments: ['Environmental Science & Engineering', 'Mining Engineering', 'Geophysics'],
    disciplines: ['Groundwater Arsenic Remediation', 'Mine Water Treatment', 'Air Quality Monitoring'],
    facultyCount: 310,
    studentCount: 7800,
    labs: ['Geo-spatial Sensing Lab', 'Air Quality Monitoring Station'],
    researchCenters: ['Clean Coal & Clean Energy Center'],
    incubationCenters: ['IIT ISM Innovation & Incubation Center'],
    patentsCount: 65,
    activeProjectsCount: 22,
  });

  // Faculty profile
  await Faculty.create({
    userRef: facultyUser._id,
    universityRef: bitMesra._id,
    name: facultyUser.name,
    designation: 'Professor & Head, Environmental Science',
    department: 'Civil & Environmental Engineering',
    expertiseAreas: ['Drinking Water Purification', 'Heavy Metal Biosorption', 'Rural Decentralized Filtration'],
    researchKeywords: ['Arsenic Removal', 'Bio-sand Filters', 'IoT Water Quality'],
    publicationsCount: 38,
    patentsCount: 3,
    activeMentorships: 4,
    isAvailableForMentorship: true,
  });

  // Student profile
  await Student.create({
    userRef: studentUser._id,
    universityRef: nitJsr._id,
    rollNumber: '2022UGCS044',
    department: 'Electrical Engineering',
    degree: 'B.Tech',
    graduationYear: 2026,
    skills: ['Embedded Systems', 'IoT Firmware', 'LoRaWAN', 'Python Data Processing', 'Hardware Prototyping'],
    projectsCompleted: 3,
  });

  // 4. Industries
  const tataSteel = await Industry.create({
    organizationName: 'Tata Steel Foundation',
    type: 'CSR',
    district: 'East Singhbhum',
    domainFocus: ['Drinking Water Security', 'Rural Health & Sanitation', 'Education Infrastructure', 'Youth Skill Building'],
    csrBudgetAvailableINR: 25000000,
    csrProjectsCount: 28,
    techSupportOfferings: ['Field Deployment Logistics', 'Industrial Fabrication Access', 'Community Outreach Network'],
    contactPerson: 'Vikramaditya Roy',
    contactEmail: 'csr@tatasteel.com',
  });

  const bccl = await Industry.create({
    organizationName: 'Bharat Coking Coal Limited (CSR Cell)',
    type: 'Industry',
    district: 'Dhanbad',
    domainFocus: ['Mine Drainage Treatment', 'Road Restoration', 'Dust Suppression', 'Solar Streetlighting'],
    csrBudgetAvailableINR: 18000000,
    csrProjectsCount: 16,
    techSupportOfferings: ['Heavy Equipment Support', 'Geotechnical Soil Testing'],
    contactPerson: 'Alok Kumar Singh',
    contactEmail: 'csr@bccl.gov.in',
  });

  // 5. Challenges across categories
  const ch1 = await Challenge.create({
    challengeId: 'JH-2026-000101',
    title: 'Severe Fluoride and Arsenic Contamination in Rural Handpumps at Ormanjhi',
    description: 'Over 14 public handpumps in Ward 4 and surrounding hamlets are dispensing yellow-tinged water with tested fluoride levels exceeding 3.5 mg/L. Multiple children and elderly residents report joint stiffness and dental fluorosis. Nearest alternative water source is 3 km away.',
    category: 'Water',
    subcategory: 'Groundwater Contamination',
    severity: 'Critical',
    urgency: 'Immediate',
    status: 'Solution Development',
    location: {
      type: 'Point',
      coordinates: [85.4744, 23.4795],
      district: 'Ranchi',
      block: 'Ormanjhi',
      villageOrWard: 'Chakla Panchayat, Ward 4',
      landmark: 'Near Govt Middle School Handpump',
      address: 'Chakla Village, Ormanjhi, Ranchi, Jharkhand - 835219',
    },
    affectedCount: 650,
    safetyRisk: true,
    durationMonths: 14,
    whoIsAffected: 'School students, village households, cattle',
    evidenceUrls: ['/uploads/evidence-sample-water.jpg'],
    citizenRef: citizen._id,
    assignedDeptRef: deptWater._id,
    assignedOfficerRef: govtOfficer._id,
    leadUniversityRef: bitMesra._id,
    leadIndustryRef: tataSteel._id,
    slaDueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    escalationLevel: 0,
    citizenValidationCount: 84,
    confirmationCount: 42,
    aiConfidence: 0.94,
    aiSuggestedDept: 'Drinking Water & Sanitation Department',
    aiSuggestedKeywords: ['fluoride', 'groundwater', 'arsenic', 'handpump filtration'],
  });

  const ch2 = await Challenge.create({
    challengeId: 'JH-2026-000102',
    title: 'Collapsing Culvert and Severe Road Craters on Hatia-Tupudana Industrial Link Road',
    description: 'A major culvert has sustained structural cracking causing heavy water stagnation and a 2-meter road cave-in on the primary transit route connecting Hatia railway siding to Tupudana Industrial Estate. Daily traffic of over 8,000 workers and school buses is diverted into unpaved hazardous mud tracks.',
    category: 'Urban Development',
    subcategory: 'Road & Bridge Infrastructure',
    severity: 'High',
    urgency: 'High',
    status: 'Under Review',
    location: {
      type: 'Point',
      coordinates: [85.2912, 23.2981],
      district: 'Ranchi',
      block: 'Namkum',
      villageOrWard: 'Tupudana Industrial Belt',
      landmark: 'Bridge 4 near Railway Overpass',
      address: 'Hatia-Tupudana Link Road, Ranchi - 834003',
    },
    affectedCount: 8000,
    safetyRisk: true,
    durationMonths: 3,
    evidenceUrls: ['/uploads/evidence-sample-road.jpg'],
    citizenRef: citizen._id,
    assignedDeptRef: deptRoads._id,
    slaDueAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    escalationLevel: 1,
    citizenValidationCount: 160,
    confirmationCount: 88,
    aiConfidence: 0.92,
    aiSuggestedDept: 'Road Construction Department',
    aiSuggestedKeywords: ['culvert collapse', 'pothole', 'road cave-in', 'heavy vehicle risk'],
  });

  const ch3 = await Challenge.create({
    challengeId: 'JH-2026-000103',
    title: 'Post-Harvest Tomato and Chilli Rotting Due to Cold Storage Absence at Bundu Block',
    description: 'Farmers in Bundu and Tamar blocks face up to 45% post-harvest spoilage of fresh tomatoes and green chillies every peak harvest cycle due to the absence of solar micro-cold storage or food dehydration facilities. Middlemen force distressed sales at Rs 3/kg.',
    category: 'Agriculture',
    subcategory: 'Post-Harvest Loss & Cold Chain',
    severity: 'High',
    urgency: 'Medium',
    status: 'Assigned',
    location: {
      type: 'Point',
      coordinates: [85.5833, 23.1667],
      district: 'Ranchi',
      block: 'Bundu',
      villageOrWard: 'Bundu Vegetable Mandi Area',
      landmark: 'Near Bundu Krishi Upaj Mandi',
      address: 'Bundu Mandi, NH-33, Ranchi - 835204',
    },
    affectedCount: 1200,
    safetyRisk: false,
    durationMonths: 24,
    evidenceUrls: ['/uploads/evidence-sample-agri.jpg'],
    citizenRef: citizen._id,
    assignedDeptRef: deptAgri._id,
    leadUniversityRef: nitJsr._id,
    slaDueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    escalationLevel: 0,
    citizenValidationCount: 215,
    confirmationCount: 104,
    aiConfidence: 0.89,
    aiSuggestedDept: 'Agriculture, Animal Husbandry & Cooperative Department',
    aiSuggestedKeywords: ['solar cold storage', 'spoilage', 'horticulture', 'micro-cold chain'],
  });

  const ch4 = await Challenge.create({
    challengeId: 'JH-2026-000104',
    title: 'Unsegregated Hazardous Medical and Plastic Waste Dumping Near Jharia Coalfields',
    description: 'Massive open dump overflowing into local stormwater nallah near Bastacola collieries, causing noxious smoke emissions and burning fumes that enter residential quarters.',
    category: 'Sanitation',
    subcategory: 'Solid Waste Management',
    severity: 'Critical',
    urgency: 'Immediate',
    status: 'Escalated',
    location: {
      type: 'Point',
      coordinates: [86.4172, 23.7541],
      district: 'Dhanbad',
      block: 'Jharia',
      villageOrWard: 'Bastacola Colony, Ward 12',
      landmark: 'Opposite Community Dispensary',
      address: 'Jharia-Dhanbad Main Road, Dhanbad - 828111',
    },
    affectedCount: 3500,
    safetyRisk: true,
    durationMonths: 8,
    evidenceUrls: ['/uploads/evidence-sample-waste.jpg'],
    citizenRef: citizen._id,
    assignedDeptRef: deptWater._id,
    leadUniversityRef: iitIsm._id,
    leadIndustryRef: bccl._id,
    slaDueAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Overdue!
    escalationLevel: 2,
    citizenValidationCount: 340,
    confirmationCount: 192,
    aiConfidence: 0.95,
    aiSuggestedDept: 'Dhanbad Municipal Corporation & Pollution Control Board',
    aiSuggestedKeywords: ['toxic fumes', 'biomedical waste', 'mine water runoff', 'open burning'],
  });

  const ch5 = await Challenge.create({
    challengeId: 'JH-2026-000105',
    title: 'Broken Solar Micro-Grid Inverters Plunging Remote Netarhat Tribal Hamlets into Darkness',
    description: 'Three decentralized solar micro-grids installed 4 years ago have burnt out charge controllers and severed battery linkages, leaving 120 tribal households without illumination or power for mobile communications for 6 months.',
    category: 'Energy',
    subcategory: 'Renewable Micro-Grids',
    severity: 'Medium',
    urgency: 'High',
    status: 'Resolved',
    location: {
      type: 'Point',
      coordinates: [84.2667, 23.4833],
      district: 'Latehar',
      block: 'Mahuadanr',
      villageOrWard: 'Netarhat Hill Enclave',
      landmark: 'Near Van Vibhag Checkpost',
      address: 'Netarhat Plateau, Latehar - 835218',
    },
    affectedCount: 480,
    safetyRisk: false,
    durationMonths: 6,
    evidenceUrls: ['/uploads/evidence-sample-solar.jpg'],
    citizenRef: citizen._id,
    assignedDeptRef: deptEnergy._id,
    slaDueAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    escalationLevel: 0,
    citizenValidationCount: 78,
    confirmationCount: 52,
    aiConfidence: 0.91,
    aiSuggestedDept: 'Jharkhand Renewable Energy Development Agency (JREDA)',
    aiSuggestedKeywords: ['solar inverter replacement', 'battery bank', 'remote microgrid'],
  });

  // 6. Innovation Project linked to Challenge 1
  const project1 = await Project.create({
    projectCode: 'PRJ-JH-2026-0012',
    challengeRef: ch1._id,
    title: 'Solar-Powered Automated Graphene-Biochar Fluoride & Arsenic Remediation Kiosk (JAL-KAVACH)',
    problemStatement: ch1.description,
    objective: 'Deploy a decentralized 2,000 L/day automated filtration kiosk powered by solar panels and locally sourced biochar-graphene composite cartridges, equipped with IoT telemetry for real-time contaminant monitoring.',
    expectedOutcome: 'Zero-fluoride drinking water complying with BIS 10500 standards for 650+ residents and school students at under 12 paise per liter operating cost.',
    technologyUsed: ['Biochar Nanocomposite Filter', 'Solar PV 1.2 kW', 'ESP32 IoT Telemetry', 'LoRaWAN Cloud Monitoring'],
    stage: 'Pilot',
    leadFacultyRef: facultyUser._id,
    universityRef: bitMesra._id,
    studentMembers: [
      { userRef: studentUser._id, name: studentUser.name, role: 'IoT Telemetry & Embedded Firmware Lead' },
      { name: 'Pooja Murmu', role: 'Water Chemical Quality Analyst' },
      { name: 'Rohan Minz', role: 'Civil Kiosk Housing & Field Fabrication' },
    ],
    govtStakeholderRef: govtOfficer._id,
    industryPartnerRef: tataSteel._id,
    totalBudgetINR: 480000,
    fundingRaisedINR: 480000,
    milestonesCount: 4,
    completedMilestonesCount: 3,
    progressPercent: 75,
    pilotLocationDistrict: 'Ranchi',
    impactPassportGenerated: false,
  });

  // Milestones for Project 1
  await Milestone.create([
    {
      projectRef: project1._id,
      title: 'Phase 1: Water Chemical Profiling & Cartridge Sizing',
      description: 'Lab spectroscopic analysis of raw water samples from 14 Ormanjhi handpumps. Validation of adsorption capacity.',
      targetDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      completionDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      status: 'Completed',
      progressPercent: 100,
    },
    {
      projectRef: project1._id,
      title: 'Phase 2: Fabrication of Solar Kiosk & Embedded Flow Controller',
      description: 'Assembly of weatherproof SS304 kiosk enclosure, solar battery array, and automatic backwash valve system.',
      targetDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      completionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'Completed',
      progressPercent: 100,
    },
    {
      projectRef: project1._id,
      title: 'Phase 3: Field Installation at Chakla School & Sensor Calibration',
      description: 'Ground deployment, connection to overhead gravity tank, and GSM sensor telemetry calibration.',
      targetDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'Completed',
      progressPercent: 100,
    },
    {
      projectRef: project1._id,
      title: 'Phase 4: 90-Day Community Handover & Citizen Water Committee Training',
      description: 'Training 6 local ward members on cartridge replacement and chlorine monitoring; official handover to Panchayat.',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'In Progress',
      progressPercent: 25,
    },
  ]);

  // Escalation record for Challenge 4
  await Escalation.create({
    challengeRef: ch4._id,
    level: 2,
    levelTitle: 'Department Supervisor Review',
    reason: 'SLA response deadline breached by 24 hours. Hazardous fumes persisting near school campus.',
    triggeredBy: 'automatic_sla_breach',
    responsibleAuthority: 'Additional District Magistrate (ADM Relief & Rehabilitation), Dhanbad',
    actionRequired: 'Joint site inspection with State Pollution Control Board within 48 hours.',
    status: 'Open',
  });

  // Notifications
  await Notification.create([
    {
      recipientUserRef: govtOfficer._id,
      title: 'Urgent Action Required',
      message: 'Challenge JH-2026-000104 in Jharia has breached SLA deadline and triggered Level 2 Escalation.',
      type: 'sla',
      deepLink: '/government/action-required',
      isRead: false,
    },
    {
      recipientUserRef: citizen._id,
      title: 'Innovation Project Approved',
      message: 'Your reported challenge JH-2026-000101 is now an active Innovation Project (JAL-KAVACH) partnered with BIT Mesra.',
      type: 'project',
      deepLink: '/projects',
      isRead: false,
    },
  ]);

  console.log('✅ Database seeded successfully with realistic societal innovation data!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
