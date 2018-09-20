# Backend

This depends on mysql.

Create a database and inject it the structure in `backend/create-database.sql` :
```
mysql -h 127.0.0.1 -P YOUR_USER -u YOUR_PASSWORD -p DATABAE-NAME < backend/create-database.sql
```
Place your facebook datas into the data folder as

```
$ ls data
.
..
about_you
ads
apps
calls_and_messages
comments
events
following_and_followers
friends
groups
likes_and_reactions
location_history
marketplace
messages
network_information
other_activity
pages
payment_history
photos
posts
profile_information
saved_items
search_history
security_and_login_information
videos
your_places
```

create and enter your virtual envs if needed

install from `requirements.txt`:
```
pip install -r requirements.txt
```

### This part is still to improve.
Edit you database configs inside the `backend/database.py` file.

launch the python scrapper:
```
python backend/scrapper.py
```

Wait for the scrapper to import your datas into the database.

you can now launch the python server
```
python backend
```

You can now install the front-end.

# Frontend
The front-end is based on the <a href="https://github.com/react-boilerplate/react-boilerplate">react-boilerplate</a> project.
The original of this version is avaible <a href="https://github.com/arnaudmolo/facebook-explorer/blob/master/README-BOILERPLATE">here</a>.

To simply install the project type `npm install`.
To launch the front-end server type `npm srart`.
