# 002-research
# Systems for generating and transforming point clouds
![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Overview:**
This project presents a set of lightweight, human-in-the-loop systems for generating point clouds as the foundational “DNA” of shapes and CAD models. 
By treating points as fundamental geometric units, the project emphasizes transparent, creativity-driven methods that avoid dependencies on commercial tools and reduce computational overhead. 
The aim is to make point-cloud creation simple, accessible, and practical for applications in CAD modeling, geometric prototyping, and reverse engineering.

**Key Objectives:**
- Make point-cloud creation **simple, accessible, and practical**
- Enable applications in CAD modeling, geometric prototyping, and reverse engineering
- Minimize dependency on black-box algorithms and commercial software
- Emphasize human creativity and control in the geometric design process

This ongoing research is conducted by:

**[Angkush Kumar Ghosh](https://ghosh-ak.github.io/site)**  
Assistant Professor  
Division of Mechanical and Electrical Engineering  
Kitami Institute of Technology, Japan

---

## 🗂️ Project Structure

```text
002-research/
├── index.html                                   # Main landing page with system overview
├── example-cases.html                           # Gallery showcasing example use cases
│
├── system-A1.html                               # Interactive Point Cloud Generator (Irregular Profiles - Algorithm 1)
├── system-A2.html                               # Interactive Point Cloud Generator (Irregular Profiles - Algorithm 2)
├── system-B.html                                # Interactive Point Cloud Generator (Geometric Elements)
├── system-C.html                                # Point Cloud Visualizer and Transformer
├── system-D.html                                # Point Cloud Cleaner and Sequencer
├── system-E.html                                # Point Cloud Formatter (CSV Plotter & Editor)
│
├── js-css/                                      # JavaScript libraries, stylesheets, and scripts
│   ├── d3.v6.min.js                             # D3.js library for visualizations
│   ├── plotly-2.24.1.min.js                     # Plotly.js for interactive plotting
│   ├── jexcel.js                                # jSpreadsheet library for spreadsheet functionality
│   ├── jsuites.js                               # jSuites library (dependency for jSpreadsheet)
│   ├── jexcel.css                               # Stylesheet for jSpreadsheet
│   ├── jsuites.css                              # Stylesheet for jSuites
│   ├── example-cases.css                        # Styles for example cases gallery
│   ├── script-system-A1.js                      # Logic for System A1
│   ├── script-system-A2.js                      # Logic for System A2
│   ├── script-system-B.js                       # Logic for System B
│   ├── script-system-C.js                       # Logic for System C
│   ├── script-system-E.js                       # Logic for System E
│   ├── script-example-cases.js                  # Logic for example cases slider
│   ├── sample.csv                               # Sample CSV file for testing
│   └── system-D.gif                             # Animation demonstrating System D
│
├── system-D-code/                               # Python code for System D
│   ├── code.py                                  # Python script for point cloud cleaning/sequencing
│   └── requirements.txt                         # Python dependencies
│
├── documents/                                   # Documentation and templates
│   ├── ipcm layer-related/                      # IPCM Layer documentation
│   │   ├── system-a1-guide.pdf                  # User guide for System A1
│   │   └── system-a2-guide.pdf                  # User guide for System A2
│   │   └── system-b-guide.pdf                   # User guide for System B
│   │   └── system-c-guide.pdf                   # User guide for System C
│   │   └── system-d-guide.pdf                   # User guide for System D
│   │   └── system-e-guide.pdf                   # User guide for System E
│   └── rendering layer-related/                 # Rendering Layer documentation
│       ├── OpenSCAD_template_documentation.pdf  # OpenSCAD template guide
│       └── openscad_template.scad               # OpenSCAD template file
│
├── example-case-images/                         # Images for example cases
│
├── functions/                                   # Additional utility functions
│   └── OpenSCAD/                                # OpenSCAD-related utilities
│       ├── OpenSCAD_template_documentation.pdf  # OpenSCAD template guide
│       └── openscad_template.scad               # OpenSCAD template file
│
├── LICENSE                                      # MIT License file
└── README.md                                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

1. **Web Browser**: Modern browser (Chrome, Firefox, Edge, Safari) with JavaScript enabled
2. **Python 3.x** (only for System D backend)
3. **OpenSCAD** (optional, for 3D rendering of generated point clouds)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/commons-repo/002-research.git 
   cd 002-research
   ```

2. **Open the main interface:**

   - Simply open `index.html` in your web browser
   - All systems (A1, A2, B, C, E) are **browser-based** and require no installation

3. **For System D (Python backend):**

   ```bash
   cd system-D-code
   pip install -r requirements.txt
   python code.py
   ```

---

## 🛠️ System Descriptions

### **System A1: Interactive Point Cloud Generator (Irregular Profiles - Algorithm 1)**

- **Purpose:** Generate point clouds from hand-drawn irregular profiles using Algorithm 1 (Bézier–Bernstein polynomial-based algorithm)
- **Input:** User-drawn strokes on canvas
- **Output:** CSV file with (X, Y) coordinates
- **Documentation:** [system-a1-guide.pdf](documents/ipcm%20layer-related/system-a1-guide.pdf)

### **System A2: Interactive Point Cloud Generator (Irregular Profiles - Algorithm 2)**

- **Purpose:** Generate point clouds from hand-drawn irregular profiles using Algorithm 2 (Spline (D3.js)-based algorithm)
- **Input:** User-drawn strokes on canvas
- **Output:** CSV file with (X, Y) coordinates
- **Documentation:** [system-a2-guide.pdf](documents/ipcm%20layer-related/system-a2-guide.pdf)

### **System B: Interactive Point Cloud Generator (Geometric Elements)**

- **Purpose:** Generate point clouds for standard geometric primitives
- **Input:** Interactive parameter controls for geometric shapes
- **Supported Shapes:**
  - Circle
  - Arc
  - Major Arc
  - Ellipse
  - Free Form (Arbitrary Points Selection)
- **Output:**
  -  CSV file with (X, Y) coordinates 
  - `points.csv` - Generated points data
  - `center.csv` - Center coordinates (for circle, arc, ellipse)
- **Documentation:** [system-b-guide.pdf](documents/ipcm%20layer-related/system-b-guide.pdf)

### **System C: Point Cloud Visualizer and Transformer**

- **Purpose:** Visualize, transform, and export point clouds
- **Input:** CSV file with (X, Y) coordinates
- **Features:**
  - Interactive Plotly.js visualization (scatter, line, line+markers)
  - Geometric transformations: translation, mirroring, rotation, scaling, and sampling
- **Ouput:**
  - Transformed points
  - CSV file with (X, Y) coordinates
- **Documentation:** [system-c-guide.pdf](documents/ipcm%20layer-related/system-c-guide.pdf)

### **System D: Point Cloud Cleaner and Sequencer**

- **Purpose:** Clean, filter, and order point clouds using Python
- **Input:** CSV file with (X, Y) coordinates
- **Features:**
  - Remove duplicate points
  - Filter outliers using statistical methods
  - Sequence points for efficient rendering
- **Technology:** Python (NumPy, Pandas, SciPy, Matplotlib)
- **Ouput:**
  - Transformed points
  - CSV file with (X, Y) coordinates
- **Documentation:** [system-d-guide.pdf](documents/ipcm%20layer-related/system-d-guide.pdf)

### **System E: Point Cloud Formatter (CSV Plotter & Editor)**

- **Purpose:** Load, edit, visualize, and format CSV data
- **Input:** CSV file upload or paste raw data
- **Features:**
  - **Dual Input:** File upload or text paste
  - **Interactive Plotting:** Scatter, line, line+markers (Plotly.js)  - 
  - **Output Formatting:** Format points to CADQuery- and OpenSCAD-style points array/list
  - **Spreadsheet Editor:** 4-sheet jSpreadsheet with 3000 rows × 26 columns (Additional rows and columns can be created if needed)
  - **Search Functionality:** Find data across sheets
  - **Formula Support:** SUM, AVERAGE, MIN, MAX, COUNT, IF, VLOOKUP, CONCAT, etc.
  - **Import/Export:** CSV per sheet
- **Documentation:** [system-e-guide.pdf](documents/ipcm%20layer-related/system-e-guide.pdf)

---

## 📚 Documentation

Comprehensive documentation is available in the `documents/` folder:

### IPCM Layer Documentation

- **System A1 Guide:** Step-by-step instructions on how to use System A1
- **System A2 Guide:** Step-by-step instructions on how to use System A2
- **System B Guide:** Step-by-step instructions on how to use System B
- **System C Guide:** Step-by-step instructions on how to use System C
- **System D Guide:** Step-by-step instructions on how to use System D
- **System E Guide:** Step-by-step instructions on how to use System E

### Rendering Layer Documentation

- **OpenSCAD Template Guide:** Introduction of the developed utility functions
- **OpenSCAD Template File:** Ready-to-use template for the developed functions

**Access Documentation:** Click the "Documentation" link on `index.html` or browse the `documents/` folder directly.

---

## 🔧 Technical Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Visualization** | D3.js v6, Plotly.js v2.24.1 |
| **Spreadsheet** | jSpreadsheet v4, jSuites |
| **Backend (System D)** | Python 3.x |
| **Python Libraries** | NumPy, Pandas, SciPy, Matplotlib |
| **3D Rendering** | OpenSCAD (external tool) |
| **Data Format** | CSV (Comma-Separated Values) |

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please contact via email, if needed as well.

---

## 📧 Contact

**Angkush Kumar Ghosh**  
Assistant Professor  
Division of Mechanical and Electrical Engineering  
Kitami Institute of Technology, Japan

- **Personal Website:** [https://ghosh-ak.github.io/site](https://ghosh-ak.github.io/site)
- **Email:** [Contact via website](https://ghosh-ak.github.io/site)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Last Updated:** November 19, 2025

