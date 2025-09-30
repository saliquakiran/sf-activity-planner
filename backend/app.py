#!/usr/bin/env python3
"""
SF Weekend Planner - Flask API Wrapper
This Flask application provides a REST API interface for the expert system.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import json
from pyswip import Prolog, Variable, Functor, registerForeign
from pyswip.easy import Atom

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
# Use relative path for deployment compatibility
PROLOG_FILE_PATH = os.path.join(os.path.dirname(__file__), 'sf_weekend_kb.pl')

# Global variables
prolog = None
all_askable_values = {}
user_preferences_cache = {}

# Prompts for the API
prompts = {
    "location_type": "Do you prefer an indoor or outdoor location?",
    "budget": "What is your budget per person?",
    "vibe": "What kind of vibe are you looking for?",
    "distance": "How far are you willing to travel?",
    "food": "Do you want a place that has food available?",
    "plugs": "Do you need a place with plugs/outlets available?",
    "wifi": "Do you need a place with free WiFi available?",
    "ambience": "Do you prefer a quiet or crowded ambience?",
    "wheelchair": "Do you need the place to be wheelchair accessible?",
}

detailed_options_display = {
    "budget": {
        "free": "Free",
        "low": "Low ($1-$20)",
        "high": "High ($20+)",
        "none": "No Preference"
    },
    "distance": {
        "short": "Short (0-3 km)",
        "medium": "Medium (3-5 km)",
        "high": "High (5+ km)",
        "none": "No Preference"
    }
}

def initialize_prolog():
    """Initialize Prolog and load the knowledge base."""
    global prolog, all_askable_values
    
    try:
        print(f"Attempting to initialize Prolog...")
        print(f"Prolog file path: {PROLOG_FILE_PATH}")
        print(f"File exists: {os.path.exists(PROLOG_FILE_PATH)}")
        
        prolog = Prolog()
        print("✓ Prolog instance created")
        
        # Register the foreign predicate for API mode
        registerForeign(read_py_foreign_api, arity=2, name="read_py_foreign")
        print("✓ Foreign predicate registered")
        
        # Load the knowledge base
        prolog.consult(PROLOG_FILE_PATH)
        print("✓ Knowledge base loaded")
        
        # Load askable values
        all_askable_values = {}
        askable_attrs_query = list(prolog.query("askable_attribute(A)"))
        for attr_result in askable_attrs_query:
            attribute = str(attr_result['A'])
            values_query = list(prolog.query(f"findall(V, askable_value({attribute}, V), ValidValues)"))
            if values_query and values_query[0]['ValidValues']:
                all_askable_values[attribute] = [str(v) for v in values_query[0]['ValidValues']]
        
        print(f"✓ Loaded {len(all_askable_values)} askable attributes")
        return True
    except Exception as e:
        print(f"❌ Error initializing Prolog: {e}")
        import traceback
        traceback.print_exc()
        return False

def read_py_foreign_api(Attribute_term, Result_var):
    """API version of the foreign predicate - uses cached preferences."""
    try:
        attribute = str(Attribute_term)
        
        if attribute in user_preferences_cache:
            user_answer_py = user_preferences_cache[attribute]
        else:
            # Default to 'none' if not provided
            user_answer_py = 'none'
        
        Result_var.unify(Atom(user_answer_py))
        return True
    except Exception as e:
        print(f"Error in read_py_foreign_api: {e}")
        Result_var.unify(Atom('none'))
        return True

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "SF Weekend Planner API is running"})

@app.route('/api/attributes', methods=['GET'])
def get_attributes():
    """Get all available attributes and their valid values."""
    return jsonify({
        "attributes": all_askable_values,
        "prompts": prompts,
        "detailed_options": detailed_options_display
    })

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get recommendations based on user preferences."""
    try:
        global user_preferences_cache, prolog
        
        # Clear previous preferences
        user_preferences_cache = {}
        
        # Get preferences from request
        preferences = request.get_json()
        if not preferences:
            return jsonify({"error": "No preferences provided"}), 400
        
        print(f"Received preferences: {preferences}")
        
        # Store preferences in cache
        for attr, value in preferences.items():
            if attr in all_askable_values:
                user_preferences_cache[attr] = value
                print(f"Stored preference: {attr} = {value}")
        
        # Clear previous facts
        prolog.retractall("known(_,_,_)")
        prolog.retractall("no_preference(_)")
        
        # Get recommendations
        recommendations = []
        final_recommendations_result = list(prolog.query("findall(Place, recommendation(Place), Places)"))
        
        if final_recommendations_result and final_recommendations_result[0]['Places']:
            recommended_place_terms = final_recommendations_result[0]['Places']
            unique_recommendations = list(dict.fromkeys(recommended_place_terms))
            
            # Get detailed information for each recommendation
            for place_term in unique_recommendations:
                try:
                    place_details_query = list(prolog.query(f"""
                        name({place_term}, Name),
                        description({place_term}, Desc),
                        address({place_term}, Address),
                        website({place_term}, Website),
                        friday_timings({place_term}, FriTimings),
                        saturday_timings({place_term}, SatTimings),
                        sunday_timings({place_term}, SunTimings),
                        food({place_term}, Food),
                        wifi({place_term}, Wifi),
                        plugs({place_term}, Plugs),
                        wheelchair({place_term}, Wheelchair).
                    """))
                    
                    if place_details_query:
                        details = place_details_query[0]
                        
                        place_info = {
                            "id": str(place_term),
                            "name": str(details.get('Name', 'N/A')),
                            "description": str(details.get('Desc', 'No description available.')),
                            "address": str(details.get('Address', 'N/A')),
                            "website": str(details.get('Website', 'N/A')),
                            "timings": {
                                "friday": str(details.get('FriTimings', 'N/A')),
                                "saturday": str(details.get('SatTimings', 'N/A')),
                                "sunday": str(details.get('SunTimings', 'N/A'))
                            },
                            "amenities": {
                                "food": str(details.get('Food', 'no')),
                                "wifi": str(details.get('Wifi', 'no')),
                                "plugs": str(details.get('Plugs', 'no')),
                                "wheelchair": str(details.get('Wheelchair', 'no'))
                            }
                        }
                        recommendations.append(place_info)
                    
                except Exception as detail_error:
                    print(f"Error retrieving details for {place_term}: {detail_error}")
                    # Add basic info even if details fail
                    recommendations.append({
                        "id": str(place_term),
                        "name": str(place_term),
                        "description": "Details unavailable",
                        "address": "N/A",
                        "website": "N/A",
                        "timings": {
                            "friday": "N/A",
                            "saturday": "N/A",
                            "sunday": "N/A"
                        },
                        "amenities": {
                            "food": "no",
                            "wifi": "no",
                            "plugs": "no",
                            "wheelchair": "no"
                        }
                    })
        
        return jsonify({
            "recommendations": recommendations,
            "count": len(recommendations),
            "preferences_used": user_preferences_cache
        })
        
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/places', methods=['GET'])
def get_all_places():
    """Get all available places in the knowledge base."""
    try:
        places = []
        places_query = list(prolog.query("place(Place), name(Place, Name)"))
        
        for place_result in places_query:
            place_id = str(place_result['Place'])
            place_name = str(place_result['Name'])
            
            # Get additional details
            try:
                details_query = list(prolog.query(f"""
                    description({place_id}, Desc),
                    address({place_id}, Address),
                    website({place_id}, Website)
                """))
                
                if details_query:
                    details = details_query[0]
                    place_info = {
                        "id": place_id,
                        "name": place_name,
                        "description": str(details.get('Desc', 'No description')),
                        "address": str(details.get('Address', 'N/A')),
                        "website": str(details.get('Website', 'N/A'))
                    }
                    places.append(place_info)
                else:
                    places.append({
                        "id": place_id,
                        "name": place_name,
                        "description": "No description",
                        "address": "N/A",
                        "website": "N/A"
                    })
            except:
                places.append({
                    "id": place_id,
                    "name": place_name,
                    "description": "No description",
                    "address": "N/A",
                    "website": "N/A"
                })
        
        return jsonify({"places": places, "count": len(places)})
        
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Initialize Prolog when module is imported (for production with gunicorn)
print("Initializing SF Weekend Planner API...")
if not initialize_prolog():
    print("❌ Failed to initialize Prolog. Please check your knowledge base file.")
    sys.exit(1)
print("✅ Prolog initialized successfully")

if __name__ == '__main__':
    print("🚀 Starting Flask API server...")
    print("📱 Frontend will be available at http://localhost:3000")
    print("🔗 API will be available at http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
