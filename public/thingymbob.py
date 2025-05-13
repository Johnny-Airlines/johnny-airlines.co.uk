from flask import Flask, Response, request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions

app = Flask(__name__)
options = ChromeOptions()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(options=options)

homepagecode = """
<script async src='https://cse.google.com/cse.js?cx=b40d3f76f484747f1'></script><div class='gcse-search'></div>
<script>
document.addEventListener('keyup', (e) => {
    if (e.code == "Space") { window.location = `/selenium?url=${prompt()}`}
    alert()
})
</script>
"""

def selenium_task(url):
    driver.get(url)
    page_source = driver.page_source
    return page_source

@app.route('/selenium')
def selenium_endpoint():
    page_source = selenium_task(request.args.get('url'))
    return Response(page_source, mimetype="text/html")

@app.route('/')
def index():
    return homepagecode


app.run(host='0.0.0.0', debug=True)
