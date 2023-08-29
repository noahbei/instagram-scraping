const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');

//test account 1
//const username = ""
//const password = ""

//test account 2
//const username = ""
//const password = "23"

const login = async (driver, username, password) => {
  await driver.get("https://www.instagram.com");
  const usernameField = await driver.wait(until.elementLocated(By.name('username')), 10000, "Login page failed to load in time, could not find username field");
  await driver.sleep(getRandomInt(1500, 3000));
  await usernameField.sendKeys(username);

  const passwordField = await driver.wait(until.elementLocated(By.name('password')), 10000, "could not find password field");
  await driver.sleep(getRandomInt(1500, 3000));
  await passwordField.sendKeys(password);

  const submitButton = await driver.wait(until.elementLocated(By.css("[type='submit']")), 10000, "Could not find Log in button");
  await driver.sleep(getRandomInt(2000, 4000));
  await submitButton.click();

  await driver.sleep(getRandomInt(5000, 6000));
}

const getFollowCounts = async (driver) => {
  //get number of followers and following
  await driver.wait(until.elementLocated(By.css("span._ac2a")), 10000, "Could not find number of followers or number of following");
  const numbers = await driver.findElements(By.css('span._ac2a'));
  const numFollowers = await numbers[1].getText();
  const numFollowing = await numbers[2].getText();
  await driver.sleep(getRandomInt(2000, 4000));
  //check to make sure numbers are correct
  console.log(`followers: ${numFollowers}, following: ${numFollowing}`);
  return [numbers, numFollowers, numFollowing];
}

const scrollDiv = async (driver, numUsers, elements, divContainer, topContainer) => {
  try {
    if (elements.length >= numUsers)
      return elements;
    await driver.executeScript("arguments[0].scrollBy(0, 1000)", divContainer);
    elements = await topContainer.findElements(By.css('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1'));
    await driver.sleep(getRandomInt(3000, 6000));
    return await scrollDiv(driver, numUsers, elements, divContainer, topContainer);
  }
  catch (error) {
    console.error("Maybe items did not load. Error occurred during scrolling: ", error);
    return elements;
  }
}

const pushToUserArray = async (elements) => {
  const userArray = [];
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
    await userArray.push(follower);
  }
  return userArray;
}

function compareArrays(array1, array2) {
  const onlyInArray1 = array1.filter(obj => !array2.find(item => item.username === obj.username));
  const onlyInArray2 = array2.filter(obj => !array1.find(item => item.username === obj.username));
  const overlap = array1.filter(obj => array2.find(item => item.username === obj.username));

  return [onlyInArray1, onlyInArray2, overlap];
}

const writeFile = (name, array) => {
  fs.writeFile('output/' + name + '.json', JSON.stringify(array, null, 2), (err) => {
    if (err) {
      console.error('Error writing', name, 'file:', err);
    } else {
      console.log(name, 'file has been written successfully.');
    }
  });
}

exports.scrapeData = async (username, password) => {
  if (!fs.existsSync("output"))
    fs.mkdirSync("output");
  
  const geckoDriverPath = __dirname + '/geckodriver-v0.33.0-win64/geckodriver.exe';
  const chromeDriverPath = __dirname + '/chromedriver_win32/chromedriver.exe';

  const firefoxOptions = new firefox.Options();
  const chromeOptions = new chrome.Options();
  //firefoxOptions.headless();
  chromeOptions.headless();

  let followersArr = [];
  let followingArr = [];
  let overlapArr = [];
  let onlyInFollowers = [];
  let onlyInFollowing = [];

  try {
    const driver = await new Builder()
    .forBrowser('firefox')
    // Use the following line for Chrome browser
    //.forBrowser('chrome')
    .setFirefoxOptions(firefoxOptions)
    .setChromeOptions(chromeOptions)
    .setFirefoxService(new firefox.ServiceBuilder(geckoDriverPath))
    .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
    .build();

    await login(driver, username, password);

    //need to wait until user is authenticated
    //navigate to profile page
    await driver.get("https://www.instagram.com/" + username + "/");

    const [buttons, numFollowers, numFollowing] = await getFollowCounts(driver);

    //open follower window
    await buttons[1].click();
    await driver.sleep(getRandomInt(5000, 7000));

    //initialize elements
    let divContainer;
    let topContainer;
    let elements;
    try {
      divContainer = await driver.findElement(By.css('div._aano'));
      topContainer = await driver.findElement(By.css('div._aano :first-child'));
      elements = await topContainer.findElements(By.css('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1'));
    } catch (error) {
      console.log("Could not find divContainer or elements", error);
      await driver.quit();
      await process.exit();
    }

    //scroll down to reveal all followers
    elements = await scrollDiv(driver, numFollowers, elements, divContainer, topContainer);
    //add a loaing bar showing progress

    //add all followers to followers array
    followersArr = await pushToUserArray(elements);

    //close followers window
    let closeButton = await driver.findElement(By.css("button._abl-"))
    await closeButton.click();
    await driver.sleep(getRandomInt(2000, 4000));

    //open following window
    await buttons[2].click();
    await driver.sleep(getRandomInt(5000, 7000));
    
    //reset the elements for followingArr
    divContainer = await driver.findElement(By.css('div._aano'));
    topContainer = await driver.findElement(By.css('div._aano :first-child'));
    await driver.wait(until.elementLocated(By.css('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft'), 10000, "didn't find element array for following"))
    elements = await topContainer.findElements(By.css('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1'));

    //scroll down to reveal all following
    elements = await scrollDiv(driver, numFollowing, elements, divContainer, topContainer);

    //push following to array
    followingArr = await pushToUserArray(elements);
    await driver.sleep(2000);

    //exit the webdriver session
    await driver.quit();
    
    //overlap = analyzeArrays(followingArr, followersArr);
    [onlyInFollowing, onlyInFollowers, overlapArr] = compareArrays(followingArr, followersArr);

    //write arrays to files
    writeFile('followers', followersArr);
    writeFile('following', followingArr);
    writeFile('overlap', overlapArr);
    writeFile('onlyInFollowing', onlyInFollowing);
    writeFile('onlyInFollowers', onlyInFollowers);
  }
  catch (error) {
    console.error('An error occured during scraping:', error.message);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}