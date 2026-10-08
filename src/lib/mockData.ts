import { Assignment } from '@/types/homework';

function createDataUrl(filename: string, textContent: string, mimeType: string = 'text/plain'): string {
  const encoded = encodeURIComponent(textContent);
  return `data:${mimeType};charset=utf-8,${encoded}`;
}

export const INITIAL_MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-3-evs-101',
    created_at: '2026-10-05T09:30:00Z',
    teacher_name: 'Ms. Sunita Sharma',
    teacher_phone: '919876543210',
    teacher_email: 'sunita.sharma@cbse-autumn.edu.in',
    class_grade: 'Class 3',
    section: 'All Sections',
    subject: 'EVS',
    title: 'Autumn Leaf Adaptation Journal & Local Tree Scrapbook',
    due_date: '2026-10-25',
    is_verified_staff: true,
    instructions: `Dear Students & Parents,

Warm Autumn Greetings!

1. Collect 5 different fallen leaves from your neighbourhood park or garden (e.g., Neem, Peepal, Gulmohar, Mango, Ashoka).
2. Dry the leaves between newspapers for 2 days and paste them into your EVS Scrapbook.
3. Label each leaf with:
   - Tree Name
   - Leaf Shape & Edge Type
   - Color shifts observed during Autumn
4. Draw a neat diagram of a plant showing root, stem, leaf, flower, and fruit.
5. Write 5 sentences on how trees prepare for the changing autumn season.

Note: Parents are requested to guide children while collecting leaves. Have fun observing nature!`,
    files: [
      {
        id: 'file-3-1',
        assignment_id: 'assign-3-evs-101',
        file_name: 'Class3_EVS_Autumn_Leaf_Worksheet.pdf',
        file_size: 485000,
        file_type: 'pdf',
        public_url: createDataUrl('Class3_EVS_Autumn_Leaf_Worksheet.pdf', `CBSE CLASS 3 EVS HOLIDAY HOMEWORK (OCTOBER 2026)
Topic: Autumn Leaf Adaptation & Tree Scrapbook
Teacher: Ms. Sunita Sharma

ACTIVITIES:
1. Paste 5 different fallen leaves in your EVS notebook.
2. Label parts of a leaf: Apex, Margin, Midrib, Petiole, Veins.
3. Answer: Why do leaves turn yellow/brown in autumn?
4. Plant a small sapling at home and photograph it for the Autumn Display.`),
      },
      {
        id: 'file-3-2',
        assignment_id: 'assign-3-evs-101',
        file_name: 'Leaf_Identification_Guide.png',
        file_size: 1250000,
        file_type: 'png',
        public_url: createDataUrl('Leaf_Identification_Guide.png', 'SAMPLE_LEAF_GUIDE_IMAGE_DATA', 'image/svg+xml'),
      }
    ]
  },
  {
    id: 'assign-5-math-102',
    created_at: '2026-10-06T10:15:00Z',
    teacher_name: 'Mr. Rajesh Kumar',
    teacher_phone: '919812345678',
    teacher_email: 'rajesh.maths@cbse-autumn.edu.in',
    class_grade: 'Class 5',
    section: 'Section A',
    subject: 'Maths',
    title: 'Fun with Geometry: Autumn Rangoli & Symmetry Patterns',
    due_date: '2026-10-24',
    is_verified_staff: true,
    instructions: `Mathematical Art & Logic Project (October 2026 Break):

1. Create an Autumn Festival Rangoli pattern on an A3 sheet using geometric shapes (Triangles, Hexagons, Circles, Rhombuses).
2. Mark all lines of symmetry on your design using a red sketch pen.
3. Solve Worksheet #4 on Factors, Multiples, and Fractional Parts of Autumn Leaves.
4. Calculate the perimeter and area of 4 different household objects (Table top, Book cover, Handkerchief, Floor tile) in centimeters.
5. Practice 15 speed-math mental addition & division problems in your homework register.`,
    files: [
      {
        id: 'file-5-1',
        assignment_id: 'assign-5-math-102',
        file_name: 'Class5_Maths_Autumn_Worksheet.pdf',
        file_size: 720000,
        file_type: 'pdf',
        public_url: createDataUrl('Class5_Maths_Autumn_Worksheet.pdf', `CBSE CLASS 5 MATHEMATICS HOLIDAY HOMEWORK
Topic: Geometry, Symmetry & Fractions
Teacher: Mr. Rajesh Kumar

SECTION A: GEOMETRIC PATTERNS
1. Draw symmetrical shapes with 1, 2, and infinite lines of symmetry.
2. Find LCM and HCF of (12, 18), (15, 25), and (24, 36).

SECTION B: PRACTICAL MATH
3. If an autumn oak tree sheds 120 leaves in 4 hours, what is the rate of leaf drop per minute?`),
      },
    ]
  },
  {
    id: 'assign-8-ai-103',
    created_at: '2026-10-04T14:20:00Z',
    teacher_name: 'Dr. Ananya Verma',
    teacher_phone: '919711223344',
    teacher_email: 'ananya.ai@cbse-autumn.edu.in',
    class_grade: 'Class 8',
    section: 'All Sections',
    subject: 'AI Foundation',
    title: 'AI in Everyday Life: Smart Farming & Autumn Crop Harvesting Case Study',
    due_date: '2026-10-26',
    is_verified_staff: true,
    instructions: `Artificial Intelligence Foundation Assignment:

Explore how AI technologies transform Indian agriculture during the Autumn Harvest Season (Kharif Crop Season):

1. Prepare a 5-slide digital presentation or 3-page written report on "AI-Powered Drones & Computer Vision in Crop Monitoring".
2. Case Study Analysis: Research how machine learning models detect plant leaf diseases before harvest.
3. Ethics Check: List 3 benefits and 2 ethical challenges of using AI automation in rural farming.
4. Interactive Task: Try Teachable Machine by Google (image recognition) to train a model distinguishing Healthy Leaves vs Diseased Leaves. Submit screenshots of your model accuracy!`,
    files: [
      {
        id: 'file-8-1',
        assignment_id: 'assign-8-ai-103',
        file_name: 'Class8_AI_Harvesting_Project_Guidelines.docx',
        file_size: 610000,
        file_type: 'docx',
        public_url: createDataUrl('Class8_AI_Harvesting_Project_Guidelines.docx', `CBSE CLASS 8 AI FOUNDATION - AUTUMN ASSIGNMENT
Project: Smart Agriculture & Computer Vision
Teacher: Dr. Ananya Verma

Deliverables:
- Presentation / Report (PDF or PPTX)
- Teachable Machine Model Link / Screenshots
- AI Ethics Reflections`),
      },
      {
        id: 'file-8-2',
        assignment_id: 'assign-8-ai-103',
        file_name: 'TeachableMachine_Sample_Dataset.zip',
        file_size: 3400000,
        file_type: 'zip',
        public_url: createDataUrl('TeachableMachine_Sample_Dataset.zip', 'MOCK_ZIP_DATASET_FOR_TEACHABLE_MACHINE'),
      }
    ]
  },
  {
    id: 'assign-10-sst-104',
    created_at: '2026-10-07T11:00:00Z',
    teacher_name: 'Mr. Vikramaditya Singh',
    teacher_phone: '919899001122',
    teacher_email: 'vikram.sst@cbse-autumn.edu.in',
    class_grade: 'Class 10',
    section: 'Section B',
    subject: 'Social Science',
    title: 'CBSE Board Project: Sustainable Development & River Valley Conservation',
    due_date: '2026-10-25',
    is_verified_staff: true,
    instructions: `CBSE Mandated Social Science Portfolio Project (2026-27):

Topic: Sustainable Resource Management & Rainwater Harvesting in North India.

Requirements:
- Length: 12-15 handwritten pages on project sheets.
- Cover Page: Title, Student Name, Roll No, School Name, CBSE Registration No.
- Table of Contents, Acknowledgement, Certificate of Authenticity.
- Core Chapters:
  1. Introduction to Sustainable Water Management.
  2. Autumn Season Water Storage & Agricultural Irrigation.
  3. Case Study: Traditional Rainwater Harvesting (Johads, Baolis, Khadins).
  4. Modern Rainwater Systems & Government Policies.
- Visuals: Paste relevant maps, diagrams of rainwater harvesting systems, and news clippings.
- Conclusion & Bibliography.`,
    files: [
      {
        id: 'file-10-1',
        assignment_id: 'assign-10-sst-104',
        file_name: 'CBSE_Class10_SST_Project_Rubrics_2026.pdf',
        file_size: 1150000,
        file_type: 'pdf',
        public_url: createDataUrl('CBSE_Class10_SST_Project_Rubrics_2026.pdf', `CBSE CLASS 10 SOCIAL SCIENCE PROJECT EVALUATION RUBRICS
Total Marks: 5
- Relevance of Content & Research: 2 Marks
- Originality & Creativity: 1 Mark
- Presentation & Neatness: 1 Mark
- Viva Voce / Quiz Performance: 1 Mark`),
      }
    ]
  },
  {
    id: 'assign-12-phy-105',
    created_at: '2026-10-06T16:45:00Z',
    teacher_name: 'Mrs. Deepa Ranganathan',
    teacher_phone: '919444112233',
    teacher_email: 'deepa.physics@cbse-autumn.edu.in',
    class_grade: 'Class 12',
    section: 'All Sections',
    subject: 'Physics',
    title: 'Investigative Physics Project: Electromagnetic Induction & Solar Cell Efficiency',
    due_date: '2026-10-27',
    is_verified_staff: true,
    instructions: `Class XII Physics Board Practical & Investigative Project Work:

Choose one of the following investigative topics for your AISSCE 2027 Practical Board Exam portfolio:

1. Topic A: To study the dependence of the angle of deviation on the angle of incidence for a glass prism.
2. Topic B: To investigate the efficiency of a Solar Cell under varying ambient light conditions and temperatures during autumn.
3. Topic C: To study self-inductance of a coil and factor affecting induced EMF (Faraday's Law).

Project Format:
- Aim, Theory & Formulae
- Circuit / Ray Diagram (Neat pencil diagram)
- Apparatus & Setup Description
- Tabular Observations (Minimum 6 sets of readings)
- Graph plotting (Incident angle vs Deviation / Voltage vs Current)
- Sources of Error & Precautions

Note: Complete all assigned numerical problems from Chapter 6 (EMI) and Chapter 7 (AC) in your Physics Fair Notebook.`,
    files: [
      {
        id: 'file-12-1',
        assignment_id: 'assign-12-phy-105',
        file_name: 'Class12_Physics_Investigative_Project_Format.pdf',
        file_size: 1890000,
        file_type: 'pdf',
        public_url: createDataUrl('Class12_Physics_Investigative_Project_Format.pdf', `CBSE CLASS 12 PHYSICS INVESTIGATIVE PROJECT GUIDELINES
Teacher: Mrs. Deepa Ranganathan

1. Cover Page Format
2. Certificate & Declaration
3. Experimental Setup & Circuit Diagrams
4. Graph Analysis & Formulae Derivations
5. Viva Voce Question Bank (50 Questions Included)`),
      },
      {
        id: 'file-12-2',
        assignment_id: 'assign-12-phy-105',
        file_name: 'EMI_and_AC_Autumn_Worksheet_Problems.pdf',
        file_size: 920000,
        file_type: 'pdf',
        public_url: createDataUrl('EMI_and_AC_Autumn_Worksheet_Problems.pdf', `CLASS XII PHYSICS NUMERICAL ASSIGNMENT
Electromagnetic Induction & Alternating Current
Solve all 25 Board Exam previous year questions included in this worksheet.`),
      }
    ]
  },
  {
    id: 'assign-12-cs-106',
    created_at: '2026-10-08T08:00:00Z',
    teacher_name: 'Mr. Arvind Swaminathan',
    teacher_phone: '919840123456',
    teacher_email: 'arvind.cs@cbse-autumn.edu.in',
    class_grade: 'Class 12',
    section: 'All Sections',
    subject: 'Computer Science (CS)',
    title: 'Python & MySQL Integrated Project: School Library & Assignment Portal',
    due_date: '2026-10-26',
    is_verified_staff: true,
    instructions: `Senior Secondary Computer Science Project Submission:

Develop a modular Python application connected with MySQL Database server:

Key Requirements:
1. Python DB Connectivity: Use \`mysql.connector\` or \`sqlite3\` library.
2. Database Schema: Create tables for Students, Books/Assignments, and Issue Logs with proper Primary & Foreign keys.
3. Functional Operations:
   - Add, Search, Update, and Delete Records (CRUD).
   - Generate summary reports (e.g. Total active assignments by subject).
   - Input validation and exception handling (\`try-except\` blocks).
4. Code Standard: PEP 8 compliant, well-commented code, modular functions.
5. Deliverables: Python source code (\`.py\` file), Database dump (\`.sql\` file), and Documentation Project Report (\`.docx\` or \`.pdf\`).`,
    files: [
      {
        id: 'file-12-cs-1',
        assignment_id: 'assign-12-cs-106',
        file_name: 'Class12_CS_Project_Template.py',
        file_size: 45000,
        file_type: 'py',
        public_url: createDataUrl('Class12_CS_Project_Template.py', `# CBSE Class 12 Computer Science Project Template
# Student Name: _____________________ Roll No: __________
import mysql.connector

def connect_db():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="yourpassword",
            database="autumn_break_portal"
        )
        print("Connected to MySQL Database successfully!")
        return conn
    except Exception as e:
        print("Database Connection Error:", e)
        return None

if __name__ == "__main__":
    print("=== CBSE Autumn Break CS Project Initializer ===")
`),
      },
      {
        id: 'file-12-cs-2',
        assignment_id: 'assign-12-cs-106',
        file_name: 'Database_Schema_Dump.sql',
        file_size: 18000,
        file_type: 'sql',
        public_url: createDataUrl('Database_Schema_Dump.sql', `-- CBSE Class 12 Computer Science MySQL Dump
CREATE DATABASE IF NOT EXISTS autumn_school_db;
USE autumn_school_db;

CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`),
      }
    ]
  }
];
