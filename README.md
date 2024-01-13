# Insta-Compare

Insta-compare is a web scraping tool designed to gather following and follower information from an Instagram user's account and analyze the differences between the two sets. This project is built using Node.js and Express for the backend, Selenium for web automation and scraping, and EJS and Bootstrap for the frontend. With Insta-compare, you can easily compare and contrast the accounts you follow with those who follow you, helping you gain valuable insights into your Instagram network.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Important Notes](#important-notes)
- [Screenshots](#screenshots)
- [License](#license)

## Prerequisites
Before using Insta-compare, ensure you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/): Make sure you have Node.js installed. You can download it [here](https://nodejs.org/).

## Installation
1. Clone the Insta-compare repository to your local machine:

```bash
git clone https://github.com/noahbei/insta-compare.git
```
2. Navigate to the project directory:

```bash
cd insta-compare
```
3. Install the required Node.js modules using npm:

```bash
npm i
```

## Usage
1. Start the Insta-compare server by running the following command:

```bash
npm run start
```
2. The console will display a message indicating that the server has started on port 3000.

3. Open a web browser and navigate to http://localhost:3000.

4. You will be prompted to log in to your Instagram account. Enter your Instagram username and password to proceed.

5. Insta-compare will log in to your account and begin gathering the required information. Please refrain from restarting the page during this process, as the scraper is working in the background.

6. The scraping process may be slow because it mimics human behavior to avoid triggering bot detection. Ensure you have a stable internet connection for optimal performance.

7. Once the scraper has finished its work, you will be redirected to a results page where you can see the output.

## How It Works
Insta-compare provides three key sections (plus the 2 input) for analyzing your Instagram network:

> **Following:** This section displays the list of accounts you follow.
>
> **Followers:** Here, you can see the list of accounts that follow you.
>
> **Only In Following:** This section displays the accounts you follow but who don't follow you back.
>
> **Only In Followers:** Here, you can see the accounts following you that you don't follow back.
>
> **Overlap:** This section shows the accounts you both follow and who follow you.

You can switch between these sections using a toggle at the top of the page.

Additionally, you can download the output as .json files through the menu at the top of the page or directly from the display divs.

## Important Notes
- The web scraping process can be slow due to the need to mimic human behavior to avoid bot detection/action blocks. Please be patient during the scraping process.

- Ensure you have a stable internet connection for the best performance. This will not work if you have a slow internet connection.

## Screenshots

![login screen](https://github.com/noahbei/instagram-scraping/blob/example-images/example-images/login%20screen.png?raw=true)
![login screen](https://github.com/noahbei/instagram-scraping/blob/example-images/example-images/scraping%20page.png?raw=true)
![login screen](https://github.com/noahbei/instagram-scraping/blob/example-images/example-images/output%20page.png?raw=true)
![login screen](https://github.com/noahbei/instagram-scraping/blob/example-images/example-images/output%20page%20responsive.png?raw=true)

## License
This project is licensed under the [Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/) License - see the [LICENSE](LISENCE) file for details.
