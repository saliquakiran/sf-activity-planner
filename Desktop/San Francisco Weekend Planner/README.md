# San Francisco Weekend Planner

A modern web application that helps you discover the perfect places to visit in San Francisco based on your preferences. Built with React frontend and Python/Prolog expert system backend.

## 🌟 Features

- **Interactive Preference Questionnaire**: Answer questions about your preferences for location type, budget, vibe, distance, amenities, and more
- **Expert System Backend**: Uses Prolog knowledge base to intelligently match your preferences with available places
- **Modern React UI**: Beautiful, responsive interface built with Material-UI
- **Detailed Recommendations**: Get comprehensive information including addresses, websites, and weekend hours
- **Real-time Results**: Instant recommendations based on your input

## 🏗️ Architecture

### Backend
- **Python Flask API**: RESTful API wrapper around the expert system
- **Prolog Knowledge Base**: Expert system rules and place data
- **PySwip**: Python-Prolog interface

### Frontend
- **React**: Modern JavaScript framework
- **Material-UI**: Beautiful, accessible UI components
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Make sure you're in the project root directory
chmod +x start_app.sh
./start_app.sh
```

This will:
- Start the Flask backend on http://localhost:5001
- Start the React frontend on http://localhost:3000
- Automatically open your browser

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

#### Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure

```
San Francisco Weekend Planner/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── expert_system.py       # Original CLI expert system
│   ├── converter.py           # CSV to Prolog converter
│   ├── kb.csv                 # Source data
│   ├── sf_weekend_kb.pl       # Generated Prolog knowledge base
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.js    # Landing page
│   │   │   ├── PreferenceForm.js  # Questionnaire
│   │   │   └── Recommendations.js # Results display
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   └── package.json           # Node dependencies
├── start_app.sh               # Startup script
└── README.md                  # This file
```

## 🔧 API Endpoints

The Flask backend provides these endpoints:

- `GET /api/health` - Health check
- `GET /api/attributes` - Get available attributes and options
- `POST /api/recommendations` - Get recommendations based on preferences
- `GET /api/places` - Get all available places

## 🎯 How It Works

1. **User Input**: Answer questions about your preferences through an interactive form
2. **Expert System**: Python backend uses Prolog rules to match your preferences with places
3. **Recommendations**: Get personalized suggestions with detailed information
4. **Results**: View recommendations with addresses, websites, hours, and amenities

## 🛠️ Development

### Adding New Places
1. Update `backend/kb.csv` with new place data
2. Run `python backend/converter.py` to regenerate the Prolog knowledge base
3. Restart the backend server

### Modifying Preferences
Edit the preference options in:
- `backend/app.py` (API prompts and options)
- `frontend/src/components/PreferenceForm.js` (UI form)

### Styling
The app uses Material-UI theming. Customize the theme in `frontend/src/App.js`.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🔍 Troubleshooting

### Backend Issues
- Ensure Python virtual environment is activated
- Check that SWI-Prolog is installed
- Verify the knowledge base file exists at `backend/sf_weekend_kb.pl`

### Frontend Issues
- Make sure Node.js and npm are installed
- Clear browser cache if you see stale content
- Check browser console for JavaScript errors

### Connection Issues
- Ensure backend is running on port 5001
- Check that CORS is enabled (should be automatic)
- Verify no firewall is blocking the connection

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Happy Weekend Planning! 🌉**
