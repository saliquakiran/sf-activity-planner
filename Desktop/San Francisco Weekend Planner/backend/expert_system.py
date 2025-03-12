#!/usr/bin/env python3
"""
SF Places Expert System - Standalone Version
This script provides an interactive expert system for recommending places to visit in San Francisco.
"""

# Import necessary libraries
from pyswip import Prolog, Variable, Functor, registerForeign
from pyswip.easy import Atom
import os
import re

# --- Configuration ---
# Define the path to the Prolog knowledge base file.
prolog_file_path = '/Users/saliquakiran/Desktop/San Francisco Weekend Planner/backend/sf_weekend_kb.pl'

# --- Global Variables ---
prolog = None
all_askable_values = {}

# --- Prompts and Display Options ---
prompts = {
    "location_type": "Do you prefer an indoor or outdoor location?",
    "budget": "What is your budget per person?",
    "vibe": "What kind of vibe are you looking for? (Select one or more, comma-separated numbers)",
    "distance": "How far are you willing to travel?",
    "food": "Do you want a place that has food available?",
    "plugs": "Do you need a place with plugs/outlets available?",
    "wifi": "Do you need a place with free Wifi available?",
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
        "short": "short (0-3 km)",
        "medium": "medium (3 - 5 km)",
        "high": "high (5+km)",
        "none": "No Preference"
    }
}

user_preferences_cache = {}

# --- Helper Functions ---

def get_numbered_choice(attribute, valid_options):
    """
    Displays numbered options for a given attribute and gets user input by number(s).
    """
    display_options_atoms = valid_options + ['none']
    num_options = len(display_options_atoms)

    print(f"\n{prompts.get(attribute, f'Select preference for {attribute}:')}")

    options_to_display = []
    if attribute in detailed_options_display:
        options_to_display = [detailed_options_display[attribute].get(atom, atom.replace('_', ' ').title()) for atom in display_options_atoms]
    else:
        for atom in display_options_atoms:
            if atom == 'none':
                options_to_display.append("No Preference")
            else:
                options_to_display.append(atom.replace('_', ' ').title())

    for i, option_text in enumerate(options_to_display):
        print(f"{i + 1}. {option_text}")

    while True:
        try:
            input_prompt = f"Enter choice number(s) (1-{num_options}, comma-separated for multiple): " if attribute == 'vibe' else f"Enter choice number (1-{num_options}): "
            response = input(input_prompt).strip()

            if attribute == 'vibe':
                selected_values = []
                numbers_str = response.split(',')
                valid_input_found = False

                for num_str in numbers_str:
                    num_str = num_str.strip()
                    if not num_str: continue

                    if not num_str.isdigit():
                         print("Invalid input. Please enter number(s) separated by commas.")
                         selected_values = []
                         valid_input_found = False
                         break

                    num = int(num_str)
                    if 1 <= num <= num_options:
                        valid_input_found = True
                        selected_option_atom = display_options_atoms[num - 1]
                        if selected_option_atom == 'none':
                             return 'none'
                        selected_values.append(selected_option_atom)
                    else:
                        print(f"Invalid number: {num}. Please enter numbers between 1 and {num_options}.")
                        selected_values = []
                        valid_input_found = False
                        break

                if valid_input_found and selected_values:
                    return ','.join(selected_values)
                elif valid_input_found and not selected_values:
                     print("Invalid selection combination.")
                     continue
                elif response and not valid_input_found:
                     continue
                elif not response:
                     return 'none'

            else:
                if not response:
                     return 'none'

                if not response.isdigit():
                    print("Invalid input. Please enter a single number.")
                    continue

                num = int(response)
                if 1 <= num <= num_options:
                    selected_value_atom = display_options_atoms[num - 1]
                    return selected_value_atom
                else:
                    print(f"Invalid number: {num}. Please enter a number between 1 and {num_options}.")
                    continue

        except ValueError:
            print("Invalid input. Please enter a number or comma-separated numbers.")
            continue
        except Exception as e:
            print(f"An unexpected error occurred during input: {e}")
            return 'none'

# --- Foreign Predicates ---

def read_py_foreign(Attribute_term, Result_var):
    """
    Prolog foreign predicate callback to ask the user for a preference.
    """
    attribute = str(Attribute_term)

    if attribute in user_preferences_cache:
        user_answer_py = user_preferences_cache[attribute]
    else:
        valid_options = all_askable_values.get(attribute, [])
        user_answer_py = get_numbered_choice(attribute, valid_options)
        user_preferences_cache[attribute] = user_answer_py

    Result_var.unify(Atom(user_answer_py))
    return True

# --- Main Recommendation Logic ---

def generate_recommendations():
    """
    Runs the main Prolog query to find recommendations based on user preferences.
    """
    recommendations = []
    try:
        global prolog
        if prolog:
            final_recommendations_result = list(prolog.query("findall(Place, recommendation(Place), Places)"))

            if final_recommendations_result and final_recommendations_result[0]['Places']:
                recommended_place_terms = final_recommendations_result[0]['Places']
                unique_recommendations = list(dict.fromkeys(recommended_place_terms))
                recommendations = unique_recommendations

                print("\n🎉 Perfect! Here are your personalized recommendations:")

                for place_term in recommendations:
                     try:
                         place_details_query = list(prolog.query(f"""
                            name({place_term}, Name),
                            description({place_term}, Desc),
                            address({place_term}, Address),
                            website({place_term}, Website),
                            friday_timings({place_term}, FriTimings),
                            saturday_timings({place_term}, SatTimings),
                            sunday_timings({place_term}, SunTimings).
                         """))

                         if place_details_query:
                             details = place_details_query[0]

                             place_name = str(details.get('Name', 'N/A'))
                             description = str(details.get('Desc', 'No description available.'))
                             address = str(details.get('Address', 'N/A'))
                             website = str(details.get('Website', 'N/A'))

                             fri_timings = str(details.get('FriTimings', 'N/A'))
                             sat_timings = str(details.get('SatTimings', 'N/A'))
                             sun_timings = str(details.get('SunTimings', 'N/A'))

                             print("\n" + "="*20)
                             print(f"Name: {place_name}")
                             print(f"Description: {description}")
                             print(f"Address: {address}")
                             print(f"Website: {website}")
                             print("Opening and closing times this weekend:")
                             print(f"Friday: {fri_timings}")
                             print(f"Saturday: {sat_timings}")
                             print(f"Sunday: {sun_timings}")
                             print("="*20 + "\n")

                         else:
                             name_query = list(prolog.query(f"name({place_term}, Name)"))
                             place_name = name_query[0]['Name'] if name_query else str(place_term)
                             print(f"\nCould not retrieve full details for {place_name} ({place_term}).")

                     except Exception as detail_error:
                         print(f"\nError retrieving details for {place_term}: {detail_error}")

            else:
                print("\n😔 No places match your criteria. Try adjusting your preferences!")

        else:
             print("Error: Prolog instance not initialized.")

    except Exception as e:
        print(f"\nAn unexpected error occurred during the recommendation query: {e}")
        print("Please check your Prolog KB or the Python foreign function.")

    return recommendations

def system_clock():
    """
    Asks the user if they want to run the expert system again.
    """
    try_again = input("\nDo you want to use the recommender again (y/n)? ").strip().lower()
    return try_again == "y"

def system_engine():
    """
    Main function to initialize and run the SF Place Recommender expert system.
    """
    print("Welcome to the San Francisco Weekend Activity Recommender!")
    print("This system will help you find the perfect place based on your preferences.")

    global prolog
    prolog = Prolog()

    try:
        registerForeign(read_py_foreign, arity=2)
        # Successfully registered - no need to tell user about technical details
    except Exception as e:
        print(f"Error registering foreign predicate: {e}")
        print("Please ensure foreign predicates are correctly defined in your KB and Python.")
        return

    while True:
        global user_preferences_cache
        user_preferences_cache = {}
        print("\nLet's find you the perfect place! I'll ask you a few questions about your preferences.")

        try:
            prolog.consult(prolog_file_path)
            # KB loaded successfully - no need to tell user about technical details

            global all_askable_values
            all_askable_values = {}
            try:
                askable_attrs_query = list(prolog.query("askable_attribute(A)"))
                for attr_result in askable_attrs_query:
                    attribute = str(attr_result['A'])
                    values_query = list(prolog.query(f"findall(V, askable_value({attribute}, V), ValidValues)"))
                    if values_query and values_query[0]['ValidValues']:
                        all_askable_values[attribute] = [str(v) for v in values_query[0]['ValidValues']]
            except Exception as fetch_error:
                 print(f"Error fetching askable values: {fetch_error}")

            try:
                prolog.retractall("known(_,_,_)")
                prolog.retractall("no_preference(_)")
                # Preferences cleared - no need to tell user about technical details
            except Exception as e:
                # Could not retract previous facts (likely first run) - this is normal
                pass

        except FileNotFoundError:
            print(f"Error: Prolog file not found at {prolog_file_path}.")
            print("Please check the 'prolog_file_path' variable and ensure the file exists.")
            break
        except Exception as e:
            print(f"An error occurred while consulting the KB: {e}")
            break

        generate_recommendations()

        if not system_clock():
            print("Thank you for using our service!")
            break

if __name__ == "__main__":
    system_engine()
