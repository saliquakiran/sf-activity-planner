import csv
import re
import os

# --- Configuration ---
# Adjust these paths if your files are located elsewhere
# IMPORTANT: Make sure your CSV file now has single columns for timings like
# "Friday Timings", "Saturday Timings", "Sunday Timings"
csv_file_path = '/Users/saliquakiran/Desktop/San Francisco Weekend Planner/backend/kb.csv' # Update if needed
output_file_path = '/Users/saliquakiran/Desktop/San Francisco Weekend Planner/backend/sf_weekend_kb.pl' # Update if needed
# --- End Configuration ---

def clean_str_single_quoted(s):
    """Clean a string for Prolog use, using single quotes."""
    if s is None: # Handle potential None values from .get()
        return "''"
    s = str(s) # Ensure it's a string
    # Escape single quotes by doubling them (' -> '')
    s = s.replace("'", "''")
    # Escape backslashes (\ -> \\) - Good practice if backslashes might appear in text
    s = s.replace('\\', '\\\\')
    # Wrap in single quotes
    return f"'{s}'"

def clean_atom(s):
    """Clean a string to be used as a Prolog atom (lowercase, alphanumeric + underscores)."""
    if s is None:
        return "''"
    s = str(s).strip().lower()
    # Replace any character not a-z, 0-9, or underscore with an underscore
    s = re.sub(r'[^a-z0-9_]', '_', s)
    # Remove leading/trailing underscores
    s = s.strip('_')
    # If the result is empty or starts with a number/underscore, prepend a safe prefix
    if not s or not s[0].isalpha():
         s = 'p_' + s if s else 'p_item' # Use 'p_item' for empty strings

    return s


def csv_to_prolog_kb_file(csv_path, output_path):
    """Convert CSV data to a Prolog knowledge base file."""
    places = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as f_csv:
            reader = csv.DictReader(f_csv)
            print(f"Reading data from {csv_path}...")
            row_count = 0
            for row in reader:
                row_count += 1
                original_name = row.get('Name', '').strip()
                # Skip rows with no name
                if not original_name:
                     print(f"Warning: Skipping row {row_count} due to missing Name.")
                     continue

                try:
                    # Generate place ID using cleaned name
                    place_id = clean_atom(original_name) # Use original_name for ID generation

                    # --- Diagnostic Print (Keep for conversion process) ---
                    # print(f"\nProcessing row {row_count}: Original Name='{original_name}', Generated ID='{place_id}'")
                    # --- End Diagnostic Print ---


                    # Parse location type - now can result in ['indoor'], ['outdoor'], or ['indoor', 'outdoor']
                    location_type_str = row.get('Outdoor/Indoor', '').strip().lower() # Use .get for safety and strip/lower
                    location_types = []
                    if "indoor" in location_type_str:
                        location_types.append("indoor")
                    if "outdoor" in location_type_str:
                        location_types.append("outdoor")
                    if not location_types: # Default if neither is specified
                         location_types = ["outdoor"]


                    # Parse budget
                    budget_str = row.get('Budget per person \n\nFree\nLow ($1-$20)\nHigh ($20+)', '').strip().lower()
                    if "free" in budget_str:
                        budget = "free"
                    elif "low" in budget_str:
                        budget = "low"
                    elif "high" in budget_str:
                        budget = "high"
                    else:
                        budget = "low" # Default budget if unclear

                    # Parse vibes - split by comma or slash, clean each, filter empty
                    vibes_str = row.get('What kind of vibe are you looking for?\n\nChill/ Sport / Study/ Social/ Romantic', '')
                    vibes = [clean_atom(v) for v in re.split(r'[,/]', vibes_str) if clean_atom(v)] # Split by , or /, clean each part

                    # Parse distance
                    distance_str = row.get('Distance from residence\n\nshort (0-3 km)\nmedium (3 - 5 km)\nhigh (5+km)', '').strip().lower()
                    if "short" in distance_str:
                        distance = "short"
                    elif "medium" in distance_str:
                        distance = "medium"
                    elif "high" in distance_str:
                        distance = "high"
                    else:
                        distance = "medium" # Default distance

                    # Parse yes/no attributes safely using .get()
                    food = "yes" if row.get('Food available? (Y/N)', '').strip().upper() == 'Y' else "no"
                    plugs = "yes" if row.get('Plugs/outlets available? (Y/N)', '').strip().upper() == 'Y' else "no"
                    wifi = "yes" if row.get('Free Wifi available?', '').strip().upper() == 'Y' else "no"
                    wheelchair = "yes" if row.get('Wheelchair accessible?', '').strip().upper() == 'Y' else "no"


                    # Parse ambience
                    ambience_str = row.get('Do you want a Quiet or crowded place?', '').strip()
                    ambience = "quiet" if "Quiet" in ambience_str else "crowded" # Assumes 'crowded' if not 'Quiet'

                    # Parse Single Timing Columns
                    # Use .get() with a default empty string to avoid KeyError
                    timings_fri = row.get('Friday Timings', '').strip()
                    timings_sat = row.get('Saturday Timings', '').strip()
                    timings_sun = row.get('Sunday Timings', '').strip()


                    # Create place dictionary
                    place = {
                        'id': place_id,
                        'name': original_name, # Keep original name for fact writing
                        'description': row.get('Description', ''),
                        'address': row.get('Address', ''),
                        'website': row.get('Website ', ''), # Note the space in the key
                        'location_types': location_types, # Store as list
                        'budget': budget,
                        'vibes': vibes,
                        'distance': distance,
                        'food': food,
                        'plugs': plugs,
                        'wifi': wifi,
                        'ambience': ambience,
                        'wheelchair': wheelchair,
                        'timings': { # Store timings in a nested dictionary
                            'friday': timings_fri,
                            'saturday': timings_sat,
                            'sunday': timings_sun
                        }
                    }
                    places.append(place)
                except KeyError as e:
                    print(f"Warning: Missing expected column header in row {row_count}: {e}. Please check CSV headers. Skipping row.")
                except Exception as e:
                    print(f"Warning: Error processing row {row_count}: {e}. Row data: {row}")


        print(f"\nFinished reading {len(places)} valid places from CSV.")
        print(f"Writing Prolog KB to {output_path}...")

        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"Created output directory: {output_dir}")
        elif not output_dir:
             print(f"Warning: Output path '{output_file_path}' does not specify a directory. Writing to current directory.")


        # Write Prolog KB File
        with open(output_path, 'w', encoding='utf-8') as outfile:
            # Write dynamic declarations for the interactive system
            outfile.write('% Dynamic declarations for known facts and no preferences\n')
            outfile.write(':- dynamic known/3.\n')
            outfile.write(':- dynamic no_preference/1.\n\n')

            # Write foreign declaration for the Python callback
            outfile.write('% Declare the foreign predicate that will call Python functions\n')
            outfile.write('% read_py_foreign/2 takes 2 arguments: Attribute (+), Result (-)\n')
            outfile.write('% This directive is only for PySwip, ignore if not available\n')
            outfile.write(':- catch(foreign(read_py_foreign(+, -)), error(existence_error(procedure, foreign/1), _), true).\n\n')


            # Write valid values for each attribute
            outfile.write('% Define valid values for each attribute\n')
            outfile.write('valid_location_type(indoor).\n')
            outfile.write('valid_location_type(outdoor).\n\n')

            outfile.write('valid_budget(free).\n')
            outfile.write('valid_budget(low).\n')
            outfile.write('valid_budget(high).\n\n')

            outfile.write('valid_distance(short).\n')
            outfile.write('valid_distance(medium).\n')
            outfile.write('valid_distance(high).\n\n')

            outfile.write('valid_ambience(quiet).\n')
            outfile.write('valid_ambience(crowded).\n\n')

            # Define the attributes we can ask about (for Python validation)
            outfile.write('% Define the attributes we can ask about\n')
            outfile.write('askable_attribute(location_type).\n')
            outfile.write('askable_attribute(budget).\n')
            outfile.write('askable_attribute(vibe).\n')
            outfile.write('askable_attribute(distance).\n')
            outfile.write('askable_attribute(food).\n')
            outfile.write('askable_attribute(plugs).\n')
            outfile.write('askable_attribute(wifi).\n')
            outfile.write('askable_attribute(ambience).\n')
            outfile.write('askable_attribute(wheelchair).\n\n')

            # Define valid values for askable attributes (for Python validation)
            outfile.write('% Define valid values for askable attributes (for Python validation)\n')
            outfile.write('askable_value(location_type, indoor).\n')
            outfile.write('askable_value(location_type, outdoor).\n')
            outfile.write('askable_value(budget, X) :- valid_budget(X).\n')
            # Dynamically add vibes found in the CSV as valid options
            all_vibes = sorted(list(set(vibe for place in places for vibe in place['vibes'])))
            for vibe in all_vibes:
                 outfile.write(f'askable_value(vibe, {vibe}).\n')
            outfile.write('askable_value(distance, X) :- valid_distance(X).\n')
            outfile.write('askable_value(food, X) :- member(X, [yes, no]).\n')
            outfile.write('askable_value(plugs, X) :- member(X, [yes, no]).\n')
            outfile.write('askable_value(wifi, X) :- member(X, [yes, no]).\n')
            outfile.write('askable_value(ambience, X) :- valid_ambience(X).\n')
            outfile.write('askable_value(wheelchair, X) :- member(X, [yes, no]).\n\n')


            # Write place facts - grouped by predicate to avoid warnings
            outfile.write('% Place facts - these define the properties of each place\n')
            
            # Group 1: place/1 facts
            outfile.write('% Place declarations\n')
            for place in places:
                outfile.write(f'place({place["id"]}). % {place["name"]}\n')
            outfile.write('\n')
            
            # Group 2: name/2 facts
            outfile.write('% Place names\n')
            for place in places:
                outfile.write(f'name({place["id"]}, {clean_str_single_quoted(place["name"])}).\n')
            outfile.write('\n')
            
            # Group 3: description/2 facts
            outfile.write('% Place descriptions\n')
            for place in places:
                outfile.write(f'description({place["id"]}, {clean_str_single_quoted(place["description"])}).\n')
            outfile.write('\n')
            
            # Group 4: address/2 facts
            outfile.write('% Place addresses\n')
            for place in places:
                outfile.write(f'address({place["id"]}, {clean_str_single_quoted(place["address"])}).\n')
            outfile.write('\n')
            
            # Group 5: website/2 facts
            outfile.write('% Place websites\n')
            for place in places:
                outfile.write(f'website({place["id"]}, {clean_str_single_quoted(place["website"])}).\n')
            outfile.write('\n')
            
            # Group 6: location_type/2 facts
            outfile.write('% Location types (indoor/outdoor)\n')
            for place in places:
                if place["location_types"]:
                    for loc_type in place["location_types"]:
                         outfile.write(f'location_type({place["id"]}, {loc_type}).\n')
                else:
                     outfile.write(f'% No location types specified for {place["id"]}\n')
            outfile.write('\n')
            
            # Group 7: budget/2 facts
            outfile.write('% Budget information\n')
            for place in places:
                outfile.write(f'budget({place["id"]}, {place["budget"]}).\n')
            outfile.write('\n')
            
            # Group 8: vibe/2 facts
            outfile.write('% Vibe information\n')
            for place in places:
                if place["vibes"]:
                    for vibe in place["vibes"]:
                        outfile.write(f'vibe({place["id"]}, {vibe}).\n')
                else:
                     outfile.write(f'% No vibes specified for {place["id"]}\n')
            outfile.write('\n')
            
            # Group 9: distance/2 facts
            outfile.write('% Distance information\n')
            for place in places:
                outfile.write(f'distance({place["id"]}, {place["distance"]}).\n')
            outfile.write('\n')
            
            # Group 10: food/2 facts
            outfile.write('% Food availability\n')
            for place in places:
                outfile.write(f'food({place["id"]}, {place["food"]}).\n')
            outfile.write('\n')
            
            # Group 11: plugs/2 facts
            outfile.write('% Plugs/outlets availability\n')
            for place in places:
                outfile.write(f'plugs({place["id"]}, {place["plugs"]}).\n')
            outfile.write('\n')
            
            # Group 12: wifi/2 facts
            outfile.write('% WiFi availability\n')
            for place in places:
                outfile.write(f'wifi({place["id"]}, {place["wifi"]}).\n')
            outfile.write('\n')
            
            # Group 13: ambience/2 facts
            outfile.write('% Ambience information\n')
            for place in places:
                outfile.write(f'ambience({place["id"]}, {place["ambience"]}).\n')
            outfile.write('\n')
            
            # Group 14: wheelchair/2 facts
            outfile.write('% Wheelchair accessibility\n')
            for place in places:
                outfile.write(f'wheelchair({place["id"]}, {place["wheelchair"]}).\n')
            outfile.write('\n')
            
            # Group 15: Friday timings
            outfile.write('% Friday timings\n')
            for place in places:
                outfile.write(f'friday_timings({place["id"]}, {clean_str_single_quoted(place["timings"]["friday"])}).\n')
            outfile.write('\n')
            
            # Group 16: Saturday timings
            outfile.write('% Saturday timings\n')
            for place in places:
                outfile.write(f'saturday_timings({place["id"]}, {clean_str_single_quoted(place["timings"]["saturday"])}).\n')
            outfile.write('\n')
            
            # Group 17: Sunday timings
            outfile.write('% Sunday timings\n')
            for place in places:
                outfile.write(f'sunday_timings({place["id"]}, {clean_str_single_quoted(place["timings"]["sunday"])}).\n')
            outfile.write('\n')


            # Write the expert system rules compatible with the registerForeign strategy
            # Using a raw string (r'''...''') helps with backslashes like in \+
            outfile.write(r'''
% --- Expert System Logic for RegisterForeign Interaction ---

% Predicate to get user preference for an Attribute.
% It first checks if the preference is known, otherwise calls the foreign predicate.
% get_preference(Attribute, UserPreference)
% UserPreference will be unified with an atom (like 'indoor', 'none', 'yes')
% OR a comma-separated string atom (like 'chill,social') for multi-select attributes like 'vibe'.
get_preference(Attribute, UserPreference) :-
    % 1. Check if preference is already known
    known(yes, Attribute, UserPreference_Known), !, UserPreference = UserPreference_Known. % If yes, succeed and unify UserPreference
get_preference(Attribute, none) :-
    % 2. Check if user explicitly stated no preference
    no_preference(Attribute), !. % If no preference, succeed and unify UserPreference with 'none'
get_preference(Attribute, UserPreference) :-
    % 3. If preference is not known, call the Python foreign function to ask
    % The Python function read_py_foreign(Attribute, AnswerTerm) will:
    %    - Ask the user about Attribute (handling numbered/multi-select input)
    %    - Unify its second argument (AnswerTerm) with the user's answer atom ('indoor', 'none', etc.)
    %      or a comma-separated string atom ('chill,social') for multi-select.
    %    - It will *not* assert facts itself.
    read_py_foreign(Attribute, AnswerTerm), % Call Python, get answer as a term (atom)
    % 4. Assert the fact based on the answer received from Python
    % This assertion happens *after* the foreign call returns, in Prolog.
    ( AnswerTerm == none ->
        assertz(no_preference(Attribute)),
        UserPreference = none % Unify with 'none' if user chose none
    ; % Else (it's a preference value like 'indoor', 'chill', 'yes', or a comma-separated string 'chill,social')
        assertz(known(yes, Attribute, AnswerTerm)),
        UserPreference = AnswerTerm % Unify with the actual answer (atom or comma-separated string atom)
    ).

% --- Recommendation Rules ---

% Main recommendation rule
recommendation(Place) :-
    place(Place), % This must succeed for the checks to be evaluated
    % Call predicates to check each attribute based on user preference
    check_location_type(Place),
    check_budget(Place),
    check_vibe(Place), % Special handling for vibe
    check_distance(Place),
    check_plugs(Place),      % Plugs/Wifi checks handle location type internally now
    check_wifi(Place),
    check_food(Place),
    check_ambience(Place),
    check_wheelchair(Place).


% Helper predicates to check if a place matches the user's preference for an attribute
% These predicates call get_preference/2 to obtain the user's preference interactively.

check_location_type(Place) :-
    get_preference(location_type, UserPref), % Get user preference for location_type (atom 'indoor', 'outdoor', or 'none')
    ( UserPref == none -> true % If no preference, this check passes
    ; location_type(Place, UserPref) % If preference, place must match that single type
    ).

check_budget(Place) :-
    get_preference(budget, UserPref), % Get user preference for budget (atom 'free', 'low', 'high', or 'none')
    ( UserPref == none -> true
    ; budget(Place, UserPref)
    ).

% Special check for vibe to handle a comma-separated string of preferences
check_vibe(Place) :-
    get_preference(vibe, UserVibe), % Get user preference for vibe (atom 'none' or a comma-separated string 'chill,social')
    ( UserVibe == none -> true % If no preference, this check passes
    ; atom(UserVibe) -> % Ensure it's an atom (the comma-separated string)
        split_comma_string(UserVibe, DesiredVibes), % Split the string into a list of atoms
        % Check if there exists at least one Vibe in DesiredVibes such that vibe(Place, Vibe) is true
        ( member(Vibe, DesiredVibes), vibe(Place, Vibe) -> true ; fail ) % This inner check succeeds once if any match
    ; % Fallback for unexpected term type
      fail
    ).

% Helper predicate to check if a place has at least one vibe from a list of desired vibes
% This predicate is called by check_vibe after splitting the comma-separated string.
place_has_any_vibe_in_list(Place, DesiredVibes) :-
    member(Vibe, DesiredVibes), % Get each desired vibe from the list
    vibe(Place, Vibe).          % Check if the place has that vibe fact
    % This will backtrack through the DesiredVibes list until a match is found, or fail if no match.

% Helper predicate to split a comma-separated string into a list of atoms
% Requires SWI-Prolog's split_string/4 and maplist/2
split_comma_string(String, ListOfAtoms) :-
    atom(String), % Ensure input is an atom
    atom_string(String, StringRep), % Convert atom to string representation
    split_string(StringRep, ",", "", StringList), % Split by comma, no padding
    maplist(atom_string, ListOfAtoms, StringList). % Convert each string in list to atom


check_distance(Place) :-
    get_preference(distance, UserPref), % Get user preference for distance (atom 'short', 'medium', 'high', or 'none')
    ( UserPref == none -> true
    ; distance(Place, UserPref)
    ).

% Plugs/Wifi checks need to handle outdoor locations and user preference
check_plugs(Place) :-
     location_type(Place, outdoor) -> true % Outdoor places always pass plugs check (no plugs needed)
    ; get_preference(plugs, UserPref), (UserPref == none -> true ; plugs(Place, yes)). % Indoor/both need plugs if user wants them (UserPref is 'yes' or 'no')

% MODIFIED: Wifi question is always asked regardless of location type
check_wifi(Place) :-
     get_preference(wifi, UserPref), % Always call get_preference to ask the user about wifi
     (UserPref == none -> true % If user has no preference, this check passes
     ; wifi(Place, yes) -> UserPref == yes % If place has wifi, user must want wifi ('yes')
     ; wifi(Place, no) -> UserPref == no   % If place has no wifi, user must want no wifi ('no')
     ).


check_food(Place) :-
    get_preference(food, UserPref), % Get user preference for food (atom 'yes', 'no', or 'none')
    ( UserPref == none -> true
    ; food(Place, yes) -> UserPref == yes % Place has food, user must want food ('yes')
    ; food(Place, no) -> UserPref == no   % Place has no food, user must want no food ('no')
    ).

check_ambience(Place) :-
    get_preference(ambience, UserPref), % Get user preference for ambience (atom 'quiet', 'crowded', or 'none')
    ( UserPref == none -> true
    ; ambience(Place, UserPref)
    ).

check_wheelchair(Place) :-
    get_preference(wheelchair, UserPref), % Get user preference for wheelchair (atom 'yes', 'no', or 'none')
    ( UserPref == none -> true
    ; wheelchair(Place, yes) -> UserPref == yes % Place is accessible, user must want accessible ('yes')
    ; wheelchair(Place, no) -> UserPref == no   % Place not accessible, user must want not accessible ('no')
    ).
''') # End of raw string block for Prolog rules


        print(f"\nSuccessfully generated Prolog KB at '{output_path}'")

    except FileNotFoundError:
        print(f"Error: CSV file not found at '{csv_path}'")
    except Exception as e:
        print(f"Error converting CSV to Prolog KB: {e}")
        raise # Re-raise the exception for debugging


if __name__ == "__main__":
    # Ensure the output directory exists
    output_dir = os.path.dirname(output_file_path)
    if output_dir: # Check if dirname returned something (it wouldn't for just a filename)
        os.makedirs(output_dir, exist_ok=True)
        print(f"Ensured output directory exists: {output_dir}")
    else:
         print(f"Warning: Output path '{output_file_path}' does not specify a directory. Writing to current directory.")

    csv_to_prolog_kb_file(csv_file_path, output_file_path)
    print("Prolog knowledge base file generation complete!")
