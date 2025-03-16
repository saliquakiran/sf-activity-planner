# SF Weekend Planner - Backend

This directory contains all the essential backend files for the San Francisco Weekend Planner Expert System.

## What the System Does
The expert system will ask you questions about your preferences (indoor/outdoor, budget, vibe, distance, amenities) and recommend personalized places to visit in San Francisco for the weekend.

## Files

- **`expert_system.py`** - Main application script that runs the interactive expert system
- **`converter.py`** - Converts CSV data to Prolog knowledge base format
- **`kb.csv`** - Source data containing San Francisco places and their attributes
- **`sf_weekend_kb.pl`** - Generated Prolog knowledge base (created by converter.py)
- **`run_expert_system.sh`** - Shell script to launch the expert system

## Quick Start

### Option 1: Using the Launch Script (Recommended)
```bash
cd backend
bash run_expert_system.sh
```

### Option 2: Manual Steps
```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Run the expert system
python expert_system.py
```

### Convert Data (if needed)
If you need to regenerate the Prolog knowledge base from the CSV data:
```bash
cd backend
source venv/bin/activate
python converter.py
```

## Dependencies

- Python 3.13
- PySwip (Prolog interface)
- SWI-Prolog
- Virtual environment: `venv/` (included in this directory)
