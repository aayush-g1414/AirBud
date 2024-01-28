import json
import pandas as pd

data = pd.read_csv("data.csv", index_col=0)

# convert back into json
data_json = data.to_json(orient="index")
data_dict = json.loads(data_json)

system_prompt = open('movie_system_prompt.txt', 'r').read()

for title, info_dict in data_dict.items():
    system_prompt += "\n" + title + " : " + str(info_dict)

# save to file
with open("movie_system_prompt_with_movies.txt", "w") as f:
    f.write(system_prompt)
    f.write("\n\n")
