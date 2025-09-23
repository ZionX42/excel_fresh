# ExcelVision 📊

> **AI-Powered Spreadsheet Generation Platform**

Transform natural language descriptions into professional Excel spreadsheets in seconds. ExcelVision combines the power of modern AI with intuitive web interfaces to revolutionize how spreadsheets are created.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.0.0-blue.svg)
![FastAPI](https://img.shields.io/badge/fastapi-0.110.1-green.svg)

## ✨ Features

### 🚀 **Core Functionality**
- **Natural Language Processing**: Describe your spreadsheet needs in plain English
- **AI-Powered Generation**: Currently stub implementation, AI integration coming next
- **Multiple Provider Support**: Choose from OpenAI, Anthropic Claude, or Google Gemini
- **Instant Downloads**: Generate and download Excel files immediately
- **Real-time Processing**: Fast generation with progress indicators

### 🔐 **Authentication & Security**
- **Multi-Authentication**: Email/password, Google OAuth, Microsoft OAuth
- **JWT Token Management**: Secure session handling
- **User Session Persistence**: Seamless experience across visits
- **Protected API Endpoints**: Secure backend architecture

### 📈 **Data Management**
- **Generation History**: Track all your created spreadsheets
- **File Metadata**: Size, creation date, and provider information
- **MongoDB Integration**: Scalable data storage solution
- **RESTful API**: Clean, documented endpoints

### 🎨 **User Experience**
- **Modern Dark Theme**: Beautiful, professional interface
- **Responsive Design**: Works perfectly on all devices
- **Intuitive Navigation**: Clean, user-friendly layout
- **Real-time Feedback**: Toast notifications and loading states

## 🛠️ Technology Stack

### **Frontend**
- **React 19**: Latest React with modern hooks and features
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: High-quality, accessible component library
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **Sonner**: Beautiful toast notifications
- **Lucide React**: Comprehensive icon library

### **Backend**
- **FastAPI**: Modern, fast Python web framework
- **MongoDB**: NoSQL database with Motor async driver
- **Pydantic**: Data validation and serialization
- **JWT Authentication**: Secure token-based authentication
- **OAuth Integration**: Google and Microsoft authentication
- **OpenPyXL**: Excel file generation and manipulation

### **Infrastructure & Tools**
- **CORS Middleware**: Cross-origin resource sharing
- **Environment Configuration**: Secure configuration management
- **Docker Ready**: Containerization support via Emergent
- **TypeScript Support**: Type-safe development
- **ESLint & Prettier**: Code quality and formatting

## 📁 Project Structure

```
excel_fresh/
├── app/
│   ├── frontend/              # React application
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── App.js         # Main application component
│   │   │   └── App.css        # Global styles
│   │   ├── public/            # Static assets
│   │   └── package.json       # Frontend dependencies
│   │
│   ├── backend/               # FastAPI server
│   │   ├── server.py          # Main server application
│   │   ├── requirements.txt   # Python dependencies
│   │   └── .env               # Environment variables
│   │
│   ├── tests/                 # Test suites
│   ├── emergent.yml           # Deployment configuration
│   └── README.md              # App-specific documentation
│
├── README.md                  # This file
└── package-lock.json          # Root dependency lock
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (≥16.0.0)
- **Python** (≥3.9)
- **MongoDB** (local or cloud instance)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/ZionX42/excel_fresh.git
cd excel_fresh
```

### 2. Backend Setup

```bash
cd app/backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URL and other settings
```

**Environment Variables (.env)**:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=excelvision_db
CORS_ORIGINS=*
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_TENANT_ID=common
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install Node.js dependencies
npm install
# or
yarn install

# Configure environment variables
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env.local
```

### 4. Start the Development Servers

**Terminal 1 - Backend:**
```bash
cd app/backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd app/frontend
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📊 Generated Excel File Examples

### Generated Excel File Structure

When you describe "Create a cashflow forecast model with monthly revenue, costs and profit summary", ExcelVision generates a professional multi-sheet Excel file:

#### 📋 **README Sheet**
```
ExcelVision Generated Spreadsheet
Description: Create a cashflow forecast model with monthly revenue, costs and profit summary
Generated At: 2025-01-15T14:30:25.123456+00:00
Provider: Auto (OpenAI)

This spreadsheet contains:
• Monthly financial data with formulas
• Summary KPIs and calculations  
• Transaction details for analysis
• Visual charts for data insights
```

#### 📈 **Financial_Model Sheet**
| Month | Revenue | Costs   | Profit  |
|-------|---------|---------|---------|
| Jan   | $18,000 | $12,000 | $6,000  |
| Feb   | $19,000 | $12,600 | $6,400  |
| Mar   | $20,000 | $13,200 | $6,800  |
| ...   | ...     | ...     | =B-C    |

*Features auto-filters, currency formatting, and growth formulas*

#### 📊 **Summary_Dashboard Sheet**  
```
📊 Executive Dashboard

Key Performance Indicators:
Total Revenue:     $282,000
Total Costs:       $184,800  
Total Profit:      $97,200
Profit Margin:     34.5%

Growth Analysis:
Monthly Growth Rate: 8.3%
```

#### 📝 **Transactions Sheet**
| Date       | Category  | Amount  | Description              | Reference |
|------------|-----------|---------|--------------------------|-----------|
| 2025-01-07 | Sales     | $1,100  | Transaction 1 - Sales    | TXN-0001  |
| 2025-01-14 | Marketing | $1,200  | Transaction 2 - Marketing| TXN-0002  |
| ...        | ...       | ...     | ...                      | ...       |

*Includes 50+ sample transactions with auto-filters and categorization*

### File Specifications
- **Format**: `.xlsx` (Excel 2007+)
- **Size**: Typically 20-50 KB depending on data volume
- **Compatibility**: Works with Excel, Google Sheets, LibreOffice
- **Features**: Formulas, formatting, filters, charts

## 🔧 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | User login with email/password |
| GET | `/api/auth/google/login` | Initiate Google OAuth flow |
| GET | `/api/auth/microsoft/login` | Initiate Microsoft OAuth flow |

### Generation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate Excel spreadsheet |
| GET | `/api/generations` | List user's generation history |
| GET | `/api/status` | Get system status |

### Example Generation Request

```json
{
  "description": "Create a sales dashboard with monthly trends, top 10 products, and ROI calculator",
  "provider": "auto"
}
```

## 🎨 User Interface Screenshots

### Main Dashboard
![ExcelVision Dashboard](https://github.com/user-attachments/assets/73c0f527-b5c8-47f6-846f-737249431c7f)

**Features shown:**
- **Clean, modern interface** with dark theme and rose accent colors
- **Central text area** for describing spreadsheet requirements in natural language
- **Provider selection dropdown** (OpenAI, Anthropic, Google Gemini)
- **One-click generation button** with download icon
- **Feature cards** highlighting instant models, provider choice, and export capabilities
- **Recent generations section** showing generation history with metadata

### Authentication Page  
![ExcelVision Authentication](https://github.com/user-attachments/assets/0af9e4cd-5a25-4a9c-93b9-f06b41045009)

**Features shown:**
- **Split-screen design** with abstract visual background
- **Multiple authentication options**: Email/password, Google OAuth, Microsoft OAuth  
- **Secure password handling** with visibility toggle
- **Clean form design** with proper input styling and validation
- **Seamless registration flow** with toggle between sign-in and sign-up modes

## 🚀 Deployment

### Using Docker (Recommended)

The project includes Emergent configuration for easy deployment:

```bash
# Build and deploy using Emergent
emergent deploy
```

### Manual Deployment

**Frontend (Static Build):**
```bash
cd app/frontend
npm run build
# Deploy build/ directory to your static hosting service
```

**Backend (Production Server):**
```bash
cd app/backend
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Environment Configuration

For production, ensure these environment variables are properly set:

- `MONGO_URL`: Production MongoDB connection string
- `JWT_SECRET`: Strong, unique secret key
- `CORS_ORIGINS`: Specific allowed origins (not *)
- OAuth credentials for Google/Microsoft authentication

## 🧪 Development Workflow

### Running Tests

```bash
# Backend tests
cd app/backend
pytest

# Frontend tests
cd app/frontend
npm test
```

### Code Quality

```bash
# Python linting
flake8 app/backend/
black app/backend/

# JavaScript linting
cd app/frontend
npm run lint
```

### Adding New Features

1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Implement Changes**: Follow existing code patterns
3. **Add Tests**: Ensure good test coverage
4. **Update Documentation**: Keep README and comments current
5. **Submit Pull Request**: Include detailed description

## 🔮 Roadmap

### Phase 1: AI Integration (Next)
- [ ] OpenAI API integration for intelligent spreadsheet generation
- [ ] Claude API integration for advanced text processing
- [ ] Gemini API integration for multimodal capabilities
- [ ] Dynamic template selection based on description analysis

### Phase 2: Enhanced Features
- [ ] Template library and customization options
- [ ] Advanced chart and visualization generation
- [ ] Collaborative editing capabilities
- [ ] Export to multiple formats (PDF, CSV, Google Sheets)

### Phase 3: Enterprise Features
- [ ] Team management and sharing
- [ ] Advanced authentication (SAML, LDAP)
- [ ] API rate limiting and usage analytics
- [ ] Custom branding and white-label options

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- **Bug Reports**: Submit detailed bug reports with reproduction steps
- **Feature Requests**: Suggest new features and improvements
- **Code Contributions**: Submit pull requests for bug fixes or features
- **Documentation**: Help improve documentation and examples
- **Testing**: Write tests and help with quality assurance

### Development Guidelines
- Follow existing code style and patterns
- Write clear, descriptive commit messages
- Include tests for new functionality
- Update documentation for any changes
- Be respectful and constructive in discussions

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team & Support

### Maintainers
- **ZionX42** - Project Creator and Lead Developer

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/ZionX42/excel_fresh/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ZionX42/excel_fresh/discussions)
- **Email**: Contact through GitHub profile

### Acknowledgments
- Built with [FastAPI](https://fastapi.tiangolo.com/) and [React](https://reactjs.org/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Deployed with [Emergent](https://emergent.sh/)

---

**Built with ❤️ for the future of spreadsheet creation**

*Star ⭐ this repository if you find it useful!*