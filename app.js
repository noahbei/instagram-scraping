const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');

////const username = "";
const password = "";

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
const overlapArr = [];
let onlyInFollowers = [];
let onlyInFollowing = [];
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
    let elements = await topContainer.findElements(By.css('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1'));

    const scrollDiv = async (numUsers) => {
      try {
        if (elements.length >= numUsers)
          return;
        await driver.executeScript("arguments[0].scrollBy(0, 1200)", divContainer);
        elements = await topContainer.findElements(By.css('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1'));
        await driver.sleep(4000);
        await scrollDiv(numUsers);
      }
      catch (error) {
        console.error("Maybe items did not load. Error occurred during scrolling: ", error);
      }
    }
    // scroll down to reveal all followers
    await scrollDiv(numFollowers);
    //add a loaing bar showing progress

    //add all followers to followers array
    //should maybe return array instead
    const pushToUserArray = async (array) => {
      for (let i = 0; i < elements.length; i++) {
        const usernameElem = await elements[i].findElement(By.css('span:first-child'));
        let nameElem;
        try {
          nameElem = await elements[i].findElement(By.css('span:nth-child(2)'));
        } catch (error) {
          console.log("name not found");
        }
  
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
    elements = await topContainer.findElements(By.css('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1'));

    // scroll down to reveal all following
    await scrollDiv(numFollowing);

    //push following to array
    await pushToUserArray(followingArr)
    await driver.sleep(2000);

    followingArr.forEach((following) => {
    followersArr.forEach((follower) => {
        if (following.username === follower.username)
            overlapArr.push(following);
      })
    });

    function compareArrays(array1, array2) {
      const onlyInArray1 = array1.filter(obj => !array2.find(item => item.username === obj.username));
      const onlyInArray2 = array2.filter(obj => !array1.find(item => item.username === obj.username));

      return [onlyInArray1, onlyInArray2];
    }

    [onlyInFollowing, onlyInFollowers] = compareArrays(followingArr, followersArr);
  } 
  finally {
    const writeFile = (name, array) => {
      fs.writeFile(name + '.json', JSON.stringify(array, null, 2), (err) => {
        if (err) {
          console.error('Error writing', name, 'file:', err);
        } else {
          console.log(name, 'file has been written successfully.');
        }
      });
    }
    writeFile('followers', followersArr);
    writeFile('following', followingArr);
    writeFile('overlap', overlapArr);
    writeFile('onlyInFollowing', onlyInFollowing);
    writeFile('onlyInFollowers', onlyInFollowers);

    await driver.sleep(2000);
    await driver.quit();
  }
})();
