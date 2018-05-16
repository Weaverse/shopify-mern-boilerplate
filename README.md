Shopify MERN App - Developer Guide
=======================


Prerequisites
-------------

- [MongoDB](https://www.mongodb.org/downloads)
- [Node.js 8.0+](http://nodejs.org)
- Command Line Tools
 - **Mac OS X:** [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`)
 - **Windows:** [Visual Studio](https://www.visualstudio.com/products/visual-studio-community-vs) OR [Visaul Studio Code](https://code.visualstudio.com) + [Windows Subsystem for Linux - Ubuntu](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
 - **Ubuntu** / **Linux Mint:** `sudo apt-get install build-essential`
 - **Fedora**: `sudo dnf groupinstall "Development Tools"`
 - **OpenSUSE:** `sudo zypper install --type pattern devel_basis`

**Note:** If you are new to Node or Express, I recommend to watch
[Node.js and Express 101](https://www.youtube.com/watch?v=BN0JlMZCtNU)
screencast by Alex Ford that teaches Node and Express from scratch. Alternatively,
here is another great tutorial for complete beginners - [Getting Started With Node.js, Express, MongoDB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/).


Features
---------------
* [Shopify Polaris](https://github.com/Shopify/polaris) newest version.
* [Shopify Express](https://github.com/Shopify/shopify-express)
    * Authenticate with Shopify
    * Usage of Shopify API
    * Shopify Webhook
* React ^16.3
* Hot Reload React app
* Full ES6 support for both Server and Client
* MongoDB model



Todos
---------------
* Add GraphQL
* Add Server side render

Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Go to you Workspace
cd /path-to-your-workspace

# Clone the project
git clone this-project-url

# Change directory
cd project-dir

# Install NPM dependencies
yarn install

# Copy .env.example to .env
cp .env.example .env

# Then simply start your app
yarn dev
```

**Warning:** While working with Shopify, it require https,
you might need to download [ngrok](https://ngrok.com/).
You must start ngrok after starting the project.

```bash
# start ngrok to intercept the data exchanged on port 8080
./ngrok http 8080
```

Next, you must use the https url defined by ngrok, for example `https://minhpt.ngrok.io`

Replace it with `BASE_URL` defined in `.env.example` file.



Project Structure
-----------------

| Name                                   | Description                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| **src/server**                         | Backend Server app                                           |
| **src/client**                         | Client React app                                             |
| **assets**                             | Static assets (fonts, css, js, img) / Client build dir       |
| **dist**                               | Server built app                                             |
| .dockerignore                          | Folder and files ignored by docker usage.                    |
| .env.example                           | Your API keys, tokens, passwords and database URI.           |
| .eslintrc                              | Rules for eslint linter.                                     |
| .gitignore                             | Folder and files ignored by git.                             |
| .travis.yml                            | Configuration files for continue integration.                |
| index.js                               | The main application file.                                   |
| src/router.js                          | The main application Router file.                            |
| docker-compose.yml                     | Docker compose configuration file.                           |
| Dockerfile                             | Docker configuration file.                                   |
| package.json                           | NPM dependencies.                                            |





Setting up Shopify development app
-----------------

Create an Shopify app in [Shopify Partner](https://partners.shopify.com)

Get the `SHOPIFY_APP_KEY` and `SHOPIFY_APP_SECRET` in App info and update the `.env` file.

Update the `Whitelisted redirection URL(s)` to `https://your-domain.ngrok.com/shopify/auth/callback`

Save and go to `https://your-domain.ngrok.com/shopify/auth?shop=your-shop.myshopify.com`

