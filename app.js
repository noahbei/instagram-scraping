const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

//const username = "";
//const password = "";

//test account
const username = ""
const password = ""


const geckoDriverPath = 'C:/Windows/geckodriver.exe';
const firefoxOptions = new firefox.Options();

// Uncomment the following line if you want to run Firefox in headless mode
 firefoxOptions.headless();

// Set the path to the Firefox binary (optional)
// firefoxOptions.setBinary('path/to/firefox');
const followersArr = [];
let follower = {};

(async () => {
  const driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(firefoxOptions)
    .setFirefoxService(new firefox.ServiceBuilder(geckoDriverPath))
    .build();

  try {
    await driver.get("https://www.instagram.com");
    //for login page
    const usernameField = await driver.wait(until.elementLocated(By.name('username')), 10000, "Loggin page failed to load in time");
    await usernameField.sendKeys(username);
    const passwordField = await driver.findElement(By.name("password"));
    await passwordField.sendKeys(password);
    const submitButton = await driver.wait(until.elementLocated(By.css("[type='submit']")), 10000, "Could not find Log in button");
    await submitButton.click();

    await driver.sleep(2000);
    await driver.get("https://www.instagram.com/" + username + "/");
    await driver.sleep(1000);
    await driver.get("https://www.instagram.com/" + username + "/followers");
    await driver.sleep(4000);
    const topContainer = await driver.findElement(By.css('div._aano :first-child'));
    const elements = await topContainer.findElements(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'));

    for (let i = 0; i < elements.length; i += 2) {
      const usernameElem = await elements[i];
      const nameElem = await elements[i + 1];

      let username = await usernameElem.getText();
      username = username.split("\n")[0];
      let name = await nameElem.getText();

      const follower = {
        username: username,
        name: name
      }

      followersArr.push(follower);
    }
    for (let i = 0; i < followersArr.length; i++) {
      console.log(`username: ${followersArr[i].username}, name: ${followersArr[i].name}`)
    }
  }
  finally {
    console.log(followersArr)
    setTimeout(e => {driver.quit()}, 200000);
  }
})();
//setTimeout(() => {2 + 2}, 20000000)


/* 
document.querySelectorAll("span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft").forEach((item, index) => {
    //0, 2, 4, usernames
    if (index % 2 === 0) {
        follower = {};
        follower.username = item.querySelector("div > div > div > a > span > div").textContent;
    }
    //1, 3, 5 names
    else {
        follower.name = item.textContent;
        followersArr.push(follower);
    }
}); */