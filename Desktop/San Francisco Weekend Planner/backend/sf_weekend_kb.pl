% Dynamic declarations for known facts and no preferences
:- dynamic known/3.
:- dynamic no_preference/1.

% Declare the foreign predicate that will call Python functions
% read_py_foreign/2 takes 2 arguments: Attribute (+), Result (-)
% This directive is only for PySwip, ignore if not available
:- catch(foreign(read_py_foreign(+, -)), error(existence_error(procedure, foreign/1), _), true).

% Define valid values for each attribute
valid_location_type(indoor).
valid_location_type(outdoor).

valid_budget(free).
valid_budget(low).
valid_budget(high).

valid_distance(short).
valid_distance(medium).
valid_distance(high).

valid_ambience(quiet).
valid_ambience(crowded).

% Define the attributes we can ask about
askable_attribute(location_type).
askable_attribute(budget).
askable_attribute(vibe).
askable_attribute(distance).
askable_attribute(food).
askable_attribute(plugs).
askable_attribute(wifi).
askable_attribute(ambience).
askable_attribute(wheelchair).

% Define valid values for askable attributes (for Python validation)
askable_value(location_type, indoor).
askable_value(location_type, outdoor).
askable_value(budget, X) :- valid_budget(X).
askable_value(vibe, chill).
askable_value(vibe, romantic).
askable_value(vibe, social).
askable_value(vibe, sport).
askable_value(vibe, study).
askable_value(distance, X) :- valid_distance(X).
askable_value(food, X) :- member(X, [yes, no]).
askable_value(plugs, X) :- member(X, [yes, no]).
askable_value(wifi, X) :- member(X, [yes, no]).
askable_value(ambience, X) :- valid_ambience(X).
askable_value(wheelchair, X) :- member(X, [yes, no]).

% Place facts - these define the properties of each place
% Place declarations
place(cherry_blossom_festival). % Cherry Blossom Festival
place(earth_day_festival). % Earth Day Festival
place(sf_art_fair). % SF Art Fair
place(sunset_dunes_park). % Sunset Dunes Park
place(candlelight_concert). % Candlelight Concert
place(fat_ham_at_sf_playhouse). % Fat Ham at SF Playhouse
place(emotionair_installations). % EmotionAir Installations
place(bay_area_brew_festival). % Bay Area Brew Festival
place(chess_night_game). % Chess Night Game
place(japanese_tea_garden_visit). % Japanese Tea Garden Visit
place(dolores_park). % Dolores Park
place(downtown_first_thursdays). % Downtown First Thursdays
place(balloon_museum). % Balloon Museum
place(asian_art_museum). % Asian Art Museum
place(queen_wilhelmina_tulip_garden). % Queen Wilhelmina Tulip Garden
place(painted_ladies). % Painted Ladies
place(fishermans_wharf). % Fishermans wharf
place(golden_gate_park). % Golden Gate Park
place(ina_coolbrith_park). % Ina Coolbrith Park
place(san_francisco_botanical_garden). % San Francisco Botanical Garden
place(strawberry_hill). % Strawberry Hill
place(pioneer_park). % Pioneer Park
place(andytown_salesforce). % AndyTown Salesforce
place(sff_mission_bay). % SFF Mission Bay
place(benchmark_climbing). % Benchmark Climbing
place(ymca). % YMCA
place(the_crossing). % The Crossing
place(lands_end). % Lands End
place(china_camp_state_park). % China Camp State Park
place(joe___the_juice). % Joe & the Juice
place(peets_coffee). % Peets Coffee
place(blue_bottle). % Blue Bottle
place(motoring_coffee). % Motoring coffee
place(cafe_reveille). % Cafe Reveille
place(him_mark_lai_branch_library). % Him Mark Lai Branch Library
place(mission_bay_branch_library). % Mission Bay Branch Library
place(sf_public_library). % SF Public Library
place(potrero_branch_library). % Potrero Branch Library
place(golden_gate_valley_branch_library). % Golden Gate Valley Branch Library

% Place names
name(cherry_blossom_festival, 'Cherry Blossom Festival').
name(earth_day_festival, 'Earth Day Festival').
name(sf_art_fair, 'SF Art Fair').
name(sunset_dunes_park, 'Sunset Dunes Park').
name(candlelight_concert, 'Candlelight Concert').
name(fat_ham_at_sf_playhouse, 'Fat Ham at SF Playhouse').
name(emotionair_installations, 'EmotionAir Installations').
name(bay_area_brew_festival, 'Bay Area Brew Festival').
name(chess_night_game, 'Chess Night Game').
name(japanese_tea_garden_visit, 'Japanese Tea Garden Visit').
name(dolores_park, 'Dolores Park').
name(downtown_first_thursdays, 'Downtown First Thursdays').
name(balloon_museum, 'Balloon Museum').
name(asian_art_museum, 'Asian Art Museum').
name(queen_wilhelmina_tulip_garden, 'Queen Wilhelmina Tulip Garden').
name(painted_ladies, 'Painted Ladies').
name(fishermans_wharf, 'Fishermans wharf').
name(golden_gate_park, 'Golden Gate Park').
name(ina_coolbrith_park, 'Ina Coolbrith Park').
name(san_francisco_botanical_garden, 'San Francisco Botanical Garden').
name(strawberry_hill, 'Strawberry Hill').
name(pioneer_park, 'Pioneer Park').
name(andytown_salesforce, 'AndyTown Salesforce').
name(sff_mission_bay, 'SFF Mission Bay').
name(benchmark_climbing, 'Benchmark Climbing').
name(ymca, 'YMCA').
name(the_crossing, 'The Crossing').
name(lands_end, 'Lands End').
name(china_camp_state_park, 'China Camp State Park').
name(joe___the_juice, 'Joe & the Juice').
name(peets_coffee, 'Peets Coffee').
name(blue_bottle, 'Blue Bottle').
name(motoring_coffee, 'Motoring coffee').
name(cafe_reveille, 'Cafe Reveille').
name(him_mark_lai_branch_library, 'Him Mark Lai Branch Library').
name(mission_bay_branch_library, 'Mission Bay Branch Library').
name(sf_public_library, 'SF Public Library').
name(potrero_branch_library, 'Potrero Branch Library').
name(golden_gate_valley_branch_library, 'Golden Gate Valley Branch Library').

% Place descriptions
description(cherry_blossom_festival, 'Traditional Japanese Performances, food stalls, and cultural exhibitions.').
description(earth_day_festival, 'Earth Day celebration with live music, eco-friendly vendors, educational workshops.').
description(sf_art_fair, 'Contemporary and Modern artworks from over 70 galleries.').
description(sunset_dunes_park, 'Oceanfront Park with scenic coastal views, nature trails and golden sand dunes.').
description(candlelight_concert, 'Classical Music in candlelight settings and historic venue.').
description(fat_ham_at_sf_playhouse, 'James Ijames'' Pulitzer Prize-winning play: a modern, queer Southern reimagining of Shakespeare''s Hamlet, set at a family barbecue. ').
description(emotionair_installations, 'Inflatable Installations, blending art with emotion in a sensory experience.').
description(bay_area_brew_festival, 'Featuring over 50 beweries, beers, food trucks and DJs.').
description(chess_night_game, 'Play chess with strangers and socialize.').
description(japanese_tea_garden_visit, 'Serene garden with traditional Japanese architecture, koi ponds, bonsai trees, and a tea house.').
description(dolores_park, 'Vibrant park known for its stunning views of downtown SF.').
description(downtown_first_thursdays, 'A monthly art and culture night where museums, galleries, and local businesses in downtown areas open late with free or discounted admission, special exhibits, and live performances.').
description(balloon_museum, 'The museum of inflatable art with 60 artists from around the globe.').
description(asian_art_museum, 'One of the largest museums in the Western world devoted exclusively to Asian art.').
description(queen_wilhelmina_tulip_garden, 'A peaceful spot in Golden Gate Park with beautiful tulips and great views of a windmill.').
description(painted_ladies, 'The Painted Ladies are a famous row of colorful old houses in San Francisco with a great view of the city skyline behind them.').
description(fishermans_wharf, 'Fisherman’s Wharf is a fun waterfront area in San Francisco with seafood, shops, street performers, and views of the bay.').
description(golden_gate_park, 'The largest park in San Francisco with gardens, museums, trails, and plenty of space to relax or explore.').
description(ina_coolbrith_park, 'A small and quiet park on a hill with views of San Francisco and a peaceful place to sit or take photos.').
description(san_francisco_botanical_garden, 'Garden located in Golden Gate Park with variety of plants and trees, perfect for a relaxing walk.').
description(strawberry_hill, 'Small hill in Stow Lake with easy trails and great views of the park.').
description(pioneer_park, 'Quiet park with nice walking paths and great views of San Francisco, located near Coit Tower.').
description(andytown_salesforce, 'Cozy cafe known for its delicious drinks, and a relaxed atmosphere, perfect for a quick stop or a chill hangout').
description(sff_mission_bay, 'You can play soccer here, solo or with your friends. There are 2 grounds available. You need to pre-register to play here through the website. Refreshment available outside the grounds.').
description(benchmark_climbing, 'An idoor climbing gym. First time is free if you go with an existing member (free beer too).').
description(ymca, 'This facility has mulitple offerings like a gym, swimming pool, badminton court, basketball court, etc. You need to be a member but you can visit for free with an existing member.').
description(the_crossing, 'You can play paddle here, solo or with your friends. There are 2 courts available. You need to pre-register to play here through the website. Refreshment available outside the courts.').
description(lands_end, 'A very scenic hike on the west end of San Francisco. There''s a beach too so dont forget to pack your swimming suits!!!').
description(china_camp_state_park, 'This state park allows visitors to camp. They provide a fire pit and toilets. You''ll be surrounded by nature and lot''s of peace. Don''t forget to take your camping gear and food. Firewood is available at site.').
description(joe___the_juice, 'With modern interiors, ambient music, and ample seating, it’s a great place for casual studying or light laptop work.').
description(peets_coffee, 'With modern interiors, ambient music, and ample seating, it’s a great place for casual studying or light laptop work.').
description(blue_bottle, 'Known for its minimalist decor and artisanal brews, this cafe offers a quiet, aesthetically pleasing space. Great for studying or just hanging out with friends. ').
description(motoring_coffee, 'Known for its minimalist decor and artisanal brews, this cafe a quiet, aesthetically pleasing space. Great for studying or just hanging out with friends. ').
description(cafe_reveille, 'Known for its minimalist decor and artisanal brews, this cafe offers a quiet, aesthetically pleasing space. Great for studying or just hanging out with friends. ').
description(him_mark_lai_branch_library, 'Public library offering materials to read, plus Wi-Fi and computers.').
description(mission_bay_branch_library, 'This branch features an in-library use laptop program and multiple study rooms. One of the 29 branches of the San Francisco Public Library. Local branches have Internet access with varying policies.').
description(sf_public_library, 'This beautiful, impressive modern structure opened in 1996 and contains seven stories of books and exhibits.').
description(potrero_branch_library, 'Potrero Branch Library was the 22nd branch established in the San Francisco Public Library system and has a history that dates back to the 1890s.').
description(golden_gate_valley_branch_library, '').

% Place addresses
address(cherry_blossom_festival, '1610 Geary Blvd').
address(earth_day_festival, '750 Howard St.').
address(sf_art_fair, '2 Marina Blvd Landmark Building C, Suite 260').
address(sunset_dunes_park, 'Great Hwy & Noriega St.').
address(candlelight_concert, '4705 3rd St.').
address(fat_ham_at_sf_playhouse, '450 Post St.').
address(emotionair_installations, '3601 Lyon St').
address(bay_area_brew_festival, '105 Montgomery St.').
address(chess_night_game, '2131 Lombard Street').
address(japanese_tea_garden_visit, '75 Hagiwara Tea Garden Drive').
address(dolores_park, '19th street').
address(downtown_first_thursdays, 'Between Market & Howard').
address(balloon_museum, 'Palace of Fine Arts').
address(asian_art_museum, 'Larkin Street').
address(queen_wilhelmina_tulip_garden, '1690 John F Kennedy Dr, SF').
address(painted_ladies, 'San Francisco, CA 94117').
address(fishermans_wharf, 'Beach street').
address(golden_gate_park, '501 Stanyan St, San Francisco').
address(ina_coolbrith_park, 'Vallejo & Taylor, Vallejo Street').
address(san_francisco_botanical_garden, '9th Avenue').
address(strawberry_hill, 'Golden Gate Park').
address(pioneer_park, 'Telegram Hill Boulevard').
address(andytown_salesforce, 'Rooftop, Park Level, 181 Fremont St, San Francisco, CA 94105').
address(sff_mission_bay, '701 Mission Bay Boulevard North, San Francisco, CA 94158').
address(benchmark_climbing, '1414 Van Ness Ave, San Francisco, CA 94109').
address(ymca, '169 Steuart St, San Francisco, CA 94105').
address(the_crossing, '250 Main St, San Francisco, CA 94105').
address(lands_end, '680 Point Lobos Ave, San Francisco, CA 94121').
address(china_camp_state_park, '101 Peacock Gap Trail, San Rafael, CA 94901').
address(joe___the_juice, '235 Montgomery St.').
address(peets_coffee, '773 Market street').
address(blue_bottle, '705 Market Street').
address(motoring_coffee, '1525 Union street').
address(cafe_reveille, '1998 Polk street').
address(him_mark_lai_branch_library, '1135 Powell street').
address(mission_bay_branch_library, '960 4th street').
address(sf_public_library, '100 Larkin Street').
address(potrero_branch_library, '1616 20th Street').
address(golden_gate_valley_branch_library, '1801 Green Street').

% Place websites
website(cherry_blossom_festival, 'https://sfcherryblossom.org/').
website(earth_day_festival, 'https://yerbabuenagardens.org/events/2025earthday/').
website(sf_art_fair, 'https://sanfranciscoartfair.com/').
website(sunset_dunes_park, 'https://sfrecpark.org/1555/Sunset-Dunes').
website(candlelight_concert, 'https://www.san-francisco-theater.com/shows/bayview-opera-house/candlelight-rings-dragons').
website(fat_ham_at_sf_playhouse, 'https://www.sfplayhouse.org/sfph/2024-2025-season/fat-ham/?gad_source=1&gclid=Cj0KCQjwqv2_BhC0ARIsAFb5Ac_PZL3wgtD6MKEBr5RZrIHPc5j5p7ErY3qlyWIQ4m4-KwIfcF-M-zoaAuOiEALw_wcB').
website(emotionair_installations, 'https://tickets.balloonmuseum.world/emotion-air-san-francisco/?gad_source=1&gclid=Cj0KCQjwqv2_BhC0ARIsAFb5Ac8GVm8JeJQtqndnk1Xynk8Uce4j3ij6di9ZrCZO1vd8-p8veVG_M5EaAk2aEALw_wcB').
website(bay_area_brew_festival, 'https://www.bayareabrewfestival.com/').
website(chess_night_game, 'https://www.instagram.com/silicon_valley_chess_community?igsh=NTc4MTIwNjQ2YQ== ').
website(japanese_tea_garden_visit, 'https://gggp.org/japanese-tea-garden/?gad_source=1&gad_campaignid=21017713825&gclid=Cj0KCQjwqv2_BhC0ARIsAFb5Ac-Eh3nR-L57seTH6H2SMpxTf71qTdLXxLEWIq_fQquu9sGRzOaf1CYaAl5fEALw_wcB').
website(dolores_park, 'https://sfrecpark.org/facilities/facility/details/Mission-Dolores-Park-188').
website(downtown_first_thursdays, 'https://www.dftsf.com/').
website(balloon_museum, 'https://tickets.balloonmuseum.world/emotion-air-san-francisco/').
website(asian_art_museum, 'https://asianart.org/?gad_source=1&gad_campaignid=21002195167&gclid=Cj0KCQjwqv2_BhC0ARIsAFb5Ac9JjXW2mpFTOjkJRc7lv_iL_1c0v5G2F2ThPgxyWKOT8Zqk7aieWxIaAoZREALw_wcB').
website(queen_wilhelmina_tulip_garden, 'https://sfrecpark.org/908/Golden-Gate-Park---Queen-Wilhelmina-Gard').
website(painted_ladies, 'https://www.sftravel.com/things-to-do/attractions/iconic-sf/painted-ladies').
website(fishermans_wharf, 'https://www.fishermanswharf.org/').
website(golden_gate_park, 'https://sfrecpark.org/770/Golden-Gate-Park').
website(ina_coolbrith_park, 'https://sanfranciscoparksalliance.org/explore-parks/ina-coolbrith-park/').
website(san_francisco_botanical_garden, 'https://gggp.org/san-francisco-botanical-garden/').
website(strawberry_hill, 'https://en.wikipedia.org/wiki/Strawberry_Hill_(San_Francisco)').
website(pioneer_park, 'https://maps.app.goo.gl/VVk6ime2wVdmyF7fA?g_st=com.google.maps.preview.copy ').
website(andytown_salesforce, 'https://www.andytownsf.com/locations?srsltid=AfmBOopalwo_B552eDfWKsWu5wFWE6ITzZCe0bDOoqDBrAcTrXyEr2PG').
website(sff_mission_bay, 'https://www.sffsoccer.com/').
website(benchmark_climbing, 'https://www.benchmarkclimbing.com/').
website(ymca, 'https://www.ymcasf.org/location/embarcadero-ymca/').
website(the_crossing, 'https://www.eastcutcrossing.com/').
website(lands_end, 'https://www.nps.gov/goga/planyourvisit/landsend.htm').
website(china_camp_state_park, 'https://friendsofchinacamp.org/').
website(joe___the_juice, 'https://www.joejuice.com/').
website(peets_coffee, 'https://www.peets.com/pages/store-locator?stockist-query=San%20Francisco,%20CA,%20USA&selected=773%20Market%20St.').
website(blue_bottle, 'https://bluebottlecoffee.com/us/eng').
website(motoring_coffee, 'https://www.motoring.coffee/').
website(cafe_reveille, 'https://www.cafereveille.com/').
website(him_mark_lai_branch_library, 'https://sfpl.org/locations/chinatown').
website(mission_bay_branch_library, 'https://sfpl.org/locations/mission-bay').
website(sf_public_library, 'https://sfpl.org/locations/main-library').
website(potrero_branch_library, 'https://sfpl.org/locations/potrero').
website(golden_gate_valley_branch_library, 'https://sfpl.org/locations/golden-gate-valley').

% Location types (indoor/outdoor)
location_type(cherry_blossom_festival, outdoor).
location_type(earth_day_festival, outdoor).
location_type(sf_art_fair, indoor).
location_type(sunset_dunes_park, outdoor).
location_type(candlelight_concert, indoor).
location_type(fat_ham_at_sf_playhouse, indoor).
location_type(emotionair_installations, indoor).
location_type(bay_area_brew_festival, outdoor).
location_type(chess_night_game, outdoor).
location_type(japanese_tea_garden_visit, outdoor).
location_type(dolores_park, outdoor).
location_type(downtown_first_thursdays, outdoor).
location_type(balloon_museum, indoor).
location_type(asian_art_museum, indoor).
location_type(queen_wilhelmina_tulip_garden, outdoor).
location_type(painted_ladies, outdoor).
location_type(fishermans_wharf, outdoor).
location_type(golden_gate_park, outdoor).
location_type(ina_coolbrith_park, outdoor).
location_type(san_francisco_botanical_garden, outdoor).
location_type(strawberry_hill, outdoor).
location_type(pioneer_park, outdoor).
location_type(andytown_salesforce, indoor).
location_type(sff_mission_bay, outdoor).
location_type(benchmark_climbing, indoor).
location_type(ymca, indoor).
location_type(the_crossing, outdoor).
location_type(lands_end, outdoor).
location_type(china_camp_state_park, outdoor).
location_type(joe___the_juice, indoor).
location_type(peets_coffee, indoor).
location_type(blue_bottle, indoor).
location_type(motoring_coffee, indoor).
location_type(cafe_reveille, indoor).
location_type(him_mark_lai_branch_library, indoor).
location_type(mission_bay_branch_library, indoor).
location_type(sf_public_library, indoor).
location_type(potrero_branch_library, indoor).
location_type(golden_gate_valley_branch_library, indoor).

% Budget information
budget(cherry_blossom_festival, free).
budget(earth_day_festival, free).
budget(sf_art_fair, free).
budget(sunset_dunes_park, free).
budget(candlelight_concert, high).
budget(fat_ham_at_sf_playhouse, low).
budget(emotionair_installations, high).
budget(bay_area_brew_festival, high).
budget(chess_night_game, free).
budget(japanese_tea_garden_visit, low).
budget(dolores_park, free).
budget(downtown_first_thursdays, low).
budget(balloon_museum, low).
budget(asian_art_museum, low).
budget(queen_wilhelmina_tulip_garden, free).
budget(painted_ladies, free).
budget(fishermans_wharf, low).
budget(golden_gate_park, free).
budget(ina_coolbrith_park, free).
budget(san_francisco_botanical_garden, low).
budget(strawberry_hill, free).
budget(pioneer_park, free).
budget(andytown_salesforce, low).
budget(sff_mission_bay, free).
budget(benchmark_climbing, high).
budget(ymca, high).
budget(the_crossing, high).
budget(lands_end, free).
budget(china_camp_state_park, high).
budget(joe___the_juice, low).
budget(peets_coffee, low).
budget(blue_bottle, low).
budget(motoring_coffee, low).
budget(cafe_reveille, low).
budget(him_mark_lai_branch_library, free).
budget(mission_bay_branch_library, free).
budget(sf_public_library, free).
budget(potrero_branch_library, free).
budget(golden_gate_valley_branch_library, free).

% Vibe information
vibe(cherry_blossom_festival, chill).
vibe(cherry_blossom_festival, social).
vibe(cherry_blossom_festival, romantic).
vibe(earth_day_festival, chill).
vibe(earth_day_festival, social).
vibe(earth_day_festival, romantic).
vibe(sf_art_fair, chill).
vibe(sf_art_fair, social).
vibe(sf_art_fair, romantic).
vibe(sunset_dunes_park, chill).
vibe(sunset_dunes_park, social).
vibe(sunset_dunes_park, romantic).
vibe(candlelight_concert, romantic).
vibe(fat_ham_at_sf_playhouse, chill).
vibe(fat_ham_at_sf_playhouse, social).
vibe(fat_ham_at_sf_playhouse, romantic).
vibe(emotionair_installations, social).
vibe(emotionair_installations, romantic).
vibe(bay_area_brew_festival, social).
vibe(bay_area_brew_festival, chill).
vibe(chess_night_game, social).
vibe(chess_night_game, chill).
vibe(japanese_tea_garden_visit, romantic).
vibe(japanese_tea_garden_visit, chill).
vibe(dolores_park, romantic).
vibe(dolores_park, chill).
vibe(dolores_park, social).
vibe(downtown_first_thursdays, social).
vibe(downtown_first_thursdays, chill).
vibe(balloon_museum, social).
vibe(balloon_museum, chill).
vibe(asian_art_museum, social).
vibe(asian_art_museum, chill).
vibe(queen_wilhelmina_tulip_garden, chill).
vibe(painted_ladies, chill).
vibe(painted_ladies, social).
vibe(painted_ladies, romantic).
vibe(fishermans_wharf, chill).
vibe(fishermans_wharf, social).
vibe(fishermans_wharf, romantic).
vibe(golden_gate_park, chill).
vibe(golden_gate_park, social).
vibe(golden_gate_park, romantic).
vibe(golden_gate_park, sport).
vibe(ina_coolbrith_park, chill).
vibe(ina_coolbrith_park, social).
vibe(ina_coolbrith_park, romantic).
vibe(san_francisco_botanical_garden, chill).
vibe(san_francisco_botanical_garden, social).
vibe(san_francisco_botanical_garden, romantic).
vibe(strawberry_hill, chill).
vibe(strawberry_hill, sport).
vibe(strawberry_hill, social).
vibe(strawberry_hill, romantic).
vibe(pioneer_park, chill).
vibe(pioneer_park, social).
vibe(pioneer_park, romantic).
vibe(andytown_salesforce, study).
vibe(andytown_salesforce, chill).
vibe(andytown_salesforce, social).
vibe(sff_mission_bay, sport).
vibe(sff_mission_bay, social).
vibe(benchmark_climbing, sport).
vibe(benchmark_climbing, social).
vibe(ymca, sport).
vibe(the_crossing, sport).
vibe(the_crossing, social).
vibe(lands_end, sport).
vibe(lands_end, social).
vibe(china_camp_state_park, chill).
vibe(china_camp_state_park, sport).
vibe(china_camp_state_park, social).
vibe(china_camp_state_park, romantic).
vibe(joe___the_juice, chill).
vibe(joe___the_juice, study).
vibe(joe___the_juice, social).
vibe(peets_coffee, chill).
vibe(peets_coffee, study).
vibe(peets_coffee, social).
vibe(blue_bottle, chill).
vibe(blue_bottle, study).
vibe(blue_bottle, social).
vibe(motoring_coffee, chill).
vibe(motoring_coffee, study).
vibe(motoring_coffee, social).
vibe(cafe_reveille, chill).
vibe(cafe_reveille, study).
vibe(cafe_reveille, social).
vibe(him_mark_lai_branch_library, study).
vibe(mission_bay_branch_library, study).
vibe(sf_public_library, study).
vibe(potrero_branch_library, study).
vibe(golden_gate_valley_branch_library, study).

% Distance information
distance(cherry_blossom_festival, high).
distance(earth_day_festival, short).
distance(sf_art_fair, short).
distance(sunset_dunes_park, high).
distance(candlelight_concert, medium).
distance(fat_ham_at_sf_playhouse, short).
distance(emotionair_installations, medium).
distance(bay_area_brew_festival, short).
distance(chess_night_game, medium).
distance(japanese_tea_garden_visit, medium).
distance(dolores_park, short).
distance(downtown_first_thursdays, short).
distance(balloon_museum, medium).
distance(asian_art_museum, short).
distance(queen_wilhelmina_tulip_garden, high).
distance(painted_ladies, medium).
distance(fishermans_wharf, medium).
distance(golden_gate_park, medium).
distance(ina_coolbrith_park, short).
distance(san_francisco_botanical_garden, high).
distance(strawberry_hill, high).
distance(pioneer_park, short).
distance(andytown_salesforce, short).
distance(sff_mission_bay, short).
distance(benchmark_climbing, short).
distance(ymca, short).
distance(the_crossing, short).
distance(lands_end, medium).
distance(china_camp_state_park, high).
distance(joe___the_juice, short).
distance(peets_coffee, short).
distance(blue_bottle, short).
distance(motoring_coffee, short).
distance(cafe_reveille, short).
distance(him_mark_lai_branch_library, short).
distance(mission_bay_branch_library, short).
distance(sf_public_library, short).
distance(potrero_branch_library, short).
distance(golden_gate_valley_branch_library, short).

% Food availability
food(cherry_blossom_festival, yes).
food(earth_day_festival, yes).
food(sf_art_fair, yes).
food(sunset_dunes_park, no).
food(candlelight_concert, yes).
food(fat_ham_at_sf_playhouse, no).
food(emotionair_installations, no).
food(bay_area_brew_festival, yes).
food(chess_night_game, no).
food(japanese_tea_garden_visit, no).
food(dolores_park, no).
food(downtown_first_thursdays, yes).
food(balloon_museum, no).
food(asian_art_museum, no).
food(queen_wilhelmina_tulip_garden, no).
food(painted_ladies, no).
food(fishermans_wharf, yes).
food(golden_gate_park, no).
food(ina_coolbrith_park, no).
food(san_francisco_botanical_garden, no).
food(strawberry_hill, no).
food(pioneer_park, no).
food(andytown_salesforce, yes).
food(sff_mission_bay, yes).
food(benchmark_climbing, yes).
food(ymca, no).
food(the_crossing, yes).
food(lands_end, no).
food(china_camp_state_park, no).
food(joe___the_juice, yes).
food(peets_coffee, yes).
food(blue_bottle, yes).
food(motoring_coffee, yes).
food(cafe_reveille, yes).
food(him_mark_lai_branch_library, no).
food(mission_bay_branch_library, no).
food(sf_public_library, no).
food(potrero_branch_library, no).
food(golden_gate_valley_branch_library, no).

% Plugs/outlets availability
plugs(cherry_blossom_festival, no).
plugs(earth_day_festival, no).
plugs(sf_art_fair, no).
plugs(sunset_dunes_park, no).
plugs(candlelight_concert, no).
plugs(fat_ham_at_sf_playhouse, no).
plugs(emotionair_installations, no).
plugs(bay_area_brew_festival, no).
plugs(chess_night_game, no).
plugs(japanese_tea_garden_visit, no).
plugs(dolores_park, no).
plugs(downtown_first_thursdays, no).
plugs(balloon_museum, no).
plugs(asian_art_museum, yes).
plugs(queen_wilhelmina_tulip_garden, no).
plugs(painted_ladies, no).
plugs(fishermans_wharf, no).
plugs(golden_gate_park, no).
plugs(ina_coolbrith_park, no).
plugs(san_francisco_botanical_garden, no).
plugs(strawberry_hill, no).
plugs(pioneer_park, no).
plugs(andytown_salesforce, yes).
plugs(sff_mission_bay, no).
plugs(benchmark_climbing, yes).
plugs(ymca, yes).
plugs(the_crossing, no).
plugs(lands_end, no).
plugs(china_camp_state_park, no).
plugs(joe___the_juice, yes).
plugs(peets_coffee, yes).
plugs(blue_bottle, yes).
plugs(motoring_coffee, no).
plugs(cafe_reveille, yes).
plugs(him_mark_lai_branch_library, yes).
plugs(mission_bay_branch_library, yes).
plugs(sf_public_library, yes).
plugs(potrero_branch_library, yes).
plugs(golden_gate_valley_branch_library, yes).

% WiFi availability
wifi(cherry_blossom_festival, no).
wifi(earth_day_festival, no).
wifi(sf_art_fair, yes).
wifi(sunset_dunes_park, no).
wifi(candlelight_concert, no).
wifi(fat_ham_at_sf_playhouse, no).
wifi(emotionair_installations, no).
wifi(bay_area_brew_festival, no).
wifi(chess_night_game, yes).
wifi(japanese_tea_garden_visit, yes).
wifi(dolores_park, no).
wifi(downtown_first_thursdays, no).
wifi(balloon_museum, yes).
wifi(asian_art_museum, yes).
wifi(queen_wilhelmina_tulip_garden, no).
wifi(painted_ladies, no).
wifi(fishermans_wharf, no).
wifi(golden_gate_park, no).
wifi(ina_coolbrith_park, no).
wifi(san_francisco_botanical_garden, no).
wifi(strawberry_hill, no).
wifi(pioneer_park, no).
wifi(andytown_salesforce, yes).
wifi(sff_mission_bay, no).
wifi(benchmark_climbing, yes).
wifi(ymca, yes).
wifi(the_crossing, yes).
wifi(lands_end, no).
wifi(china_camp_state_park, no).
wifi(joe___the_juice, yes).
wifi(peets_coffee, yes).
wifi(blue_bottle, yes).
wifi(motoring_coffee, yes).
wifi(cafe_reveille, yes).
wifi(him_mark_lai_branch_library, yes).
wifi(mission_bay_branch_library, yes).
wifi(sf_public_library, yes).
wifi(potrero_branch_library, yes).
wifi(golden_gate_valley_branch_library, yes).

% Ambience information
ambience(cherry_blossom_festival, crowded).
ambience(earth_day_festival, crowded).
ambience(sf_art_fair, crowded).
ambience(sunset_dunes_park, crowded).
ambience(candlelight_concert, quiet).
ambience(fat_ham_at_sf_playhouse, crowded).
ambience(emotionair_installations, crowded).
ambience(bay_area_brew_festival, crowded).
ambience(chess_night_game, crowded).
ambience(japanese_tea_garden_visit, quiet).
ambience(dolores_park, crowded).
ambience(downtown_first_thursdays, crowded).
ambience(balloon_museum, crowded).
ambience(asian_art_museum, quiet).
ambience(queen_wilhelmina_tulip_garden, quiet).
ambience(painted_ladies, crowded).
ambience(fishermans_wharf, crowded).
ambience(golden_gate_park, quiet).
ambience(ina_coolbrith_park, quiet).
ambience(san_francisco_botanical_garden, quiet).
ambience(strawberry_hill, quiet).
ambience(pioneer_park, quiet).
ambience(andytown_salesforce, quiet).
ambience(sff_mission_bay, crowded).
ambience(benchmark_climbing, crowded).
ambience(ymca, crowded).
ambience(the_crossing, crowded).
ambience(lands_end, quiet).
ambience(china_camp_state_park, quiet).
ambience(joe___the_juice, crowded).
ambience(peets_coffee, crowded).
ambience(blue_bottle, quiet).
ambience(motoring_coffee, quiet).
ambience(cafe_reveille, quiet).
ambience(him_mark_lai_branch_library, quiet).
ambience(mission_bay_branch_library, quiet).
ambience(sf_public_library, quiet).
ambience(potrero_branch_library, quiet).
ambience(golden_gate_valley_branch_library, quiet).

% Wheelchair accessibility
wheelchair(cherry_blossom_festival, yes).
wheelchair(earth_day_festival, yes).
wheelchair(sf_art_fair, yes).
wheelchair(sunset_dunes_park, yes).
wheelchair(candlelight_concert, yes).
wheelchair(fat_ham_at_sf_playhouse, yes).
wheelchair(emotionair_installations, yes).
wheelchair(bay_area_brew_festival, yes).
wheelchair(chess_night_game, yes).
wheelchair(japanese_tea_garden_visit, yes).
wheelchair(dolores_park, yes).
wheelchair(downtown_first_thursdays, yes).
wheelchair(balloon_museum, yes).
wheelchair(asian_art_museum, yes).
wheelchair(queen_wilhelmina_tulip_garden, yes).
wheelchair(painted_ladies, yes).
wheelchair(fishermans_wharf, yes).
wheelchair(golden_gate_park, yes).
wheelchair(ina_coolbrith_park, no).
wheelchair(san_francisco_botanical_garden, yes).
wheelchair(strawberry_hill, no).
wheelchair(pioneer_park, yes).
wheelchair(andytown_salesforce, yes).
wheelchair(sff_mission_bay, yes).
wheelchair(benchmark_climbing, no).
wheelchair(ymca, yes).
wheelchair(the_crossing, yes).
wheelchair(lands_end, yes).
wheelchair(china_camp_state_park, yes).
wheelchair(joe___the_juice, yes).
wheelchair(peets_coffee, yes).
wheelchair(blue_bottle, yes).
wheelchair(motoring_coffee, yes).
wheelchair(cafe_reveille, yes).
wheelchair(him_mark_lai_branch_library, no).
wheelchair(mission_bay_branch_library, yes).
wheelchair(sf_public_library, no).
wheelchair(potrero_branch_library, yes).
wheelchair(golden_gate_valley_branch_library, yes).

% Friday timings
friday_timings(cherry_blossom_festival, '11:00AM - 5:00PM').
friday_timings(earth_day_festival, '6:00AM - 10:00PM').
friday_timings(sf_art_fair, '11:00AM - 7:00PM').
friday_timings(sunset_dunes_park, '7:00AM - 5:00PM').
friday_timings(candlelight_concert, '6:30 PM - 7:30 PM').
friday_timings(fat_ham_at_sf_playhouse, '8:00 PM - 9:40 PM').
friday_timings(emotionair_installations, '11:00AM - 8:00PM').
friday_timings(bay_area_brew_festival, 'Closed').
friday_timings(chess_night_game, '11:00AM - 8:00PM').
friday_timings(japanese_tea_garden_visit, '7:00AM - 5:30PM').
friday_timings(dolores_park, '6:00AM - 10:00PM').
friday_timings(downtown_first_thursdays, '9:00AM - 5:30PM').
friday_timings(balloon_museum, '11:00AM - 8:00PM').
friday_timings(asian_art_museum, '10:00AM - 5:00PM').
friday_timings(queen_wilhelmina_tulip_garden, '12:00AM - 11:59 PM').
friday_timings(painted_ladies, '12:00AM - 11:59 PM').
friday_timings(fishermans_wharf, '12:00AM - 11:59 PM').
friday_timings(golden_gate_park, '12:00AM - 11:59 PM').
friday_timings(ina_coolbrith_park, '5:00AM - 12:00AM').
friday_timings(san_francisco_botanical_garden, '7:30AM - 6:00PM').
friday_timings(strawberry_hill, '9:00 AM - 6:00PM').
friday_timings(pioneer_park, '5:00AM - 12:00AM').
friday_timings(andytown_salesforce, '8:00AM - 3:00PM').
friday_timings(sff_mission_bay, '12:00AM - 11:59PM').
friday_timings(benchmark_climbing, '11:00AM - 10:00PM').
friday_timings(ymca, '5:30AM - 9:00 PM').
friday_timings(the_crossing, '9:00AM - 9:00PM').
friday_timings(lands_end, '12:00AM - 11:59 PM').
friday_timings(china_camp_state_park, '8:00 AM - 7:30PM').
friday_timings(joe___the_juice, '6:30 AM - 8:00 PM').
friday_timings(peets_coffee, '5:30 AM - 5:00 PM').
friday_timings(blue_bottle, '6:30 AM - 5:30 PM').
friday_timings(motoring_coffee, '7:00AM - 6:00PM').
friday_timings(cafe_reveille, '7:30AM - 7:30 PM').
friday_timings(him_mark_lai_branch_library, '1:00PM - 6:00 PM').
friday_timings(mission_bay_branch_library, '1:00PM - 6:00 PM').
friday_timings(sf_public_library, '12:00PM - 6:00PM').
friday_timings(potrero_branch_library, '1:00 PM - 6:00 PM').
friday_timings(golden_gate_valley_branch_library, '1:00 PM - 6:00 PM').

% Saturday timings
saturday_timings(cherry_blossom_festival, '11:00AM - 5:00PM').
saturday_timings(earth_day_festival, '6:00AM - 10:00PM').
saturday_timings(sf_art_fair, '11:00AM - 7PM').
saturday_timings(sunset_dunes_park, '7:00AM - 7:00PM').
saturday_timings(candlelight_concert, '6:30 PM - 7:30 PM').
saturday_timings(fat_ham_at_sf_playhouse, '3:00 PM - 4:40 PM').
saturday_timings(emotionair_installations, '10:00AM - 9:00PM').
saturday_timings(bay_area_brew_festival, '1:00 PM - 4:00 PM').
saturday_timings(chess_night_game, '10:00AM - 9:00PM').
saturday_timings(japanese_tea_garden_visit, '9:00AM - 5:30PM').
saturday_timings(dolores_park, '6:00AM - 10:00PM').
saturday_timings(downtown_first_thursdays, '9:00AM - 5:30PM').
saturday_timings(balloon_museum, '10:00AM - 9:00PM').
saturday_timings(asian_art_museum, '10:00AM - 5:00PM').
saturday_timings(queen_wilhelmina_tulip_garden, '12:00AM - 11:59 PM').
saturday_timings(painted_ladies, '12:00AM - 11:59 PM').
saturday_timings(fishermans_wharf, '12:00AM - 11:59 PM').
saturday_timings(golden_gate_park, '12:00AM - 11:59 PM').
saturday_timings(ina_coolbrith_park, '5:00AM - 12:00AM').
saturday_timings(san_francisco_botanical_garden, '7:30AM - 6:00PM').
saturday_timings(strawberry_hill, '9:00 AM - 6:00PM').
saturday_timings(pioneer_park, '5:00AM - 12:00AM').
saturday_timings(andytown_salesforce, '9:00AM - 3:00PM').
saturday_timings(sff_mission_bay, '12:00AM - 11:59PM').
saturday_timings(benchmark_climbing, '10:00AM - 7:00PM').
saturday_timings(ymca, '7:00 AM - 2:00 PM').
saturday_timings(the_crossing, '9:00 AM - 9:00 PM').
saturday_timings(lands_end, '12:00AM - 11:59 PM').
saturday_timings(china_camp_state_park, '8:00 AM - 7:30PM').
saturday_timings(joe___the_juice, '7:00 AM - 8:00 PM').
saturday_timings(peets_coffee, '5:30 AM - 5:00 PM').
saturday_timings(blue_bottle, '6:30 AM - 5:30 PM').
saturday_timings(motoring_coffee, '7:00 AM - 6:00 PM').
saturday_timings(cafe_reveille, '7:30AM - 7:30 PM').
saturday_timings(him_mark_lai_branch_library, '10:00AM - 6:00 PM').
saturday_timings(mission_bay_branch_library, '10:00AM - 6:00 PM').
saturday_timings(sf_public_library, '10:00PM - 6:00PM').
saturday_timings(potrero_branch_library, '10:00PM - 6:00PM').
saturday_timings(golden_gate_valley_branch_library, '10:00PM - 6:00PM').

% Sunday timings
sunday_timings(cherry_blossom_festival, '11:00AM - 5:00PM').
sunday_timings(earth_day_festival, '6:00AM - 10:00PM').
sunday_timings(sf_art_fair, '11:00AM - 7PM').
sunday_timings(sunset_dunes_park, '7:00AM - 7:00PM').
sunday_timings(candlelight_concert, '6:30 PM - 7:30 PM').
sunday_timings(fat_ham_at_sf_playhouse, '2:00 PM - 3:40 PM').
sunday_timings(emotionair_installations, '10:00AM - 8:00PM').
sunday_timings(bay_area_brew_festival, 'Closed').
sunday_timings(chess_night_game, '10:00AM - 8:00PM').
sunday_timings(japanese_tea_garden_visit, '9:00AM - 5:30PM').
sunday_timings(dolores_park, '6:00AM - 10:00PM').
sunday_timings(downtown_first_thursdays, '9:00AM - 5:30PM').
sunday_timings(balloon_museum, '10:00AM - 8:00PM').
sunday_timings(asian_art_museum, '10:00AM - 5:00PM').
sunday_timings(queen_wilhelmina_tulip_garden, '12:00AM - 11:59 PM').
sunday_timings(painted_ladies, '12:00AM - 11:59 PM').
sunday_timings(fishermans_wharf, '12:00AM - 11:59 PM').
sunday_timings(golden_gate_park, '12:00AM - 11:59 PM').
sunday_timings(ina_coolbrith_park, '5:00AM - 12:00AM').
sunday_timings(san_francisco_botanical_garden, '7:30AM - 6:00PM').
sunday_timings(strawberry_hill, '9:00 AM - 6:00PM').
sunday_timings(pioneer_park, '5:00AM - 12:00AM').
sunday_timings(andytown_salesforce, '9:00 - 3:00PM').
sunday_timings(sff_mission_bay, '12:00AM - 11:59PM').
sunday_timings(benchmark_climbing, '10:00AM - 7:00PM').
sunday_timings(ymca, 'Closed').
sunday_timings(the_crossing, '9:00 AM - 9:00 PM').
sunday_timings(lands_end, '12:00AM - 11:59 PM').
sunday_timings(china_camp_state_park, '8:00 AM - 7:30PM').
sunday_timings(joe___the_juice, '7:00 AM - 8:00 PM').
sunday_timings(peets_coffee, '5:30 AM - 5:00 PM').
sunday_timings(blue_bottle, '6:30 AM - 5:30 PM').
sunday_timings(motoring_coffee, '7:00 AM - 6:00 PM').
sunday_timings(cafe_reveille, '7:30AM - 7:30 PM').
sunday_timings(him_mark_lai_branch_library, '1:00PM - 5:00 PM').
sunday_timings(mission_bay_branch_library, '1:00PM - 5:00 PM').
sunday_timings(sf_public_library, '12:00PM - 6:00PM').
sunday_timings(potrero_branch_library, '1:00PM - 5:00PM').
sunday_timings(golden_gate_valley_branch_library, '1:00PM - 5:00PM').


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
