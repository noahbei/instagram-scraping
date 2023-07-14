const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');

//const username = "";
//const password = "";

//test account 1
const username = ""
const password = ""

//test account 2
//const username = ""
//const password = "23"

const geckoDriverPath = 'C:/Users/tromb/webDev/instagram-scraping/geckodriver-v0.33.0-win64/geckodriver.exe';
const chromeDriverPath = 'C:/Users/tromb/webDev/instagram-scraping/chromedriver_win32/chromedriver.exe';

const firefoxOptions = new firefox.Options();
const chromeOptions = new chrome.Options();
// Set the path to the Firefox binary (optional)
// firefoxOptions.setBinary('path/to/firefox');

// Set the path to the Chrome binary (optional)
// chromeOptions.setBinary('path/to/chrome');

// Uncomment the following line if you want to run Firefox in headless mode
// firefoxOptions.headless();

// Uncomment the following line if you want to run Chrome in headless mode
// chromeOptions.headless();

const followersArr = [];
const followingArr = [];
let follower = {};

(async () => {
  const driver = await new Builder()
  //.forBrowser('firefox')
  // Use the following line for Chrome browser
  .forBrowser('chrome')
  .setFirefoxOptions(firefoxOptions)
  .setChromeOptions(chromeOptions)
  .setFirefoxService(new firefox.ServiceBuilder(geckoDriverPath))
  .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
  .build();

  try {
    await driver.get("https://www.instagram.com");
    //for login page
    const usernameField = await driver.wait(until.elementLocated(By.name('username')), 10000, "Login page failed to load in time, could not find username field");
    await driver.sleep(1000);
    await usernameField.sendKeys(username);
    const  passwordField = await driver.wait(until.elementLocated(By.name('password')), 10000, "could not find password field");
    await driver.sleep(1000);
    await passwordField.sendKeys(password);
    const submitButton = await driver.wait(until.elementLocated(By.css("[type='submit']")), 10000, "Could not find Log in button");
    await driver.sleep(2000);
    await submitButton.click();
    await driver.sleep(5000);

    //need to wait until user is authenticated
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

    //open follower window
    await numbers[1].click();
    await driver.sleep(6000);

    //initialize elements
    let divContainer = await driver.findElement(By.css('div._aano'));
    let topContainer = await driver.findElement(By.css('div._aano :first-child'));
    let elements = await topContainer.findElements(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'));

    const scrollDiv = async (numUsers) => {
      try {
        if ((elements.length)/2 >= numUsers)
          return;
        await driver.executeScript("arguments[0].scrollBy(0, 600)", divContainer);
        elements = await topContainer.findElements(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'));
        await driver.sleep(5000);
        await scrollDiv(numUsers);
      }
      catch (error) {
        console.error("Maybe items did not load. Error occurred during scrolling: ", error);
      }
    }
    // scroll down to reveal all followers
    await scrollDiv(numFollowers);

    //add all followers to followers array
    //should maybe return array instead
    const pushToUserArray = async (array) => {
      for (let i = 0; i < elements.length; i += 2) {
        const usernameElem = await elements[i];
        const nameElem = await elements[i + 1];
  
        let username = await usernameElem.getText();
        username = username.split("\n")[0];
        let name;
        try {
          name = await nameElem.getText();
        } catch (error) {
          console.error("Could not retrieve name:", error);
          name = "N/A";
        }
  
        const follower = {
          username: username,
          name: name
        };
        await array.push(follower);
      }
    }

    await pushToUserArray(followersArr);

    //close followers window
    let closeButton = await driver.findElement(By.css("button._abl-"))
    await closeButton.click();
    await driver.sleep(2000);

    //open following window
    await numbers[2].click();
    await driver.sleep(6000);
    
    //reset the elements for followingArr
    divContainer = await driver.findElement(By.css('div._aano'));
    topContainer = await driver.findElement(By.css('div._aano :first-child'));
    await driver.wait(until.elementLocated(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'), 10000, "didn't find element array for following"))
    elements = await topContainer.findElements(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'));
    //elements.splice(0, 10);

    // scroll down to reveal all following
    await scrollDiv(numFollowing);

    //push following to array
    await pushToUserArray(followingArr)
    await driver.sleep(2000);
  } 
  finally {
    console.log("followers:\n" + JSON.stringify(followersArr, null, 2));
    console.log("\n");
    console.log("following:\n" + JSON.stringify(followingArr, null, 2));
    await driver.sleep(2000);
    await driver.quit();
  }
})();


