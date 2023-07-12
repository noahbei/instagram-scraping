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
// firefoxOptions.headless();

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

    //navigate to profile page
    await driver.get("https://www.instagram.com/" + username + "/");

    //get number of followers and following
    await driver.wait(until.elementLocated(By.css("span._ac2a")), 10000, "Could not find number of followers or number of following");
    const numbers = await driver.findElements(By.css('span._ac2a'));
    const numFollowers = await numbers[1].getText();
    const numFollowing = await numbers[2].getText();
    await driver.sleep(2000);
    //check to make sure numbers are correct
    console.log(`followers: ${numFollowers}, following: ${numFollowing}`);

    //open up follower window
    await driver.get("https://www.instagram.com/" + username + "/followers");
    await driver.sleep(6000);

    //initialize elements
    const divContainer = await driver.findElement(By.css('div._aano'));
    const topContainer = await driver.findElement(By.css('div._aano :first-child'));
    let elements = await topContainer.findElements(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'));

    const scrollDiv = async () => {
      try {
        if (elements.length >= numFollowers)
          return;
        await driver.executeScript("arguments[0].scrollBy(0, 200)", divContainer);
        elements = await topContainer.findElements(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'));
        await driver.sleep(10000);
        await scrollDiv();
      }
      catch (error) {
        console.error("Maybe items did not load. Error occurred during scrolling: ", error);
      }
      
    }
    // scroll down to reveal all followers
    await scrollDiv();

    //push followers to array
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
    /* 
    // print followers for testing
    for (let i = 0; i < followersArr.length; i++) {
      console.log(`username: ${followersArr[i].username}, name: ${followersArr[i].name}`)
    }
    */
  } 
  finally {
    console.log(followersArr)
    driver.sleep(2000);
    driver.quit();
  }
})();