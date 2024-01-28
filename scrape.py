import selenium
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import os.path
import time

from collections import deque

chrome_options = Options()
chrome_options.add_argument("--ignore-certificate-errors-spki-list")
chrome_options.add_argument('--ignore-ssl-errors')

s = Service(ChromeDriverManager().install()) # manages chromedriver
driver = webdriver.Chrome(service=s, options=chrome_options)

d = {}
try:
    driver.get("https://entertainment.aa.com/en/movies")
    time.sleep(3)
    queue = deque()
    s = set()
    visited = set()

    for i in range(0, 200):
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(0.5)
        a_tags = driver.find_elements(By.TAG_NAME, "a")
        for a in a_tags:
            if a.get_attribute('href') not in s:
                queue.append(a.get_attribute('href'))
                s.add(a.get_attribute('href'))


    while len(queue) > 0:
        print(len(queue))
        try:
            href = queue.popleft()
            visited.add(href)
            if href is None:
                continue
            if 'aa.com/en/title/' in href:
                print(href)
                time.sleep(0.5)
                driver.get(href)

                title = driver.find_element(By.XPATH, '//*[@id="gatsby-focus-wrapper"]/div/div[1]/main/div/div[2]/div[1]/div[1]/div[1]/h1').text
                desc = driver.find_element(By.XPATH, '//*[@id="gatsby-focus-wrapper"]/div/div[1]/main/div/div[2]/div[1]/div[2]/p').text
                cast = driver.find_element(By.XPATH, '//*[@id="gatsby-focus-wrapper"]/div/div[1]/main/div/div[2]/div[2]/div[2]/div/div[1]/p').text
                director = driver.find_element(By.XPATH, '//*[@id="gatsby-focus-wrapper"]/div/div[1]/main/div/div[2]/div[2]/div[2]/div/div[2]/p').text
                genres = list(map(str.strip, driver.find_elements(By.XPATH, '//*[@id="gatsby-focus-wrapper"]/div/div[1]/main/div/div[2]/div[2]/div[2]/div/div[4]/p')[0].text.split(',')))
                year, rating = list(map(str.strip, driver.find_elements(By.XPATH, '//*[@id="gatsby-focus-wrapper"]/div/div[1]/main/div/div[2]/div[1]/div[1]/div[2]')[0].text.split("|")))

                if title not in d:
                    d[title] = {
                        "desc": desc,
                        "cast": cast,
                        "director": director,
                        "genres": genres,
                        "year": year,
                        "rating": rating
                    }

                # get new a tags
                a_tags = driver.find_elements(By.TAG_NAME, "a")
                for a in a_tags:
                    if a.get_attribute('href') not in visited:
                        queue.append(a.get_attribute('href'))
                    
            else:
                continue

        except Exception as e:
            print(e)
            pass

except KeyboardInterrupt:
    pass

import json
with open('data2.json', 'w') as fp:
    json.dump(d, fp)

driver.quit()
print(f"Found {len(d)} movies")


