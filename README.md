# Gezenti

Gezenti is a daily travel game based on the cities of Turkey.

<img width="954" alt="Screenshot 2024-06-18 at 22 58 08" src="https://github.com/frozsgy/gezenti/assets/8549267/8c1298fc-b70b-4a24-a4fd-806d81b55543">

## History

The inspiration for this game comes from another game called Travle, which I personally enjoyed a lot over the last
year.

Back at November 2023, I was playing Travle a lot, and I wanted to play a localized version of it too, to improve
my Turkish geography knowledge while having some fun. However, there were no localized versions available at that time,
so I decided to give it a go. Over the course of a weekend, I developed the initial idea and it was working fine-ish.
However in the following weeks, I haven't had much chance to polish it further, and in a couple of weeks, Travle
announced a localized version for Turkey too, which kinda made this project obsolete. However, over the last couple of
days, I decided to finalize this so I can publish and share the source code, which was my intention from the start
anyway.

While developing this, I wanted to avoid using massive JS frameworks so I can work on my vanilla JS skills too. I have
to admit, it was a bit challenging, but I enjoyed the whole process from start to finish.

I hope you'll enjoy this game as much as I did while developing it.

## Deployment

You can deploy this to Heroku directly by using the `build.sh` file to bundle the necessary files under a folder, and
then push everything. It works without any need for configuration.

If you want to deploy this on your own, you'd need the contents of the `frontend` folder, and also the `backend.py` file
and its dependencies (please refer to the `build.sh` file for further information). Most of the files under
the `backend` folder were used during the data preprocessing and saving them to the necessary JSON files.

## Tech Stack

- Backend:
    - Python with Flask
- Frontend:
    - Javascript
        - Turkey map was developed using https://github.com/dnomak/svg-turkiye-haritasi
        - Autocomplete feature is provided by https://github.com/TarekRaafat/autoComplete.js
        - Modal view was developed using https://github.com/robinparisi/tingle

## Contributing

Got any suggestions or improvements? Pull requests are always welcome.

----

Available at https://gezenti.ozanalpay.com

